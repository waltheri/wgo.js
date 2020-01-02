import EventEmitter from '../utils/EventEmitter';
import KifuNode, { Path } from './KifuNode';
import Game from '../Game/Game';
import { PropIdent } from '../SGFParser/sgfTypes';
import goRules, { JAPANESE_RULES } from '../Game/rules';
import { Color, Point } from '../types';

/**
 * Contains functionality to create, edit and manipulate go game record. It is basically virtual player
 * with API without board and any UI.
 */
export default class KifuReader extends EventEmitter {
  rootNode: KifuNode;
  currentNode: KifuNode;
  game: Game;

  constructor(rootNode: KifuNode = new KifuNode()) {
    super();

    this.rootNode = rootNode;
    this.currentNode = rootNode;

    this.executeRootNode();
    this.executeNode();
  }

  /**
   * This will execute root node (root properties) once and initialize Game object
   */
  protected executeRootNode() {
    const size = this.getRootProperty(PropIdent.BOARD_SIZE) || 19;
    const rules = goRules[this.getRootProperty(PropIdent.RULES) as keyof typeof goRules] || JAPANESE_RULES;
    const handicap = this.getRootProperty(PropIdent.HANDICAP) || 0;

    this.game = new Game(size, rules);
    if (handicap > 1) {
      this.game.turn = Color.WHITE;
    }
  }

  /**
   * Executes node. It will go through its properties and make changes in game object.
   */
  protected executeNode() {
    // first process setup
    const addBlack: Point[] = this.getProperty(PropIdent.ADD_BLACK) || [];
    const addWhite: Point[] = this.getProperty(PropIdent.ADD_WHITE) || [];
    const clear: Point[] = this.getProperty(PropIdent.CLEAR_FIELD) || [];

    addBlack.forEach(p => this.game.setStone(p.x, p.y, Color.BLACK));
    addWhite.forEach(p => this.game.setStone(p.x, p.y, Color.WHITE));
    clear.forEach(p => this.game.setStone(p.x, p.y, Color.EMPTY));

    // then play a move
    const blackMove: Point = this.getProperty(PropIdent.BLACK_MOVE);
    const whiteMove: Point = this.getProperty(PropIdent.WHITE_MOVE);

    if (blackMove && whiteMove) {
      throw 'Some error';
    }

    if (blackMove) {
      this.game.position.applyMove(blackMove.x, blackMove.y, Color.BLACK, true, true);
    } else if (whiteMove) {
      this.game.position.applyMove(blackMove.x, blackMove.y, Color.WHITE, true, true);
    }

    // set turn
    const turn: Color.BLACK | Color.WHITE = this.getProperty(PropIdent.SET_TURN);

    if (turn) {
      this.game.turn = turn;
    }
  }

  /**
   * This will revert game changes of current node and re-execute it. Use this, after KifuNode properties are updated.
   */
  resetNode() {
    if (this.currentNode.parent) {
      // update normal node
      this.game.popPosition();
      this.game.pushPosition(this.game.position.clone());
      this.executeNode();
    } else {
      // update root node
      this.executeRootNode();
      this.executeNode();
    }
  }

  /**
   * Gets property of current node.
   *
   * @param propIdent
   */
  getProperty(propIdent: PropIdent) {
    return this.currentNode.getProperty(propIdent);
  }

  /**
   * Gets property of root node.
   *
   * @param propIdent
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
   * Go to a next node and executes it (updates game object).
   * @param node
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
        this.game.pushPosition(this.game.position.clone());
        this.currentNode = this.currentNode.children[i];
        this.executeNode();

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
      this.game.popPosition();
      this.currentNode = this.currentNode.parent;
      return true;
    }

    return false;
  }

  /**
   * Go to the first position - root node.
   */
  first() {
    this.game.clear();
    this.currentNode = this.rootNode;
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
