import EventEmitter from '../utils/EventEmitter';
import KifuNode from './KifuNode';
import Game from '../Game/Game';
import { PropIdent } from '../SGFParser/sgfTypes';
import goRules, { JAPANESE_RULES, NO_RULES } from '../Game/rules';
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
    const size = this.rootNode.getProperty(PropIdent.BOARD_SIZE) || 19;
    const rules = goRules[this.rootNode.getProperty(PropIdent.RULES) as keyof typeof goRules] || JAPANESE_RULES;
    const handicap = this.rootNode.getProperty(PropIdent.HANDICAP) || 0;

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
    const addBlack: Point[] = this.currentNode.getProperty(PropIdent.ADD_BLACK) || [];
    const addWhite: Point[] = this.currentNode.getProperty(PropIdent.ADD_WHITE) || [];
    const clear: Point[] = this.currentNode.getProperty(PropIdent.CLEAR_FIELD) || [];

    addBlack.forEach(p => this.game.setStone(p.x, p.y, Color.BLACK));
    addWhite.forEach(p => this.game.setStone(p.x, p.y, Color.WHITE));
    clear.forEach(p => this.game.setStone(p.x, p.y, Color.EMPTY));

    // then play a move
    const blackMove: Point = this.currentNode.getProperty(PropIdent.BLACK_MOVE);
    const whiteMove: Point = this.currentNode.getProperty(PropIdent.WHITE_MOVE);

    if (blackMove && whiteMove) {
      throw 'Some error';
    }

    if (blackMove) {
      this.game.position.applyMove(blackMove.x, blackMove.y, Color.BLACK, true, true);
    } else if (whiteMove) {
      this.game.position.applyMove(blackMove.x, blackMove.y, Color.WHITE, true, true);
    }

    // set turn
    const turn: Color.BLACK | Color.WHITE = this.currentNode.getProperty(PropIdent.SET_TURN);

    if (turn) {
      this.game.turn = turn;
    }
  }
}
