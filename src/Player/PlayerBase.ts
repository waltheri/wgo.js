import KifuNode from '../kifu/KifuNode';
import EventEmitter from '../utils/EventEmitter';
import { Game, GoRules, JAPANESE_RULES } from '../Game';
import { PropIdent } from '../SGFParser/sgfTypes';
import { Point, Color } from '../types';

interface PlayerParams {
  size: number;
  rules: GoRules;
  [key: string]: any;
}

export default class PlayerBase extends EventEmitter {
  rootNode: KifuNode;
  currentNode: KifuNode;
  game: Game;

  // player params defined by SGF
  params: PlayerParams;

  // data bounded to SGF properties
  propertiesData: Map<KifuNode, { [propIdent: string]: any }>;

  constructor(rootNode: KifuNode = new KifuNode()) {
    super();

    this.rootNode = rootNode;
    this.currentNode = rootNode;

    // init properties data map
    this.propertiesData = new Map();

    // set default params
    this.params = {
      size: 19,
      rules: JAPANESE_RULES,
    };

    this.executeRoot();
  }

  /**
   * Executes root properties during initialization. If some properties change, call this to re-init player.
   */
  protected executeRoot() {
    this.emitNodeLifeCycleEvent('beforeInit');
    this.game = new Game(this.params.size, this.params.rules);
    this.emitNodeLifeCycleEvent('afterInit');

    this.executeMove();
    this.emitNodeLifeCycleEvent('nextNode');
  }

  /**
   * Change current node to specified next node and executes its properties.
   */
  protected executeNext(i: number) {
    this.emitNodeLifeCycleEvent('beforeNextNode');

    this.game.pushPosition(this.game.position.clone());
    this.currentNode = this.currentNode.children[i];

    this.executeMove();
    this.emitNodeLifeCycleEvent('nextNode');
  }

  /**
   * Change current node to previous/parent next node and executes its properties.
   */
  protected executePrevious() {
    this.emitNodeLifeCycleEvent('beforePreviousNode');
    this.game.popPosition();
    this.currentNode = this.currentNode.parent;
    this.emitNodeLifeCycleEvent('previousNode');
  }

  /**
   * Executes a move (black or white) - changes game position and sets turn.
   */
  protected executeMove() {
    this.emitNodeLifeCycleEvent('beforeMove');

    // Execute move - B or W property - these properties are vital in this player implementation therefore hard coded.
    const blackMove: Point = this.getProperty(PropIdent.BLACK_MOVE);
    const whiteMove: Point = this.getProperty(PropIdent.WHITE_MOVE);

    if (blackMove !== undefined && whiteMove !== undefined) {
      // TODO: change this to custom (kifu) error.
      throw new TypeError('Black (B) and white (W) properties must not be mixed within a node.');
    }

    if (blackMove !== undefined) {
      if (blackMove) {
        this.game.position.applyMove(blackMove.x, blackMove.y, Color.BLACK, true, true);
      } else {
        // black passes
        this.game.position.turn = Color.WHITE;
      }
    } else if (whiteMove !== undefined) {
      if (whiteMove) {
        this.game.position.applyMove(whiteMove.x, whiteMove.y, Color.WHITE, true, true);
      } else {
        // white passes
        this.game.position.turn = Color.BLACK;
      }
    }

    this.emitNodeLifeCycleEvent('afterMove');
  }

  /**
   * Emits node life cycle method (for every property)
   */
  protected emitNodeLifeCycleEvent(name: string) {
    this.emit(name);

    Object.keys(this.currentNode.properties).forEach((propIdent) => {
      this.emit(
        `${name}:${propIdent}`,
        this.currentNode.properties[propIdent],
        this.getPropertyData(propIdent),
        this.setPropertyData.bind(this, propIdent),
      );
    });
  }

  /**
   * Gets property data of current node - data are temporary not related to SGF.
   */
  getPropertyData(propIdent: string) {
    const currentNodeData = this.propertiesData.get(this.currentNode);
    return currentNodeData ? currentNodeData[propIdent] : undefined;
  }

  /**
   * Sets property data of current node - data are temporary not related to SGF.
   */
  setPropertyData(propIdent: string, data: any) {
    let currentNodeData = this.propertiesData.get(this.currentNode);

    if (data == null) {
      if (currentNodeData) {
        delete currentNodeData[propIdent];
      }
    } else {
      if (!currentNodeData) {
        currentNodeData = {};
        this.propertiesData.set(this.currentNode, currentNodeData);
      }
      currentNodeData[propIdent] = data;
    }
  }

  /**
   * Gets property of current node.
   */
  getProperty(propIdent: PropIdent) {
    return this.currentNode.getProperty(propIdent);
  }

  /**
   * Sets property of current node.
   */
  setProperty(propIdent: PropIdent) {
    return this.currentNode.setProperty(propIdent);
  }
}
