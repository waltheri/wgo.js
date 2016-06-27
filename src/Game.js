// Game module

import {BLACK, WHITE, EMPTY} from "./core";
import Position from "./Position";


// Error codes returned by method Game#play()
export const MOVE_OUT_OF_BOARD = 1;
export const FIELD_OCCUPIED = 2;
export const MOVE_SUICIDE = 3;
export const POSITION_REPEATED = 4;

// preset rule sets

export const JAPANESE_RULES = {
	checkRepeat: "KO",
	allowRewrite: false,
	allowSuicide: false
}

export const CHINESE_RULES = {
	checkRepeat: "ALL",
	allowRewrite: false,
	allowSuicide: false
}

export const ING_RULES = {
	checkRepeat: "ALL",
	allowRewrite: false,
	allowSuicide: true
}

export const NO_RULES = {
	checkRepeat: "NONE",
	allowRewrite: true,
	allowSuicide: true
}

// function for stone capturing
var capture = function(position, capturedStones, x, y, c) {
	if(x >= 0 && x < position.size && y >= 0 && y < position.size && position.get(x,y) == c) {
		position.set(x,y,0);
		capturedStones.push({x:x, y:y});

		capture(position, capturedStones, x, y-1, c);
		capture(position, capturedStones, x, y+1, c);
		capture(position, capturedStones, x-1, y, c);
		capture(position, capturedStones, x+1, y, c);
	}
}

// looking at liberties
var hasLiberties = function(position, alreadyTested, x, y, c) {
	// out of the board there aren't liberties
	if(x < 0 || x >= position.size || y < 0 || y >= position.size) return false;
	
	// however empty field means liberty
	if(position.get(x,y) == EMPTY) return true;
	
	// already tested field or stone of enemy isn't a liberty.
	if(alreadyTested.get(x,y) == true || position.get(x,y) == -c) return false;
	
	// set this field as tested
	alreadyTested.set(x,y,true);
	
	// in this case we are checking our stone, if we get 4 false, it has no liberty
	return 	hasLiberties(position, alreadyTested, x, y-1, c) ||
			hasLiberties(position, alreadyTested, x, y+1, c) ||
			hasLiberties(position, alreadyTested, x-1, y, c) ||
			hasLiberties(position, alreadyTested, x+1, y, c);
}

// analysing function - modifies original position, if there are some capturing, and returns array of captured stones
var captureIfPossible = function(position, x, y, c) {
	var capturedStones = [];
	// is there a stone possible to capture?
	if(x >= 0 && x < position.size && y >= 0 && y < position.size && position.get(x,y) == c) {
		// create testing map
		var alreadyTested = new Position(position.size);
		// if it has zero liberties capture it
		if(!hasLiberties(position, alreadyTested, x, y, c)) {
			// capture stones from game
			capture(position, capturedStones, x, y, c);
		}
	}
	return capturedStones;
}

// analysing history
var checkHistory = function(position, x, y) {
	var flag, stop; 
	
	if(this.repeating == "KO" && this.stack.length-2 >= 0) stop = this.stack.length-2;
	else if(this.repeating == "ALL") stop = 0;
	else return true;
	
	for(var i = this.stack.length-2; i >= stop; i--) {
		if(this.stack[i].get(x,y) == position.get(x,y)) {
			flag = true;
			for(var j = 0; j < this.size*this.size; j++) {
				if(this.stack[i].grid[j] != position.grid[j]) {
					flag = false; 
					break;
				}
			}
			if(flag) return false;
		}
	}
	
	return true;
}

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
 
	constructor(size, rulesOrCheckRepeat, allowRewrite, allowSuicide) {
		this.size = size || 19;
		
		if(typeof rulesOrCheckRepeat == "object") {
			allowRewrite = rulesOrCheckRepeat.allowRewrite;
			allowSuicide = rulesOrCheckRepeat.allowSuicide;
			rulesOrCheckRepeat = rulesOrCheckRepeat.checkRepeat;
		}
		
		this.repeating = rulesOrCheckRepeat == null ? "KO" : rulesOrCheckRepeat; // possible values: KO, ALL or nothing
		this.allow_rewrite = allowRewrite || false;
		this.allow_suicide = allowSuicide || false;
		
		this.stack = [new Position(this.size)];
		//this.turn = BLACK;			  
	}
	
	get position() {
		return this.stack[this.stack.length-1];
	}
	
	set position(pos) {
		this.stack[this.stack.length-1] = pos; 
	}
	
	get turn() {
		return this.stack[this.stack.length-1].turn;
	}
	
	set turn(turn) {
		this.stack[this.stack.length-1].turn = turn; 
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
	
	play(x, y, c, noplay) {
		//check coordinates validity
		if(!this.isOnBoard(x,y)) return MOVE_OUT_OF_BOARD;
		if(!this.allow_rewrite && this.position.get(x,y) != 0) return FIELD_OCCUPIED;
		
		// clone position
		var c = c || this.position.turn; 
		
		var newPosition = this.position.clone();	
		newPosition.set(x,y,c);
		
		// check capturing
		var capturesColor = c;
		var capturedStones = captureIfPossible(newPosition, x-1, y, -c).concat(captureIfPossible(newPosition, x+1, y, -c), captureIfPossible(newPosition, x, y-1, -c), captureIfPossible(newPosition, x, y+1, -c));
		
		// check suicide
		if(!capturedStones.length) {
			var testing = new Position(this.size);
			if(!hasLiberties(newPosition, testing, x, y, c)) {
				if(this.allow_suicide) {
					capturesColor = -c;
					capture(newPosition, capturedStones, x, y, c);
				}
				else return MOVE_SUICIDE;
			}
		}
		
		// check history
		if(this.repeating && !checkHistory.call(this, newPosition, x, y)) {
			return POSITION_REPEATED;
		}
		
		if(noplay) return false;
		
		// reverse turn
		newPosition.turn = -c;
		
		// update position info
		if(capturesColor == BLACK) newPosition.capCount.black += capturedStones.length;
		else newPosition.capCount.white += capturedStones.length;
		
		// save position
		this.pushPosition(newPosition);
		
		return capturedStones;
	}
	
	/**
	 * Play pass.
	 *
	 * @param {(BLACK|WHITE)} c color
	 */
	
	pass(c) {
		var c = c || this.position.turn; 
		
		this.pushPosition();
		this.position.turn = -c;
	}
	
	/**
	 * Finds out validity of the move. 
	 *
	 * @param {number} x coordinate
	 * @param {number} y coordinate
	 * @param {(BLACK|WHITE)} c color
	 * @return {boolean} true if move can be played.
	 */
	
	isValid(x, y, c) {
		return typeof this.play(x, y, c, true) != "number";
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
		if(this.isOnBoard(x, y) && this.position.get(x, y) == EMPTY) {
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
		if(this.isOnBoard(x, y) && this.position.get(x, y) != EMPTY) {
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
		if(this.isOnBoard(x,y)) {
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
		if(this.isOnBoard(x, y)) {
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
		var pos = pos || this.position.clone();
		this.stack.push(pos);
		return this;
	}
	
	/**
	 * Remove current position from stack. Pointer of actual position is moved to the previous position.
	 */
	
	popPosition() {
		var old;
		if(this.stack.length > 0) old = this.stack.pop();
		return old;
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
		var c, p,
		    white = 0, 
			black = 0,
		    capturedStones = [],
		    newPosition = this.position.clone();
		
		for(var x = 0; x < this.size; x++) {
			for(var y = 0; y < this.size; y++) {
				c = this.position.get(x,y);
				if(c) {
					p = capturedStones.length;
					capturedStones = capturedStones.concat(captureIfPossible(newPosition, x-1, y, -c), captureIfPossible(newPosition, x+1, y, -c), captureIfPossible(newPosition, x, y-1, -c), captureIfPossible(newPosition, x, y+1, -c));
								
					if(c == BLACK) black += capturedStones.length-p;
					else white += capturedStones.length-p;
				}
			}
		}
		this.position.capCount.black += black;
		this.position.capCount.white += white;
		this.position.grid = newPosition.grid;
		
		return capturedStones;
	}
}
