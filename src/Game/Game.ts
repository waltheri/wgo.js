import { GoRules, JAPANESE_RULES, Repeating } from './rules';
import Position from './Position';
import { Color } from '../types';

export default class Game {
  readonly sizeX: number;
  readonly sizeY: number;
  readonly rules: GoRules;
  readonly komi: number;

  private _positionStack: Position[];

  /**
   * Creates instance of game class.
   *
   * @class
   * This class implements game logic. It basically analyses given moves and returns capture stones.
   * WGo.Game also stores every position from beginning, so it has ability to check repeating positions
   * and it can effectively restore old positions.
   *
   *
   * @param {number} [size = 19] Size of the board
   * @param {string} [checkRepeat = KO] How to handle repeated position:
   *
   * * KO - ko is properly handled - position cannot be same like previous position
   * * ALL - position cannot be same like any previous position - e.g. it forbids triple ko
   * * NONE - position can be repeated
   *
   * @param {boolean} [allowRewrite = false] Allow to play moves, which were already played
   * @param {boolean} [allowSuicide = false] Allow to play suicides, stones are immediately captured
   */
  constructor(size: number | { x: number, y: number } = 19, rules: GoRules = JAPANESE_RULES) {
    if (typeof size === 'number') {
      this.sizeX = size;
      this.sizeY = size;
    } else {
      this.sizeX = size.x;
      this.sizeY = size.y;
    }

    this.rules = rules;
    this.komi = rules.komi;
    this._positionStack = [new Position(this.sizeX, this.sizeY)];
  }

  /**
   * Current position of the game.
   */
  get position() {
    return this._positionStack[this._positionStack.length - 1];
  }

  set position(pos) {
    this._positionStack[this._positionStack.length - 1] = pos;
  }

  /**
   * Color of the player whose turn currently is. 
   */
  get turn() {
    return this.position.turn;
  }

  set turn(color: Color.White | Color.Black) {
    this.position.turn = color;
  }

  /**
   * Object with current counts of captured stones.
   */
  get capCount() {
    return this.position.capCount;
  }

  /**
   * Play move. You can specify color.
   */
  play(x: number, y: number) {
    const nextPosition = this._executePlay(x, y);

    if (nextPosition) {
      this.pushPosition(nextPosition);
    }

    return nextPosition;
  }

  /**
   * Tries to play on given coordinates, returns new position after the play, or error code.
   */
  _executePlay(x: number, y: number) {
    const nextPosition = this.position.clone();
    const success = nextPosition.applyMove(x, y, nextPosition.turn, this.rules.allowSuicide, this.rules.allowRewrite);

    if (success && !this.hasPositionRepeated(nextPosition)) {
      return nextPosition;
    }

    return false;
  }

  /**
   * @param {Position} position to check
   * @return {boolean} Returns true if the position didn't occurred in the past (according to the rule set)
   */
  hasPositionRepeated(position: Position): boolean {
    let depth: number;

    if (this.rules.repeating === Repeating.KO && this._positionStack.length - 2 >= 0) {
      depth = this._positionStack.length - 2;
    } else if (this.rules.repeating === Repeating.NONE) {
      depth = 0;
    } else {
      return false;
    }

    for (let i = this._positionStack.length - 1; i >= depth; i--) {
      if (this._positionStack[i].compare(position).length === 0) {
        return true;
      }
    }

    return false;
  }

  /**
   * Play pass.
   *
   * @param {(BLACK|WHITE)} c color
   */
  pass(c: Color.Black | Color.White = this.turn) {
    const nextPosition = this.position.clone();
    nextPosition.turn = -(c || this.turn);
    this.pushPosition(nextPosition);
  }

  /**
   * Finds out validity of the move.
   *
   * @param {number} x coordinate
   * @param {number} y coordinate
   * @return {boolean} true if move can be played.
   */
  isValid(x: number, y: number): boolean {
    return !!this._executePlay(x, y);
  }

  /**
   * Controls position of the move.
   *
   * @param {number} x coordinate
   * @param {number} y coordinate
   * @return {boolean} true if move is on board.
   */
  isOnBoard(x: number, y: number): boolean {
    return this.position.has(x, y);
  }

  /**
   * Inserts move into current position. Use for setting position, for example in handicap game. Field must be empty.
   *
   * @param {number} x coordinate
   * @param {number} y coordinate
   * @param {Color} c color
   * @return {boolean} true if operation is successful.
   */
  addStone(x: number, y: number, c: Color.Black | Color.White): boolean {
    if (this.isOnBoard(x, y) && this.position.get(x, y) === Color.Empty) {
      this.position.set(x, y, c);
      return true;
    }
    return false;
  }

  /**
   * Removes move from current position.
   *
   * @param {number} x coordinate
   * @param {number} y coordinate
   * @return {boolean} true if operation is successful.
   */
  removeStone(x: number, y: number): boolean {
    if (this.isOnBoard(x, y) && this.position.get(x, y) !== Color.Empty) {
      this.position.set(x, y, Color.Empty);
      return true;
    }
    return false;
  }

  /**
   * Set or insert move of current position.
   *
   * @param {number} x coordinate
   * @param {number} y coordinate
   * @param {(BLACK|WHITE)} [c] color
   * @return {boolean} true if operation is successful.
   */
  setStone(x: number, y: number, c: Color): boolean {
    if (this.isOnBoard(x, y)) {
      this.position.set(x, y, c);
      return true;
    }
    return false;
  }

  /**
   * Get stone on given position.s
   *
   * @param {number} x coordinate
   * @param {number} y coordinate
   * @return {(Color|null)} color
   */
  getStone(x: any, y: any): (Color | null) {
    return this.position.get(x, y);
  }

  /**
   * Add position to stack. If position isn't specified current position is cloned and stacked.
   * Pointer of actual position is moved to the new position.
   *
   * @param {WGo.Position} tmp position (optional)
   */
  pushPosition(pos: Position) {
    return this._positionStack.push(pos);
  }

  /**
   * Remove current position from stack. Pointer of actual position is moved to the previous position.
   */
  popPosition() {
    if (this._positionStack.length > 1) {
      return this._positionStack.pop();
    }

    return null;
  }

  /**
   * Removes all positions except the initial.
   */
  clear() {
    this._positionStack = [this._positionStack[0]];
  }
}
