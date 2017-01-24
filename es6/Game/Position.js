/**
 * Contains implementation of go position class.
 * @module Position
 */

import { BLACK, EMPTY, WHITE } from "../core";

// creates 2-dim array for testing
var createGrid = function(size) {
	let grid = [];
	for(let i = 0; i < size; i++) {
		grid.push([]);
	}
	return grid;
}

// function for stone capturing
var capture = function (position, capturedStones, x, y, c) {
	if (x >= 0 && x < position.size && y >= 0 && y < position.size && position.get(x, y) == c) {
		position.set(x, y, 0);
		return 1 + capture(position, x, y - 1, c) + capture(position, x, y + 1, c) + capture(position, x - 1, y, c) + capture(position, x + 1, y, c);
	}
	return 0;
}

// looking at liberties
var hasLiberties = function (position, alreadyTested, x, y, c) {
	// out of the board there aren't liberties
	if (x < 0 || x >= position.size || y < 0 || y >= position.size) return false;

	// however empty field means liberty
	if (position.get(x, y) == EMPTY) return true;

	// already tested field or stone of enemy isn't a liberty.
	if (alreadyTested.get(x, y) == true || position.get(x, y) == -c) return false;

	// set this field as tested
	alreadyTested.set(x, y, true);

	// in this case we are checking our stone, if we get 4 false, it has no liberty
	return hasLiberties(position, alreadyTested, x, y - 1, c) ||
		hasLiberties(position, alreadyTested, x, y + 1, c) ||
		hasLiberties(position, alreadyTested, x - 1, y, c) ||
		hasLiberties(position, alreadyTested, x + 1, y, c);
}

// analysing function - modifies original position, if there are some capturing, and returns array of captured stones
var captureIfPossible = function (position, x, y, c) {
	var capturedStones = 0;
	// is there a stone possible to capture?
	if (x >= 0 && x < position.size && y >= 0 && y < position.size && position.get(x, y) == c) {
		// create testing map
		var alreadyTested = createGrid(this.size);
		// if it has zero liberties capture it
		if (!hasLiberties(position, alreadyTested, x, y, c)) {
			// capture stones from game
			capturedStones += capture(position, x, y, c);
		}
	}
	return capturedStones;
}

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
		if (x < 0 || y < 0 || x >= this.size || y >= this.size) return undefined;
		return this.grid[x * this.size + y];
	}

	/**
	 * Sets stone on the given field.
	 *
	 * @param {number} x - X coordinate
	 * @param {number} y - Y coordinate
	 * @param {(BLACK|WHITE|EMPTY)} c - Color
	 */

	set(x, y, c) {
		this.grid[x * this.size + y] = c;
		return this;
	}

	/**
	 * Clears the whole position (every value is set to EMPTY).
	 */

	clear() {
		for (var i = 0; i < this.size * this.size; i++) this.grid[i] = EMPTY;
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

		for (var i = 0; i < this.size * this.size; i++) {
			if (this.grid[i] && !position.grid[i]) remove.push({
				x: Math.floor(i / this.size),
				y: i % this.size
			});
			else if (this.grid[i] != position.grid[i]) add.push({
				x: Math.floor(i / this.size),
				y: i % this.size,
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
	next(x, y, c, allowSuicide) {
		// check if move is on empty field of the board
		if (this.get(x, y) !== EMPTY) return null;

		// clone position and add a stone
		let newPosition = this.clone();
		newPosition.set(x, y, c);

		// check capturing
		const capturedStones = captureIfPossible(newPosition, x - 1, y, -c) + captureIfPossible(newPosition, x + 1, y, -c) + captureIfPossible(newPosition, x, y - 1, -c) + captureIfPossible(newPosition, x, y + 1, -c);

		// check suicide
		if (capturedStones !== 0) {
			var testing = createGrid(this.size);
			if (!hasLiberties(newPosition, testing, x, y, c)) {
				if (allowSuicide) {
					capture(newPosition, x, y, c);
				}
				else return null;
			}
		}

		return newPosition;
	}
}
