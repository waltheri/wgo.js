
import { BLACK, EMPTY } from "../core";
import Position from "./Position";
import * as err from "./errors";
import predefinedRules, { repeat } from "./rules";

export let defaultSize = 19;
export let defaultRules = "Japanese";

export default class Game {

	/**
	 * Creates instance of game class.
	 * 
	 * @class
	 * This class implements game logic. It basically analyses given moves and returns capture stones. 
	 * WGo.Game also stores every position from beginning, so it has ability to check repeating positions
	 * and it can effectively restore old positions.
	 *
	 *
	 * @param {number}  [size = 19]           Size of the board
	 * @param {object}  [rules]               Rules object.
	 * @param {string}  [rules.checkRepeat]   How to handle repeated position:
	 * @param {boolean} [rules.allowSuicide]  Allow to play suicides, stones are immediately captured
	 * @param {boolean} [rules.allowRewrite]  Allow to play moves, which were already played, options:
	 *                                        - KO - ko is properly handled - position cannot be same like previous position
	 *                                        - ALL - position cannot be same like any previous position - e.g. it forbids triple ko
	 *                                        - NONE - position can be repeated
	 */

	constructor(size = defaultSize, rules = predefinedRules[defaultRules]) {
		this.size = defaultSize;
		
		this.checkRepeat = rules.checkRepeat;
		this.allowRewrite = rules.allowRewrite;
		this.allowSuicide = rules.allowSuicide;

		this.stack = [new Position(this.size)];
	}

	get position() {
		return this.stack[this.stack.length - 1];
	}

	set position(pos) {
		this.stack[this.stack.length - 1] = pos;
	}

	get turn() {
		return this.position.turn;
	}

	set turn(turn) {
		this.position.turn = turn;
	}

	/**
	 * Play move. 
	 *
	 * @param {number} x coordinate
	 * @param {number} y coordinate
	 * @param {(BLACK|WHITE)} c color
	 * @param {boolean} noplay - if true, move isn't played. Used by WGo.Game.isValid.
	 * @return {number} code of error, if move isn't valid. If it is valid, function returns array of captured stones.
	 * 
	 * Error codes: 
	 * 1 - given coordinates are not on board
	 * 2 - on given coordinates already is a stone
	 * 3 - suicide (currently they are forbbiden)
	 * 4 - repeated position
	 */
	play(x, y, c = this.position.turn) {
		let nextPosition = this.tryToPlay(x, y, c);

		if(nextPosition instanceof Position) {
			this.pushPosition(nextPosition);
		}

		return nextPosition;
	}

	/**
	 * Tries to play on given coordinates, returns new position after the play, or error code.
	 */
	tryToPlay(x, y, c) {
		//check coordinates validity
		if (!this.isOnBoard(x, y)) return err.MOVE_OUT_OF_BOARD;
		if (!this.allowRewrite && this.position.get(x, y) != 0) return err.FIELD_OCCUPIED;

		const nextPosition = this.position.next(x, y, c, this.allowSuicide);

		if (nextPosition == null) return err.MOVE_SUICIDE;
		else if (!this.checkHistory(nextPosition, x, y)) return err.POSITION_REPEATED;

		return nextPosition;
	}

	/**
	 * @param {Position} position to check
	 * @param {number} x coordinate
	 * @param {number} y coordinate
	 * @return {boolean} Returns true if the position didn't occured in the past (according to the ruleset)
	 */
	checkHistory(position, x, y) {
		var flag, stop;

		if (this.checkRepeat == repeat.KO && this.stack.length - 2 >= 0) stop = this.stack.length - 2;
		else if (this.checkRepeat == repeat.ALL) stop = 0;
		else return true;

		for (var i = this.stack.length - 2; i >= stop; i--) {
			if (this.stack[i].get(x, y) == position.get(x, y)) {
				flag = true;
				for (var j = 0; j < this.size * this.size; j++) {
					if (this.stack[i].grid[j] != position.grid[j]) {
						flag = false;
						break;
					}
				}
				if (flag) return false;
			}
		}

		return true;
	}

	/**
	 * Play pass.
	 *
	 * @param {(BLACK|WHITE)} c color
	 */

	pass(c) {
		let nextPosition = this.position.clone();
		nextPosition.turn = -(c || this.position.turn);
		this.pushPosition(nextPosition);
	}

	/**
	 * Finds out validity of the move. 
	 *
	 * @param {number} x coordinate
	 * @param {number} y coordinate
	 * @param {(BLACK|WHITE)} c color
	 * @return {boolean} true if move can be played.
	 */

	isValid(x, y, c = this.position.turn) {
		return this.tryToPlay(x, y, c) instanceof Position;
	}

	/**
	 * Controls position of the move. 
	 *
	 * @param {number} x coordinate
	 * @param {number} y coordinate
	 * @return {boolean} true if move is on board.
	 */

	isOnBoard(x, y) {
		return x >= 0 && y >= 0 && x < this.size && y < this.size;
	}

	/**
	 * Inserts move into current position. Use for setting position, for example in handicap game. Field must be empty.
	 *
	 * @param {number} x coordinate
	 * @param {number} y coordinate
	 * @param {(BLACK|WHITE|EMPTY)} c color
	 * @return {boolean} true if operation is successfull.
	 */

	addStone(x, y, c) {
		if (this.isOnBoard(x, y) && this.position.get(x, y) == EMPTY) {
			this.position.set(x, y, c || EMPTY);
			return true;
		}
		return false;
	}

	/**
	 * Removes move from current position. 
	 *
	 * @param {number} x coordinate
	 * @param {number} y coordinate
	 * @return {boolean} true if operation is successfull.
	 */

	removeStone(x, y) {
		if (this.isOnBoard(x, y) && this.position.get(x, y) != EMPTY) {
			this.position.set(x, y, EMPTY);
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
	 * @return {boolean} true if operation is successfull.
	 */

	setStone(x, y, c) {
		if (this.isOnBoard(x, y)) {
			this.position.set(x, y, c || EMPTY);
			return true;
		}
		return false;
	}

	/**
	 * Get stone on given position.
	 *
	 * @param {number} x coordinate
	 * @param {number} y coordinate
	 * @return {(BLACK|WHITE|EMPTY|null)} color
	 */

	getStone(x, y) {
		if (this.isOnBoard(x, y)) {
			return this.position.get(x, y);
		}
		return null;
	}

	/**
	 * Add position to stack. If position isn't specified current position is cloned and stacked.
	 * Pointer of actual position is moved to the new position.
	 *
	 * @param {WGo.Position} tmp position (optional)
	 */

	pushPosition(pos) {
		return this.stack.push(pos);
	}

	/**
	 * Remove current position from stack. Pointer of actual position is moved to the previous position.
	 */

	popPosition() {
		return this.stack.pop();
	}

	/**
	 * Removes all positions.
	 */

	firstPosition() {
		this.stack = [];
		this.pushPosition(new Position(this.size));
		return this;
	}

	/**
	 * Gets count of captured stones.
	 *
	 * @param {(BLACK|WHITE)} color
	 * @return {number} count
	 */

	getCaptureCount(color) {
		return color == BLACK ? this.position.capCount.black : this.position.capCount.white;
	}

	/**
	 * Validate postion. Position is tested from 0:0 to size:size, if there are some moves, that should be captured, they will be removed.
	 * You can use this, after insertion of more stones.
	 *
	 * @return {Array} removed stones
	 */

	validatePosition() {
		this.position = this.position.getValidatedPosition();
	}

	/**
	 * Gets previous position or undefined, if current position is the first one.
	 * 
	 * @return {Position}
	 */
	getPreviousPosition() {
		return this.stack[this.stack.length-2];
	}
}
