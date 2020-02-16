import KifuNode, { Path } from '../kifu/KifuNode';
import EventEmitter from '../utils/EventEmitter';
import { Game, goRules, GoRules, JAPANESE_RULES } from '../Game';
import { PropIdent } from '../SGFParser/sgfTypes';
import { Point, Color } from '../types';
import PropertyHandler from './propertyHandlers/PropertyHandler';
import basePropertyHandlers from './propertyHandlers/basePropertyHandlers';

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

  constructor() {
    super();
    this.registerPropertyHandlers(basePropertyHandlers);
  }

  /**
   * Load game (kifu) from KifuNode.
   */
  loadKifu(rootNode: KifuNode) {
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
   * Create new game (kifu) and init player with it.
   */
  newGame(size?: number, rules?: GoRules) {
    const rootNode = new KifuNode();

    if (size) {
      rootNode.setProperty('SZ', size);
    }

    if (rules) {
      // TODO: handle rules more correctly
      const rulesName = Object.keys(goRules).find(name => (goRules as any)[name] === rules);
      if (rulesName) {
        rootNode.setProperty('RU', rulesName);
      }
    }

    this.loadKifu(rootNode);
  }

  /**
   * Register event listeners for SGF properties.
   */
  protected registerPropertyHandlers(propertyHandlers: PropertyHandler<any, any>[]) {
    propertyHandlers.forEach(handler => handler.register(this));
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
  // setProperty(propIdent: PropIdent) {
  //   return this.currentNode.setProperty(propIdent);
  // }

  /**
   * Gets property of root node.
   */
  getRootProperty(propIdent: PropIdent) {
    return this.rootNode.getProperty(propIdent);
  }

  /**
   * Returns array of next nodes (children).
   */
  getNextNodes() {
    return this.currentNode.children;
  }

  /**
   * Go to (specified) next node and execute it.
   */
  next(node: number | KifuNode = 0) {
    if (this.currentNode.children.length) {
      let i: number;

      if (typeof node === 'number') {
        i = node;
      } else {
        i = this.currentNode.children.indexOf(node);
      }

      if (this.currentNode.children[i]) {
        this.executeNext(i);
        return true;
      }
    }

    return false;
  }

  /**
   * Go to the previous node.
   */
  previous() {
    if (this.currentNode.parent) {
      this.executePrevious();
      return true;
    }

    return false;
  }

  /**
   * Go to the first position - root node.
   */
  first() {
    // not sure if effective - TODO: check if there is a better way to do this
    while (this.previous()) {}
  }

  /**
   * Go to the last position.
   */
  last() {
    while (this.next()) {}
  }

  /**
   * Go to specified path.
   */
  goTo(pathOrMoveNumber: Path | number) {
    // TODO: check if there is a better way to do this
    const path = typeof pathOrMoveNumber === 'number' ? { depth: pathOrMoveNumber, forks: [] } : pathOrMoveNumber;
    this.first();

    for (let i = 0, j = 0; i < path.depth; i++) {
      if (this.currentNode.children.length > 1) {
        this.next(path.forks[j++]);
      } else {
        this.next();
      }
    }
  }

  /**
	 * Go to previous fork (a node with more than one child).
	 */
  previousFork() {
    while (this.previous()) {
      if (this.currentNode.children.length > 1) {
        return;
      }
    }
  }
}
