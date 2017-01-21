/**
 * Contains implementation of go position class.
 * @module Position
 */

var WGo = require("./WGo");

/**
 * Creates instance of position object.
 *
 * @alias WGo.Position
 * @class `WGo.Position` represents a certain position of the go game. It is composed from a grid containing black and white stones, capture counts, and actual turn.
 *
 * @param {number} [size = 19] - Size of the board.
 */

var Position = function(size) {
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
	 * @type {Array.<Array.<(WGo.B|WGo.W|WGo.E)>>}
	 */
	 
	this.grid = [];
	
	for(var i = 0; i < this.size*this.size; i++) {
		this.grid[i] = WGo.E;
	}
	
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
	 * @type {(WGo.B|WGo.W)}
	 */
	 
	this.turn = WGo.B;
}

Position.prototype = {
	constructor: Position,
	
	/**
	 * Returns stone on the given field.
	 *
	 * @param {number} x - X coordinate
	 * @param {number} y - Y coordinate
	 * @return {(WGo.B|WGo.W|WGo.E)} Color
	 */

	get: function(x,y) {
		if(x < 0 || y < 0 || x >= this.size || y >= this.size) return undefined;
		return this.grid[x*this.size+y];
	},

	/**
	 * Sets stone on the given field.
	 *
	 * @param {number} x - X coordinate
	 * @param {number} y - Y coordinate
	 * @param {(WGo.B|WGo.W|WGo.E)} c - Color
	 */

	set: function(x,y,c) {
		this.grid[x*this.size+y] = c;
		return this;
	},

	/**
	 * Clears the whole position (every value is set to WGo.E).
	 */

	clear: function() {
		for(var i = 0; i < this.size*this.size; i++) this.grid[i] = WGo.E;
		return this;
	},

	/**
	 * Clones the whole position.
	 * 
	 * @return {WGo.Position} Copy of the position.
	 * @todo Clone turn as well.
	 */

	clone: function() {
		var clone = new Position(this.size);
		clone.grid = this.grid.slice(0);
		clone.capCount.black = this.capCount.black;
		clone.capCount.white = this.capCount.white;
		clone.turn = this.turn;
		return clone;
	},
	
	/**
	 * Compares this position with another position and return object with changes
	 *
	 * @param {WGo.Position} position - Position to compare to.
	 * @return {ChangeObject} Change object
	 */
	
	compare: function(position) {
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
}

module.exports = Position;
