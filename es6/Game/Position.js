/**
 * Contains implementation of go position class.
 * @module Position
 */

import {BLACK, EMPTY, WHITE} from "./core";

export default class Position {
	/**
	 * Creates instance of position object.
	 *
	 * @alias WGo.Position
	 * @class `WGo.Position` represents a certain position of the go game. It is composed from a grid containing black and white stones, capture counts, and actual turn.
	 *
	 * @param {number} [size = 19] - Size of the board.
	 */
	 
	constructor(size) {
		/** 
		 * Size of the board.
		 *
		 * @type {number}
		 * @constant 
		 */
		 
		this.size = size || 19;
		
		/** 
		 * Two dimensional array containing stones of the position.
		 *
		 * @type {Array.<Array.<(BLACK|WHITE|EMPTY)>>}
		 */
		 
		this.grid = [];
		this.clear();
		
		/** 
		 * Contains numbers of stones that both players captured.
		 *
		 * @type {Object}
		 * @property {number} black - Count of white stones captured by **black**.
		 * @property {number} white - Count of black stones captured by **white**.
		 */
		 
		this.capCount = {
			black: 0,
			white: 0
		}
		
		/** 
		 * Who plays next move.
		 *
		 * @type {(BLACK|WHITE)}
		 */
		 
		this.turn = BLACK;
	}
	
	/**
	 * Returns stone on the given field.
	 *
	 * @param {number} x - X coordinate
	 * @param {number} y - Y coordinate
	 * @return {(BLACK|WHITE|EMPTY)} Color
	 */

	get(x, y) {
		if(x < 0 || y < 0 || x >= this.size || y >= this.size) return undefined;
		return this.grid[x*this.size+y];
	}

	/**
	 * Sets stone on the given field.
	 *
	 * @param {number} x - X coordinate
	 * @param {number} y - Y coordinate
	 * @param {(BLACK|WHITE|EMPTY)} c - Color
	 */

	set(x, y, c) {
		this.grid[x*this.size+y] = c;
		return this;
	}

	/**
	 * Clears the whole position (every value is set to EMPTY).
	 */

	clear() {
		for(var i = 0; i < this.size*this.size; i++) this.grid[i] = EMPTY;
		return this;
	}

	/**
	 * Clones the whole position.
	 * 
	 * @return {WGo.Position} Copy of the position.
	 * @todo Clone turn as well.
	 */

	clone() {
		var clone = new Position(this.size);
		clone.grid = this.grid.slice(0);
		clone.capCount.black = this.capCount.black;
		clone.capCount.white = this.capCount.white;
		clone.turn = this.turn;
		return clone;
	}
	
	/**
	 * Compares this position with another position and return object with changes
	 *
	 * @param {WGo.Position} position - Position to compare to.
	 * @return {ChangeObject} Change object
	 */
	
	compare(position) {
		var add = [], remove = [];
		
		for(var i = 0; i < this.size*this.size; i++) {
			if(this.grid[i] && !position.grid[i]) remove.push({
				x: Math.floor(i/this.size),
				y: i%this.size
			});
			else if(this.grid[i] != position.grid[i]) add.push({
				x: Math.floor(i/this.size),
				y: i%this.size,
				c: position.grid[i]
			});
		}
		
		return {
			add: add,
			remove: remove
		}
	}

	/**
	 * Returns new position after a certain move (with rules applied - without captured stones).
	 * If you don't provide move coordinates, no move will be added, but position will be validated -
	 * captured stones will be removed from top-left to bottom-right.
	 */
	next(x, y, allowSuicide) {
		
	}
}
