(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WGo = global.WGo || {})));
}(this, (function (exports) { 'use strict';

var babelHelpers = {};
babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

babelHelpers.createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

babelHelpers.defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

babelHelpers.get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

babelHelpers.inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

babelHelpers.possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

babelHelpers.toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

babelHelpers;


// WGo global object with helpers

/**
 * Main namespace - it initializes WGo in first run and then execute main function. 
 * You must call WGo.init() if you want to use library, without calling WGo.
 * @namespace
 */

var B = 1;
var BLACK = B;
var W = -1;
var WHITE = W;
var E = 0;
var EMPTY = E;
var ERROR_REPORT = false;

var lang = "en";
var i18n = {
	en: {}
};

// i18n helper
function t(str) {
	var loc = WGo.i18n[WGo.lang][str] || WGo.i18n.en[str];
	if (loc) {
		for (var i = 1; i < arguments.length; i++) {
			loc = loc.replace("$", arguments[i]);
		}
		return loc;
	}
	return str;
}

// helper for dynamic loading
exports.DIR = void 0;

if (global["document"]) {
	var scripts = document.getElementsByTagName('script');
	var path = scripts[scripts.length - 1].src.split('?')[0]; // remove any ?query
	exports.DIR = path.split('/').slice(0, -1).join('/') + '/';
}



/*
if(global["navigator"]) {
	// browser detection - can be handy
	WGo.opera = navigator.userAgent.search(/(opera)(?:.*version)?[ \/]([\w.]+)/i) != -1;
	WGo.webkit = navigator.userAgent.search(/(webkit)[ \/]([\w.]+)/i) != -1;
	WGo.msie = navigator.userAgent.search(/(msie) ([\w.]+)/i) != -1;
	WGo.mozilla = navigator.userAgent.search(/(mozilla)(?:.*? rv:([\w.]+))?/i) != -1 && !WGo.webkit && !WGo.msie;
}
*/

/*// helping function for class inheritance
WGo.extendClass = function(parent, child) {
	child.prototype = Object.create(parent.prototype);
	child.prototype.constructor = child;
	child.prototype.super = parent;
	
	return child;
};

// helping function for class inheritance
WGo.abstractMethod = function() {
	throw Error('unimplemented abstract method');
};

// helping function for deep cloning of simple objects,
WGo.clone = function(obj) {
	if(obj && typeof obj == "object") {
		var n_obj = obj.constructor == Array ? [] : {};
		
		for(var key in obj) {
			if(obj[key] == obj) n_obj[key] = obj;
			else n_obj[key] = WGo.clone(obj[key]);
		}
		
		return n_obj;
	}
	else return obj;
};
*/

/**
 * Filters html tags from the string to avoid XSS. Characters `<` and `>` are transformed to their entities. 
 * You can use this function when you display foreign texts.
 *
 * @param {string} text - text to filter
 * @return {string} Filtered text 
 */
/* 
WGo.filterHTML = function(text) {
	if(!text || typeof text != "string") return text;
	return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};*/

//export default WGo;

/**
 * Contains implementation of go position class.
 * @module Position
 */

// creates 2-dim array for testing
var createGrid = function createGrid(size) {
	var grid = [];
	for (var i = 0; i < size; i++) {
		grid.push([]);
	}
	return grid;
};

// function for stone capturing, returns number of captured stones
var capture = function capture(position, x, y, c) {
	if (x >= 0 && x < position.size && y >= 0 && y < position.size && position.get(x, y) == c) {
		position.set(x, y, 0);
		return 1 + capture(position, x, y - 1, c) + capture(position, x, y + 1, c) + capture(position, x - 1, y, c) + capture(position, x + 1, y, c);
	}
	return 0;
};

// looking at liberties
var hasLiberties = function hasLiberties(position, alreadyTested, x, y, c) {
	// out of the board there aren't liberties
	if (x < 0 || x >= position.size || y < 0 || y >= position.size) return false;

	// however empty field means liberty
	if (position.get(x, y) == EMPTY) return true;

	// already tested field or stone of enemy isn't a liberty.
	if (alreadyTested[x][y] || position.get(x, y) == -c) return false;

	// set this field as tested
	alreadyTested[x][y] = true;

	// in this case we are checking our stone, if we get 4 false, it has no liberty
	return hasLiberties(position, alreadyTested, x, y - 1, c) || hasLiberties(position, alreadyTested, x, y + 1, c) || hasLiberties(position, alreadyTested, x - 1, y, c) || hasLiberties(position, alreadyTested, x + 1, y, c);
};

// analysing function - modifies original position, if there are some capturing, and returns number of captured stones
var captureIfPossible = function captureIfPossible(position, x, y, c) {
	var capturedStones = 0;
	// is there a stone possible to capture?
	if (x >= 0 && x < position.size && y >= 0 && y < position.size && position.get(x, y) == c) {
		// create testing map
		var alreadyTested = createGrid(position.size);
		// if it has zero liberties capture it
		if (!hasLiberties(position, alreadyTested, x, y, c)) {
			// capture stones from game
			capturedStones += capture(position, x, y, c);
		}
	}
	return capturedStones;
};

var Position = function () {
	/**
  * Creates instance of position object.
  *
  * @alias WGo.Position
  * @class `WGo.Position` represents a certain position of the go game. It is composed from a grid containing black and white stones, capture counts, and actual turn.
  *
  * @param {number} [size = 19] - Size of the board.
  */

	function Position(size) {
		babelHelpers.classCallCheck(this, Position);

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
		};

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

	babelHelpers.createClass(Position, [{
		key: "get",
		value: function get(x, y) {
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

	}, {
		key: "set",
		value: function set(x, y, c) {
			this.grid[x * this.size + y] = c;
			return this;
		}

		/**
   * Clears the whole position (every value is set to EMPTY).
   */

	}, {
		key: "clear",
		value: function clear() {
			for (var i = 0; i < this.size * this.size; i++) {
				this.grid[i] = EMPTY;
			}return this;
		}

		/**
   * Clones the whole position.
   * 
   * @return {WGo.Position} Copy of the position.
   * @todo Clone turn as well.
   */

	}, {
		key: "clone",
		value: function clone() {
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

	}, {
		key: "compare",
		value: function compare(position) {
			var add = [],
			    remove = [];

			for (var i = 0; i < this.size * this.size; i++) {
				if (this.grid[i] && !position.grid[i]) remove.push({
					x: Math.floor(i / this.size),
					y: i % this.size
				});else if (this.grid[i] != position.grid[i]) add.push({
					x: Math.floor(i / this.size),
					y: i % this.size,
					c: position.grid[i]
				});
			}

			return {
				add: add,
				remove: remove
			};
		}

		/**
   * Returns new position after a certain move (with rules applied - without captured stones).
   * If you don't provide move coordinates, no move will be added, but position will be validated -
   * captured stones will be removed from top-left to bottom-right.
   */

	}, {
		key: "next",
		value: function next(x, y, c, allowSuicide) {
			// check if move is on empty field of the board
			if (this.get(x, y) !== EMPTY) return null;

			// clone position and add a stone
			var newPosition = this.clone();
			newPosition.set(x, y, c);

			// check capturing of all surrounding stones
			var capturedStones = captureIfPossible(newPosition, x - 1, y, -c) + captureIfPossible(newPosition, x + 1, y, -c) + captureIfPossible(newPosition, x, y - 1, -c) + captureIfPossible(newPosition, x, y + 1, -c);

			// check suicide
			if (capturedStones === 0) {
				var testing = createGrid(this.size);
				if (!hasLiberties(newPosition, testing, x, y, c)) {
					if (allowSuicide) {
						capturedStones = capture(newPosition, x, y, c);
						// captured stones will have the same color
						c = -c;
					} else return null;
				}
			}

			if (c == BLACK) newPosition.capCount.black += capturedStones;else newPosition.capCount.white += capturedStones;

			newPosition.turn = -c;

			return newPosition;
		}

		/**
   * Validate postion. Position is tested from 0:0 to size:size, if there are some moves, 
   * that should be captured, they will be removed. Returns a new Position object.
   * This position isn't modified.
   *
   * @return {Array} removed stones
   */

	}, {
		key: "getValidatedPosition",
		value: function getValidatedPosition() {
			var c = void 0;
			var white = 0;
			var black = 0;
			var capturedStones = void 0;
			var newPosition = this.clone();

			for (var x = 0; x < this.size; x++) {
				for (var y = 0; y < this.size; y++) {
					c = newPosition.get(x, y);
					if (c) {
						capturedStones = captureIfPossible(newPosition, x - 1, y, -c) + captureIfPossible(newPosition, x + 1, y, -c) + captureIfPossible(newPosition, x, y - 1, -c) + captureIfPossible(newPosition, x, y + 1, -c);

						if (c == BLACK) black += capturedStones;else white += capturedStones;
					}
				}
			}

			newPosition.capCount.black += black;
			newPosition.capCount.white += white;

			return newPosition;
		}

		/**
   * For debug purposes.
   */

	}, {
		key: "toString",
		value: function toString() {
			var TL = "┌";
			var TM = "┬";
			var TR = "┐";
			var ML = "├";
			var MM = "┼";
			var MR = "┤";
			var BL = "└";
			var BM = "┴";
			var BR = "┘";
			var BS = "●";
			var WS = "○";
			var HF = "─"; // horizontal fill

			var output = "   ";

			for (var i = 0; i < this.size; i++) {
				output += i < 9 ? i + " " : i;
			}

			output += "\n";

			for (var y = 0; y < this.size; y++) {
				for (var x = 0; x < this.size; x++) {
					var color = this.grid[x * this.size + y];

					if (x == 0) {
						output += (y < 10 ? " " + y : y) + " ";
					}

					if (color != EMPTY) {
						output += color == BLACK ? BS : WS;
					} else {
						var char = void 0;

						if (y == 0) {
							// top line
							if (x == 0) char = TL;else if (x < this.size - 1) char = TM;else char = TR;
						} else if (y < this.size - 1) {
							// middle line
							if (x == 0) char = ML;else if (x < this.size - 1) char = MM;else char = MR;
						} else {
							// bottom line
							if (x == 0) char = BL;else if (x < this.size - 1) char = BM;else char = BR;
						}

						output += char;
					}

					if (x == this.size - 1) {
						if (y != this.size - 1) output += "\n";
					} else {
						output += HF;
					}
				}
			}

			return output;
		}
	}]);
	return Position;
}();

// Error codes returned by method Game#play()

var MOVE_OUT_OF_BOARD = 1;
var FIELD_OCCUPIED = 2;
var MOVE_SUICIDE = 3;
var POSITION_REPEATED = 4;

var errorCodes = Object.freeze({
	MOVE_OUT_OF_BOARD: MOVE_OUT_OF_BOARD,
	FIELD_OCCUPIED: FIELD_OCCUPIED,
	MOVE_SUICIDE: MOVE_SUICIDE,
	POSITION_REPEATED: POSITION_REPEATED
});

/**
 * WGo's game engine offers to set 3 rules:
 *
 * - *checkRepeat* - one of `repeat.KO`, `repeat.ALL`, `repeat.NONE` - defines if or when a move can be repeated.
 * - *allowRewrite* - if set true a move can rewrite existing move (for uncommon applications)
 * - *allowSuicide* - if set true a suicide will be allowed (and stone will be immediately captured)
 *
 * In this module there are some common preset rule sets (Japanese, Chinese etc...). 
 * Extend object `gameRules` if you wish to add some rule set. Names of the rules should correspond with SGF's `RU` property.
 */

var repeat = {
	KO: "KO",
	ALL: "ALL",
	NONE: "NONE"
};

var JAPANESE_RULES = {
	checkRepeat: repeat.KO,
	allowRewrite: false,
	allowSuicide: false
};

var CHINESE_RULES = {
	checkRepeat: repeat.ALL,
	allowRewrite: false,
	allowSuicide: false
};

var ING_RULES = {
	checkRepeat: repeat.ALL,
	allowRewrite: false,
	allowSuicide: true
};



var rules = {
	"Japanese": JAPANESE_RULES,
	"GOE": ING_RULES,
	"NZ": ING_RULES,
	"AGA": CHINESE_RULES,
	"Chinese": CHINESE_RULES
};

var defaultSize = 19;
var defaultRules = "Japanese";

var Game$1 = function () {

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

	function Game() {
		var size = arguments.length <= 0 || arguments[0] === undefined ? defaultSize : arguments[0];
		var rules$$1 = arguments.length <= 1 || arguments[1] === undefined ? rules[defaultRules] : arguments[1];
		babelHelpers.classCallCheck(this, Game);

		this.size = defaultSize;

		this.checkRepeat = rules$$1.checkRepeat;
		this.allowRewrite = rules$$1.allowRewrite;
		this.allowSuicide = rules$$1.allowSuicide;

		this.stack = [new Position(this.size)];
	}

	babelHelpers.createClass(Game, [{
		key: "play",


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
		value: function play(x, y) {
			var c = arguments.length <= 2 || arguments[2] === undefined ? this.position.turn : arguments[2];

			var nextPosition = this.tryToPlay(x, y, c);

			if (nextPosition instanceof Position) {
				this.pushPosition(nextPosition);
			}

			return nextPosition;
		}

		/**
   * Tries to play on given coordinates, returns new position after the play, or error code.
   */

	}, {
		key: "tryToPlay",
		value: function tryToPlay(x, y, c) {
			//check coordinates validity
			if (!this.isOnBoard(x, y)) return MOVE_OUT_OF_BOARD;
			if (!this.allowRewrite && this.position.get(x, y) != 0) return FIELD_OCCUPIED;

			var nextPosition = this.position.next(x, y, c, this.allowSuicide);

			if (nextPosition == null) return MOVE_SUICIDE;else if (!this.checkHistory(nextPosition, x, y)) return POSITION_REPEATED;

			return nextPosition;
		}

		/**
   * @param {Position} position to check
   * @param {number} x coordinate
   * @param {number} y coordinate
   * @return {boolean} Returns true if the position didn't occured in the past (according to the ruleset)
   */

	}, {
		key: "checkHistory",
		value: function checkHistory(position, x, y) {
			var flag, stop;

			if (this.checkRepeat == repeat.KO && this.stack.length - 2 >= 0) stop = this.stack.length - 2;else if (this.checkRepeat == repeat.ALL) stop = 0;else return true;

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

	}, {
		key: "pass",
		value: function pass(c) {
			var nextPosition = this.position.clone();
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

	}, {
		key: "isValid",
		value: function isValid(x, y) {
			var c = arguments.length <= 2 || arguments[2] === undefined ? this.position.turn : arguments[2];

			return this.tryToPlay(x, y, c) instanceof Position;
		}

		/**
   * Controls position of the move. 
   *
   * @param {number} x coordinate
   * @param {number} y coordinate
   * @return {boolean} true if move is on board.
   */

	}, {
		key: "isOnBoard",
		value: function isOnBoard(x, y) {
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

	}, {
		key: "addStone",
		value: function addStone(x, y, c) {
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

	}, {
		key: "removeStone",
		value: function removeStone(x, y) {
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

	}, {
		key: "setStone",
		value: function setStone(x, y, c) {
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

	}, {
		key: "getStone",
		value: function getStone(x, y) {
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

	}, {
		key: "pushPosition",
		value: function pushPosition(pos) {
			return this.stack.push(pos);
		}

		/**
   * Remove current position from stack. Pointer of actual position is moved to the previous position.
   */

	}, {
		key: "popPosition",
		value: function popPosition() {
			return this.stack.pop();
		}

		/**
   * Removes all positions.
   */

	}, {
		key: "firstPosition",
		value: function firstPosition() {
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

	}, {
		key: "getCaptureCount",
		value: function getCaptureCount(color) {
			return color == BLACK ? this.position.capCount.black : this.position.capCount.white;
		}

		/**
   * Validate postion. Position is tested from 0:0 to size:size, if there are some moves, that should be captured, they will be removed.
   * You can use this, after insertion of more stones.
   *
   * @return {Array} removed stones
   */

	}, {
		key: "validatePosition",
		value: function validatePosition() {
			this.position = this.position.getValidatedPosition();
		}

		/**
   * Gets previous position or undefined, if current position is the first one.
   * 
   * @return {Position}
   */

	}, {
		key: "getPreviousPosition",
		value: function getPreviousPosition() {
			return this.stack[this.stack.length - 2];
		}
	}, {
		key: "position",
		get: function get() {
			return this.stack[this.stack.length - 1];
		},
		set: function set(pos) {
			this.stack[this.stack.length - 1] = pos;
		}
	}, {
		key: "turn",
		get: function get() {
			return this.position.turn;
		},
		set: function set(turn) {
			this.position.turn = turn;
		}
	}]);
	return Game;
}();

// Game module
Game$1.Position = Position;
Game$1.rules = rules;
Game$1.defaultRules = defaultRules;
Game$1.defaultSize = defaultSize;
Game$1.errorCodes = errorCodes;

/**
 * Class for syntax errors in SGF string.
 * @extends Error
 */
var SGFSyntaxError = function SGFSyntaxError(message, parser) {
	babelHelpers.classCallCheck(this, SGFSyntaxError);

	var tempError = Error.apply(this);
	tempError.name = this.name = 'SGFSyntaxError';
	this.message = message || 'There was an unspecified syntax error in the SGF';

	if (parser) {
		this.message += " on line " + parser.lineNo + ", char " + parser.charNo + ":\n";
		this.message += "\t" + parser.sgfString.split("\n")[parser.lineNo - 1] + "\n";
		this.message += "\t" + Array(parser.charNo + 1).join(" ") + "^";
	}

	this.stack = tempError.stack;
};

// a small ES5 hack because currently in ES6 you can't extend Errors
SGFSyntaxError.prototype = Object.create(Error.prototype);
SGFSyntaxError.prototype.constructor = SGFSyntaxError;

/**
 * Contains methods for parsing sgf string
 * @module SGFParser
 */

var CODE_A = "A".charCodeAt(0);
var CODE_Z = "Z".charCodeAt(0);
var CODE_WHITE = " ".charCodeAt(0);

/**
 * Class for parsing of sgf files. Can be used for parsing of SGF fragments as well.
 */

var SGFParser$1 = function () {

	/**
  * Class constructor.
  * @param {string} sgf string to parse.
  */

	function SGFParser(sgf) {
		babelHelpers.classCallCheck(this, SGFParser);

		/** 
   * Parsed SGF string 
   * @type {string} 
   */
		this.sgfString = sgf;

		/**
   * Current character position 
   * @type {number} 
   */
		this.position = 0;

		/** 
   * Current character
   * @type {string} 
   */
		this.currentChar = sgf[0];

		/** 
   * Current char number (on the line) 
   * @type {number}
   */
		this.lineNo = 1;

		/** 
   * Current char number (on the line) 
   * @type {number}
   */
		this.charNo = 0;
	}

	babelHelpers.createClass(SGFParser, [{
		key: "next",
		value: function next(dontSkipWhite) {
			if (!dontSkipWhite) {
				while (this.sgfString.charCodeAt(++this.position) <= CODE_WHITE) {
					if (this.sgfString[this.position] == "\n") {
						this.charNo = 0;
						this.lineNo++;
					} else {
						this.charNo++;
					}
				}
				this.charNo++;
			} else {
				this.position++;
				if (this.sgfString[this.position] == "\n") {
					this.charNo = 0;
					this.lineNo++;
				} else {
					this.charNo++;
				}
			}

			return this.currentChar = this.sgfString[this.position];
		}
	}, {
		key: "parsePropertyValue",
		value: function parsePropertyValue() {
			var value = "";

			// then we read the value
			while (this.next(true) != ']') {

				// char mustn't be undefined
				if (!this.currentChar) throw new SGFSyntaxError("End of SGF inside of property", this);

				// if there is character '\' save next character
				else if (this.currentChar == '\\') {
						this.next(true);

						// char have to exis of course
						if (!this.currentChar) throw new SGFSyntaxError("End of SGF inside of property", this);

						// ignore new line, otherwise save
						else if (this.currentChar == '\n') {
								continue;
							}
					}

				// save the character
				value += this.currentChar;
			}

			return value;
		}

		/**
   * Expects string containing value(-s) of SGF property and returns array of that values.
   * Example: `'[jj][kk]' => ['jj', 'kk']`.
   * 
   * @param {string}   string - parsed SGF
  	 * @param {number}   start  - starting position
  	 * @returns {string[]} array of property values                       
  	 * @throws {SGFSyntaxError} When sgf string is invalid.
   */

	}, {
		key: "parsePropertyValues",
		value: function parsePropertyValues() {
			var values = [];

			if (this.currentChar != '[') throw new SGFSyntaxError("Property must have at least one value enclosed in '[' and ']'", this);

			do {
				var value = this.parsePropertyValue();
				if (value != "") values.push(value);
			} while (this.next() == '[');

			return values;
		}

		/**
   * Reads the property identificator (One or more UC letters)
   * 
   * @returns {string} the identificator.
   */

	}, {
		key: "parsePropertyIdent",
		value: function parsePropertyIdent() {
			var ident = "",
			    charCode = this.sgfString.charCodeAt(this.position);
			while (charCode >= CODE_A && charCode <= CODE_Z) {
				ident += this.currentChar;
				this.next();
				charCode = this.sgfString.charCodeAt(this.position);
			}
			return ident;
		}
	}, {
		key: "parseProperties",
		value: function parseProperties() {
			var ident,
			    properties = {};
			while (ident = this.parsePropertyIdent()) {
				properties[ident] = this.parsePropertyValues();
			}
			return properties;
		}
	}, {
		key: "parseNode",
		value: function parseNode() {
			// in this point I know, that current character is ';' (don't have to check it)
			this.next();

			return this.parseProperties();
		}
	}, {
		key: "parseSequence",
		value: function parseSequence() {
			var sequence = [];

			// sequence must start with `;`
			if (this.currentChar != ';') throw new SGFSyntaxError("There must be at least one SGF node in sequence", this);

			do {
				sequence.push(this.parseNode());
			} while (this.currentChar == ';');

			return sequence;
		}

		/**
   * Parses a SGF *GameTree*.
   * 
   * @throws {SGFSyntaxError} [[Description]]
   * @returns {[[Type]]} [[Description]]
   */

	}, {
		key: "parseGameTree",
		value: function parseGameTree() {
			// No need to check GameTree (we know it starts with `(`)
			this.next();

			// Parse sequence
			var sequence = this.parseSequence();

			// Game tree ends with `)`, or add subtree to the end of sequence
			if (this.currentChar != ')') sequence.push(this.parseCollection());

			return sequence;
		}

		/**
   * Parses a SGF *Collection*.
   */

	}, {
		key: "parseCollection",
		value: function parseCollection() {
			var gameTrees = [];

			// Parse all trees
			do {
				// Collection must start with character `(`
				if (this.currentChar != '(') throw new SGFSyntaxError("SGF tree must be enclosed in '(' and ')'", this);
				gameTrees.push(this.parseGameTree());
				this.next();
			} while (this.currentChar && this.currentChar != ')');

			return gameTrees;
		}
	}]);
	return SGFParser;
}();

SGFParser$1.SGFSyntaxError = SGFSyntaxError;

/**
 * From SGF specification, there are these types of property values:
 * 
 * CValueType = (ValueType | *Compose*)
 * ValueType  = (*None* | *Number* | *Real* | *Double* | *Color* | *SimpleText* | *Text* | *Point*  | *Move* | *Stone*)
 * 
 * WGo's kifu node (KNode object) implements similar types with few exceptions: 
 * 
 * - Types `Number`, `Real` and `Double` are implemented by javascript's `number`.
 * - Types `SimpleText` and `Text` are considered as the same.
 * - Types `Point`, `Move` and `Stone` are all the same, implemented as simple object with `x` and `y` coordinates.
 * - Type `None` is implemented as `true`
 * 
 * Each `Compose` type, which is used in SGF, has its own type.
 * 
 * - `Point ':' Point` (used in AR property) has special type `Line` - object with two sets of coordinates.
 * - `Point ':' Simpletext` (used in LB property) has special type `Label` - object with coordinates and text property
 * - `Simpletext ":" Simpletext` (used in AP property) - not implemented
 * - `Number ":" SimpleText` (used in FG property) - not implemented
 * 
 * Moreover each property value has these settings:
 * 
 * - *Single value* / *Array* (more values)
 * - *Not empty* / *Empty* (value or array can be empty)
 * 
 * {@link http://www.red-bean.com/sgf/sgf4.html}
 */

/// Types definitions -----------------------------------------------------------------------------

var NONE = {
	read: function read(str) {
		return true;
	},
	write: function write(value) {
		return "";
	}
};

var NUMBER = {
	read: function read(str) {
		return parseFloat(str);
	},
	write: function write(value) {
		return value + "";
	}
};

var TEXT = {
	read: function read(str) {
		return str;
	},
	write: function write(value) {
		return value;
	}
};

var COLOR = {
	read: function read(str) {
		return str == "w" || str == "W" ? WHITE : BLACK;
	},
	write: function write(value) {
		return value == WHITE ? "W" : "B";
	}
};

var POINT = {
	read: function read(str) {
		return str ? {
			x: str.charCodeAt(0) - 97,
			y: str.charCodeAt(1) - 97
		} : false;
	},
	write: function write(value) {
		return value ? String.fromCharCode(value.x + 97) + String.fromCharCode(value.y + 97) : "";
	}
};

var LABEL = {
	read: function read(str) {
		return {
			x: str.charCodeAt(0) - 97,
			y: str.charCodeAt(1) - 97,
			text: str.substr(3)
		};
	},
	write: function write(value) {
		return String.fromCharCode(value.x + 97) + String.fromCharCode(value.y + 97) + ":" + value.text;
	}
};

var LINE = {
	read: function read(str) {
		return {
			x1: str.charCodeAt(0) - 97,
			y1: str.charCodeAt(1) - 97,
			x2: str.charCodeAt(3) - 97,
			y2: str.charCodeAt(4) - 97
		};
	},
	write: function write(value) {
		return String.fromCharCode(value.x1 + 97) + String.fromCharCode(value.y1 + 97) + ":" + String.fromCharCode(value.x2 + 97) + String.fromCharCode(value.y2 + 97);
	}
};

/// Property definitions --------------------------------------------------------------------------

var propertyValueTypes = {
	_default: {
		type: TEXT,
		multiple: false,
		notEmpty: true
	}
};

/// Move properties -------------------------------------------------------------------------------

propertyValueTypes.B = propertyValueTypes.W = {
	type: POINT,
	multiple: false,
	notEmpty: false
};

propertyValueTypes.KO = {
	type: NONE,
	multiple: false,
	notEmpty: false
};

propertyValueTypes.MN = {
	type: NUMBER,
	multiple: false,
	notEmpty: true
};

/// Setup properties ------------------------------------------------------------------------------

propertyValueTypes.AB = propertyValueTypes.AW = propertyValueTypes.AE = {
	type: POINT,
	multiple: true,
	notEmpty: true
};

propertyValueTypes.PL = {
	type: COLOR,
	multiple: false,
	notEmpty: true
};

/// Node annotation properties --------------------------------------------------------------------

propertyValueTypes.C = propertyValueTypes.N = {
	type: TEXT,
	multiple: false,
	notEmpty: true
};

propertyValueTypes.DM = propertyValueTypes.GB = propertyValueTypes.GW = propertyValueTypes.HO = propertyValueTypes.UC = propertyValueTypes.V = {
	type: NUMBER,
	multiple: false,
	notEmpty: true
};

/// Move annotation properties --------------------------------------------------------------------

propertyValueTypes.BM = propertyValueTypes.TE = {
	type: NUMBER,
	multiple: false,
	notEmpty: true
};

propertyValueTypes.DO = propertyValueTypes.IT = {
	type: NONE,
	multiple: false,
	notEmpty: false
};

/// Markup properties -----------------------------------------------------------------------------

propertyValueTypes.CR = propertyValueTypes.MA = propertyValueTypes.SL = propertyValueTypes.SQ = propertyValueTypes.TR = {
	type: POINT,
	multiple: true,
	notEmpty: true
};

propertyValueTypes.LB = {
	type: LABEL,
	multiple: true,
	notEmpty: true
};

propertyValueTypes.AR = propertyValueTypes.LN = {
	type: LINE,
	multiple: true,
	notEmpty: true
};

propertyValueTypes.DD = propertyValueTypes.TB = propertyValueTypes.TW = {
	type: POINT,
	multiple: true,
	notEmpty: false
};

/// Root properties -------------------------------------------------------------------------------

propertyValueTypes.AP = propertyValueTypes.CA = {
	type: TEXT,
	multiple: false,
	notEmpty: true
};

// note: rectangular board is not implemented (in SZ property)
propertyValueTypes.FF = propertyValueTypes.GM = propertyValueTypes.ST = propertyValueTypes.SZ = {
	type: NUMBER,
	multiple: false,
	notEmpty: true
};

/// Game info properties --------------------------------------------------------------------------

propertyValueTypes.AN = propertyValueTypes.BR = propertyValueTypes.BT = propertyValueTypes.CP = propertyValueTypes.DT = propertyValueTypes.EV = propertyValueTypes.GN = propertyValueTypes.GC = propertyValueTypes.GN = propertyValueTypes.ON = propertyValueTypes.OT = propertyValueTypes.PB = propertyValueTypes.PC = propertyValueTypes.PW = propertyValueTypes.RE = propertyValueTypes.RO = propertyValueTypes.RU = propertyValueTypes.SO = propertyValueTypes.US = propertyValueTypes.WR = propertyValueTypes.WT = {
	type: TEXT,
	multiple: false,
	notEmpty: true
};

propertyValueTypes.TM = propertyValueTypes.HA = propertyValueTypes.KM = {
	type: NUMBER,
	multiple: false,
	notEmpty: true
};

/// Timing properties -----------------------------------------------------------------------------

propertyValueTypes.BL = propertyValueTypes.WL = propertyValueTypes.OB = propertyValueTypes.OW = {
	type: NUMBER,
	multiple: false,
	notEmpty: true
};

/// Miscellaneous properties ----------------------------------------------------------------------

propertyValueTypes.PM = {
	type: NUMBER,
	multiple: false,
	notEmpty: true
};

propertyValueTypes.VW = {
	type: POINT,
	multiple: true,
	notEmpty: false
};

/**
 * Class for errors happend during manipulation the Kifu object.
 * @extends Error
 */
var KifuError = function KifuError(message) {
	babelHelpers.classCallCheck(this, KifuError);

	var tempError = Error.apply(this);
	this.message = message;
	this.stack = tempError.stack;
};

// a small ES5 hack because currently in ES6 you can't extend Errors
KifuError.prototype = Object.create(Error.prototype);
KifuError.prototype.constructor = KifuError;

// jsgf helper
var processJsgf = function processJsgf(parent, jsgf, pos) {
	if (jsgf[pos]) {
		if (Array.isArray(jsgf[pos])) {
			// more children (fork)
			jsgf[pos].forEach(function (jsgf2) {
				processJsgf(parent, jsgf2, 0);
			});
		} else {
			// one child
			var node = new KNode();
			node.setSGFProperties(jsgf[pos]);
			parent.appendChild(node);
			processJsgf(node, jsgf, pos + 1);
		}
	}
};

/**
 * Class representing one kifu node.
 */

var KNode = function () {
	babelHelpers.createClass(KNode, null, [{
		key: "fromJS",
		value: function fromJS(jsgf) {
			var root = new KNode();

			root.setSGFProperties(jsgf[0]);
			processJsgf(root, jsgf, 1);

			return root;
		}
	}, {
		key: "fromSGF",
		value: function fromSGF(sgf, ind) {
			var parser = new SGFParser$1(sgf);
			return KNode.fromJS(parser.parseCollection()[ind || 0]);
		}
	}]);

	function KNode() {
		babelHelpers.classCallCheck(this, KNode);

		// parent node (readonly)
		this.parent = null;

		// array of child nodes (readonly)
		this.children = [];

		// map of SGF properties (readonly) - {<PropIdent>: Array<PropValue>}
		this.SGFProperties = {};
	}

	babelHelpers.createClass(KNode, [{
		key: "appendChild",


		/// GENERAL TREE NODE MANIPULATION METHODS (subset of DOM API's Node)

		/**
   * Insert a KNode as the last child node of this node.
   * 
   * @throws  {KifuError} when argument is invalid.
   * @param   {KNode} node to append.
   * @returns {number} position(index) of appended node.
   */

		value: function appendChild(node) {
			if (node == null || !(node instanceof KNode) || node == this) throw new KifuError("Invalid argument passed to `appendChild` method, KNode was expected.");

			if (node.parent) node.parent.removeChild(node);

			node.parent = this;

			return this.children.push(node) - 1;
		}

		/**
   * Hard clones a KNode and all of its contents.
   * 
   * @param {boolean}	appendToParent if set true, cloned node will be appended to this parent.
   * @returns {KNode}	cloned node                              
   */

	}, {
		key: "cloneNode",
		value: function cloneNode(appendToParent) {
			var node = new KNode();
			node.innerSGF = this.innerSGF;

			if (appendToParent && this.parent) this.parent.appendChild(node);

			return node;
		}

		/**
   * Returns a Boolean value indicating whether a node is a descendant of a given node or not.
   * 
   * @param   {KNode}   node to be tested
   * @returns {boolean} true, if this node contains given node.
   */

	}, {
		key: "contains",
		value: function contains(node) {
			if (this.children.indexOf(node) >= 0) return true;

			return this.children.some(function (child) {
				return child.contains(node);
			});
		}

		/**
   * Inserts the first KNode given in a parameter immediately before the second, child of this KNode.
   * 
   * @throws  {KifuError}   when argument is invalid.
   * @param   {KNode}   newNode       node to be inserted
   * @param   {(KNode)} referenceNode reference node, if omitted, new node will be inserted at the end. 
   * @returns {KNode}   this node
   */

	}, {
		key: "insertBefore",
		value: function insertBefore(newNode, referenceNode) {
			if (newNode == null || !(newNode instanceof KNode) || newNode == this) throw new KifuError("Invalid argument passed to `insertBefore` method, KNode was expected.");else if (referenceNode == null) return this.appendChild(newNode);

			if (newNode.parent) newNode.parent.removeChild(newNode);

			newNode.parent = this;

			this.children.splice(this.children.indexOf(referenceNode), 0, newNode);
			return this;
		}

		/**
   * Removes a child node from the current element, which must be a child of the current node.
   * 
   * @param   {object} child node to be removed
   * @returns {KNode}  this node
   */

	}, {
		key: "removeChild",
		value: function removeChild(child) {
			var childPosition = this.children.indexOf(child);

			if (childPosition == -1) {
				throw new KifuError("Argument passed to `removeChild` method is not child node of the node.");
			}

			this.children.splice(childPosition, 1);

			child.parent = null;

			return this;
		}

		/**
   * Replaces one child Node of the current one with the second one given in parameter.
   * 
   * @throws  {KifuError} when argument is invalid
   * @param   {KNode} newChild node to be inserted
   * @param   {KNode} oldChild node to be replaced
   * @returns {KNode} this node
   */

	}, {
		key: "replaceChild",
		value: function replaceChild(newChild, oldChild) {
			if (newChild == null || !(newChild instanceof KNode) || newChild == this) throw new KifuError("Invalid argument passed to `replaceChild` method, KNode was expected.");

			this.insertBefore(newChild, oldChild);
			this.removeChild(oldChild);

			return this;
		}

		/// BASIC PROPERTY GETTER and SETTER

		/**
   * Gets property by SGF property identificator. Returns property value (type depends on property type)
   * 
   * @param   {string} 	propIdent - SGF property idetificator
   * @returns {any}		property value or values or undefined, if property is missing. 
   */

	}, {
		key: "getProperty",
		value: function getProperty(propIdent) {
			return this.SGFProperties[propIdent];
		}

		/**
   * Sets property by SGF property identificator.
   * 
   * @param   {string}          propIdent - SGF property idetificator
   * @param   {string|string[]} value - property value or values
   */

	}, {
		key: "setProperty",
		value: function setProperty(propIdent, value) {
			if (value == null) delete this.SGFProperties[propIdent];else this.SGFProperties[propIdent] = value;

			return this;
		}

		/// SGF RAW METHODS

		/**
   * Gets one SGF property value as string (with brackets `[` and `]`).
   * 
   * @param   {string} propIdent SGF property identificator.
   * @returns {string} SGF property values or empty string, if node doesn't containg this property.
   */

	}, {
		key: "getSGFProperty",
		value: function getSGFProperty(propIdent) {
			var _this = this;

			if (this.SGFProperties[propIdent] != null) {
				var _ret = function () {
					var propertyValueType = propertyValueTypes[propIdent] || propertyValueTypes._default;

					if (propertyValueType.multiple) {
						if (!propertyValueType.notEmpty || _this.SGFProperties[propIdent].length) {
							return {
								v: "[" + _this.SGFProperties[propIdent].map(function (propValue) {
									return propertyValueType.type.write(propValue).replace(/\]/g, "\\]");
								}).join("][") + "]"
							};
						}
					} else if (!propertyValueType.notEmpty || _this.SGFProperties[propIdent]) {
						return {
							v: "[" + propertyValueType.type.write(_this.SGFProperties[propIdent]).replace(/\]/g, "\\]") + "]"
						};
					}
				}();

				if ((typeof _ret === "undefined" ? "undefined" : babelHelpers.typeof(_ret)) === "object") return _ret.v;
			}

			return "";
		}

		/**
   * Sets one SGF property.
   * 
   * @param   {string}   propIdent SGF property idetificator
   * @param   {string[]} propValue SGF property value
   * @returns {KNode}    this KNode for chaining
   */

	}, {
		key: "setSGFProperty",
		value: function setSGFProperty(propIdent, propValue) {
			if (typeof propValue == "string") {
				var parser = new SGFParser$1(propValue);
				propValue = parser.parsePropertyValues();
			}

			var propertyValueType = propertyValueTypes[propIdent] || propertyValueTypes._default;

			if (propertyValueType.multiple) {
				if (!propertyValueType.notEmpty || propValue.length) {
					this.SGFProperties[propIdent] = propValue.map(function (val) {
						return propertyValueType.type.read(val);
					});
				}
			} else if (!propertyValueType.notEmpty || propValue[0]) {
				this.SGFProperties[propIdent] = propertyValueType.type.read(propValue.join(""));
			} else {
				delete this.SGFProperties[propIdent];
			}

			return this;
		}

		/**
   * Sets multiple SGF properties.
   * 
   * @param   {Object}   properties - map with signature propIdent -> propValues.
   * @returns {KNode}    this KNode for chaining
   */

	}, {
		key: "setSGFProperties",
		value: function setSGFProperties(properties) {
			for (var ident in properties) {
				if (properties.hasOwnProperty(ident)) {
					this.setSGFProperty(ident, properties[ident]);
				}
			}

			return this;
		}

		/**
   * Sets properties of Kifu node based on the sgf string. Usually you won't use this method directly, but use innerSGF property instead.
   * 
   * Basically it parsers the sgf, takes properties from it and adds them to the node. 
   * Then if there are other nodes in the string, they will be appended to the node as well.
   * 
   * @param {string} sgf SGF text for current node. It must be without trailing `;`, however it can contain following nodes.
   * @throws {SGFSyntaxError} throws exception, if sgf string contains invalid SGF.
   */

	}, {
		key: "setFromSGF",
		value: function setFromSGF(parser) {
			// clean up
			for (var i = this.children.length - 1; i >= 0; i--) {
				this.removeChild(this.children[i]);
			}
			this.SGFProperties = {};

			// and parse properties
			this.setSGFProperties(parser.parseProperties());

			// then we parse the rest of sgf
			if (parser.currentChar == ";") {
				// single kifu node child
				var childNode = new KNode();
				this.appendChild(childNode);
				parser.next();
				childNode.setFromSGF(parser);
			} else if (parser.currentChar == "(") {
				// two or more children
				parser.parseCollection().forEach(function (jsgf) {
					this.appendChild(KNode.fromJS(jsgf));
				}.bind(this));
			} else if (parser.currentChar) {
				// syntax error
				throw new SGFSyntaxError("Illegal character in SGF node", parser);
			}
		}
	}, {
		key: "toSGF",
		value: function toSGF() {
			return "(;" + this.innerSGF + ")";
		}
	}, {
		key: "root",
		get: function get() {
			var node = this;
			while (node.parent != null) {
				node = node.parent;
			}return node;
		}
	}, {
		key: "innerSGF",
		set: function set(sgf) {
			// prepare parser
			this.setFromSGF(new SGFParser$1(sgf));
		},
		get: function get() {
			var output = "";

			for (var propIdent in this.SGFProperties) {
				if (this.SGFProperties.hasOwnProperty(propIdent)) {
					output += propIdent + this.getSGFProperty(propIdent);
				}
			}
			if (this.children.length == 1) {
				return output + ";" + this.children[0].innerSGF;
			} else if (this.children.length > 1) {
				return this.children.reduce(function (prev, current) {
					return prev + "(;" + current.innerSGF + ")";
				}, output);
			} else {
				return output;
			}
		}
	}]);
	return KNode;
}();

/**
 * Utilities methods for Canvas board 
 */

function themeVariable(key, board) {
	return typeof board.theme[key] == "function" ? board.theme[key](board) : board.theme[key];
}

function getMarkupColor(board, x, y) {
	if (board.fieldObjects[x][y][0].c == BLACK) return themeVariable("markupBlackColor", board);else if (board.fieldObjects[x][y][0].c == WHITE) return themeVariable("markupWhiteColor", board);
	return themeVariable("markupNoneColor", board);
}

function isHereStone(board, x, y) {
	return board.fieldObjects[x][y][0] && board.fieldObjects[x][y][0].c == WHITE || board.fieldObjects[x][y][0].c == BLACK;
}

function defaultFieldClear(canvasCtx, args, board) {
	canvasCtx.clearRect(-board.fieldWidth / 2, -board.fieldHeight / 2, board.fieldWidth, board.fieldHeight);
}

var gridClearField = {
	draw: function draw(canvasCtx, args, board) {
		if (!isHereStone(board, args.x, args.y) && !args._nodraw) {
			var stoneRadius = board.stoneRadius;

			canvasCtx.clearRect(-stoneRadius, -stoneRadius, 2 * stoneRadius, 2 * stoneRadius);
		}
	},
	clear: function clear(canvasCtx, args, board) {
		if (!isHereStone(board, args.x, args.y)) {
			args._nodraw = true;
			canvasCtx.restore(); // small hack for now
			board.redrawLayer("grid");
			canvasCtx.save();
			delete args._nodraw;
		}
	}
};

/* global document, window */
/**
 * @class
 * Implements one layer of the HTML5 canvas
 */

var CanvasLayer = function () {
	function CanvasLayer() {
		babelHelpers.classCallCheck(this, CanvasLayer);

		this.element = document.createElement('canvas');
		this.context = this.element.getContext('2d');

		// Adjust pixel ratio for HDPI screens (e.g. Retina)
		this.pixelRatio = window.devicePixelRatio || 1;
		//this.context.scale(this.pixelRatio, this.pixelRatio);
		//this.context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
		this.context.scale(this.pixelRatio, this.pixelRatio);
		this.context.save();
	}

	babelHelpers.createClass(CanvasLayer, [{
		key: 'setDimensions',
		value: function setDimensions(width, height, board) {
			var linesShift = themeVariable("linesShift", board);

			this.element.width = width;
			this.element.style.width = width / this.pixelRatio + 'px';
			this.element.height = height;
			this.element.style.height = height / this.pixelRatio + 'px';

			this.context.restore();
			this.context.save();
			this.context.transform(1, 0, 0, 1, linesShift, linesShift);
		}
	}, {
		key: 'appendTo',
		value: function appendTo(element, weight) {
			this.element.style.position = 'absolute';
			this.element.style.zIndex = weight;
			element.appendChild(this.element);
		}
	}, {
		key: 'removeFrom',
		value: function removeFrom(element) {
			element.removeChild(this.element);
		}
	}, {
		key: 'getContext',
		value: function getContext() {
			return this.context;
		}
	}, {
		key: 'initialDraw',
		value: function initialDraw() /*board*/{
			// abstract method to be implemented
		}
	}, {
		key: 'draw',
		value: function draw(drawingFn, args, board) {
			this.context.save();
			drawingFn(this.context, args, board);
			this.context.restore();
		}
	}, {
		key: 'drawField',
		value: function drawField(drawingFn, args, board) {
			var leftOffset = Math.round(board.left + args.x * board.fieldWidth);
			var topOffset = board.top + args.y * board.fieldHeight;

			// create a "sandbox" for drawing function
			this.context.save();

			this.context.transform(1, 0, 0, 1, leftOffset, topOffset);
			this.context.beginPath();
			this.context.rect(-board.fieldWidth / 2, -board.fieldWidth / 2, board.fieldWidth, board.fieldHeight);
			this.context.clip();
			drawingFn(this.context, args, board);

			// restore context
			this.context.restore();
		}
	}, {
		key: 'clear',
		value: function clear() {
			this.context.clearRect(0, 0, this.element.width, this.element.height);
		}
	}]);
	return CanvasLayer;
}();

var gridHandler = {
	grid: {
		draw: function draw(canvasCtx, args, board) {
			// draw grid
			var tmp;

			canvasCtx.beginPath();
			canvasCtx.lineWidth = themeVariable("gridLinesWidth", board);
			canvasCtx.strokeStyle = themeVariable("gridLinesColor", board);

			var tx = Math.round(board.left),
			    ty = Math.round(board.top),
			    bw = Math.round(board.fieldWidth * (board.size - 1)),
			    bh = Math.round(board.fieldHeight * (board.size - 1));

			canvasCtx.strokeRect(tx, ty, bw, bh);

			for (var i = 1; i < board.size - 1; i++) {
				tmp = Math.round(board.getX(i));
				canvasCtx.moveTo(tmp, ty);
				canvasCtx.lineTo(tmp, ty + bh);

				tmp = Math.round(board.getY(i));
				canvasCtx.moveTo(tx, tmp);
				canvasCtx.lineTo(tx + bw, tmp);
			}

			canvasCtx.stroke();

			// draw stars
			canvasCtx.fillStyle = themeVariable("starColor", board);

			if (board.starPoints[board.size]) {
				for (var key in board.starPoints[board.size]) {
					canvasCtx.beginPath();
					canvasCtx.arc(board.getX(board.starPoints[board.size][key].x), board.getY(board.starPoints[board.size][key].y), themeVariable("starSize", board), 0, 2 * Math.PI, true);
					canvasCtx.fill();
				}
			}
		}
	}
};

/**
 * @class
 * @extends WGo.CanvasBoard.CanvasLayer
 * Layer which renders board grid.
 */

var GridLayer = function (_CanvasLayer) {
  babelHelpers.inherits(GridLayer, _CanvasLayer);

  function GridLayer() {
    babelHelpers.classCallCheck(this, GridLayer);
    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(GridLayer).apply(this, arguments));
  }

  babelHelpers.createClass(GridLayer, [{
    key: "initialDraw",
    value: function initialDraw(board) {
      gridHandler.grid.draw(this.context, {}, board);
    }
  }]);
  return GridLayer;
}(CanvasLayer);

/**
 * @class
 * @extends WGo.CanvasBoard.CanvasLayer
 * Layer for shadows. It is slightly translated.
 */

var ShadowLayer = function (_CanvasLayer) {
  babelHelpers.inherits(ShadowLayer, _CanvasLayer);

  function ShadowLayer() {
    babelHelpers.classCallCheck(this, ShadowLayer);
    return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ShadowLayer).apply(this, arguments));
  }

  babelHelpers.createClass(ShadowLayer, [{
    key: "setDimensions",
    value: function setDimensions(width, height, board) {
      babelHelpers.get(Object.getPrototypeOf(ShadowLayer.prototype), "setDimensions", this).call(this, width, height, board);
      this.context.transform(1, 0, 0, 1, themeVariable("shadowOffsetX", board), themeVariable("shadowOffsetY", board));
    }
  }]);
  return ShadowLayer;
}(CanvasLayer);

/**
 * Generic shadow draw handler for all stones
 * 
 * "shadowBlur" 0-1
 * 0 - no blur - createRadialGradient(0, 0, stoneRadius, 0, 0, stoneRadius)
 * 1 - maximal blur - createRadialGradient(0, 0, 0, 0, 0, 8/7*stoneRadius)
 */

var shadow = {
	draw: function draw(canvasCtx, args, board) {
		var stoneRadius = board.stoneRadius;
		var blur = themeVariable("shadowBlur", board) || 0.00001;

		var startRadius = Math.max(stoneRadius - stoneRadius * blur, 0.00001);
		var stopRadius = stoneRadius + 1 / 7 * stoneRadius * blur;

		var gradient = canvasCtx.createRadialGradient(0, 0, startRadius, 0, 0, stopRadius);
		gradient.addColorStop(0, themeVariable("shadowColor", board));
		gradient.addColorStop(1, themeVariable("shadowTransparentColor", board));

		canvasCtx.beginPath();
		canvasCtx.fillStyle = gradient;
		canvasCtx.arc(0, 0, stopRadius, 0, 2 * Math.PI, true);
		canvasCtx.fill();

		//canvasCtx.beginPath();
		//canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
		//canvasCtx.stroke();
	} //
};

// shell stone helping functions
var shellSeed = Math.ceil(Math.random() * 9999999);

var drawShellLine = function drawShellLine(ctx, x, y, radius, startAngle, endAngle, factor, thickness) {
	ctx.strokeStyle = "rgba(64,64,64,0.2)";

	ctx.lineWidth = radius / 30 * thickness;
	ctx.beginPath();

	radius -= Math.max(1, ctx.lineWidth);

	var x1 = x + radius * Math.cos(startAngle * Math.PI);
	var y1 = y + radius * Math.sin(startAngle * Math.PI);
	var x2 = x + radius * Math.cos(endAngle * Math.PI);
	var y2 = y + radius * Math.sin(endAngle * Math.PI);

	var m, angle, diffX, diffY;
	if (x2 > x1) {
		m = (y2 - y1) / (x2 - x1);
		angle = Math.atan(m);
	} else if (x2 == x1) {
		angle = Math.PI / 2;
	} else {
		m = (y2 - y1) / (x2 - x1);
		angle = Math.atan(m) - Math.PI;
	}

	var c = factor * radius;
	diffX = Math.sin(angle) * c;
	diffY = Math.cos(angle) * c;

	var bx1 = x1 + diffX;
	var by1 = y1 - diffY;

	var bx2 = x2 + diffX;
	var by2 = y2 - diffY;

	ctx.moveTo(x1, y1);
	ctx.bezierCurveTo(bx1, by1, bx2, by2, x2, y2);
	ctx.stroke();
};

var drawShell = function drawShell(arg) {
	var fromAngle = arg.angle;
	var toAngle = arg.angle;

	for (var i = 0; i < arg.lines.length; i++) {
		fromAngle += arg.lines[i];
		toAngle -= arg.lines[i];
		drawShellLine(arg.ctx, arg.x, arg.y, arg.radius, fromAngle, toAngle, arg.factor, arg.thickness);
	}
};

var shellStone = {
	stone: {
		draw: function draw(canvasCtx, args, board) {
			var stoneRadius = board.stoneRadius;
			var radgrad = void 0;

			if (args.c == WHITE) {
				radgrad = "#aaa";
			} else {
				radgrad = "#000";
			}

			canvasCtx.beginPath();
			canvasCtx.fillStyle = radgrad;
			canvasCtx.arc(0, 0, Math.max(0, stoneRadius - 0.5), 0, 2 * Math.PI, true);
			canvasCtx.fill();

			// do shell magic here
			if (args.c == WHITE) {
				// do shell magic here
				var type = shellSeed % (3 + args.x * board.size + args.y) % 3;
				var z = board.size * board.size + args.x * board.size + args.y;
				var angle = 2 / z * (shellSeed % z);

				if (type == 0) {
					drawShell({
						ctx: canvasCtx,
						x: 0,
						y: 0,
						radius: stoneRadius,
						angle: angle,
						lines: [0.10, 0.12, 0.11, 0.10, 0.09, 0.09, 0.09, 0.09],
						factor: 0.25,
						thickness: 1.75
					});
				} else if (type == 1) {
					drawShell({
						ctx: canvasCtx,
						x: 0,
						y: 0,
						radius: stoneRadius,
						angle: angle,
						lines: [0.10, 0.09, 0.08, 0.07, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
						factor: 0.2,
						thickness: 1.5
					});
				} else {
					drawShell({
						ctx: canvasCtx,
						x: 0,
						y: 0,
						radius: stoneRadius,
						angle: angle,
						lines: [0.12, 0.14, 0.13, 0.12, 0.12, 0.12],
						factor: 0.3,
						thickness: 2
					});
				}
				radgrad = canvasCtx.createRadialGradient(-2 * stoneRadius / 5, -2 * stoneRadius / 5, stoneRadius / 3, -stoneRadius / 5, -stoneRadius / 5, 5 * stoneRadius / 5);
				radgrad.addColorStop(0, 'rgba(255,255,255,0.9)');
				radgrad.addColorStop(1, 'rgba(255,255,255,0)');

				// add radial gradient //
				canvasCtx.beginPath();
				canvasCtx.fillStyle = radgrad;
				canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
				canvasCtx.fill();
			} else {
				radgrad = canvasCtx.createRadialGradient(0.4 * stoneRadius, 0.4 * stoneRadius, 0, 0.5 * stoneRadius, 0.5 * stoneRadius, stoneRadius);
				radgrad.addColorStop(0, 'rgba(32,32,32,1)');
				radgrad.addColorStop(1, 'rgba(0,0,0,0)');

				canvasCtx.beginPath();
				canvasCtx.fillStyle = radgrad;
				canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
				canvasCtx.fill();

				radgrad = canvasCtx.createRadialGradient(-0.4 * stoneRadius, -0.4 * stoneRadius, 1, -0.5 * stoneRadius, -0.5 * stoneRadius, 1.5 * stoneRadius);
				radgrad.addColorStop(0, 'rgba(64,64,64,1)');
				radgrad.addColorStop(1, 'rgba(0,0,0,0)');

				canvasCtx.beginPath();
				canvasCtx.fillStyle = radgrad;
				canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
				canvasCtx.fill();
			}
		}
	},
	shadow: shadow
};

var glassStone = {
    // draw handler for stone layer
    stone: {
        // drawing function - args object contain info about drawing object, board is main board object
        draw: function draw(canvasCtx, args, board) {
            var stoneRadius = board.stoneRadius;
            var radgrad;

            // set stone texture
            if (args.c == WHITE) {
                radgrad = canvasCtx.createRadialGradient(-2 * stoneRadius / 5, -2 * stoneRadius / 5, stoneRadius / 3, -stoneRadius / 5, -stoneRadius / 5, 5 * stoneRadius / 5);
                radgrad.addColorStop(0, '#fff');
                radgrad.addColorStop(1, '#aaa');
            } else {
                radgrad = canvasCtx.createRadialGradient(-2 * stoneRadius / 5, -2 * stoneRadius / 5, 1, -stoneRadius / 5, -stoneRadius / 5, 4 * stoneRadius / 5);
                radgrad.addColorStop(0, '#666');
                radgrad.addColorStop(1, '#000');
            }

            // paint stone
            canvasCtx.beginPath();
            canvasCtx.fillStyle = radgrad;
            canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
            canvasCtx.fill();
        }
    },

    // adding shadow
    shadow: shadow
};

var paintedStone = {
	stone: {
		draw: function draw(canvasCtx, args, board) {
			var stoneRadius = board.stoneRadius;
			var radgrad = void 0;

			if (args.c == WHITE) {
				radgrad = canvasCtx.createRadialGradient(-2 * stoneRadius / 5, -2 * stoneRadius / 5, 2, -stoneRadius / 5, -stoneRadius / 5, 4 * stoneRadius / 5);
				radgrad.addColorStop(0, '#fff');
				radgrad.addColorStop(1, '#ddd');
			} else {
				radgrad = canvasCtx.createRadialGradient(-2 * stoneRadius / 5, -2 * stoneRadius / 5, 1, -stoneRadius / 5, -stoneRadius / 5, 4 * stoneRadius / 5);
				radgrad.addColorStop(0, '#111');
				radgrad.addColorStop(1, '#000');
			}

			canvasCtx.beginPath();
			canvasCtx.fillStyle = radgrad;
			canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
			canvasCtx.fill();

			canvasCtx.beginPath();
			canvasCtx.lineWidth = stoneRadius / 6;

			if (args.c == WHITE) {
				canvasCtx.strokeStyle = '#999';
				canvasCtx.arc(stoneRadius / 8, stoneRadius / 8, stoneRadius / 2, 0, Math.PI / 2, false);
			} else {
				canvasCtx.strokeStyle = '#ccc';
				canvasCtx.arc(-stoneRadius / 8, -stoneRadius / 8, stoneRadius / 2, Math.PI, 1.5 * Math.PI);
			}

			canvasCtx.stroke();
		}
	},
	shadow: shadow
};

// Black and white stone
var simpleStone = {
	stone: {
		draw: function draw(canvasCtx, args, board) {
			var stoneRadius = board.stoneRadius;
			var lw = themeVariable("markupLinesWidth", board) || 1;

			if (args.c == WHITE) canvasCtx.fillStyle = "white";else canvasCtx.fillStyle = "black";

			canvasCtx.beginPath();
			canvasCtx.arc(0, 0, Math.max(0, stoneRadius - lw), 0, 2 * Math.PI, true);
			canvasCtx.fill();

			canvasCtx.lineWidth = lw;
			canvasCtx.strokeStyle = "black";
			canvasCtx.stroke();
		}
	}
};

/* global window */

// Check if image has been loaded properly
// see https://stereochro.me/ideas/detecting-broken-images-js
function isOkay(img) {
	if (typeof img === 'string') {
		return false;
	}
	if (!img.complete) {
		return false;
	}
	if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) {
		return false;
	}
	return true;
}

// Shadow handler for the 'REALISITC' rendering mode
// handler for image based stones
var realisticStone = function (graphics, fallback) {
	var randSeed = Math.ceil(Math.random() * 9999999);
	var redrawRequest = void 0;

	return {
		stone: {
			draw: function draw(canvasCtx, args, board) {
				var stoneRadius = board.stoneRadius;
				var graphic = args.c == WHITE ? graphics.whiteStoneGraphic : graphics.blackStoneGraphic;
				var count = graphic.length;
				var idx = randSeed % (count + args.x * board.size + args.y) % count;

				if (typeof graphic[idx] === 'string') {
					// The image has not been loaded yet
					var stoneGraphic = new window.Image();
					// Redraw the whole board after the image has been loaded.
					// This prevents 'missing stones' and similar graphical errors
					// especially on slower internet connections.
					stoneGraphic.onload = function () {
						// make sure board will be redraw just once, and after every stone is processed
						if (redrawRequest != null) {
							window.clearTimeout(redrawRequest);
						}
						redrawRequest = window.setTimeout(function () {
							board.redraw();
							redrawRequest = null;
						}, 1);
					};
					stoneGraphic.src = themeVariable("imageFolder", board) + graphic[idx];
					graphic[idx] = stoneGraphic;
				}

				if (isOkay(graphic[idx])) {
					canvasCtx.drawImage(graphic[idx], -stoneRadius, -stoneRadius, 2 * stoneRadius, 2 * stoneRadius);
				} else {
					// Fall back to SHELL handler if there was a problem loading the image
					fallback.stone.draw(canvasCtx, args, board);
				}
			}
		},
		shadow: shadow
	};
};

var circle = {
	stone: {
		draw: function draw(canvasCtx, args, board) {
			var stoneRadius = board.stoneRadius;

			canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
			canvasCtx.lineWidth = args.lineWidth || themeVariable("markupLinesWidth", board) || 1;
			canvasCtx.beginPath();
			canvasCtx.arc(0, 0, Math.round(stoneRadius / 2), 0, 2 * Math.PI, true);
			canvasCtx.stroke();
		}
	},
	grid: gridClearField
};

var square = {
	stone: {
		draw: function draw(canvasCtx, args, board) {
			var stoneRadius = Math.round(board.stoneRadius);

			canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
			canvasCtx.lineWidth = args.lineWidth || themeVariable("markupLinesWidth", board) || 1;
			canvasCtx.beginPath();
			canvasCtx.rect(Math.round(-stoneRadius / 2), Math.round(-stoneRadius / 2), stoneRadius, stoneRadius);
			canvasCtx.stroke();
		}
	},
	grid: gridClearField
};

var triangle = {
	stone: {
		draw: function draw(canvasCtx, args, board) {
			var stoneRadius = board.stoneRadius;

			canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
			canvasCtx.lineWidth = args.lineWidth || themeVariable("markupLinesWidth", board) || 1;
			canvasCtx.beginPath();
			canvasCtx.moveTo(0, 0 - Math.round(stoneRadius / 2));
			canvasCtx.lineTo(Math.round(-stoneRadius / 2), Math.round(stoneRadius / 3));
			canvasCtx.lineTo(Math.round(+stoneRadius / 2), Math.round(stoneRadius / 3));
			canvasCtx.closePath();
			canvasCtx.stroke();
		}
	},
	grid: gridClearField
};

var label = {
			stone: {
						draw: function draw(canvasCtx, args, board) {
									var stoneRadius = board.stoneRadius;
									var font = args.font || themeVariable("font", board) || "";

									canvasCtx.fillStyle = args.c || getMarkupColor(board, args.x, args.y);

									if (args.text.length == 1) canvasCtx.font = Math.round(stoneRadius * 1.5) + "px " + font;else if (args.text.length == 2) canvasCtx.font = Math.round(stoneRadius * 1.2) + "px " + font;else canvasCtx.font = Math.round(stoneRadius) + "px " + font;

									canvasCtx.beginPath();
									canvasCtx.textBaseline = "middle";
									canvasCtx.textAlign = "center";
									canvasCtx.fillText(args.text, 0, 0, 2 * stoneRadius);
						}
			},
			grid: gridClearField
};

var dot = {
	stone: {
		draw: function draw(canvasCtx, args, board) {
			var stoneRadius = board.stoneRadius;

			canvasCtx.fillStyle = args.c || getMarkupColor(board, args.x, args.y);
			canvasCtx.beginPath();
			canvasCtx.rect(-stoneRadius / 2, -stoneRadius / 2, stoneRadius, stoneRadius);
			canvasCtx.fill();
		}
	},
	grid: gridClearField
};

var xMark = {
	stone: {
		draw: function draw(canvasCtx, args, board) {
			var stoneRadius = board.stoneRadius;

			canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
			canvasCtx.lineCap = "round";
			canvasCtx.lineWidth = (args.lineWidth || themeVariable("markupLinesWidth", board) || 1) * 2 - 1;
			canvasCtx.beginPath();
			canvasCtx.moveTo(Math.round(-stoneRadius / 2), Math.round(-stoneRadius / 2));
			canvasCtx.lineTo(Math.round(stoneRadius / 2), Math.round(stoneRadius / 2));
			canvasCtx.moveTo(Math.round(stoneRadius / 2) - 1, Math.round(-stoneRadius / 2));
			canvasCtx.lineTo(Math.round(-stoneRadius / 2) - 1, Math.round(stoneRadius / 2));
			canvasCtx.stroke();
			canvasCtx.lineCap = "butt";
		}
	},
	grid: gridClearField
};

var smileyFace = {
	stone: {
		draw: function draw(canvasCtx, args, board) {
			var stoneRadius = board.stoneRadius;

			canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
			canvasCtx.lineWidth = (args.lineWidth || themeVariable("markupLinesWidth", board) || 1) * 2;
			canvasCtx.beginPath();
			canvasCtx.arc(-stoneRadius / 3, -stoneRadius / 3, stoneRadius / 6, 0, 2 * Math.PI, true);
			canvasCtx.stroke();
			canvasCtx.beginPath();
			canvasCtx.arc(stoneRadius / 3, -stoneRadius / 3, stoneRadius / 6, 0, 2 * Math.PI, true);
			canvasCtx.stroke();
			canvasCtx.beginPath();
			canvasCtx.moveTo(-stoneRadius / 1.5, 0);
			canvasCtx.bezierCurveTo(-stoneRadius / 1.5, stoneRadius / 2, stoneRadius / 1.5, stoneRadius / 2, stoneRadius / 1.5, 0);
			canvasCtx.stroke();
		}
	},
	grid: gridClearField
};



var drawHandlers = Object.freeze({
	shellStone: shellStone,
	glassStone: glassStone,
	paintedStone: paintedStone,
	simpleStone: simpleStone,
	realisticStone: realisticStone,
	circle: circle,
	square: square,
	triangle: triangle,
	label: label,
	dot: dot,
	xMark: xMark,
	smileyFace: smileyFace
});

/**
 * Draws coordinates on the board 
 */

var coordinates = {
	grid: {
		draw: function draw(canvasCtx, args, board) {
			var t, xright, xleft, ytop, ybottom;

			canvasCtx.fillStyle = themeVariable("coordinatesColor", board);
			canvasCtx.textBaseline = "middle";
			canvasCtx.textAlign = "center";
			canvasCtx.font = board.stoneRadius + "px " + (board.font || "");

			xright = board.getX(-0.75);
			xleft = board.getX(board.size - 0.25);
			ytop = board.getY(-0.75);
			ybottom = board.getY(board.size - 0.25);

			var coordinatesX = themeVariable("coordinatesX", board);
			var coordinatesY = themeVariable("coordinatesY", board);

			for (var i = 0; i < board.size; i++) {
				t = board.getY(i);
				canvasCtx.fillText(coordinatesX[i], xright, t);
				canvasCtx.fillText(coordinatesX[i], xleft, t);

				t = board.getX(i);
				canvasCtx.fillText(coordinatesY[i], t, ytop);
				canvasCtx.fillText(coordinatesY[i], t, ybottom);
			}

			canvasCtx.fillStyle = "black";
		}
	}
};

/** 
 * Object containing default graphical properties of a board.
 * A value of all properties can be even static value or function, returning final value.
 * Theme object doesn't set board and stone textures - they are set separately.
 */

var realisticTheme = {
    // stones
    stoneHandler: realisticStone({
        whiteStoneGraphic: ["stones/white00_128.png", "stones/white01_128.png", "stones/white02_128.png", "stones/white03_128.png", "stones/white04_128.png", "stones/white05_128.png", "stones/white06_128.png", "stones/white07_128.png", "stones/white08_128.png", "stones/white09_128.png", "stones/white10_128.png"],
        blackStoneGraphic: ["stones/black00_128.png", "stones/black01_128.png", "stones/black02_128.png", "stones/black03_128.png"]
    }, shellStone),
    stoneSize: function stoneSize(board) {
        var fieldSize = Math.min(board.fieldWidth, board.fieldHeight);
        return (/*8/17**/0.5 * fieldSize
        );
    },

    // shadow
    shadowColor: "rgba(62,32,32,0.5)",
    shadowTransparentColor: "rgba(62,32,32,0)",
    shadowBlur: 0.5,
    shadowOffsetX: function shadowOffsetX(board) {
        return Math.round(board.stoneRadius / 7);
    },
    shadowOffsetY: function shadowOffsetY(board) {
        return Math.round(board.stoneRadius / 3);
    },

    // markup
    markupBlackColor: "rgba(255,255,255,0.9)",
    markupWhiteColor: "rgba(0,0,0,0.7)",
    markupNoneColor: "rgba(0,0,0,0.7)",
    markupLinesWidth: function markupLinesWidth(board) {
        return board.stoneRadius / 7.5;
    },
    markupHandlers: {
        CR: circle,
        LB: label,
        SQ: square,
        TR: triangle,
        MA: xMark,
        SL: dot,
        SM: smileyFace
    },

    // grid & star points
    gridLinesWidth: function gridLinesWidth(board) {
        return board.stoneRadius / 15;
    },
    gridLinesColor: "#654525",
    starColor: "#531",
    starSize: function starSize(board) {
        return board.stoneRadius / 8 + 1;
    },

    // coordinates
    coordinatesHandler: coordinates,
    coordinatesColor: "#531",
    coordinatesX: "ABCDEFGHJKLMNOPQRSTUV",
    coordinatesY: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],

    // other
    variationColor: "rgba(0,32,128,0.8)",
    font: "calibri",
    linesShift: -0.25,
    imageFolder: "../images/"
};

/** 
 * Object containing default graphical properties of a board.
 * A value of all properties can be even static value or function, returning final value.
 * Theme object doesn't set board and stone textures - they are set separately.
 */

var modernTheme = {
    // stones
    stoneHandler: shellStone,
    stoneSize: function stoneSize(board) {
        var fieldSize = Math.min(board.fieldWidth, board.fieldHeight);
        return 8 / 17 * fieldSize;
    },

    // shadow
    shadowColor: "rgba(62,32,32,0.5)",
    shadowTransparentColor: "rgba(62,32,32,0)",
    shadowBlur: 0.25,
    shadowOffsetX: function shadowOffsetX(board) {
        return Math.round(board.stoneRadius / 7);
    },
    shadowOffsetY: function shadowOffsetY(board) {
        return Math.round(board.stoneRadius / 7);
    },

    // markup
    markupBlackColor: "rgba(255,255,255,0.9)",
    markupWhiteColor: "rgba(0,0,0,0.7)",
    markupNoneColor: "rgba(0,0,0,0.7)",
    markupLinesWidth: function markupLinesWidth(board) {
        return board.stoneRadius / 7.5;
    },
    markupHandlers: {
        CR: circle,
        LB: label,
        SQ: square,
        TR: triangle,
        MA: xMark,
        SL: dot,
        SM: smileyFace
    },

    // grid & star points
    gridLinesWidth: function gridLinesWidth(board) {
        return board.stoneRadius / 15;
    },
    gridLinesColor: "#654525",
    starColor: "#531",
    starSize: function starSize(board) {
        return board.stoneRadius / 8 + 1;
    },

    // coordinates
    coordinatesHandler: coordinates,
    coordinatesColor: "#531",
    coordinatesX: "ABCDEFGHJKLMNOPQRSTUV",
    coordinatesY: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],

    // other
    variationColor: "rgba(0,32,128,0.8)",
    font: "calibri",
    linesShift: -0.25,
    imageFolder: "../images/"
};

// add here all themes, which should be publicly exposed


var themes = Object.freeze({
	realisticTheme: realisticTheme,
	modernTheme: modernTheme
});

var defaultConfig = {
	size: 19,
	width: 0,
	height: 0,
	starPoints: {
		5: [{ x: 2, y: 2 }],
		7: [{ x: 3, y: 3 }],
		8: [{ x: 2, y: 2 }, { x: 5, y: 2 }, { x: 2, y: 5 }, { x: 5, y: 5 }],
		9: [{ x: 2, y: 2 }, { x: 6, y: 2 }, { x: 4, y: 4 }, { x: 2, y: 6 }, { x: 6, y: 6 }],
		10: [{ x: 2, y: 2 }, { x: 7, y: 2 }, { x: 2, y: 7 }, { x: 7, y: 7 }],
		11: [{ x: 2, y: 2 }, { x: 8, y: 2 }, { x: 5, y: 5 }, { x: 2, y: 8 }, { x: 8, y: 8 }],
		12: [{ x: 3, y: 3 }, { x: 8, y: 3 }, { x: 3, y: 8 }, { x: 8, y: 8 }],
		13: [{ x: 3, y: 3 }, { x: 9, y: 3 }, { x: 6, y: 6 }, { x: 3, y: 9 }, { x: 9, y: 9 }],
		14: [{ x: 3, y: 3 }, { x: 10, y: 3 }, { x: 3, y: 10 }, { x: 10, y: 10 }],
		15: [{ x: 3, y: 3 }, { x: 11, y: 3 }, { x: 7, y: 7 }, { x: 3, y: 11 }, { x: 11, y: 11 }],
		16: [{ x: 3, y: 3 }, { x: 12, y: 3 }, { x: 3, y: 12 }, { x: 12, y: 12 }],
		17: [{ x: 3, y: 3 }, { x: 8, y: 3 }, { x: 13, y: 3 }, { x: 3, y: 8 }, { x: 8, y: 8 }, { x: 13, y: 8 }, { x: 3, y: 13 }, { x: 8, y: 13 }, { x: 13, y: 13 }],
		18: [{ x: 3, y: 3 }, { x: 14, y: 3 }, { x: 3, y: 14 }, { x: 14, y: 14 }],
		19: [{ x: 3, y: 3 }, { x: 9, y: 3 }, { x: 15, y: 3 }, { x: 3, y: 9 }, { x: 9, y: 9 }, { x: 15, y: 9 }, { x: 3, y: 15 }, { x: 9, y: 15 }, { x: 15, y: 15 }],
		20: [{ x: 3, y: 3 }, { x: 16, y: 3 }, { x: 3, y: 16 }, { x: 16, y: 16 }],
		21: [{ x: 3, y: 3 }, { x: 10, y: 3 }, { x: 17, y: 3 }, { x: 3, y: 10 }, { x: 10, y: 10 }, { x: 17, y: 10 }, { x: 3, y: 17 }, { x: 10, y: 17 }, { x: 17, y: 17 }]
	},
	section: {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0
	},
	coordinates: false,
	theme: realisticTheme
};

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply$1(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

var _apply = apply$1;

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity$1(value) {
  return value;
}

var identity_1 = identity$1;

var apply$2 = _apply;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */
function overRest$1(func, start, transform) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = transform(array);
    return apply$2(func, this, otherArgs);
  };
}

var _overRest = overRest$1;

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant$1(value) {
  return function() {
    return value;
  };
}

var constant_1 = constant$1;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/** Detect free variable `global` from Node.js. */
var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal$1;

var freeGlobal = _freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$1 = freeGlobal || freeSelf || Function('return this')();

var _root = root$1;

var root = _root;

/** Built-in value references. */
var Symbol$1 = root.Symbol;

var _Symbol = Symbol$1;

var Symbol$2 = _Symbol;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$1 = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto$1.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$2 ? Symbol$2.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag$1(value) {
  var isOwn = hasOwnProperty$1.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var _getRawTag = getRawTag$1;

/** Used for built-in method references. */
var objectProto$2 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$2.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString$1(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString$1;

var Symbol = _Symbol;
var getRawTag = _getRawTag;
var objectToString = _objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag$1(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

var _baseGetTag = baseGetTag$1;

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$2(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject$2;

var baseGetTag = _baseGetTag;
var isObject$1 = isObject_1;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]';
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction$1(value) {
  if (!isObject$1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction$1;

var root$2 = _root;

/** Used to detect overreaching core-js shims. */
var coreJsData$1 = root$2['__core-js_shared__'];

var _coreJsData = coreJsData$1;

var coreJsData = _coreJsData;

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked$1(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

var _isMasked = isMasked$1;

/** Used for built-in method references. */
var funcProto$1 = Function.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$1 = funcProto$1.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */
function toSource$1(func) {
  if (func != null) {
    try {
      return funcToString$1.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

var _toSource = toSource$1;

var isFunction = isFunction_1;
var isMasked = _isMasked;
var isObject = isObject_1;
var toSource = _toSource;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var funcProto = Function.prototype;
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative$1(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

var _baseIsNative = baseIsNative$1;

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$1(object, key) {
  return object == null ? undefined : object[key];
}

var _getValue = getValue$1;

var baseIsNative = _baseIsNative;
var getValue = _getValue;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative$1(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

var _getNative = getNative$1;

var getNative = _getNative;

var defineProperty$1 = (function() {
  try {
    var func = getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty = defineProperty$1;

var constant = constant_1;
var defineProperty = _defineProperty;
var identity$2 = identity_1;

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var baseSetToString$1 = !defineProperty ? identity$2 : function(func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

var _baseSetToString = baseSetToString$1;

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800;
var HOT_SPAN = 16;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeNow = Date.now;

/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */
function shortOut$1(func) {
  var count = 0,
      lastCalled = 0;

  return function() {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);

    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(undefined, arguments);
  };
}

var _shortOut = shortOut$1;

var baseSetToString = _baseSetToString;
var shortOut = _shortOut;

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */
var setToString$1 = shortOut(baseSetToString);

var _setToString = setToString$1;

var identity = identity_1;
var overRest = _overRest;
var setToString = _setToString;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest$1(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

var _baseRest = baseRest$1;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear$1() {
  this.__data__ = [];
  this.size = 0;
}

var _listCacheClear = listCacheClear$1;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq$1(value, other) {
  return value === other || (value !== value && other !== other);
}

var eq_1 = eq$1;

var eq = eq_1;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf$1(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

var _assocIndexOf = assocIndexOf$1;

var assocIndexOf = _assocIndexOf;

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete$1(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}

var _listCacheDelete = listCacheDelete$1;

var assocIndexOf$2 = _assocIndexOf;

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet$1(key) {
  var data = this.__data__,
      index = assocIndexOf$2(data, key);

  return index < 0 ? undefined : data[index][1];
}

var _listCacheGet = listCacheGet$1;

var assocIndexOf$3 = _assocIndexOf;

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas$1(key) {
  return assocIndexOf$3(this.__data__, key) > -1;
}

var _listCacheHas = listCacheHas$1;

var assocIndexOf$4 = _assocIndexOf;

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet$1(key, value) {
  var data = this.__data__,
      index = assocIndexOf$4(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

var _listCacheSet = listCacheSet$1;

var listCacheClear = _listCacheClear;
var listCacheDelete = _listCacheDelete;
var listCacheGet = _listCacheGet;
var listCacheHas = _listCacheHas;
var listCacheSet = _listCacheSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache$1.prototype.clear = listCacheClear;
ListCache$1.prototype['delete'] = listCacheDelete;
ListCache$1.prototype.get = listCacheGet;
ListCache$1.prototype.has = listCacheHas;
ListCache$1.prototype.set = listCacheSet;

var _ListCache = ListCache$1;

var ListCache$2 = _ListCache;

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear$1() {
  this.__data__ = new ListCache$2;
  this.size = 0;
}

var _stackClear = stackClear$1;

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete$1(key) {
  var data = this.__data__,
      result = data['delete'](key);

  this.size = data.size;
  return result;
}

var _stackDelete = stackDelete$1;

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet$1(key) {
  return this.__data__.get(key);
}

var _stackGet = stackGet$1;

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas$1(key) {
  return this.__data__.has(key);
}

var _stackHas = stackHas$1;

var getNative$2 = _getNative;
var root$3 = _root;

/* Built-in method references that are verified to be native. */
var Map$1 = getNative$2(root$3, 'Map');

var _Map = Map$1;

var getNative$3 = _getNative;

/* Built-in method references that are verified to be native. */
var nativeCreate$1 = getNative$3(Object, 'create');

var _nativeCreate = nativeCreate$1;

var nativeCreate = _nativeCreate;

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear$1() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}

var _hashClear = hashClear$1;

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete$1(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

var _hashDelete = hashDelete$1;

var nativeCreate$2 = _nativeCreate;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto$3 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet$1(key) {
  var data = this.__data__;
  if (nativeCreate$2) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}

var _hashGet = hashGet$1;

var nativeCreate$3 = _nativeCreate;

/** Used for built-in method references. */
var objectProto$4 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas$1(key) {
  var data = this.__data__;
  return nativeCreate$3 ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
}

var _hashHas = hashHas$1;

var nativeCreate$4 = _nativeCreate;

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet$1(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = (nativeCreate$4 && value === undefined) ? HASH_UNDEFINED$1 : value;
  return this;
}

var _hashSet = hashSet$1;

var hashClear = _hashClear;
var hashDelete = _hashDelete;
var hashGet = _hashGet;
var hashHas = _hashHas;
var hashSet = _hashSet;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash$1.prototype.clear = hashClear;
Hash$1.prototype['delete'] = hashDelete;
Hash$1.prototype.get = hashGet;
Hash$1.prototype.has = hashHas;
Hash$1.prototype.set = hashSet;

var _Hash = Hash$1;

var Hash = _Hash;
var ListCache$4 = _ListCache;
var Map$2 = _Map;

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear$1() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map$2 || ListCache$4),
    'string': new Hash
  };
}

var _mapCacheClear = mapCacheClear$1;

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable$1(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

var _isKeyable = isKeyable$1;

var isKeyable = _isKeyable;

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData$1(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

var _getMapData = getMapData$1;

var getMapData = _getMapData;

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete$1(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

var _mapCacheDelete = mapCacheDelete$1;

var getMapData$2 = _getMapData;

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet$1(key) {
  return getMapData$2(this, key).get(key);
}

var _mapCacheGet = mapCacheGet$1;

var getMapData$3 = _getMapData;

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas$1(key) {
  return getMapData$3(this, key).has(key);
}

var _mapCacheHas = mapCacheHas$1;

var getMapData$4 = _getMapData;

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet$1(key, value) {
  var data = getMapData$4(this, key),
      size = data.size;

  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

var _mapCacheSet = mapCacheSet$1;

var mapCacheClear = _mapCacheClear;
var mapCacheDelete = _mapCacheDelete;
var mapCacheGet = _mapCacheGet;
var mapCacheHas = _mapCacheHas;
var mapCacheSet = _mapCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache$1.prototype.clear = mapCacheClear;
MapCache$1.prototype['delete'] = mapCacheDelete;
MapCache$1.prototype.get = mapCacheGet;
MapCache$1.prototype.has = mapCacheHas;
MapCache$1.prototype.set = mapCacheSet;

var _MapCache = MapCache$1;

var ListCache$3 = _ListCache;
var Map = _Map;
var MapCache = _MapCache;

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet$1(key, value) {
  var data = this.__data__;
  if (data instanceof ListCache$3) {
    var pairs = data.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache(pairs);
  }
  data.set(key, value);
  this.size = data.size;
  return this;
}

var _stackSet = stackSet$1;

var ListCache = _ListCache;
var stackClear = _stackClear;
var stackDelete = _stackDelete;
var stackGet = _stackGet;
var stackHas = _stackHas;
var stackSet = _stackSet;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack$1(entries) {
  var data = this.__data__ = new ListCache(entries);
  this.size = data.size;
}

// Add methods to `Stack`.
Stack$1.prototype.clear = stackClear;
Stack$1.prototype['delete'] = stackDelete;
Stack$1.prototype.get = stackGet;
Stack$1.prototype.has = stackHas;
Stack$1.prototype.set = stackSet;

var _Stack = Stack$1;

var defineProperty$2 = _defineProperty;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue$1(object, key, value) {
  if (key == '__proto__' && defineProperty$2) {
    defineProperty$2(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue$1;

var baseAssignValue = _baseAssignValue;
var eq$2 = eq_1;

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue$1(object, key, value) {
  if ((value !== undefined && !eq$2(object[key], value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue(object, key, value);
  }
}

var _assignMergeValue = assignMergeValue$1;

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor$1(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

var _createBaseFor = createBaseFor$1;

var createBaseFor = _createBaseFor;

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor$1 = createBaseFor();

var _baseFor = baseFor$1;

var _cloneBuffer = createCommonjsModule(function (module, exports) {
var root = _root;

/** Detect free variable `exports`. */
var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined,
    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;
});

var root$4 = _root;

/** Built-in value references. */
var Uint8Array$1 = root$4.Uint8Array;

var _Uint8Array = Uint8Array$1;

var Uint8Array = _Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer$1(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

var _cloneArrayBuffer = cloneArrayBuffer$1;

var cloneArrayBuffer = _cloneArrayBuffer;

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray$1(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

var _cloneTypedArray = cloneTypedArray$1;

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray$1(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

var _copyArray = copyArray$1;

var isObject$6 = isObject_1;

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */
var baseCreate$1 = (function() {
  function object() {}
  return function(proto) {
    if (!isObject$6(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object;
    object.prototype = undefined;
    return result;
  };
}());

var _baseCreate = baseCreate$1;

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg$1(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

var _overArg = overArg$1;

var overArg = _overArg;

/** Built-in value references. */
var getPrototype$1 = overArg(Object.getPrototypeOf, Object);

var _getPrototype = getPrototype$1;

/** Used for built-in method references. */
var objectProto$5 = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype$1(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$5;

  return value === proto;
}

var _isPrototype = isPrototype$1;

var baseCreate = _baseCreate;
var getPrototype = _getPrototype;
var isPrototype = _isPrototype;

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject$1(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

var _initCloneObject = initCloneObject$1;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$2(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike$2;

var baseGetTag$2 = _baseGetTag;
var isObjectLike$1 = isObjectLike_1;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */
function baseIsArguments$1(value) {
  return isObjectLike$1(value) && baseGetTag$2(value) == argsTag;
}

var _baseIsArguments = baseIsArguments$1;

var baseIsArguments = _baseIsArguments;
var isObjectLike = isObjectLike_1;

/** Used for built-in method references. */
var objectProto$6 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto$6.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
var isArguments$1 = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
  return isObjectLike(value) && hasOwnProperty$4.call(value, 'callee') &&
    !propertyIsEnumerable.call(value, 'callee');
};

var isArguments_1 = isArguments$1;

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$1 = Array.isArray;

var isArray_1 = isArray$1;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength$1(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

var isLength_1 = isLength$1;

var isFunction$3 = isFunction_1;
var isLength = isLength_1;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike$1(value) {
  return value != null && isLength(value.length) && !isFunction$3(value);
}

var isArrayLike_1 = isArrayLike$1;

var isArrayLike = isArrayLike_1;
var isObjectLike$3 = isObjectLike_1;

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject$1(value) {
  return isObjectLike$3(value) && isArrayLike(value);
}

var isArrayLikeObject_1 = isArrayLikeObject$1;

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

var stubFalse_1 = stubFalse;

var isBuffer_1 = createCommonjsModule(function (module, exports) {
var root = _root,
    stubFalse = stubFalse_1;

/** Detect free variable `exports`. */
var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;
});

var baseGetTag$3 = _baseGetTag;
var getPrototype$2 = _getPrototype;
var isObjectLike$4 = isObjectLike_1;

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto$2 = Function.prototype;
var objectProto$7 = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString$2 = funcProto$2.toString;

/** Used to check objects for own properties. */
var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString$2.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject$1(value) {
  if (!isObjectLike$4(value) || baseGetTag$3(value) != objectTag) {
    return false;
  }
  var proto = getPrototype$2(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty$5.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString$2.call(Ctor) == objectCtorString;
}

var isPlainObject_1 = isPlainObject$1;

var baseGetTag$4 = _baseGetTag;
var isLength$2 = isLength_1;
var isObjectLike$5 = isObjectLike_1;

/** `Object#toString` result references. */
var argsTag$1 = '[object Arguments]';
var arrayTag = '[object Array]';
var boolTag = '[object Boolean]';
var dateTag = '[object Date]';
var errorTag = '[object Error]';
var funcTag$1 = '[object Function]';
var mapTag = '[object Map]';
var numberTag = '[object Number]';
var objectTag$1 = '[object Object]';
var regexpTag = '[object RegExp]';
var setTag = '[object Set]';
var stringTag = '[object String]';
var weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]';
var dataViewTag = '[object DataView]';
var float32Tag = '[object Float32Array]';
var float64Tag = '[object Float64Array]';
var int8Tag = '[object Int8Array]';
var int16Tag = '[object Int16Array]';
var int32Tag = '[object Int32Array]';
var uint8Tag = '[object Uint8Array]';
var uint8ClampedTag = '[object Uint8ClampedArray]';
var uint16Tag = '[object Uint16Array]';
var uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag$1] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray$1(value) {
  return isObjectLike$5(value) &&
    isLength$2(value.length) && !!typedArrayTags[baseGetTag$4(value)];
}

var _baseIsTypedArray = baseIsTypedArray$1;

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary$1(func) {
  return function(value) {
    return func(value);
  };
}

var _baseUnary = baseUnary$1;

var _nodeUtil = createCommonjsModule(function (module, exports) {
var freeGlobal = _freeGlobal;

/** Detect free variable `exports`. */
var freeExports = 'object' == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;
});

var baseIsTypedArray = _baseIsTypedArray;
var baseUnary = _baseUnary;
var nodeUtil = _nodeUtil;

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray$1 = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

var isTypedArray_1 = isTypedArray$1;

var baseAssignValue$3 = _baseAssignValue;
var eq$3 = eq_1;

/** Used for built-in method references. */
var objectProto$8 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue$1(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty$6.call(object, key) && eq$3(objValue, value)) ||
      (value === undefined && !(key in object))) {
    baseAssignValue$3(object, key, value);
  }
}

var _assignValue = assignValue$1;

var assignValue = _assignValue;
var baseAssignValue$2 = _baseAssignValue;

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject$1(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue$2(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }
  return object;
}

var _copyObject = copyObject$1;

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes$1(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

var _baseTimes = baseTimes$1;

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex$1(value, length) {
  length = length == null ? MAX_SAFE_INTEGER$1 : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

var _isIndex = isIndex$1;

var baseTimes = _baseTimes;
var isArguments$2 = isArguments_1;
var isArray$2 = isArray_1;
var isBuffer$1 = isBuffer_1;
var isIndex = _isIndex;
var isTypedArray$2 = isTypedArray_1;

/** Used for built-in method references. */
var objectProto$9 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$7 = objectProto$9.hasOwnProperty;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys$1(value, inherited) {
  var isArr = isArray$2(value),
      isArg = !isArr && isArguments$2(value),
      isBuff = !isArr && !isArg && isBuffer$1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray$2(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$7.call(value, key)) &&
        !(skipIndexes && (
           // Safari 9 has enumerable `arguments.length` in strict mode.
           key == 'length' ||
           // Node.js 0.10 has enumerable non-index properties on buffers.
           (isBuff && (key == 'offset' || key == 'parent')) ||
           // PhantomJS 2 has enumerable non-index properties on typed arrays.
           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
           // Skip index properties.
           isIndex(key, length)
        ))) {
      result.push(key);
    }
  }
  return result;
}

var _arrayLikeKeys = arrayLikeKeys$1;

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn$1(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

var _nativeKeysIn = nativeKeysIn$1;

var isObject$7 = isObject_1;
var isPrototype$2 = _isPrototype;
var nativeKeysIn = _nativeKeysIn;

/** Used for built-in method references. */
var objectProto$10 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty$8 = objectProto$10.hasOwnProperty;

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn$1(object) {
  if (!isObject$7(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype$2(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$8.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

var _baseKeysIn = baseKeysIn$1;

var arrayLikeKeys = _arrayLikeKeys;
var baseKeysIn = _baseKeysIn;
var isArrayLike$2 = isArrayLike_1;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn$2(object) {
  return isArrayLike$2(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

var keysIn_1 = keysIn$2;

var copyObject = _copyObject;
var keysIn$1 = keysIn_1;

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject$1(value) {
  return copyObject(value, keysIn$1(value));
}

var toPlainObject_1 = toPlainObject$1;

var assignMergeValue$2 = _assignMergeValue;
var cloneBuffer = _cloneBuffer;
var cloneTypedArray = _cloneTypedArray;
var copyArray = _copyArray;
var initCloneObject = _initCloneObject;
var isArguments = isArguments_1;
var isArray = isArray_1;
var isArrayLikeObject = isArrayLikeObject_1;
var isBuffer = isBuffer_1;
var isFunction$2 = isFunction_1;
var isObject$5 = isObject_1;
var isPlainObject = isPlainObject_1;
var isTypedArray = isTypedArray_1;
var toPlainObject = toPlainObject_1;

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep$1(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = object[key],
      srcValue = source[key],
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue$2(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);

    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      }
      else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      }
      else {
        newValue = [];
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject$5(objValue) || (srcIndex && isFunction$2(objValue))) {
        newValue = initCloneObject(srcValue);
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue$2(object, key, newValue);
}

var _baseMergeDeep = baseMergeDeep$1;

var Stack = _Stack;
var assignMergeValue = _assignMergeValue;
var baseFor = _baseFor;
var baseMergeDeep = _baseMergeDeep;
var isObject$4 = isObject_1;
var keysIn = keysIn_1;

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge$1(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor(source, function(srcValue, key) {
    if (isObject$4(srcValue)) {
      stack || (stack = new Stack);
      baseMergeDeep(object, source, key, srcIndex, baseMerge$1, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(object[key], srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  }, keysIn);
}

var _baseMerge = baseMerge$1;

var baseMerge = _baseMerge;
var isObject$3 = isObject_1;

/**
 * Used by `_.defaultsDeep` to customize its `_.merge` use to merge source
 * objects into destination objects that are passed thru.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to merge.
 * @param {Object} object The parent object of `objValue`.
 * @param {Object} source The parent object of `srcValue`.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 * @returns {*} Returns the value to assign.
 */
function customDefaultsMerge$1(objValue, srcValue, key, object, source, stack) {
  if (isObject$3(objValue) && isObject$3(srcValue)) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, objValue);
    baseMerge(objValue, srcValue, undefined, customDefaultsMerge$1, stack);
    stack['delete'](srcValue);
  }
  return objValue;
}

var _customDefaultsMerge = customDefaultsMerge$1;

var eq$4 = eq_1;
var isArrayLike$3 = isArrayLike_1;
var isIndex$2 = _isIndex;
var isObject$8 = isObject_1;

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall$1(value, index, object) {
  if (!isObject$8(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike$3(object) && isIndex$2(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq$4(object[index], value);
  }
  return false;
}

var _isIterateeCall = isIterateeCall$1;

var baseRest$2 = _baseRest;
var isIterateeCall = _isIterateeCall;

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner$1(assigner) {
  return baseRest$2(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

var _createAssigner = createAssigner$1;

var baseMerge$2 = _baseMerge;
var createAssigner = _createAssigner;

/**
 * This method is like `_.merge` except that it accepts `customizer` which
 * is invoked to produce the merged values of the destination and source
 * properties. If `customizer` returns `undefined`, merging is handled by the
 * method instead. The `customizer` is invoked with six arguments:
 * (objValue, srcValue, key, object, source, stack).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   if (_.isArray(objValue)) {
 *     return objValue.concat(srcValue);
 *   }
 * }
 *
 * var object = { 'a': [1], 'b': [2] };
 * var other = { 'a': [3], 'b': [4] };
 *
 * _.mergeWith(object, other, customizer);
 * // => { 'a': [1, 3], 'b': [2, 4] }
 */
var mergeWith$1 = createAssigner(function(object, source, srcIndex, customizer) {
  baseMerge$2(object, source, srcIndex, customizer);
});

var mergeWith_1 = mergeWith$1;

var apply = _apply;
var baseRest = _baseRest;
var customDefaultsMerge = _customDefaultsMerge;
var mergeWith = mergeWith_1;

/**
 * This method is like `_.defaults` except that it recursively assigns
 * default properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaults
 * @example
 *
 * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
 * // => { 'a': { 'b': 2, 'c': 3 } }
 */
var defaultsDeep = baseRest(function(args) {
  args.push(undefined, customDefaultsMerge);
  return apply(mergeWith, undefined, args);
});

var defaultsDeep_1 = defaultsDeep;

/* global document, window */

/**
 * Contains implementation of go board.
 * @module CanvasBoard
 */

// Private methods of WGo.CanvasBoard

var calcLeftMargin = function calcLeftMargin(board) {
	return 3 * board.width / (4 * (board.bottomRightFieldX + 1 - board.topLeftFieldX) + 2) - board.fieldWidth * board.topLeftFieldX;
};

var calcTopMargin = function calcTopMargin(board) {
	return 3 * board.height / (4 * (board.bottomRightFieldY + 1 - board.topLeftFieldY) + 2) - board.fieldHeight * board.topLeftFieldY;
};

var calcFieldWidth = function calcFieldWidth(board) {
	return 4 * board.width / (4 * (board.bottomRightFieldX + 1 - board.topLeftFieldX) + 2);
};

var calcFieldHeight = function calcFieldHeight(board) {
	return 4 * board.height / (4 * (board.bottomRightFieldY + 1 - board.topLeftFieldY) + 2);
};

var clearField = function clearField(board, x, y) {
	var handler;
	for (var z = 0; z < board.fieldObjects[x][y].length; z++) {
		var obj = board.fieldObjects[x][y][z];
		if (!obj.type) handler = themeVariable("stoneHandler", board);else if (typeof obj.type == "string") handler = themeVariable("markupHandlers", board)[obj.type];else handler = obj.type;

		for (var layer in handler) {
			board[layer].drawField(handler[layer].clear ? handler[layer].clear : defaultFieldClear, obj, board);
		}
	}
};

// Draws all object on specified field
var drawField = function drawField(board, x, y) {
	var handler = void 0;
	for (var z = 0; z < board.fieldObjects[x][y].length; z++) {
		var obj = board.fieldObjects[x][y][z];

		if (!obj.type) handler = themeVariable("stoneHandler", board);else if (typeof obj.type == "string") handler = themeVariable("markupHandlers", board)[obj.type];else handler = obj.type;

		for (var layer in handler) {
			board[layer].drawField(handler[layer].draw, obj, board);
		}
	}
};

var getMousePos = function getMousePos(board, e) {
	// new hopefully better translation of coordinates

	var x, y;

	x = e.layerX * board.pixelRatio;
	x -= board.left;
	x /= board.fieldWidth;
	x = Math.round(x);

	y = e.layerY * board.pixelRatio;
	y -= board.top;
	y /= board.fieldHeight;
	y = Math.round(y);

	return {
		x: x >= board.size ? -1 : x,
		y: y >= board.size ? -1 : y
	};
};

var updateDim = function updateDim(board) {
	board.element.style.width = board.width / board.pixelRatio + "px";
	board.element.style.height = board.height / board.pixelRatio + "px";

	board.stoneRadius = themeVariable("stoneSize", board);

	for (var i = 0; i < board.layers.length; i++) {
		board.layers[i].setDimensions(board.width, board.height, board);
	}
};

var objectMissing = function objectMissing(objectsArray) {
	return function (object) {
		return !objectsArray.some(function (obj) {
			if (object == obj) return true;

			return Object.keys(object).every(function (key) {
				return object[key] == obj[key];
			});
		});
	};
};

var CanvasBoard$1 = function () {
	/**
  * CanvasBoard class constructor - it creates a canvas board.
  *
  * @alias WGo.CanvasBoard
  * @class
  * @implements BLACKoard
  * @param {HTMLElement} elem DOM element to put in
  * @param {Object} config Configuration object. It is object with "key: value" structure. Possible configurations are:
  *
  * * size: number - size of the board (default: 19)
  * * width: number - width of the board (default: 0)
  * * height: number - height of the board (default: 0)
  * * font: string - font of board writings (!deprecated)
  * * lineWidth: number - line width of board drawings (!deprecated)
  * * autoLineWidth: boolean - if set true, line width will be automatically computed accordingly to board size - this option rewrites 'lineWidth' /and it will keep markups sharp/ (!deprecated)
  * * starPoints: Object - star points coordinates, defined for various board sizes. Look at CanvasBoard.default for more info.
  * * stoneHandler: CanvasBoard.DrawHandler - stone drawing handler (default: CanvasBoard.drawHandlers.SHELL)
  * * starSize: number - size of star points (default: 1). Radius of stars is dynamic, however you can modify it by given constant. (!deprecated)
  * * stoneSize: number - size of stone (default: 1). Radius of stone is dynamic, however you can modify it by given constant. (!deprecated)
  * * shadowSize: number - size of stone shadow (default: 1). Radius of shadow is dynamic, however you can modify it by given constant. (!deprecated)
  * * background: string - background of the board, it can be either color (#RRGGBB) or url. Empty string means no background. (default: WGo.DIR+"wood1.jpg")
  * * section: {
  *     top: number,
  *     right: number,
  *     bottom: number,
  *     left: number
  *   }
  *   It defines a section of board to be displayed. You can set a number of rows(or cols) to be skipped on each side.
  *   Numbers can be negative, in that case there will be more empty space. In default all values are zeros.
  * * theme: Object - theme object, which defines all graphical attributes of the board. Default theme object is "WGo.CanvasBoard.themes.default". For old look you may use "WGo.CanvasBoard.themes.old".
  *
  * Note: properties lineWidth, autoLineWidth, starPoints, starSize, stoneSize and shadowSize will be considered only if you set property 'theme' to 'WGo.CanvasBoard.themes.old'.
  */

	function CanvasBoard(elem, config) {
		var _this = this;

		babelHelpers.classCallCheck(this, CanvasBoard);

		// merge user config with default
		this.config = defaultsDeep_1(config || {}, defaultConfig);

		// and store it directly on `this`
		Object.keys(this.config).forEach(function (key) {
			_this[key] = _this.config[key];
		});

		// set section if set
		this.topLeftFieldX = this.section.left;
		this.topLeftFieldY = this.section.top;
		this.bottomRightFieldX = this.size - 1 - this.section.right;
		this.bottomRightFieldY = this.size - 1 - this.section.bottom;

		// init board
		this.init();

		// append to element
		elem.appendChild(this.element);

		// set initial dimensions

		// set the pixel ratio for HDPI (e.g. Retina) screens
		this.pixelRatio = window.devicePixelRatio || 1;

		if (this.width && this.height) this.setDimensions(this.width, this.height);else if (this.width) this.setWidth(this.width);else if (this.height) this.setHeight(this.height);
	}

	/**
     * Initialization method, it is called in constructor. You shouldn't call it, but you can alter it.
  */

	babelHelpers.createClass(CanvasBoard, [{
		key: "init",
		value: function init() {

			// placement of objects (in 3D array)
			this.fieldObjects = [];
			for (var i = 0; i < this.size; i++) {
				this.fieldObjects[i] = [];
				for (var j = 0; j < this.size; j++) {
					this.fieldObjects[i][j] = [];
				}
			}

			// other objects, stored in list
			this.customObjects = [];

			// layers
			this.layers = [];

			// event listeners, binded to board
			this.listeners = [];

			this.element = document.createElement('div');
			this.element.className = 'wgo-board';
			this.element.style.position = 'relative';

			if (this.background) {
				if (this.background[0] == "#") this.element.style.backgroundColor = this.background;else {
					this.element.style.backgroundImage = "url('" + this.background + "')";
					/*this.element.style.backgroundRepeat = "repeat";*/
				}
			}

			this.grid = new GridLayer();
			this.shadow = new ShadowLayer();
			this.stone = new CanvasLayer();

			this.addLayer(this.grid, 100);
			this.addLayer(this.shadow, 200);
			this.addLayer(this.stone, 300);
		}
	}, {
		key: "setWidth",
		value: function setWidth(width) {
			this.width = width;
			this.width *= this.pixelRatio;
			this.fieldHeight = this.fieldWidth = calcFieldWidth(this);
			this.left = calcLeftMargin(this);

			this.height = (this.bottomRightFieldY - this.topLeftFieldY + 1.5) * this.fieldHeight;
			this.top = calcTopMargin(this);

			updateDim(this);
			this.redraw();
		}
	}, {
		key: "setHeight",
		value: function setHeight(height) {
			this.height = height;
			this.height *= this.pixelRatio;
			this.fieldWidth = this.fieldHeight = calcFieldHeight(this);
			this.top = calcTopMargin(this);

			this.width = (this.bottomRightFieldX - this.topLeftFieldX + 1.5) * this.fieldWidth;
			this.left = calcLeftMargin(this);

			updateDim(this);
			this.redraw();
		}
	}, {
		key: "setDimensions",
		value: function setDimensions(width, height) {
			this.width = width || parseInt(this.element.style.width, 10);
			this.width *= this.pixelRatio;
			this.height = height || parseInt(this.element.style.height, 10);
			this.height *= this.pixelRatio;

			this.fieldWidth = calcFieldWidth(this);
			this.fieldHeight = calcFieldHeight(this);
			this.left = calcLeftMargin(this);
			this.top = calcTopMargin(this);

			updateDim(this);
			this.redraw();
		}

		/**
   * Get currently visible section of the board
   */

	}, {
		key: "getSection",
		value: function getSection() {
			return this.section;
		}

		/**
   * Set section of the board to be displayed
   */

	}, {
		key: "setSection",
		value: function setSection(section_or_top, right, bottom, left) {
			if ((typeof section_or_top === "undefined" ? "undefined" : babelHelpers.typeof(section_or_top)) == "object") {
				this.section = section_or_top;
			} else {
				this.section = {
					top: section_or_top,
					right: right,
					bottom: bottom,
					left: left
				};
			}

			this.topLeftFieldX = this.section.left;
			this.topLeftFieldY = this.section.top;
			this.bottomRightFieldX = this.size - 1 - this.section.right;
			this.bottomRightFieldY = this.size - 1 - this.section.bottom;

			this.setDimensions();
		}
	}, {
		key: "setSize",
		value: function setSize(size) {
			size = size || 19;

			if (size != this.size) {
				this.size = size;

				this.fieldObjects = [];
				for (var i = 0; i < this.size; i++) {
					this.fieldObjects[i] = [];
					for (var j = 0; j < this.size; j++) {
						this.fieldObjects[i][j] = [];
					}
				}

				this.bottomRightFieldX = this.size - 1 - this.section.right;
				this.bottomRightFieldY = this.size - 1 - this.section.bottom;
				this.setDimensions();
			}
		}

		/**
   * Redraw everything.
   */

	}, {
		key: "redraw",
		value: function redraw() {
			try {
				// redraw layers
				for (var i = 0; i < this.layers.length; i++) {
					this.layers[i].clear(this);
					this.layers[i].initialDraw(this);
				}

				// redraw field objects
				for (var _i = 0; _i < this.size; _i++) {
					for (var j = 0; j < this.size; j++) {
						drawField(this, _i, j);
					}
				}

				// redraw custom objects
				for (var _i2 = 0; _i2 < this.customObjects.length; _i2++) {
					var obj = this.customObjects[_i2];
					var handler = obj.handler;

					for (var layer in handler) {
						this[layer].draw(handler[layer].draw, obj, this);
					}
				}
			} catch (err) {
				// If the board is too small some canvas painting function can throw an exception, but we don't want to break our app
				console.error("WGo board failed to render. Error: " + err.message);
			}
		}

		/**
   * Redraw just one layer. Use in special cases, when you know, that only that layer needs to be redrawn.
   * For complete redrawing use method redraw().
   */

	}, {
		key: "redrawLayer",
		value: function redrawLayer(layer) {
			var obj, handler;

			this[layer].clear();
			this[layer].initialDraw(this);

			for (var x = 0; x < this.size; x++) {
				for (var y = 0; y < this.size; y++) {
					for (var z = 0; z < this.fieldObjects[x][y].length; z++) {
						obj = this.fieldObjects[x][y][z];
						if (!obj.type) handler = themeVariable("stoneHandler", this);else if (typeof obj.type == "string") handler = themeVariable("markupHandlers", this)[obj.type];else handler = obj.type;

						if (handler[layer]) this[layer].drawField(handler[layer].draw, obj, this);
					}
				}
			}

			for (var i = 0; i < this.customObjects.length; i++) {
				obj = this.customObjects[i];
				handler = obj.handler;

				if (handler[layer]) this[layer].draw(handler[layer].draw, obj, this);
			}
		}

		/**
   * Get absolute X coordinate
   *
   * @param {number} x relative coordinate
   */

	}, {
		key: "getX",
		value: function getX(x) {
			return this.left + x * this.fieldWidth;
		}

		/**
   * Get absolute Y coordinate
   *
   * @param {number} y relative coordinate
   */

	}, {
		key: "getY",
		value: function getY(y) {
			return this.top + y * this.fieldHeight;
		}

		/**
   * Add layer to the board. It is meant to be only for canvas layers.
   *
   * @param {CanvasBoard.CanvasLayer} layer to add
   * @param {number} weight layer with biggest weight is on the top 
   */

	}, {
		key: "addLayer",
		value: function addLayer(layer, weight) {
			layer.appendTo(this.element, weight);
			//layer.setDimensions(this.width, this.height, this);
			this.layers.push(layer);
		}

		/**
   * Remove layer from the board.
   *
   * @param {CanvasBoard.CanvasLayer} layer to remove
   */

	}, {
		key: "removeLayer",
		value: function removeLayer(layer) {
			var i = this.layers.indexOf(layer);
			if (i >= 0) {
				this.layers.splice(i, 1);
				layer.removeFrom(this.element);
			}
		}
	}, {
		key: "update",
		value: function update(fieldObjects) {
			var changes = this.getChanges(fieldObjects);
			var i = void 0;

			if (changes.remove && changes.remove == "all") this.removeAllObjects();else if (changes.remove) {
				for (i = 0; i < changes.remove.length; i++) {
					this.removeObject(changes.remove[i]);
				}
			}

			if (changes.add) {
				for (i = 0; i < changes.add.length; i++) {
					this.addObject(changes.add[i]);
				}
			}
		}
	}, {
		key: "getChanges",
		value: function getChanges(fieldObjects) {
			if (fieldObjects == this.fieldObjects) return {};

			var add = [];
			var remove = [];

			for (var x = 0; x < this.size; x++) {
				if (fieldObjects[x] != this.fieldObjects[x]) {
					for (var y = 0; y < this.size; y++) {
						if (fieldObjects[x][y] != this.fieldObjects[x][y] && (fieldObjects[x][y].length || this.fieldObjects[x][y].length)) {
							add = add.concat(fieldObjects[x][y].filter(objectMissing(this.fieldObjects[x][y])));
							remove = remove.concat(this.fieldObjects[x][y].filter(objectMissing(fieldObjects[x][y])));
						}
					}
				}
			}

			return { add: add, remove: remove };
		}
	}, {
		key: "addObject",
		value: function addObject(obj) {
			// handling multiple objects
			if (obj.constructor == Array) {
				for (var i = 0; i < obj.length; i++) {
					this.addObject(obj[i]);
				}return;
			}

			// TODO: should be warning or error
			if (obj.x < 0 || obj.y < 0 || obj.x >= this.size || obj.y >= this.size) return;

			try {
				// clear all objects on object's coordinates
				clearField(this, obj.x, obj.y);

				// if object of this type is on the board, replace it
				var layers = this.fieldObjects[obj.x][obj.y];
				for (var z = 0; z < layers.length; z++) {
					if (layers[z].type == obj.type) {
						layers[z] = obj;
						drawField(this, obj.x, obj.y);
						return;
					}
				}

				// if object is a stone, add it at the beginning, otherwise at the end
				if (!obj.type) layers.unshift(obj);else layers.push(obj);

				// draw all objects
				drawField(this, obj.x, obj.y);
			} catch (err) {
				// If the board is too small some canvas painting function can throw an exception, but we don't want to break our app
				console.error("WGo board failed to render. Error: " + err.message);
			}
		}
	}, {
		key: "removeObject",
		value: function removeObject(obj) {
			// handling multiple objects
			if (obj.constructor == Array) {
				for (var n = 0; n < obj.length; n++) {
					this.removeObject(obj[n]);
				}return;
			}

			if (obj.x < 0 || obj.y < 0 || obj.x >= this.size || obj.y >= this.size) return;

			try {
				var i = void 0;
				for (var j = 0; j < this.fieldObjects[obj.x][obj.y].length; j++) {
					if (this.fieldObjects[obj.x][obj.y][j].type == obj.type) {
						i = j;
						break;
					}
				}
				if (i == null) return;

				// clear all objects on object's coordinates
				clearField(this, obj.x, obj.y);

				this.fieldObjects[obj.x][obj.y].splice(i, 1);

				drawField(this, obj.x, obj.y);
			} catch (err) {
				// If the board is too small some canvas painting function can throw an exception, but we don't want to break our app
				console.error("WGo board failed to render. Error: " + err.message);
			}
		}
	}, {
		key: "removeObjectsAt",
		value: function removeObjectsAt(x, y) {
			if (!this.fieldObjects[x][y].length) return;

			clearField(this, x, y);
			this.fieldObjects[x][y] = [];
		}
	}, {
		key: "removeAllObjects",
		value: function removeAllObjects() {
			this.fieldObjects = [];
			for (var i = 0; i < this.size; i++) {
				this.fieldObjects[i] = [];
				for (var j = 0; j < this.size; j++) {
					this.fieldObjects[i][j] = [];
				}
			}
			this.redraw();
		}
	}, {
		key: "addCustomObject",
		value: function addCustomObject(handler, args) {
			this.customObjects.push({ handler: handler, args: args });
			this.redraw();
		}
	}, {
		key: "removeCustomObject",
		value: function removeCustomObject(handler, args) {
			for (var i = 0; i < this.customObjects.length; i++) {
				var obj = this.customObjects[i];
				if (obj.handler == handler && obj.args == args) {
					this.customObjects.splice(i, 1);
					this.redraw();
					return true;
				}
			}
			return false;
		}
	}, {
		key: "on",
		value: function on(type, callback) {
			var _this2 = this;

			var evListener = {
				type: type,
				callback: callback,
				handleEvent: function handleEvent(event) {
					var coo = getMousePos(_this2, event);
					callback(coo.x, coo.y, event);
				}
			};

			this.element.addEventListener(type, evListener, true);
			this.listeners.push(evListener);
		}
	}, {
		key: "off",
		value: function off(type, callback) {
			for (var i = 0; i < this.listeners.length; i++) {
				var listener = this.listeners[i];
				if (listener.type == type && listener.callback == callback) {
					this.element.removeEventListener(listener.type, listener, true);
					this.listeners.splice(i, 1);
					return true;
				}
			}
			return false;
		}
	}]);
	return CanvasBoard;
}();

CanvasBoard$1.drawHandlers = drawHandlers;
CanvasBoard$1.themes = themes;
CanvasBoard$1.defaultConfig = defaultConfig;

/**
 * Simple events handling.
 */

var EventEmitter = function () {
	function EventEmitter() {
		babelHelpers.classCallCheck(this, EventEmitter);

		this.__events = {};
	}

	babelHelpers.createClass(EventEmitter, [{
		key: "on",
		value: function on(evName, callback) {
			this.__events[evName] = this.__events[evName] || [];
			this.__events[evName].push(callback);
		}
	}, {
		key: "off",
		value: function off(evName, callback) {
			if (this.__events[evName]) {
				if (callback == null) this.__events[evName] = [];
				this.__events[evName] = this.__events[evName].filter(function (fn) {
					return fn != callback;
				});
			}
		}
	}, {
		key: "trigger",
		value: function trigger(evName, payload) {
			if (this.__events[evName]) {
				this.__events[evName].forEach(function (fn) {
					return fn(payload);
				});
			}
		}
	}]);
	return EventEmitter;
}();

/**
 * This file contains all SGF property (for go) identifiers as constants.
 */

var BLACK_MOVE = "B";
var EXECUTE_ILLEGAL = "KO";
var MOVE_NUMBER = "MN";
var WHITE_MOVE = "W";

var ADD_BLACK = "AB";
var CLEAR_FIELD = "AE";
var ADD_WHITE = "AW";
var SET_TURN = "PL";

var COMMENT = "C";
var EVEN_POSITION = "DM";
var GOOD_FOR_BLACK = "GB";
var GOOD_FOR_WHITE = "GW";
var HOTSPOT = "HO";
var NODE_NAME = "N";
var UNCLEAR_POSITION = "UC";
var NODE_VALUE = "V";

var BAD_MOVE = "BM";
var DOUBTFUL_MOVE = "DM";
var INTERESTING_MOVE = "IT";
var GOOD_MOVE = "TE";

var ARROW = "AR";
var CIRCLE = "CR";
var DIM = "DD";
var LABEL$1 = "LB";
var LINE$1 = "LN";
var X_MARK = "MA";
var SELECTED = "SL";
var SQUARE = "SQ";
var TRIANGLE = "TR";

var APPLICATION = "AP";
var CHARSET = "CA";
var SGF_VERSION = "FF";
var GAME_TYPE = "GM";
var VARIATIONS_STYLE = "ST";
var BOARD_SIZE = "SZ";

var ANNOTATOR = "AN";
var BLACK_RANK = "BR";
var BLACK_TEAM = "BT";
var COPYRIGHT = "CP";
var DATE = "DT";
var EVENT = "EV";
var GAME_NAME = "GN";
var GAME_COMMENT = "GC";
var OPENING_INFO = "ON";
var OVER_TIME = "OT";
var BLACK_NAME = "BN";
var PLACE = "PC";
var WHITE_NAME = "PW";
var RESULT = "RE";
var ROUND = "RO";
var RULES = "RU";
var SOURCE = "SO";
var TIME_LIMITS = "TM";
var AUTHOR = "US";
var WHITE_RANK = "WR";
var WHITE_TEAM = "WT";

var BLACK_TIME_LEFT = "BL";
var BLACK_STONES_LEFT = "OB";
var WHITE_STONES_LEFT = "OW";
var WHITE_TIME_LEFT = "WL";

var FIGURE = "FG";
var PRINT_MOVE_NUMBERS = "PM";
var BOARD_SECTION = "VW";

var HANDICAP = "HA";
var KOMI = "KM";
var BLACK_TERRITORY = "TB";
var WHITE_TERRITORY = "TW";

var properties = Object.freeze({
	BLACK_MOVE: BLACK_MOVE,
	EXECUTE_ILLEGAL: EXECUTE_ILLEGAL,
	MOVE_NUMBER: MOVE_NUMBER,
	WHITE_MOVE: WHITE_MOVE,
	ADD_BLACK: ADD_BLACK,
	CLEAR_FIELD: CLEAR_FIELD,
	ADD_WHITE: ADD_WHITE,
	SET_TURN: SET_TURN,
	COMMENT: COMMENT,
	EVEN_POSITION: EVEN_POSITION,
	GOOD_FOR_BLACK: GOOD_FOR_BLACK,
	GOOD_FOR_WHITE: GOOD_FOR_WHITE,
	HOTSPOT: HOTSPOT,
	NODE_NAME: NODE_NAME,
	UNCLEAR_POSITION: UNCLEAR_POSITION,
	NODE_VALUE: NODE_VALUE,
	BAD_MOVE: BAD_MOVE,
	DOUBTFUL_MOVE: DOUBTFUL_MOVE,
	INTERESTING_MOVE: INTERESTING_MOVE,
	GOOD_MOVE: GOOD_MOVE,
	ARROW: ARROW,
	CIRCLE: CIRCLE,
	DIM: DIM,
	LABEL: LABEL$1,
	LINE: LINE$1,
	X_MARK: X_MARK,
	SELECTED: SELECTED,
	SQUARE: SQUARE,
	TRIANGLE: TRIANGLE,
	APPLICATION: APPLICATION,
	CHARSET: CHARSET,
	SGF_VERSION: SGF_VERSION,
	GAME_TYPE: GAME_TYPE,
	VARIATIONS_STYLE: VARIATIONS_STYLE,
	BOARD_SIZE: BOARD_SIZE,
	ANNOTATOR: ANNOTATOR,
	BLACK_RANK: BLACK_RANK,
	BLACK_TEAM: BLACK_TEAM,
	COPYRIGHT: COPYRIGHT,
	DATE: DATE,
	EVENT: EVENT,
	GAME_NAME: GAME_NAME,
	GAME_COMMENT: GAME_COMMENT,
	OPENING_INFO: OPENING_INFO,
	OVER_TIME: OVER_TIME,
	BLACK_NAME: BLACK_NAME,
	PLACE: PLACE,
	WHITE_NAME: WHITE_NAME,
	RESULT: RESULT,
	ROUND: ROUND,
	RULES: RULES,
	SOURCE: SOURCE,
	TIME_LIMITS: TIME_LIMITS,
	AUTHOR: AUTHOR,
	WHITE_RANK: WHITE_RANK,
	WHITE_TEAM: WHITE_TEAM,
	BLACK_TIME_LEFT: BLACK_TIME_LEFT,
	BLACK_STONES_LEFT: BLACK_STONES_LEFT,
	WHITE_STONES_LEFT: WHITE_STONES_LEFT,
	WHITE_TIME_LEFT: WHITE_TIME_LEFT,
	FIGURE: FIGURE,
	PRINT_MOVE_NUMBERS: PRINT_MOVE_NUMBERS,
	BOARD_SECTION: BOARD_SECTION,
	HANDICAP: HANDICAP,
	KOMI: KOMI,
	BLACK_TERRITORY: BLACK_TERRITORY,
	WHITE_TERRITORY: WHITE_TERRITORY
});

var _setupProperties;

/**
 * Groups of propertise with special meaning.
 */

var markupProperties = [CIRCLE, X_MARK, SELECTED, SQUARE, TRIANGLE, LABEL$1];

var setupProperties = (_setupProperties = {}, babelHelpers.defineProperty(_setupProperties, ADD_BLACK, BLACK), babelHelpers.defineProperty(_setupProperties, ADD_WHITE, WHITE), babelHelpers.defineProperty(_setupProperties, CLEAR_FIELD, EMPTY), _setupProperties);

var setupPropertiesReversed = Object.keys(setupProperties).reduce(function (obj, key) {
	obj[setupProperties[key]] = key;
	return obj;
}, {});

function onCoordinates(x, y) {
	return function (obj) {
		return obj.x === x && obj.y === y;
	};
}

function notOnCoordinates(x, y) {
	return function (obj) {
		return obj.x !== x || obj.y !== y;
	};
}

function normalizeMarkupArguments(setupOrX, y, type) {
	if ((typeof setupOrX === "undefined" ? "undefined" : babelHelpers.typeof(setupOrX)) == "object") {
		return {
			x: setupOrX.x,
			y: setupOrX.y,
			type: setupOrX.type
		};
	}

	return {
		x: setupOrX,
		y: y,
		type: type
	};
}

function getMarkupProperties(kNode) {
	return Object.keys(kNode.SGFProperties).filter(function (propIdent) {
		return markupProperties.indexOf(propIdent) >= 0;
	}).map(function (propIdent) {
		return {
			propIdent: propIdent,
			value: kNode.SGFProperties[propIdent]
		};
	});
}

function normalizeSetupArguments(setupOrX, y, c) {
	if ((typeof setupOrX === "undefined" ? "undefined" : babelHelpers.typeof(setupOrX)) == "object") {
		return {
			x: setupOrX.x,
			y: setupOrX.y,
			c: setupOrX.c
		};
	}

	return {
		x: setupOrX,
		y: y,
		c: c
	};
}

function getSetupProperties(kNode) {
	return Object.keys(kNode.SGFProperties).filter(function (propIdent) {
		return setupProperties[propIdent] != null;
	}).map(function (propIdent) {
		return {
			propIdent: propIdent,
			value: kNode.SGFProperties[propIdent]
		};
	});
}

/**
 * Kifu class - handles kifu - it can traverse and edit it. Has powerful api.
 * In previous WGo it would be KifuReader.
 */

var Kifu$1 = function (_EventEmitter) {
	babelHelpers.inherits(Kifu, _EventEmitter);
	babelHelpers.createClass(Kifu, null, [{
		key: "fromJS",

		/**
   * Creates a Kifu object from the JSGF object
   * 
   * @param   {Object} jsgf object
   * @returns {Kifu}   Kifu object
   */
		value: function fromJS(jsgf) {
			return new Kifu(KNode.fromJS(jsgf));
		}

		/**
   * Creates a Kifu object from the SGF string
   * 
   * @param   {string} sgf string
   * @returns {Kifu}   Kifu instance
   */

	}, {
		key: "fromSGF",
		value: function fromSGF(sgf) {
			return new Kifu(KNode.fromSGF(sgf));
		}

		/**
   * Constructs a new empty Kifu object or Kifu object from a KNode.
   * 
   * @param {KNode} [kNode] - KNode object which will serve as root node of the kifu.
   */

	}]);

	function Kifu(boardSize, ruleSet) {
		babelHelpers.classCallCheck(this, Kifu);


		// Board size argument

		var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Kifu).call(this));

		if (typeof boardSize == "number") {
			_this.currentNode = _this.rootNode = new KNode();
			_this.rootNode.setProperty("SZ", boardSize);

			// ... and rules argument as string
			if (typeof ruleSet == "string") {
				_this.rootNode.setProperty("RU", ruleSet);
				_this.ruleSet = rules[ruleSet] || rules[defaultRules];
			}
			// ... and rules argument as object
			else if (ruleSet != null) {
					_this.ruleSet = ruleSet;
				}
				// ... and no second argument
				else {
						_this.rootNode.setProperty("RU", defaultRules);
						_this.ruleSet = rules[defaultRules];
					}
		}
		// KNode argument
		else if (boardSize != null) {
				var kNode = boardSize;
				_this.rootNode = kNode.root;
				_this.currentNode = kNode;

				_this.ruleSet = rules[_this.rootNode.getProperty("RU")] || rules[defaultRules];
				boardSize = _this.rootNode.getProperty("SZ");
			}
			// No argument
			else {
					_this.currentNode = _this.rootNode = new KNode();
					_this.ruleSet = rules[defaultRules];
					_this.rootNode.setProperty("SZ", 19);
					_this.rootNode.setProperty("RU", defaultRules);
				}

		_this.game = new Game$1(boardSize, _this.ruleSet);
		_this.executeNode();
		return _this;
	}

	babelHelpers.createClass(Kifu, [{
		key: "setRulesSet",
		value: function setRulesSet(ruleSet) {
			this.ruleSet = ruleSet;
			this.game.setRules(ruleSet);
		}

		/**
   * Gets specified property or all available game info as an object. In this context, all properties 
   * of the root node are considered as game info.
   * 
   * @param {string} [property] of info (sgf identificator), if omitted you will get all properties.
   */

	}, {
		key: "getGameInfo",
		value: function getGameInfo(property) {
			if (property != null) return this.rootNode.getProperty(property);else return Object.assign({}, this.rootNode.SGFProperties);
		}

		/**
   * Sets game info (as SGF property to root node).
   * 
   * @param {string} property of info (sgf identificator)
   * @param {string} value    of info (sgf value)
   */

	}, {
		key: "setGameInfo",
		value: function setGameInfo(property, value) {
			var oldValue = this.rootNode.getProperty(property);
			this.rootNode.setProperty(property, value);
			this.trigger("infoChanged", {
				target: this,
				node: this.rootNode,
				key: property,
				oldValue: oldValue,
				value: value
			});
		}

		/* ======= NODE MANIPULATION FUNCTIONALITY ================================================== */

		/**
   * Adds a child node to the current node, you can specify a position. Example:
   * 
   * ```
   * # Current node - D5
   * D5 ─┬─ C7 ── D6
   *     └─ B6
   * 
   * # After addNode(F5)
   * D5 ─┬─ C7 ── D6
   *     ├─ B6
   *     └─ F5
   * ```
   * 
   * @param {KNode}  node  a node to add, if omitted a new node will be created.
   * @param {number} index - position of node (0 means first position), if omitted the node will be added as last child of current node.
   */

	}, {
		key: "addNode",
		value: function addNode(node, index) {
			if (typeof node == "number") {
				index = node;
				node = new KNode();
			} else if (node == null) {
				node = new KNode();
			}

			if (index == null || index >= this.currentNode.children.length) {
				this.currentNode.appendChild(node);
			} else {
				this.currentNode.insertBefore(node, this.currentNode.children[index]);
			}

			this.trigger("treeChanged", {
				target: this,
				currentNode: this.currentNode,
				type: "addNode",
				node: node,
				position: index
			});
		}

		/**
   * Moves current's node child from one position to another. Example:
   * 
   * ```
   * # Current node - D5
   * D5 ─┬─ C7 ── D6
   *     └─ B6
   * 
   * # After moveNode(0, 1)
   * D5 ─┬─ B6
   *     └─ C7 ── D6
   * ```
   * 
   * @param {number} from index
   * @param {number} to   index
   */

	}, {
		key: "moveNode",
		value: function moveNode(from, to) {
			var nodeFrom = this.currentNode.children[from];
			var nodeTo = this.currentNode.children[to];

			if (nodeFrom == null || nodeTo == null) {
				throw new KifuError("Argument `from` or argument `to` of method `moveNode()` points to nonexisting node.");
			}

			if (from > to) {
				this.currentNode.children.splice(to, 0, this.currentNode.children.splice(from, 1)[0]);
			} else if (from < to) {
				this.currentNode.children.splice(to + 1, 1, this.currentNode.children.splice(from, 1)[0]);
			}

			this.trigger("treeChanged", {
				target: this,
				currentNode: this.currentNode,
				type: "moveNode",
				nodeFrom: nodeFrom,
				positionFrom: from,
				nodeTo: nodeTo,
				positionTo: to
			});
		}

		/**
   * Removes current's node child and all its descendants. Example:
   * 
   * ```
   * # Current node - D5
   * D5 ─┬─ C7 ── D6
   *     └─ B6
   * 
   * # After removeNode(0)
   * D5 ── F5
   * ```
   * 
   * @param {number} index of child node
   * @return {KNode} Removed node.
   */

	}, {
		key: "removeNode",
		value: function removeNode(index) {
			if (index == null) {
				index = this.currentNode.children.length - 1;
			}

			var removedNode = this.currentNode.children[index];

			this.currentNode.removeChild(removedNode);

			this.trigger("treeChanged", {
				target: this,
				currentNode: this.currentNode,
				type: "removeNode",
				node: removedNode,
				position: index
			});

			return removedNode;
		}

		/* ======= GENERAL NODE PROPERTIES =============================================================*/

	}, {
		key: "hasMoveProperty",
		value: function hasMoveProperty() {
			return Object.keys(this.currentNode.SGFProperties).some(function (propIdent) {
				return propIdent == BLACK_MOVE || propIdent == WHITE_MOVE;
			});
		}
	}, {
		key: "hasSetupProperties",
		value: function hasSetupProperties() {
			return Object.keys(this.currentNode.SGFProperties).some(function (propIdent) {
				return setupProperties[propIdent] != null || setupProperties[propIdent] == SET_TURN;
			});
		}

		/* ======= MOVE RELATED PROPERTIES ============================================================== */

		/**
   * Gets move associated to the current node.
   * 
   * @returns {Object} move object
   */

	}, {
		key: "getMove",
		value: function getMove() {
			if (this.currentNode.SGFProperties[BLACK_MOVE]) {
				return Object.assign({ c: BLACK }, this.currentNode.SGFProperties[BLACK_MOVE]);
			} else if (this.currentNode.SGFProperties[WHITE_MOVE]) {
				return Object.assign({ c: WHITE }, this.currentNode.SGFProperties[WHITE_MOVE]);
			}

			return null;
		}

		/**
   * Sets (or removes) move directly to the current node.
   * 
   * @param {(Object|number)}    x      move object or x coordinate of move.
   * @param {number}             y      y coordinate of move (if first argument is not move object)
   * @param {(WGo.B|WGo.E)}      c      color of move (if first argument is not move object)
   */

	}, {
		key: "setMove",
		value: function setMove(x, y, c) {
			if (this.hasSetupProperties()) {
				throw new KifuError("Move cannot be set. Move properties mustn't be mixed with setup properties.");
			} else if (this.currentNode.parent == null) {
				throw new KifuError("Move cannot be set. Root node mustn't contain move properties.");
			}

			var _normalizeSetupArgume = normalizeSetupArguments(x, y, c);

			x = _normalizeSetupArgume.x;
			y = _normalizeSetupArgume.y;
			c = _normalizeSetupArgume.c;

			this.removeMove();

			if (c == BLACK) this.currentNode.setProperty(BLACK_MOVE, { x: x, y: y });else if (c == WHITE) this.currentNode.setProperty(WHITE_MOVE, { x: x, y: y });

			this.refreshGame();
		}

		/**
   * Removes any move proprty in the current node.
   */

	}, {
		key: "removeMove",
		value: function removeMove() {
			this.currentNode.setProperty(BLACK_MOVE);
			this.currentNode.setProperty(WHITE_MOVE);
			this.refreshGame();
		}

		/**
   * Gets color of currently playing player.
   */

	}, {
		key: "getTurn",
		value: function getTurn() {
			return this.game.turn;
		}

		/**
   * Sets player of next move.
   * 
   * @param {(WGo.B|WGo.W)} turn 
   */

	}, {
		key: "setTurn",
		value: function setTurn(turn) {
			if (this.hasMoveProperty()) {
				throw new KifuError("Turn can't be set. Setup properties mustn't be mixed with move properties.");
			}

			this.currentNode.setProperty(SET_TURN, turn);

			if (turn == null) {
				var prevPos = this.game.getPreviousPosition();
				turn = prevPos ? prevPos.turn : BLACK;
			}

			this.game.turn = turn;
		}

		/* ======= MARKUP ==================================================================== */

		/**
   * Gets all markup associated with the current node.
   *
   * @returns {BoardObject[]} Array of markup objects                  
   */

	}, {
		key: "getMarkup",
		value: function getMarkup() {
			var markupList = [];

			getMarkupProperties(this.currentNode).forEach(function (_ref) {
				var propIdent = _ref.propIdent;
				var value = _ref.value;

				markupList = [].concat(babelHelpers.toConsumableArray(markupList), babelHelpers.toConsumableArray(value.map(function (markup) {
					return {
						x: markup.x,
						y: markup.y,
						type: propIdent
					};
				})));
			});

			return markupList;
		}

		/**
   * Gets markup on given coordination (as markup object).
   * 
   * @param {number}                      x coordinate
   * @param {number}                      y coordinate
   *                                        
   * @returns {BoardObject} Markup object.                
   */

	}, {
		key: "getMarkupAt",
		value: function getMarkupAt(x, y) {
			for (var propIdent in this.currentNode.SGFProperties) {
				if (markupProperties.indexOf(propIdent) >= 0 && this.currentNode.SGFProperties[propIdent].some(function (markup) {
					return markup.x === x && markup.y === y;
				})) {
					return { x: x, y: y, type: propIdent };
				}
			}

			return null;
		}

		/**
   * Adds markup into the kifu. If there is already a markup on given coordinates, it will be overridden.
   * 
   * @param {(BoardObject|number)} x         Markup object or x coordinate.
   * @param {number}               y         Y coordinate if first argument is coordinate.
   * @param {string}               type      Type of markup (if first 2 arguments are coordinates).
   */

	}, {
		key: "setMarkup",
		value: function setMarkup(x, y, type) {
			var _normalizeMarkupArgum = normalizeMarkupArguments(x, y, type);

			x = _normalizeMarkupArgum.x;
			y = _normalizeMarkupArgum.y;
			type = _normalizeMarkupArgum.type;


			this.removeMarkup(x, y);

			var markupList = this.currentNode.getProperty(type) || [];
			markupList.push({ x: x, y: y });
			this.currentNode.setProperty(type, markupList);
		}

		/**
   * Removes given markup or markup on coordinates.
   * 
   * @param {(BoardObject|number)} x         Markup object or x coordinate.
   * @param {number}               y         Y coordinate if first argument is coordinate.
   */

	}, {
		key: "removeMarkup",
		value: function removeMarkup(x, y) {
			var _this2 = this;

			var _normalizeMarkupArgum2 = normalizeMarkupArguments(x, y);

			x = _normalizeMarkupArgum2.x;
			y = _normalizeMarkupArgum2.y;


			getMarkupProperties(this.currentNode).forEach(function (_ref2) {
				var propIdent = _ref2.propIdent;
				var value = _ref2.value;

				_this2.currentNode.setProperty(propIdent, value.filter(notOnCoordinates(x, y)));
			});
		}

		/* ======= SETUP ==================================================================== */

		/**
   * Gets setup stones in the current node.
   *                                        
   * @returns {BoardObject[]} Array of setup object.  
   */

	}, {
		key: "getSetup",
		value: function getSetup() {
			var setupList = [];

			getSetupProperties(this.currentNode).forEach(function (_ref3) {
				var propIdent = _ref3.propIdent;
				var value = _ref3.value;

				setupList = [].concat(babelHelpers.toConsumableArray(setupList), babelHelpers.toConsumableArray(value.map(function (setup) {
					return {
						x: setup.x,
						y: setup.y,
						c: setupProperties[propIdent]
					};
				})));
			});

			return setupList;
		}

		/**
   * Gets setup stone on given coordination (as setup object).
   * 
   * @param {number}                      x coordinate
   * @param {number}                      y coordinate
   *                                        
   * @returns {BoardObject} Setup object  
   */

	}, {
		key: "getSetupAt",
		value: function getSetupAt(x, y) {
			if (arguments.length == 2) {
				for (var propIdent in this.currentNode.SGFProperties) {
					if (setupProperties[propIdent] != null && this.currentNode.SGFProperties[propIdent].some(onCoordinates(x, y))) {
						return { x: x, y: y, c: setupProperties[propIdent] };
					}
				}

				return null;
			}

			var setupList = [];

			getSetupProperties(this.currentNode).forEach(function (_ref4) {
				var propIdent = _ref4.propIdent;
				var value = _ref4.value;

				setupList = [].concat(babelHelpers.toConsumableArray(setupList), [value.map(function (setup) {
					return {
						x: setup.x,
						y: setup.y,
						c: setupProperties[propIdent]
					};
				})]);
			});

			return setupList;
		}

		/**
   * Adds setup stone into the kifu. If there is already a setup stone on given coordinates, it will be overridden.
   * 
   * @param {(BoardObject|number)} x         Setup object or x coordinate.
   * @param {number}               y         Y coordinate if first argument is coordinate.
   * @param {(WGo.B|WGo.W|WGo.E)}  color     Color of stone (if first 2 arguments are coordinates).
   */

	}, {
		key: "setSetup",
		value: function setSetup(x, y, c) {
			if (this.hasMoveProperty()) {
				throw new KifuError("Stone cannot be set. Setup properties mustn't be mixed with move properties.");
			}

			var _normalizeSetupArgume2 = normalizeSetupArguments(x, y, c);

			x = _normalizeSetupArgume2.x;
			y = _normalizeSetupArgume2.y;
			c = _normalizeSetupArgume2.c;


			this.removeSetup(x, y);

			var setupList = this.currentNode.getProperty(setupPropertiesReversed[c]) || [];
			setupList.push({ x: x, y: y });
			this.currentNode.setProperty(setupPropertiesReversed[c], setupList);

			this.game.setStone(x, y, c);
		}

		/**
   * Removes given setup or setup stone on coordinates.
   * 
   * @param {(BoardObject|number)} x         Setup object or x coordinate.
   * @param {number}               y         Y coordinate if first argument is coordinate.
   */

	}, {
		key: "removeSetup",
		value: function removeSetup(x, y) {
			var _this3 = this;

			var _normalizeSetupArgume3 = normalizeSetupArguments(x, y);

			x = _normalizeSetupArgume3.x;
			y = _normalizeSetupArgume3.y;


			getSetupProperties(this.currentNode).forEach(function (_ref5) {
				var propIdent = _ref5.propIdent;
				var value = _ref5.value;

				_this3.currentNode.setProperty(propIdent, value.filter(notOnCoordinates(x, y)));
			});

			this.refreshGame();
		}

		/* ======= TRAVERSING ==================================================================== */

	}, {
		key: "first",
		value: function first() {
			var previousNode = this.currentNode;

			this.currentNode = this.rootNode;
			this.game.firstPosition();
			this.executeNode();

			if (previousNode != this.currentNod) {
				this.trigger("update", {
					target: this,
					action: "first",
					currentNode: this.currentNode,
					previousNode: previousNode,
					game: this.game
				});
			}

			return this;
		}
	}, {
		key: "previous",
		value: function previous() {
			if (this.currentNode.parent != null) {
				var previousNode = this.currentNode;

				this.currentNode = this.currentNode.parent;
				this.game.popPosition();

				this.trigger("update", {
					target: this,
					action: "previous",
					currentNode: this.currentNode,
					previousNode: previousNode,
					game: this.game
				});
			}

			return this;
		}
	}, {
		key: "next",
		value: function next() {
			var index = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

			if (this.currentNode.children[index] != null) {
				var previousNode = this.currentNode;

				this.currentNode = this.currentNode.children[index];
				this.executeNode();

				this.trigger("update", {
					target: this,
					action: "next",
					currentNode: this.currentNode,
					previousNode: previousNode,
					index: index,
					game: this.game
				});
			}

			return this;
		}
	}, {
		key: "last",
		value: function last() {
			var previousNode = this.currentNode;

			while (this.currentNode.children[0]) {
				this.currentNode = this.currentNode.children[0];
				this.executeNode();
			}

			if (previousNode != this.currentNode) {
				this.trigger("update", {
					target: this,
					action: "last",
					currentNode: this.currentNode,
					previousNode: previousNode,
					game: this.game
				});
			}

			return this;
		}

		/**
   * TODO: analysis needed.
   * 
   * @param {*} kifuPath 
   */

	}, {
		key: "goTo",
		value: function goTo(kifuPath) {
			return this;
		}

		/**
   * Executes current node - new position will be created in game object.
   * This method should be called when there is new current node and you want to
   * to reflect node properties in game object (play move, set stones...).
   */

	}, {
		key: "executeNode",
		value: function executeNode() {
			var _this4 = this;

			if (this.currentNode != this.rootNode) {
				var move = this.getMove();

				if (move != null) {
					this.game.play(move.x, move.y, move.c);
					return;
				} else {
					this.game.pushPosition(this.game.position.clone());
				}
			}

			getSetupProperties(this.currentNode).forEach(function (_ref6) {
				var propIdent = _ref6.propIdent;
				var value = _ref6.value;

				value.forEach(function (_ref7) {
					var x = _ref7.x;
					var y = _ref7.y;
					return _this4.game.setStone(x, y, setupProperties[propIdent]);
				});
			});

			var turnSet = this.currentNode.getProperty(SET_TURN);
			if (turnSet != null) {
				this.game.turn = turnSet;
			}
		}

		/**
   * Refresh game object - should be called, when current node's move or setup stones have changed.
   */

	}, {
		key: "refreshGame",
		value: function refreshGame() {
			if (this.currentNode.parent != null) {
				this.game.popPosition();
			} else {
				this.game.firstPosition();
			}
			this.executeNode();
		}

		/* ======= SHORTCUTS AND HELPERS ========================================================= */

	}, {
		key: "getPosition",
		value: function getPosition() {
			return this.game.position;
		}
	}, {
		key: "isValidMove",
		value: function isValidMove(move) {
			return this.game.isValid(move.x, move.y);
		}

		/**
   * Plays a move. This is a shortcut for creating a node, setting a move property and traversing on it.
   * 
   * @param {Object}  move              coordinates
   * @param {boolean} [newVariant=true] if false, following nodes will be appended to the new node, instead of creating a new branch (default true)
   */

	}, {
		key: "play",
		value: function play(move) {
			var newVariant = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

			var newNode = new KNode();
			var x = move.x;
			var y = move.y;
			var _move$c = move.c;
			var c = _move$c === undefined ? this.getTurn() : _move$c;


			if (c == BLACK) newNode.setProperty(BLACK_MOVE, { x: x, y: y });else if (c == WHITE) newNode.setProperty(WHITE_MOVE, { x: x, y: y });

			if (newVariant === false && this.currentNode.children[0]) {

				this.currentNode.children.forEach(function (node) {
					newNode.appendChild(node);
				});

				this.next(this.currentNode.appendChild(newNode));
			} else {
				this.next(this.currentNode.appendChild(newNode));
			}
		}
	}, {
		key: "toSGF",
		value: function toSGF() {
			return this.rootNode.toSGF();
		}
	}, {
		key: "toJS",
		value: function toJS() {
			return this.rootNode.toJS();
		}
	}, {
		key: "blackName",
		get: function get() {
			return this.rootNode.getProperty(BLACK_NAME);
		},
		set: function set(name) {
			this.setGameInfo(BLACK_NAME, name);
		}
	}, {
		key: "blackRank",
		get: function get() {
			return this.rootNode.getProperty(BLACK_RANK);
		},
		set: function set(rank) {
			this.setGameInfo(BLACK_RANK, rank);
		}
	}, {
		key: "blackTeam",
		get: function get() {
			return this.rootNode.getProperty(BLACK_TEAM);
		},
		set: function set(team) {
			this.setGameInfo(BLACK_TEAM, team);
		}
	}, {
		key: "whiteName",
		get: function get() {
			return this.rootNode.getProperty(WHITE_NAME);
		},
		set: function set(name) {
			this.setGameInfo(WHITE_NAME, name);
		}
	}, {
		key: "whiteRank",
		get: function get() {
			return this.rootNode.getProperty(WHITE_RANK);
		},
		set: function set(rank) {
			this.setGameInfo(WHITE_RANK, rank);
		}
	}, {
		key: "whiteTeam",
		get: function get() {
			return this.rootNode.getProperty(WHITE_TEAM);
		},
		set: function set(team) {
			this.setGameInfo(WHITE_TEAM, team);
		}
	}, {
		key: "date",
		get: function get() {
			var date = this.rootNode.getProperty(DATE);
			return date ? new Date(date) : null;
		},
		set: function set(date) {
			var month = date.getMonth();
			var day = date.getDate();

			month = month < 9 ? "0" + (month + 1) : month + 1;
			day = day < 10 ? "0" + day : day;

			this.setGameInfo(DATE, date.getFullYear() + "-" + month + "-" + day);
		}
	}, {
		key: "event",
		get: function get() {
			return this.rootNode.getProperty(EVENT);
		},
		set: function set(team) {
			this.setGameInfo(EVENT, team);
		}
	}, {
		key: "result",
		get: function get() {
			return this.rootNode.getProperty(RESULT);
		},
		set: function set(result) {
			this.setGameInfo(RESULT, result);
		}
	}, {
		key: "komi",
		get: function get() {
			return this.rootNode.getProperty(KOMI);
		},
		set: function set(komi) {
			this.setGameInfo(KOMI, komi);
		}
	}, {
		key: "rules",
		get: function get() {
			return this.rootNode.getProperty("RU");
		},
		set: function set(rules$$1) {
			this.setRulesSet(rules$$1[rules$$1] || rules$$1[defaultRules]);
			this.setGameInfo("RU", rules$$1);
		}
	}, {
		key: "boardSize",
		get: function get() {
			return this.rootNode.getProperty("SZ") || 19;
		}
	}]);
	return Kifu;
}(EventEmitter);

Kifu$1.KNode = KNode;
Kifu$1.KifuError = KifuError;
Kifu$1.markupProperties = markupProperties;
Kifu$1.properties = properties;
Kifu$1.propertyValueTypes = propertyValueTypes;

var defaultConfig$1 = {
	inIframe: true,
	board: CanvasBoard$1,
	boardConfig: {},
	styles: [exports.DIR + "wgo.css"]
};

var template = "\n\t<div class=\"wgo-player\">\n\t\t<div class=\"wgo-board-wrapper\">\n\t\t\t<div class=\"wgo-board-container\"></div>\n\t\t</div>\n\t\t<div class=\"wgo-bottom\">\n\t\t\t<div class=\"wgo-capture-info\">\n\t\t\t\t<div class=\"wgo-capture-box wgo-capture-black\">2</div>\n\t\t\t\t<div class=\"wgo-capture-box wgo-capture-white\">5</div>\n\t\t\t</div>\n\t\t\t<button class=\"wgo-button wgo-menu\">\n\t\t\t\t<span class=\"wgo-dot\"></span>\n\t\t\t\t<span class=\"wgo-dot\"></span>\n\t\t\t\t<span class=\"wgo-dot\"></span>\n\t\t\t</button>\n\t\t\t<div class=\"wgo-control\">\n\t\t\t\t<button class=\"wgo-button wgo-first\"></button>\n\t\t\t\t<button class=\"wgo-button wgo-prev-10\"></button>\n\t\t\t\t<button class=\"wgo-button wgo-prev\"></button>\n\t\t\t\t<input type=\"text\" class=\"wgo-move\" maxlength=\"3\" value=\"0\">\n\t\t\t\t<button class=\"wgo-button wgo-next\"></button>\n\t\t\t\t<button class=\"wgo-button wgo-next-10\"></button>\n\t\t\t\t<button class=\"wgo-button wgo-last\"></button>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n";

var iframe = function (styles, scripts) {
	return "\n\t\t<!DOCTYPE html>\n\t\t<html class=\"wgo-player-iframe-content\">\n\t\t\t<head>\n\t\t\t\t<meta charset=\"UTF-8\">\n\t\t\t\t<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n\t\t\t\t" + styles.reduce(function (prev, current) {
		return prev + ("<link rel=\"stylesheet\" href=\"" + current + "\">");
	}, "") + "\n\t\t\t</head>\n\t\t\t<body>\n\t\t\t\t<div id=\"player\"></div>\n\t\t\t\t" + scripts.reduce(function (prev, current) {
		return prev + ("<script src=\"" + current + "\"></script>");
	}, "") + "\n\t\t\t</body>\n\t\t</html>\n\t";
};

var Board = function () {
	function Board(BoardRenderer, elem, options) {
		babelHelpers.classCallCheck(this, Board);

		this.boardRenderer = new BoardRenderer(elem, options);
		this.updateBoard = this.updateBoard.bind(this);
	}

	babelHelpers.createClass(Board, [{
		key: "registerEvents",
		value: function registerEvents(kifu) {
			kifu.on("update", this.updateBoard);
		}
	}, {
		key: "updateBoard",
		value: function updateBoard(event) {
			var objects = [];
			var size = event.game.position.size;
			size;
			// get stones
			for (var x = 0; x < size; x++) {
				objects[x] = [];
				for (var y = 0; y < size; y++) {
					objects[x][y] = [];
					if (event.game.position.grid[x * size + y]) {
						objects[x][y].push({ x: x, y: y, c: event.game.position.grid[x * size + y] });
					}
				}
			}

			// get markup
			var move = event.target.getMove();
			if (move) objects[move.x][move.y].push({ x: move.x, y: move.y, type: "CR" });

			// render board object
			this.boardRenderer.update(objects);
		}
	}]);
	return Board;
}();

var Player$1 = function () {
	function Player(elem, config) {
		babelHelpers.classCallCheck(this, Player);

		// merge user config with default
		this.config = defaultsDeep_1(config || {}, defaultConfig$1);
		this.kifu = new Kifu$1();
		this.dom = {};
		this.domLoaded = null;

		if (this.config.inIframe) {
			this.initIframe(elem);
		} else {
			this.initPlayer(elem);
		}

		this.registerKifuEvents = this.registerKifuEvents.bind(this);
		this.updateCaptureCounts = this.updateCaptureCounts.bind(this);

		this.first = this.first.bind(this);
		this.prev10 = this.prev10.bind(this);
		this.prev = this.prev.bind(this);
		this.next = this.next.bind(this);
		this.next10 = this.next10.bind(this);
		this.last = this.last.bind(this);
	}

	babelHelpers.createClass(Player, [{
		key: "loadSGFFromURL",
		value: function loadSGFFromURL(url) {
			var _this = this;

			return fetch(url).then(function (sgf) {
				return _this.loadSGF(sgf);
			});
		}
	}, {
		key: "loadSGF",
		value: function loadSGF(sgf) {
			this.kifu = Kifu$1.fromSGF(sgf);

			if (this.domLoaded) {
				this.domLoaded.then(this.registerKifuEvents);
			} else {
				this.registerKifuEvents();
			}
		}
	}, {
		key: "initIframe",
		value: function initIframe(elem) {
			var _this2 = this;

			var iframeElem = document.createElement("iframe");
			iframeElem.setAttribute("srcdoc", iframe(this.config.styles, []));
			iframeElem.className = "wgo-iframe-player";
			elem.appendChild(iframeElem);

			this.domLoaded = new Promise(function (resolve) {
				iframeElem.addEventListener("load", function () {
					_this2.initPlayer(iframeElem.contentDocument.getElementById("player"));
					resolve();
				});
			});

			return this.domLoaded;
		}
	}, {
		key: "initPlayer",
		value: function initPlayer(elem) {
			elem.innerHTML = template;

			// board
			this.dom.board = elem.querySelector(".wgo-board-container");

			// buttons
			this.dom.first = elem.querySelector(".wgo-first");
			this.dom.prev10 = elem.querySelector(".wgo-prev-10");
			this.dom.prev = elem.querySelector(".wgo-prev");
			this.dom.next = elem.querySelector(".wgo-next");
			this.dom.next10 = elem.querySelector(".wgo-next-10");
			this.dom.last = elem.querySelector(".wgo-last");

			// capture stones counts
			this.dom.captureBlack = elem.querySelector(".wgo-capture-black");
			this.dom.captureWhite = elem.querySelector(".wgo-capture-white");

			if (!this.config.boardConfig.width) {
				this.config.boardConfig.width = parseInt(this.dom.board.offsetWidth);
			}

			this.board = new Board(this.config.board, this.dom.board, this.config.boardConfig);
		}
	}, {
		key: "registerKifuEvents",
		value: function registerKifuEvents() {
			this.domLoaded = null;
			this.board.registerEvents(this.kifu);

			this.dom.first.addEventListener("click", this.first);
			this.dom.prev10.addEventListener("click", this.prev10);
			this.dom.prev.addEventListener("click", this.prev);
			this.dom.next.addEventListener("click", this.next);
			this.dom.next10.addEventListener("click", this.next10);
			this.dom.last.addEventListener("click", this.last);

			this.kifu.on("update", this.updateCaptureCounts);
		}
	}, {
		key: "updateCaptureCounts",
		value: function updateCaptureCounts(event) {
			this.dom.captureBlack.textContent = event.game.position.capCount.black;
			this.dom.captureWhite.textContent = event.game.position.capCount.white;
		}
	}, {
		key: "first",
		value: function first() {
			this.kifu.first();
		}
	}, {
		key: "prev10",
		value: function prev10() {
			//todo
		}
	}, {
		key: "prev",
		value: function prev() {
			this.kifu.previous();
		}
	}, {
		key: "next",
		value: function next() {
			this.kifu.next();
		}
	}, {
		key: "next10",
		value: function next10() {
			//todo
		}
	}, {
		key: "last",
		value: function last() {
			this.kifu.last();
		}
	}]);
	return Player;
}();

Player$1.defaultConfig = defaultConfig$1;

// WGo module

exports.Game = Game$1;
exports.Position = Position;
exports.SGFParser = SGFParser$1;
exports.KNode = KNode;
exports.CanvasBoard = CanvasBoard$1;
exports.Kifu = Kifu$1;
exports.Player = Player$1;
exports.B = B;
exports.BLACK = BLACK;
exports.W = W;
exports.WHITE = WHITE;
exports.E = E;
exports.EMPTY = EMPTY;
exports.ERROR_REPORT = ERROR_REPORT;
exports.lang = lang;
exports.i18n = i18n;
exports.t = t;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=wgo.js.map
