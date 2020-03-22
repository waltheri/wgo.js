import KifuNode, { Path } from '../kifu/KifuNode';
import EventEmitter from '../utils/EventEmitter';
import { Game, goRules, GoRules, JAPANESE_RULES } from '../Game';
import { PropIdent } from '../SGFParser/sgfTypes';
import PropertyHandler from './PropertyHandler';
import { PlayerInitParams } from './types';
import * as basePropertyListeners from './basePropertyListeners';

export default class PlayerBase extends EventEmitter {
  rootNode: KifuNode;
  currentNode: KifuNode;
  game: Game;
  params: PlayerInitParams;

  constructor() {
    super();

    this.on('beforeInit.SZ', basePropertyListeners.beforeInitSZ);
    this.on('beforeInit.RU', basePropertyListeners.beforeInitRU);
    this.on('applyGameChanges.HA', basePropertyListeners.applyGameChangesHA);
    this.on('applyGameChanges.B', basePropertyListeners.applyGameChangesMove);
    this.on('applyGameChanges.W', basePropertyListeners.applyGameChangesMove);
    this.on('applyGameChanges.PL', basePropertyListeners.applyGameChangesPL);
    this.on('applyGameChanges.AB', basePropertyListeners.applyGameChangesSetup);
    this.on('applyGameChanges.AW', basePropertyListeners.applyGameChangesSetup);
    this.on('applyGameChanges.AE', basePropertyListeners.applyGameChangesSetup);
  }

  /**
   * Load game (kifu) from KifuNode.
   */
  loadKifu(rootNode: KifuNode) {
    this.rootNode = rootNode;
    this.currentNode = rootNode;

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
   * Executes root properties during initialization. If some properties change, call this to re-init player.
   */
  protected executeRoot() {
    this.params = {
      size: 19,
      rules: JAPANESE_RULES,
    };

    this.emitNodeLifeCycleEvent('beforeInit');
    this.game = new Game(this.params.size, this.params.rules);

    this.executeNode();
  }

  protected executeNode() {
    this.emitNodeLifeCycleEvent('applyGameChanges');
    this.emitNodeLifeCycleEvent('applyNodeChanges');
  }

  /**
   * Change current node to specified next node and executes its properties.
   */
  protected executeNext(i: number) {
    this.emitNodeLifeCycleEvent('clearNodeChanges');

    this.game.pushPosition(this.game.position.clone());
    this.currentNode = this.currentNode.children[i];

    this.executeNode();
  }

  /**
   * Change current node to previous/parent next node and executes its properties.
   */
  protected executePrevious() {
    this.emitNodeLifeCycleEvent('clearNodeChanges');
    this.emitNodeLifeCycleEvent('clearGameChanges');

    this.game.popPosition();
    this.currentNode = this.currentNode.parent;

    this.emitNodeLifeCycleEvent('applyNodeChanges');
  }

  /**
   * Emits node life cycle method (for every property)
   */
  protected emitNodeLifeCycleEvent(name: keyof PropertyHandler<any, any>) {
    this.emit(name, {
      name,
      target: this,
    });

    this.currentNode.forEachProperty((propIdent, value) => {
      this.emit(`${name}.${propIdent}`, {
        name,
        target: this,
        propIdent,
        value,
      });
    });
  }

  protected getPropertyHandler(propIdent: string) {
    return (this.constructor as any).propertyHandlers[propIdent] as PropertyHandler<any, any>;
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
