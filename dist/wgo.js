(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WGo = global.WGo || {})));
}(this, function (exports) { 'use strict';

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
	};

	/*
	if(global["document"]) {
		var scripts = document.getElementsByTagName('script');
		var path = scripts[scripts.length-1].src.split('?')[0];      // remove any ?query
		WGo.DIR = path.split('/').slice(0, -1).join('/')+'/';  
	}

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
		}]);
		return Position;
	}();

	// Error codes returned by method Game#play()
	var MOVE_OUT_OF_BOARD = 1;
	var FIELD_OCCUPIED = 2;
	var MOVE_SUICIDE = 3;
	var POSITION_REPEATED = 4;

	// function for stone capturing
	var capture = function capture(position, capturedStones, x, y, c) {
		if (x >= 0 && x < position.size && y >= 0 && y < position.size && position.get(x, y) == c) {
			position.set(x, y, 0);
			capturedStones.push({ x: x, y: y });

			capture(position, capturedStones, x, y - 1, c);
			capture(position, capturedStones, x, y + 1, c);
			capture(position, capturedStones, x - 1, y, c);
			capture(position, capturedStones, x + 1, y, c);
		}
	};

	// looking at liberties
	var hasLiberties = function hasLiberties(position, alreadyTested, x, y, c) {
		// out of the board there aren't liberties
		if (x < 0 || x >= position.size || y < 0 || y >= position.size) return false;

		// however empty field means liberty
		if (position.get(x, y) == EMPTY) return true;

		// already tested field or stone of enemy isn't a liberty.
		if (alreadyTested.get(x, y) == true || position.get(x, y) == -c) return false;

		// set this field as tested
		alreadyTested.set(x, y, true);

		// in this case we are checking our stone, if we get 4 false, it has no liberty
		return hasLiberties(position, alreadyTested, x, y - 1, c) || hasLiberties(position, alreadyTested, x, y + 1, c) || hasLiberties(position, alreadyTested, x - 1, y, c) || hasLiberties(position, alreadyTested, x + 1, y, c);
	};

	// analysing function - modifies original position, if there are some capturing, and returns array of captured stones
	var captureIfPossible = function captureIfPossible(position, x, y, c) {
		var capturedStones = [];
		// is there a stone possible to capture?
		if (x >= 0 && x < position.size && y >= 0 && y < position.size && position.get(x, y) == c) {
			// create testing map
			var alreadyTested = new Position(position.size);
			// if it has zero liberties capture it
			if (!hasLiberties(position, alreadyTested, x, y, c)) {
				// capture stones from game
				capture(position, capturedStones, x, y, c);
			}
		}
		return capturedStones;
	};

	// analysing history
	var checkHistory = function checkHistory(position, x, y) {
		var flag, stop;

		if (this.repeating == "KO" && this.stack.length - 2 >= 0) stop = this.stack.length - 2;else if (this.repeating == "ALL") stop = 0;else return true;

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
	};

	var Game = function () {

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

		function Game(size, rulesOrCheckRepeat, allowRewrite, allowSuicide) {
			babelHelpers.classCallCheck(this, Game);

			this.size = size || 19;

			if ((typeof rulesOrCheckRepeat === "undefined" ? "undefined" : babelHelpers.typeof(rulesOrCheckRepeat)) == "object") {
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

			value: function play(x, y, c, noplay) {
				//check coordinates validity
				if (!this.isOnBoard(x, y)) return MOVE_OUT_OF_BOARD;
				if (!this.allow_rewrite && this.position.get(x, y) != 0) return FIELD_OCCUPIED;

				// clone position
				var c = c || this.position.turn;

				var newPosition = this.position.clone();
				newPosition.set(x, y, c);

				// check capturing
				var capturesColor = c;
				var capturedStones = captureIfPossible(newPosition, x - 1, y, -c).concat(captureIfPossible(newPosition, x + 1, y, -c), captureIfPossible(newPosition, x, y - 1, -c), captureIfPossible(newPosition, x, y + 1, -c));

				// check suicide
				if (!capturedStones.length) {
					var testing = new Position(this.size);
					if (!hasLiberties(newPosition, testing, x, y, c)) {
						if (this.allow_suicide) {
							capturesColor = -c;
							capture(newPosition, capturedStones, x, y, c);
						} else return MOVE_SUICIDE;
					}
				}

				// check history
				if (this.repeating && !checkHistory.call(this, newPosition, x, y)) {
					return POSITION_REPEATED;
				}

				if (noplay) return false;

				// reverse turn
				newPosition.turn = -c;

				// update position info
				if (capturesColor == BLACK) newPosition.capCount.black += capturedStones.length;else newPosition.capCount.white += capturedStones.length;

				// save position
				this.pushPosition(newPosition);

				return capturedStones;
			}

			/**
	   * Play pass.
	   *
	   * @param {(BLACK|WHITE)} c color
	   */

		}, {
			key: "pass",
			value: function pass(c) {
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

		}, {
			key: "isValid",
			value: function isValid(x, y, c) {
				return typeof this.play(x, y, c, true) != "number";
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
				var pos = pos || this.position.clone();
				this.stack.push(pos);
				return this;
			}

			/**
	   * Remove current position from stack. Pointer of actual position is moved to the previous position.
	   */

		}, {
			key: "popPosition",
			value: function popPosition() {
				var old;
				if (this.stack.length > 0) old = this.stack.pop();
				return old;
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
				var c,
				    p,
				    white = 0,
				    black = 0,
				    capturedStones = [],
				    newPosition = this.position.clone();

				for (var x = 0; x < this.size; x++) {
					for (var y = 0; y < this.size; y++) {
						c = this.position.get(x, y);
						if (c) {
							p = capturedStones.length;
							capturedStones = capturedStones.concat(captureIfPossible(newPosition, x - 1, y, -c), captureIfPossible(newPosition, x + 1, y, -c), captureIfPossible(newPosition, x, y - 1, -c), captureIfPossible(newPosition, x, y + 1, -c));

							if (c == BLACK) black += capturedStones.length - p;else white += capturedStones.length - p;
						}
					}
				}
				this.position.capCount.black += black;
				this.position.capCount.white += white;
				this.position.grid = newPosition.grid;

				return capturedStones;
			}
		}, {
			key: "position",
			get: function get() {
				return this.stack[this.stack.length - 1];
			},
			set: function set(pos) {
				this.stack[this.stack.length - 1] = pos;
			}
		}]);
		return Game;
	}();

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

	var SGFParser = function () {

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

	// helper function for translating letters to numbers (a => 0, b => 1, ...)
	var str2coo = function str2coo(str) {
		return {
			x: str.charCodeAt(0) - 97,
			y: str.charCodeAt(1) - 97
		};
	};

	// helper function for translating numbers to letters (0 => a, 1 => b, ...)
	var coo2str = function coo2str(field) {
		return String.fromCharCode(field.x + 97) + String.fromCharCode(field.y + 97);
	};

	// helper to remove setup or markup from SGF properties
	var removeSGFValue = function removeSGFValue(properties, ident, field) {
		if (properties[ident]) {
			var pos = properties[ident].indexOf(coo2str(field));
			if (pos >= 0) {
				properties[ident].splice(pos, 1);
				if (!properties[ident].length) delete properties[ident];
			}
		}
	};

	// jsgf helper
	var processJsgf = function processJsgf(parent, jsgf, pos) {
		if (jsgf[pos]) {
			if (jsgf[pos].constructor == Array) {
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

	var rMove = function rMove(color) {
		return function (node, value) {
			if (value == null) {
				node.setMove();
			} else if (!value[0]) {
				node.setMove({
					pass: true,
					c: color
				});
			} else {
				var move = str2coo(value[0]);
				move.c = color;
				node.setMove(move);
			}
		};
	};

	var rSetup = function rSetup(color, propIdent) {
		return function (node, value) {
			if (value == null) {
				var keys = Object.keys(node.setup);
				for (var i = 0; i < keys.length; i++) {
					if (node.setup[keys[i]] == color) {
						delete node.setup[keys[i]];
					}
				}
				delete node.SGFProperties[propIdent];
				return;
			}

			node.addSetup(value.map(function (elem) {
				var setup = str2coo(elem);
				setup.c = color;
				return setup;
			}));
		};
	};

	var rMarkup = function rMarkup(type) {
		return function (node, value) {
			if (value == null) {
				var keys = Object.keys(node.markup);
				for (var i = 0; i < keys.length; i++) {
					if (node.markup[keys[i]].type == type) {
						delete node.markup[keys[i]];
					}
				}
				delete node.SGFProperties[type];
				return;
			}

			node.addMarkup(value.map(function (elem) {
				var markup = str2coo(elem);
				markup.type = type;
				return markup;
			}));
		};
	};

	var rPlayerInfo = function rPlayerInfo(color, type) {
		return function (node, value) {
			if (node.parent) console.warn("Adding player information(" + color + "." + type + ") to non-root node, probably will be ignored.");
			node.gameInfo = node.gameInfo || {};
			node.gameInfo[color] = node.gameInfo[color] || {};
			node.gameInfo[color][type] = value.join("");
		};
	};

	var rGameInfo = function rGameInfo(property) {
		return function (node, value) {
			if (node.parent) console.warn("Adding game information(" + property + ") to non-root node, probably will be ignored.");
			node.gameInfo = node.gameInfo || {};
			node.gameInfo[property] = value.join("");
		};
	};

	/**
	 * List of functions which transforms string SGF property values into javascript kifu property.
	 */
	var SGFreaders = {
		B: rMove(BLACK),
		W: rMove(WHITE),
		AB: rSetup(BLACK, "AB"),
		AW: rSetup(WHITE, "AW"),
		AE: rSetup(EMPTY, "AE"),
		PL: function PL(node, value) {
			if (value) {
				if (value[0] == "b" || value[0] == "B") node.setTurn(BLACK);else if (value[0] == "w" || value[0] == "W") node.setTurn(WHITE);
			} else {
				node.setTurn();
			}
		},
		C: function C(node, value) {
			node.setComment(value ? value.join("") : "");
		},
		CR: rMarkup("CR"), // circle
		SQ: rMarkup("SQ"), // square
		TR: rMarkup("TR"), // triangle
		SL: rMarkup("SL"), // dot
		MA: rMarkup("MA"), // X
		LB: function LB(node, value) {
			if (value == null) {
				var keys = Object.keys(node.markup);
				for (var i = 0; i < keys.length; i++) {
					if (node.markup[keys[i]].type == "LB") {
						delete node.markup[keys[i]];
					}
				}
				delete node.SGFProperties.LB;
				return;
			}

			node.addMarkup(value.map(function (elem) {
				var markup = str2coo(elem);
				markup.type = "LB";
				markup.text = elem.substr(3);
				return markup;
			}));
		},
		BR: rPlayerInfo("black", "rank"),
		PB: rPlayerInfo("black", "name"),
		BT: rPlayerInfo("black", "team"),
		WR: rPlayerInfo("white", "rank"),
		PW: rPlayerInfo("white", "name"),
		WT: rPlayerInfo("white", "team"),
		TM: rGameInfo("basicTime"),
		OT: rGameInfo("byoyomi"),
		AN: rGameInfo("annotations"),
		CP: rGameInfo("copyright"),
		DT: rGameInfo("date"),
		EV: rGameInfo("event"),
		GN: rGameInfo("gameName"),
		GC: rGameInfo("gameComment"),
		ON: rGameInfo("opening"),
		PC: rGameInfo("place"),
		RE: rGameInfo("result"),
		RO: rGameInfo("round"),
		RU: rGameInfo("rules"),
		SO: rGameInfo("source"),
		US: rGameInfo("user")
	};

	/**
	 * List of functions which transforms javascript kifu property into SGF property.
	 */
	var SGFwriters = {
		LB: function LB(value) {
			return coo2str(value) + ":" + value.text;
		}
	};

	/**
	 * List of SGF markup properties.
	 */
	var markupProperties = ["CR", "LB", "MA", "SL", "SQ", "TR"];

	/**
	 * List of 'boolean' SGF properties. These properties don't have a value, but their presence has a meaning. 
	 * Other properties without a value won't do anything and may be discarded.
	 */

	var booleanProperties = ["DO", "IT", "KO"];

	/**
	 * Class representing one kifu node.
	 */

	var KNode = function () {
		babelHelpers.createClass(KNode, null, [{
			key: "fromJSGF",
			value: function fromJSGF(jsgf) {
				var root = new KNode();

				root.setSGFProperties(jsgf[0]);
				processJsgf(root, jsgf, 1);

				return root;
			}
		}, {
			key: "fromSGF",
			value: function fromSGF(sgf, ind) {
				var parser = new SGFParser(sgf);
				return KNode.fromJSGF(parser.parseCollection()[ind || 0]);
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

			// init some general proeprties
			this._init();
		}

		babelHelpers.createClass(KNode, [{
			key: "_init",


			/**
	   * Initialize KNode object. Called in constructor, it can be overriden to add some general properties.
	   */

			value: function _init() {
				// map of setup (readonly)
				this.setup = {};

				// map of markup (readonly)
				this.markup = {};

				// move
				this.move = null;

				// comment
				this.comment = "";

				// turn
				this.turn = null;
			}

			/// GENERAL TREE NODE MANIPULATION METHODS (subset of DOM API's Node)

			/**
	   * Insert a KNode as the last child node of this node.
	   * 
	   * @throws  {Error} when argument is invalid.
	   * @param   {KNode} node to append.
	   * @returns {Knode} this node.
	   */

		}, {
			key: "appendChild",
			value: function appendChild(node) {
				if (node == null || !(node instanceof KNode) || node == this) throw new Error("Invalid argument passed to `appendChild` method, KNode was expected.");

				if (node.parent) node.parent.removeChild(node);

				node.parent = this;

				this.children.push(node);
				return this;
			}

			// Clones a KNode and all of its contents (TODO)

		}, {
			key: "cloneNode",
			value: function cloneNode() {}

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
	   * @throws  {Error}   when argument is invalid.
	   * @param   {KNode}   newNode       node to be inserted
	   * @param   {(KNode)} referenceNode reference node, if omitted, new node will be inserted at the end. 
	   * @returns {KNode}   this node
	   */

		}, {
			key: "insertBefore",
			value: function insertBefore(newNode, referenceNode) {
				if (newNode == null || !(newNode instanceof KNode) || newNode == this) throw new Error("Invalid argument passed to `insertBefore` method, KNode was expected.");else if (referenceNode == null) return this.appendChild(newNode);

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
				this.children.splice(this.children.indexOf(child), 1);

				child.parent = null;

				return this;
			}

			/**
	   * Replaces one child Node of the current one with the second one given in parameter.
	   * 
	   * @throws  {Error} when argument is invalid
	   * @param   {KNode} newChild node to be inserted
	   * @param   {KNode} oldChild node to be replaced
	   * @returns {KNode} this node
	   */

		}, {
			key: "replaceChild",
			value: function replaceChild(newChild, oldChild) {
				if (newChild == null || !(newChild instanceof KNode) || newChild == this) throw new Error("Invalid argument passed to `replaceChild` method, KNode was expected.");

				this.insertBefore(newChild, oldChild);
				this.removeChild(oldChild);

				return this;
			}

			/// BASIC PROPERTY GETTER and SETTER

			/**
	   * Gets property by SGF property identificator. Returns false, true or single string or array of strings.
	   * 
	   * @param   {string}         				propIdent - SGF property idetificator
	   * @returns {false|true|string|string[]}	property value or values. 
	   */

		}, {
			key: "getProperty",
			value: function getProperty(propIdent) {
				if (this.SGFProperties[propIdent]) {
					if (this.SGFProperties[propIdent].length == 1) {
						if (this.SGFProperties[propIdent][0] == "" && booleanProperties.indexOf(propIdent) >= 0) return true;
						return this.SGFProperties[propIdent][0];
					} else if (this.SGFProperties[propIdent].length > 1) return this.SGFProperties[propIdent];
				}
				if (booleanProperties.indexOf(propIdent) >= 0) return false;else return "";
			}

			/**
	   * Sets property by SGF property identificator. Currently it isn't consistent with other API!!!! [TODO] revisit
	   * 
	   * @param   {string}          propIdent - SGF property idetificator
	   * @param   {string|string[]} value - property value or values
	   */

		}, {
			key: "setProperty",
			value: function setProperty(propIdent, value) {
				if (value == null || value === false || value == "") {
					// remove property
					delete this.SGFProperties[propIdent];
				} else if (value.constructor === Array) {
					// add multiple values
					this.SGFProperties[propIdent] = value.slice(0);
				} else if (value === true) {
					// add property without value
					this.SGFProperties[propIdent] = [""];
				} else {
					// add standard property
					this.SGFProperties[propIdent] = [value];
				}

				return false;
			}

			/// SGF RAW METHODS

			/**
	   * Sets one SGF property.
	   * 
	   * @param   {string}          propIdent SGF property idetificator
	   * @param   {string|string[]} propValue SGF property value
	   * @returns {KNode}           this KNode for chaining
	   */

		}, {
			key: "setSGFProperty",
			value: function setSGFProperty(propIdent, propValue) {
				if (typeof propValue == "string") {
					var parser = new SGFParser(propValue);
					propValue = parser.parsePropertyValues();
				}

				if (SGFreaders[propIdent]) {
					SGFreaders[propIdent](this, propValue);
				} else {
					if (propValue == null) delete this.SGFProperties[propIdent];else this.SGFProperties[propIdent] = propValue;
				}

				return this;
			}

			/**
	   * Gets one SGF property value.
	   * 
	   * @param   {string} propIdent SGF property identificator.
	   * @returns {string} SGF property values or empty string, if node doesn't containg this property.
	   */

		}, {
			key: "getSGFProperty",
			value: function getSGFProperty(propIdent) {
				if (this.SGFProperties[propIdent]) {
					return "[" + this.SGFProperties[propIdent].map(function (propValue) {
						return propValue.replace(/\]/g, "\\]");
					}).join("][") + "]";
				}
				return "";
			}
		}, {
			key: "setSGFProperties",
			value: function setSGFProperties(properties) {
				for (var ident in properties) {
					if (properties.hasOwnProperty(ident)) {
						this.setSGFProperty(ident, properties[ident]);
					}
				}
			}

			/**
	   * Sets properties of Kifu node based on the sgf string. 
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
				this._init();
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
						this.appendChild(KNode.fromJSGF(jsgf));
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

			/// KIFU SPECIFIC METHODS

			// Adds or changes setup (may be array)

		}, {
			key: "addSetup",
			value: function addSetup(setup) {
				if (setup.constructor != Array) setup = [setup];

				this.removeSetup(setup);

				for (var i = 0, property; i < setup.length; i++) {
					this.setup[setup[i].x + ":" + setup[i].y] = setup[i].c;

					if (setup[i].c == BLACK) property = "AB";else if (setup[i].c == WHITE) property = "AW";else property = "AE";

					if (!this.SGFProperties[property]) this.SGFProperties[property] = [];

					this.SGFProperties[property].push((SGFwriters[property] ? SGFwriters[property] : coo2str)(setup[i]));
				}

				return this;
			}

			// Removes setup

		}, {
			key: "removeSetup",
			value: function removeSetup(setup) {
				if (setup.constructor != Array) setup = [setup];

				for (var i = 0; i < setup.length; i++) {
					delete this.setup[setup[i].x + ":" + setup[i].y];

					removeSGFValue(this.SGFProperties, "AB", setup[i]);
					removeSGFValue(this.SGFProperties, "AW", setup[i]);
					removeSGFValue(this.SGFProperties, "AE", setup[i]);
				}
			}

			// Adds or changes markup

		}, {
			key: "addMarkup",
			value: function addMarkup(markup) {
				if (markup.constructor != Array) markup = [markup];

				this.removeMarkup(markup);

				for (var i = 0; i < markup.length; i++) {
					this.markup[markup[i].x + ":" + markup[i].y] = markup[i];

					if (!this.SGFProperties[markup[i].type]) this.SGFProperties[markup[i].type] = [];

					this.SGFProperties[markup[i].type].push((SGFwriters[markup[i].type] ? SGFwriters[markup[i].type] : coo2str)(markup[i]));
				}
			}

			// Removes markup

		}, {
			key: "removeMarkup",
			value: function removeMarkup(markup) {
				if (markup.constructor != Array) markup = [markup];

				for (var i = 0; i < markup.length; i++) {
					delete this.markup[markup[i].x + ":" + markup[i].y];

					for (var j = 0; j < markupProperties.length; j++) {
						removeSGFValue(this.SGFProperties, markupProperties[j], markup[i]);
					}
				}
			}
		}, {
			key: "setMove",
			value: function setMove(move) {
				this.move = move;

				if (!move || !move.c) {
					delete this.SGFProperties.B;
					delete this.SGFProperties.W;
				} else if (move.c == WHITE) {
					delete this.SGFProperties.B;
					this.SGFProperties.W = [coo2str(move)];
				} else {
					delete this.SGFProperties.W;
					this.SGFProperties.B = [coo2str(move)];
				}
			}
		}, {
			key: "setTurn",
			value: function setTurn(turn) {
				this.turn = turn;

				if (turn) {
					if (turn == BLACK) {
						this.SGFProperties.PL = ["B"];
					} else {
						this.SGFProperties.PL = ["W"];
					}
				} else {
					delete this.SGFProperties.PL;
				}
			}

			// Returns anticipated turn (player color) for next move

		}, {
			key: "getTurn",
			value: function getTurn() {
				if (this.turn) return this.turn;else if (this.move) return -this.move.c;else if (this.parent) return this.parent.getTurn();else return BLACK;
			}
		}, {
			key: "setComment",
			value: function setComment(comment) {
				this.comment = comment;
				if (comment) {
					this.SGFProperties.C = [comment];
				} else {
					delete this.SGFProperties.C;
				}
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
				this.setFromSGF(new SGFParser(sgf));
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

	// theme helper
	var theme_variable = function theme_variable(key, board) {
		return typeof board.theme[key] == "function" ? board.theme[key](board) : board.theme[key];
	};

	/** 
	 * Object containing default graphical properties of a board.
	 * A value of all properties can be even static value or function, returning final value.
	 * Theme object doesn't set board and stone textures - they are set separately.
	 */

	var themes = {
		old: {
			shadowColor: "rgba(32,32,32,0.5)",
			shadowTransparentColor: "rgba(32,32,32,0)",
			shadowBlur: 0,
			shadowSize: function shadowSize(board) {
				return board.shadowSize;
			},
			markupBlackColor: "rgba(255,255,255,0.8)",
			markupWhiteColor: "rgba(0,0,0,0.8)",
			markupNoneColor: "rgba(0,0,0,0.8)",
			markupLinesWidth: function markupLinesWidth(board) {
				return board.autoLineWidth ? board.stoneRadius / 7 : board.lineWidth;
			},
			gridLinesWidth: 1,
			gridLinesColor: function gridLinesColor(board) {
				return "rgba(0,0,0," + Math.min(1, board.stoneRadius / 15) + ")";
			},
			starColor: "#000",
			starSize: function starSize(board) {
				return board.starSize * (board.width / 300 + 1);
			},
			stoneSize: function stoneSize(board) {
				return board.stoneSize * Math.min(board.fieldWidth, board.fieldHeight) / 2;
			},
			coordinatesColor: "rgba(0,0,0,0.7)",
			font: function font(board) {
				return board.font;
			},
			linesShift: 0.5
		},
		default: {
			shadowColor: "rgba(62,32,32,0.5)",
			shadowTransparentColor: "rgba(62,32,32,0)",
			shadowBlur: function shadowBlur(board) {
				return board.stoneRadius * 0.1;
			},
			shadowSize: 1,
			markupBlackColor: "rgba(255,255,255,0.9)",
			markupWhiteColor: "rgba(0,0,0,0.7)",
			markupNoneColor: "rgba(0,0,0,0.7)",
			markupLinesWidth: function markupLinesWidth(board) {
				return board.stoneRadius / 8;
			},
			gridLinesWidth: function gridLinesWidth(board) {
				return board.stoneRadius / 15;
			},
			gridLinesColor: "#654525",
			starColor: "#531",
			starSize: function starSize(board) {
				return board.stoneRadius / 8 + 1;
			},
			stoneSize: function stoneSize(board) {
				return Math.min(board.fieldWidth, board.fieldHeight) / 2;
			},
			coordinatesColor: "#531",
			variationColor: "rgba(0,32,128,0.8)",
			font: "calibri",
			linesShift: 0.25
		}
	};

	// Drawing related functions and objects

	var default_field_clear = function default_field_clear(args, board) {
		var xr = board.getX(args.x),
		    yr = board.getY(args.y),
		    sr = board.stoneRadius;
		this.clearRect(xr - 2 * sr - board.ls, yr - 2 * sr - board.ls, 4 * sr, 4 * sr);
	};

	var shadowHandler = {
		draw: function draw(args, board) {
			var xr = board.getX(args.x),
			    yr = board.getY(args.y),
			    sr = board.stoneRadius;

			this.beginPath();

			var blur = theme_variable("shadowBlur", board);
			var radius = Math.max(0, sr - 0.5);
			var gradient = this.createRadialGradient(xr - board.ls, yr - board.ls, radius - 1 - blur, xr - board.ls, yr - board.ls, radius + blur);

			gradient.addColorStop(0, theme_variable("shadowColor", board));
			gradient.addColorStop(1, theme_variable("shadowTransparentColor", board));

			this.fillStyle = gradient;

			this.arc(xr - board.ls, yr - board.ls, radius + blur, 0, 2 * Math.PI, true);
			this.fill();
		},
		clear: function clear(args, board) {
			var xr = board.getX(args.x),
			    yr = board.getY(args.y),
			    sr = board.stoneRadius;
			this.clearRect(xr - 1.1 * sr - board.ls, yr - 1.1 * sr - board.ls, 2.2 * sr, 2.2 * sr);
		}
	};

	var get_markup_color = function get_markup_color(board, x, y) {
		if (board.obj_arr[x][y][0].c == BLACK) return theme_variable("markupBlackColor", board);else if (board.obj_arr[x][y][0].c == WHITE) return theme_variable("markupWhiteColor", board);
		return theme_variable("markupNoneColor", board);
	};

	var is_here_stone = function is_here_stone(board, x, y) {
		return board.obj_arr[x][y][0] && board.obj_arr[x][y][0].c == WHITE || board.obj_arr[x][y][0].c == BLACK;
	};

	var redraw_layer = function redraw_layer(board, layer) {
		var handler;

		board[layer].clear();
		board[layer].draw(board);

		for (var x = 0; x < board.size; x++) {
			for (var y = 0; y < board.size; y++) {
				for (var z = 0; z < board.obj_arr[x][y].length; z++) {
					var obj = board.obj_arr[x][y][z];
					if (!obj.type) handler = board.stoneHandler;else if (typeof obj.type == "string") handler = drawHandlers[obj.type];else handler = obj.type;

					if (handler[layer]) handler[layer].draw.call(board[layer].getContext(obj), obj, board);
				}
			}
		}

		for (var i = 0; i < board.obj_list.length; i++) {
			var obj = board.obj_list[i];
			var handler = obj.handler;

			if (handler[layer]) handler[layer].draw.call(board[layer].getContext(obj.args), obj.args, board);
		}
	};

	// shell stone helping functions

	var shell_seed;

	var draw_shell_line = function draw_shell_line(ctx, x, y, radius, start_angle, end_angle, factor, thickness) {
		ctx.strokeStyle = "rgba(64,64,64,0.2)";

		ctx.lineWidth = radius / 30 * thickness;
		ctx.beginPath();

		radius -= Math.max(1, ctx.lineWidth);

		var x1 = x + radius * Math.cos(start_angle * Math.PI);
		var y1 = y + radius * Math.sin(start_angle * Math.PI);
		var x2 = x + radius * Math.cos(end_angle * Math.PI);
		var y2 = y + radius * Math.sin(end_angle * Math.PI);

		var m, angle, x, diff_x, diff_y;
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
		diff_x = Math.sin(angle) * c;
		diff_y = Math.cos(angle) * c;

		var bx1 = x1 + diff_x;
		var by1 = y1 - diff_y;

		var bx2 = x2 + diff_x;
		var by2 = y2 - diff_y;

		ctx.moveTo(x1, y1);
		ctx.bezierCurveTo(bx1, by1, bx2, by2, x2, y2);
		ctx.stroke();
	};

	var draw_shell = function draw_shell(arg) {
		var from_angle = arg.angle;
		var to_angle = arg.angle;

		for (var i = 0; i < arg.lines.length; i++) {
			from_angle += arg.lines[i];
			to_angle -= arg.lines[i];
			draw_shell_line(arg.ctx, arg.x, arg.y, arg.radius, from_angle, to_angle, arg.factor, arg.thickness);
		}
	};

	// drawing handlers

	var drawHandlers = {
		// handler for normal stones
		NORMAL: {
			// draw handler for stone layer
			stone: {
				// drawing function - args object contain info about drawing object, board is main board object
				// this function is called from canvas2D context
				draw: function draw(args, board) {
					var xr = board.getX(args.x),
					    yr = board.getY(args.y),
					    sr = board.stoneRadius,
					    radgrad;

					// set stone texture
					if (args.c == WHITE) {
						radgrad = this.createRadialGradient(xr - 2 * sr / 5, yr - 2 * sr / 5, sr / 3, xr - sr / 5, yr - sr / 5, 5 * sr / 5);
						radgrad.addColorStop(0, '#fff');
						radgrad.addColorStop(1, '#aaa');
					} else {
						radgrad = this.createRadialGradient(xr - 2 * sr / 5, yr - 2 * sr / 5, 1, xr - sr / 5, yr - sr / 5, 4 * sr / 5);
						radgrad.addColorStop(0, '#666');
						radgrad.addColorStop(1, '#000');
					}

					// paint stone
					this.beginPath();
					this.fillStyle = radgrad;
					this.arc(xr - board.ls, yr - board.ls, Math.max(0, sr - 0.5), 0, 2 * Math.PI, true);
					this.fill();
				}
			},
			// adding shadow handler
			shadow: shadowHandler
		},

		PAINTED: {
			stone: {
				draw: function draw(args, board) {
					var xr = board.getX(args.x),
					    yr = board.getY(args.y),
					    sr = board.stoneRadius,
					    radgrad;

					if (args.c == WHITE) {
						radgrad = this.createRadialGradient(xr - 2 * sr / 5, yr - 2 * sr / 5, 2, xr - sr / 5, yr - sr / 5, 4 * sr / 5);
						radgrad.addColorStop(0, '#fff');
						radgrad.addColorStop(1, '#ddd');
					} else {
						radgrad = this.createRadialGradient(xr - 2 * sr / 5, yr - 2 * sr / 5, 1, xr - sr / 5, yr - sr / 5, 4 * sr / 5);
						radgrad.addColorStop(0, '#111');
						radgrad.addColorStop(1, '#000');
					}

					this.beginPath();
					this.fillStyle = radgrad;
					this.arc(xr - board.ls, yr - board.ls, Math.max(0, sr - 0.5), 0, 2 * Math.PI, true);
					this.fill();

					this.beginPath();
					this.lineWidth = sr / 6;

					if (args.c == WHITE) {
						this.strokeStyle = '#999';
						this.arc(xr + sr / 8, yr + sr / 8, sr / 2, 0, Math.PI / 2, false);
					} else {
						this.strokeStyle = '#ccc';
						this.arc(xr - sr / 8, yr - sr / 8, sr / 2, Math.PI, 1.5 * Math.PI);
					}

					this.stroke();
				}
			},
			shadow: shadowHandler
		},

		GLOW: {
			stone: {
				draw: function draw(args, board) {
					var xr = board.getX(args.x),
					    yr = board.getY(args.y),
					    sr = board.stoneRadius;

					var radgrad;
					if (args.c == WHITE) {
						radgrad = this.createRadialGradient(xr - 2 * sr / 5, yr - 2 * sr / 5, sr / 3, xr - sr / 5, yr - sr / 5, 8 * sr / 5);
						radgrad.addColorStop(0, '#fff');
						radgrad.addColorStop(1, '#666');
					} else {
						radgrad = this.createRadialGradient(xr - 2 * sr / 5, yr - 2 * sr / 5, 1, xr - sr / 5, yr - sr / 5, 3 * sr / 5);
						radgrad.addColorStop(0, '#555');
						radgrad.addColorStop(1, '#000');
					}

					this.beginPath();
					this.fillStyle = radgrad;
					this.arc(xr - board.ls, yr - board.ls, Math.max(0, sr - 0.5), 0, 2 * Math.PI, true);
					this.fill();
				}
			},
			shadow: shadowHandler
		},

		SHELL: {
			stone: {
				draw: function draw(args, board) {
					var xr,
					    yr,
					    sr = board.stoneRadius;

					shell_seed = shell_seed || Math.ceil(Math.random() * 9999999);

					xr = board.getX(args.x);
					yr = board.getY(args.y);

					var radgrad;

					if (args.c == WHITE) {
						radgrad = "#aaa";
					} else {
						radgrad = "#000";
					}

					this.beginPath();
					this.fillStyle = radgrad;
					this.arc(xr - board.ls, yr - board.ls, Math.max(0, sr - 0.5), 0, 2 * Math.PI, true);
					this.fill();

					// do shell magic here
					if (args.c == WHITE) {
						// do shell magic here
						var type = shell_seed % (3 + args.x * board.size + args.y) % 3;
						var z = board.size * board.size + args.x * board.size + args.y;
						var angle = 2 / z * (shell_seed % z);

						if (type == 0) {
							draw_shell({
								ctx: this,
								x: xr,
								y: yr,
								radius: sr,
								angle: angle,
								lines: [0.10, 0.12, 0.11, 0.10, 0.09, 0.09, 0.09, 0.09],
								factor: 0.25,
								thickness: 1.75
							});
						} else if (type == 1) {
							draw_shell({
								ctx: this,
								x: xr,
								y: yr,
								radius: sr,
								angle: angle,
								lines: [0.10, 0.09, 0.08, 0.07, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
								factor: 0.2,
								thickness: 1.5
							});
						} else {
							draw_shell({
								ctx: this,
								x: xr,
								y: yr,
								radius: sr,
								angle: angle,
								lines: [0.12, 0.14, 0.13, 0.12, 0.12, 0.12],
								factor: 0.3,
								thickness: 2
							});
						}
						radgrad = this.createRadialGradient(xr - 2 * sr / 5, yr - 2 * sr / 5, sr / 3, xr - sr / 5, yr - sr / 5, 5 * sr / 5);
						radgrad.addColorStop(0, 'rgba(255,255,255,0.9)');
						radgrad.addColorStop(1, 'rgba(255,255,255,0)');

						// add radial gradient //
						this.beginPath();
						this.fillStyle = radgrad;
						this.arc(xr - board.ls, yr - board.ls, Math.max(0, sr - 0.5), 0, 2 * Math.PI, true);
						this.fill();
					} else {
						radgrad = this.createRadialGradient(xr + 0.4 * sr, yr + 0.4 * sr, 0, xr + 0.5 * sr, yr + 0.5 * sr, sr);
						radgrad.addColorStop(0, 'rgba(32,32,32,1)');
						radgrad.addColorStop(1, 'rgba(0,0,0,0)');

						this.beginPath();
						this.fillStyle = radgrad;
						this.arc(xr - board.ls, yr - board.ls, Math.max(0, sr - 0.5), 0, 2 * Math.PI, true);
						this.fill();

						radgrad = this.createRadialGradient(xr - 0.4 * sr, yr - 0.4 * sr, 1, xr - 0.5 * sr, yr - 0.5 * sr, 1.5 * sr);
						radgrad.addColorStop(0, 'rgba(64,64,64,1)');
						radgrad.addColorStop(1, 'rgba(0,0,0,0)');

						this.beginPath();
						this.fillStyle = radgrad;
						this.arc(xr - board.ls, yr - board.ls, Math.max(0, sr - 0.5), 0, 2 * Math.PI, true);
						this.fill();
					}
				}
			},
			shadow: shadowHandler
		},

		MONO: {
			stone: {
				draw: function draw(args, board) {
					var xr = board.getX(args.x),
					    yr = board.getY(args.y),
					    sr = board.stoneRadius,
					    lw = theme_variable("markupLinesWidth", board) || 1;

					if (args.c == WHITE) this.fillStyle = "white";else this.fillStyle = "black";

					this.beginPath();
					this.arc(xr, yr, Math.max(0, sr - lw), 0, 2 * Math.PI, true);
					this.fill();

					this.lineWidth = lw;
					this.strokeStyle = "black";
					this.stroke();
				}
			}
		},

		CR: {
			stone: {
				draw: function draw(args, board) {
					var xr = board.getX(args.x),
					    yr = board.getY(args.y),
					    sr = board.stoneRadius;

					this.strokeStyle = args.c || get_markup_color(board, args.x, args.y);
					this.lineWidth = args.lineWidth || theme_variable("markupLinesWidth", board) || 1;
					this.beginPath();
					this.arc(xr - board.ls, yr - board.ls, sr / 2, 0, 2 * Math.PI, true);
					this.stroke();
				}
			}
		},

		// Label drawing handler
		LB: {
			stone: {
				draw: function draw(args, board) {
					var xr = board.getX(args.x),
					    yr = board.getY(args.y),
					    sr = board.stoneRadius,
					    font = args.font || theme_variable("font", board) || "";

					this.fillStyle = args.c || get_markup_color(board, args.x, args.y);

					if (args.text.length == 1) this.font = Math.round(sr * 1.5) + "px " + font;else if (args.text.length == 2) this.font = Math.round(sr * 1.2) + "px " + font;else this.font = Math.round(sr) + "px " + font;

					this.beginPath();
					this.textBaseline = "middle";
					this.textAlign = "center";
					this.fillText(args.text, xr, yr, 2 * sr);
				}
			},

			// modifies grid layer too
			grid: {
				draw: function draw(args, board) {
					if (!is_here_stone(board, args.x, args.y) && !args._nodraw) {
						var xr = board.getX(args.x),
						    yr = board.getY(args.y),
						    sr = board.stoneRadius;
						this.clearRect(xr - sr, yr - sr, 2 * sr, 2 * sr);
					}
				},
				clear: function clear(args, board) {
					if (!is_here_stone(board, args.x, args.y)) {
						args._nodraw = true;
						redraw_layer(board, "grid");
						delete args._nodraw;
					}
				}
			}
		},

		SQ: {
			stone: {
				draw: function draw(args, board) {
					var xr = board.getX(args.x),
					    yr = board.getY(args.y),
					    sr = Math.round(board.stoneRadius);

					this.strokeStyle = args.c || get_markup_color(board, args.x, args.y);
					this.lineWidth = args.lineWidth || theme_variable("markupLinesWidth", board) || 1;
					this.beginPath();
					this.rect(Math.round(xr - sr / 2) - board.ls, Math.round(yr - sr / 2) - board.ls, sr, sr);
					this.stroke();
				}
			}
		},

		TR: {
			stone: {
				draw: function draw(args, board) {
					var xr = board.getX(args.x),
					    yr = board.getY(args.y),
					    sr = board.stoneRadius;

					this.strokeStyle = args.c || get_markup_color(board, args.x, args.y);
					this.lineWidth = args.lineWidth || theme_variable("markupLinesWidth", board) || 1;
					this.beginPath();
					this.moveTo(xr - board.ls, yr - board.ls - Math.round(sr / 2));
					this.lineTo(Math.round(xr - sr / 2) - board.ls, Math.round(yr + sr / 3) + board.ls);
					this.lineTo(Math.round(xr + sr / 2) + board.ls, Math.round(yr + sr / 3) + board.ls);
					this.closePath();
					this.stroke();
				}
			}
		},

		MA: {
			stone: {
				draw: function draw(args, board) {
					var xr = board.getX(args.x),
					    yr = board.getY(args.y),
					    sr = board.stoneRadius;

					this.strokeStyle = args.c || get_markup_color(board, args.x, args.y);
					this.lineCap = "round";
					this.lineWidth = (args.lineWidth || theme_variable("markupLinesWidth", board) || 1) * 2 - 1;
					this.beginPath();
					this.moveTo(Math.round(xr - sr / 2), Math.round(yr - sr / 2));
					this.lineTo(Math.round(xr + sr / 2), Math.round(yr + sr / 2));
					this.moveTo(Math.round(xr + sr / 2) - 1, Math.round(yr - sr / 2));
					this.lineTo(Math.round(xr - sr / 2) - 1, Math.round(yr + sr / 2));
					this.stroke();
					this.lineCap = "butt";
				}
			}
		},

		SL: {
			stone: {
				draw: function draw(args, board) {
					var xr = board.getX(args.x),
					    yr = board.getY(args.y),
					    sr = board.stoneRadius;

					this.fillStyle = args.c || get_markup_color(board, args.x, args.y);
					this.beginPath();
					this.rect(xr - sr / 2, yr - sr / 2, sr, sr);
					this.fill();
				}
			}
		},

		SM: {
			stone: {
				draw: function draw(args, board) {
					var xr = board.getX(args.x),
					    yr = board.getY(args.y),
					    sr = board.stoneRadius;

					this.strokeStyle = args.c || get_markup_color(board, args.x, args.y);
					this.lineWidth = (args.lineWidth || theme_variable("markupLinesWidth", board) || 1) * 2;
					this.beginPath();
					this.arc(xr - sr / 3, yr - sr / 3, sr / 6, 0, 2 * Math.PI, true);
					this.stroke();
					this.beginPath();
					this.arc(xr + sr / 3, yr - sr / 3, sr / 6, 0, 2 * Math.PI, true);
					this.stroke();
					this.beginPath();
					this.moveTo(xr - sr / 1.5, yr);
					this.bezierCurveTo(xr - sr / 1.5, yr + sr / 2, xr + sr / 1.5, yr + sr / 2, xr + sr / 1.5, yr);
					this.stroke();
				}
			}
		},

		outline: {
			stone: {
				draw: function draw(args, board) {
					if (args.alpha) this.globalAlpha = args.alpha;else this.globalAlpha = 0.3;
					if (args.stoneStyle) drawHandlers[args.stoneStyle].stone.draw.call(this, args, board);else board.stoneHandler.stone.draw.call(this, args, board);
					this.globalAlpha = 1;
				}
			}
		},

		mini: {
			stone: {
				draw: function draw(args, board) {
					board.stoneRadius = board.stoneRadius / 2;
					if (args.stoneStyle) drawHandlers[args.stoneStyle].stone.draw.call(this, args, board);else board.stoneHandler.stone.draw.call(this, args, board);
					board.stoneRadius = board.stoneRadius * 2;
				}
			}
		}
	};

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
			if (this.pixelRatio > 1) {
				this.context.scale(this.pixelRatio, this.pixelRatio);
			}
		}

		babelHelpers.createClass(CanvasLayer, [{
			key: "setDimensions",
			value: function setDimensions(width, height) {
				this.element.width = width;
				this.element.style.width = width / this.pixelRatio + 'px';
				this.element.height = height;
				this.element.style.height = height / this.pixelRatio + 'px';
			}
		}, {
			key: "appendTo",
			value: function appendTo(element, weight) {
				this.element.style.position = 'absolute';
				this.element.style.zIndex = weight;
				element.appendChild(this.element);
			}
		}, {
			key: "removeFrom",
			value: function removeFrom(element) {
				element.removeChild(this.element);
			}
		}, {
			key: "getContext",
			value: function getContext() {
				return this.context;
			}
		}, {
			key: "draw",
			value: function draw(board) {
				// abstract method to be implemented
			}
		}, {
			key: "clear",
			value: function clear() {
				this.context.clearRect(0, 0, this.element.width, this.element.height);
			}
		}]);
		return CanvasLayer;
	}();

	/**
	 * @class
	 * @extends WGo.CanvasBoard.CanvasLayer
	 * Layer which renders board grid.
	 */

	var GridLayer = function (_CanvasLayer) {
		babelHelpers.inherits(GridLayer, _CanvasLayer);

		function GridLayer() {
			babelHelpers.classCallCheck(this, GridLayer);
			return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(GridLayer).call(this));
		}

		babelHelpers.createClass(GridLayer, [{
			key: "draw",
			value: function draw(board) {
				// draw grid
				var tmp;

				this.context.beginPath();
				this.context.lineWidth = theme_variable("gridLinesWidth", board);
				this.context.strokeStyle = theme_variable("gridLinesColor", board);

				var tx = Math.round(board.left),
				    ty = Math.round(board.top),
				    bw = Math.round(board.fieldWidth * (board.size - 1)),
				    bh = Math.round(board.fieldHeight * (board.size - 1));

				this.context.strokeRect(tx - board.ls, ty - board.ls, bw, bh);

				for (var i = 1; i < board.size - 1; i++) {
					tmp = Math.round(board.getX(i)) - board.ls;
					this.context.moveTo(tmp, ty);
					this.context.lineTo(tmp, ty + bh);

					tmp = Math.round(board.getY(i)) - board.ls;
					this.context.moveTo(tx, tmp);
					this.context.lineTo(tx + bw, tmp);
				}

				this.context.stroke();

				// draw stars
				this.context.fillStyle = theme_variable("starColor", board);

				if (board.starPoints[board.size]) {
					for (var key in board.starPoints[board.size]) {
						this.context.beginPath();
						this.context.arc(board.getX(board.starPoints[board.size][key].x) - board.ls, board.getY(board.starPoints[board.size][key].y) - board.ls, theme_variable("starSize", board), 0, 2 * Math.PI, true);
						this.context.fill();
					}
				}
			}
		}]);
		return GridLayer;
	}(CanvasLayer);

	/**
	 * @class
	 * @extends WGo.CanvasBoard.CanvasLayer
	 * Layer that is composed from more canvases. The proper canvas is selected according to drawn object.
	 * In default there are 4 canvases and they are used for board objects like stones. This allows overlapping of objects.
	 */
	var MultipleCanvasLayer = function (_CanvasLayer2) {
		babelHelpers.inherits(MultipleCanvasLayer, _CanvasLayer2);

		function MultipleCanvasLayer() {
			var layers = arguments.length <= 0 || arguments[0] === undefined ? 4 : arguments[0];
			babelHelpers.classCallCheck(this, MultipleCanvasLayer);

			var _this3 = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(MultipleCanvasLayer).call(this));

			_this3.init(layers);
			return _this3;
		}

		babelHelpers.createClass(MultipleCanvasLayer, [{
			key: "init",
			value: function init(n) {
				var tmp, tmpContext;

				this.layers = n;

				this.elements = [];
				this.contexts = [];

				// Adjust pixel ratio for HDPI screens (e.g. Retina)
				this.pixelRatio = window.devicePixelRatio || 1;

				for (var i = 0; i < n; i++) {
					tmp = document.createElement('canvas');
					tmpContext = tmp.getContext('2d');

					if (this.pixelRatio > 1) {
						tmpContext.scale(this.pixelRatio, this.pixelRatio);
					}

					this.elements.push(tmp);
					this.contexts.push(tmpContext);
				}
			}
		}, {
			key: "appendTo",
			value: function appendTo(element, weight) {
				for (var i = 0; i < this.layers; i++) {
					this.elements[i].style.position = 'absolute';
					this.elements[i].style.zIndex = weight;
					element.appendChild(this.elements[i]);
				}
			}
		}, {
			key: "removeFrom",
			value: function removeFrom(element) {
				for (var i = 0; i < this.layers; i++) {
					element.removeChild(this.elements[i]);
				}
			}
		}, {
			key: "getContext",
			value: function getContext(args) {
				if (args.x % 2) {
					return args.y % 2 ? this.contexts[0] : this.contexts[1];
				} else {
					return args.y % 2 ? this.contexts[2] : this.contexts[3];
				}
			}
		}, {
			key: "clear",
			value: function clear(element, weight) {
				for (var i = 0; i < this.layers; i++) {
					this.contexts[i].clearRect(0, 0, this.elements[i].width, this.elements[i].height);
				}
			}
		}, {
			key: "setDimensions",
			value: function setDimensions(width, height) {
				for (var i = 0; i < this.layers; i++) {
					this.elements[i].width = width;
					this.elements[i].style.width = width / this.pixelRatio + 'px';
					this.elements[i].height = height;
					this.elements[i].style.height = height / this.pixelRatio + 'px';
				}
			}
		}]);
		return MultipleCanvasLayer;
	}(CanvasLayer);

	/**
	 * @class
	 * @extends WGo.CanvasBoard.MultipleCanvasLayer
	 * Layer for shadows.
	 */

	var ShadowLayer = function (_MultipleCanvasLayer) {
		babelHelpers.inherits(ShadowLayer, _MultipleCanvasLayer);

		function ShadowLayer(board, shadowSize, shadowBlur) {
			babelHelpers.classCallCheck(this, ShadowLayer);

			var _this4 = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ShadowLayer).call(this, 2));

			_this4.shadowSize = shadowSize === undefined ? 1 : shadowSize;
			_this4.board = board;
			return _this4;
		}

		babelHelpers.createClass(ShadowLayer, [{
			key: "getContext",
			value: function getContext(args) {
				return args.x % 2 && args.y % 2 || !(args.x % 2) && !(args.y % 2) ? this.contexts[0] : this.contexts[1];
			}
		}, {
			key: "setDimensions",
			value: function setDimensions(width, height) {
				babelHelpers.get(Object.getPrototypeOf(ShadowLayer.prototype), "setDimensions", this).call(this, width, height);

				for (var i = 0; i < this.layers; i++) {
					this.contexts[i].setTransform(1, 0, 0, 1, Math.round(this.shadowSize * this.board.stoneRadius / 7), Math.round(this.shadowSize * this.board.stoneRadius / 7));
				}
			}
		}]);
		return ShadowLayer;
	}(MultipleCanvasLayer);

	// Private methods of WGo.CanvasBoard

	var calcLeftMargin = function calcLeftMargin() {
		return 3 * this.width / (4 * (this.bx + 1 - this.tx) + 2) - this.fieldWidth * this.tx;
	};

	var calcTopMargin = function calcTopMargin() {
		return 3 * this.height / (4 * (this.by + 1 - this.ty) + 2) - this.fieldHeight * this.ty;
	};

	var calcFieldWidth = function calcFieldWidth() {
		return 4 * this.width / (4 * (this.bx + 1 - this.tx) + 2);
	};

	var calcFieldHeight = function calcFieldHeight() {
		return 4 * this.height / (4 * (this.by + 1 - this.ty) + 2);
	};

	var clearField = function clearField(x, y) {
		var handler;
		for (var z = 0; z < this.obj_arr[x][y].length; z++) {
			var obj = this.obj_arr[x][y][z];
			if (!obj.type) handler = this.stoneHandler;else if (typeof obj.type == "string") handler = drawHandlers[obj.type];else handler = obj.type;

			for (var layer in handler) {
				if (handler[layer].clear) handler[layer].clear.call(this[layer].getContext(obj), obj, this);else default_field_clear.call(this[layer].getContext(obj), obj, this);
			}
		}
	};

	var drawField = function drawField(x, y) {
		var handler;
		for (var z = 0; z < this.obj_arr[x][y].length; z++) {
			var obj = this.obj_arr[x][y][z];
			if (!obj.type) handler = this.stoneHandler;else if (typeof obj.type == "string") handler = drawHandlers[obj.type];else handler = obj.type;

			for (var layer in handler) {
				handler[layer].draw.call(this[layer].getContext(obj), obj, this);
			}
		}
	};

	var getMousePos = function getMousePos(e) {
		// new hopefully better translation of coordinates

		var x, y;

		x = e.layerX * this.pixelRatio;
		x -= this.left;
		x /= this.fieldWidth;
		x = Math.round(x);

		y = e.layerY * this.pixelRatio;
		y -= this.top;
		y /= this.fieldHeight;
		y = Math.round(y);

		return {
			x: x >= this.size ? -1 : x,
			y: y >= this.size ? -1 : y
		};
	};

	var updateDim = function updateDim() {
		this.element.style.width = this.width / this.pixelRatio + "px";
		this.element.style.height = this.height / this.pixelRatio + "px";

		this.stoneRadius = theme_variable("stoneSize", this);
		//if(this.autoLineWidth) this.lineWidth = this.stoneRadius/7; //< 15 ? 1 : 3;
		this.ls = theme_variable("linesShift", this);

		for (var i = 0; i < this.layers.length; i++) {
			this.layers[i].setDimensions(this.width, this.height);
		}
	};

	var CanvasBoard = function () {
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
			babelHelpers.classCallCheck(this, CanvasBoard);

			var config = config || {};

			// set user configuration
			for (var key in config) {
				this[key] = config[key];
			} // add default configuration
			for (var key in defaultConfig) {
				if (this[key] === undefined) this[key] = defaultConfig[key];
			} // add default theme variables
			for (var key in themes.default) {
				if (this.theme[key] === undefined) this.theme[key] = themes.default[key];
			} // set section if set
			this.tx = this.section.left;
			this.ty = this.section.top;
			this.bx = this.size - 1 - this.section.right;
			this.by = this.size - 1 - this.section.bottom;

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
				this.obj_arr = [];
				for (var i = 0; i < this.size; i++) {
					this.obj_arr[i] = [];
					for (var j = 0; j < this.size; j++) {
						this.obj_arr[i][j] = [];
					}
				}

				// other objects, stored in list
				this.obj_list = [];

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
				this.shadow = new ShadowLayer(this, theme_variable("shadowSize", this));
				this.stone = new MultipleCanvasLayer();

				this.addLayer(this.grid, 100);
				this.addLayer(this.shadow, 200);
				this.addLayer(this.stone, 300);
			}
		}, {
			key: "setWidth",
			value: function setWidth(width) {
				this.width = width;
				this.width *= this.pixelRatio;
				this.fieldHeight = this.fieldWidth = calcFieldWidth.call(this);
				this.left = calcLeftMargin.call(this);

				this.height = (this.by - this.ty + 1.5) * this.fieldHeight;
				this.top = calcTopMargin.call(this);

				updateDim.call(this);
				this.redraw();
			}
		}, {
			key: "setHeight",
			value: function setHeight(height) {
				this.height = height;
				this.height *= this.pixelRatio;
				this.fieldWidth = this.fieldHeight = calcFieldHeight.call(this);
				this.top = calcTopMargin.call(this);

				this.width = (this.bx - this.tx + 1.5) * this.fieldWidth;
				this.left = calcLeftMargin.call(this);

				updateDim.call(this);
				this.redraw();
			}
		}, {
			key: "setDimensions",
			value: function setDimensions(width, height) {
				this.width = width || parseInt(this.element.style.width, 10);
				this.width *= this.pixelRatio;
				this.height = height || parseInt(this.element.style.height, 10);
				this.height *= this.pixelRatio;

				this.fieldWidth = calcFieldWidth.call(this);
				this.fieldHeight = calcFieldHeight.call(this);
				this.left = calcLeftMargin.call(this);
				this.top = calcTopMargin.call(this);

				updateDim.call(this);
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

				this.tx = this.section.left;
				this.ty = this.section.top;
				this.bx = this.size - 1 - this.section.right;
				this.by = this.size - 1 - this.section.bottom;

				this.setDimensions();
			}
		}, {
			key: "setSize",
			value: function setSize(size) {
				var size = size || 19;

				if (size != this.size) {
					this.size = size;

					this.obj_arr = [];
					for (var i = 0; i < this.size; i++) {
						this.obj_arr[i] = [];
						for (var j = 0; j < this.size; j++) {
							this.obj_arr[i][j] = [];
						}
					}

					this.bx = this.size - 1 - this.section.right;
					this.by = this.size - 1 - this.section.bottom;
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
						this.layers[i].draw(this);
					}

					// redraw field objects
					for (var i = 0; i < this.size; i++) {
						for (var j = 0; j < this.size; j++) {
							drawField.call(this, i, j);
						}
					}

					// redraw custom objects
					for (var i = 0; i < this.obj_list.length; i++) {
						var obj = this.obj_list[i];
						var handler = obj.handler;

						for (var layer in handler) {
							handler[layer].draw.call(this[layer].getContext(obj.args), obj.args, this);
						}
					}
				} catch (err) {
					// If the board is too small some canvas painting function can throw an exception, but we don't want to break our app
					console.log("WGo board failed to render. Error: " + err.message);
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
				layer.setDimensions(this.width, this.height);
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
			value: function update(changes) {
				var i;
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
			key: "addObject",
			value: function addObject(obj) {
				// handling multiple objects
				if (obj.constructor == Array) {
					for (var i = 0; i < obj.length; i++) {
						this.addObject(obj[i]);
					}return;
				}

				try {
					// clear all objects on object's coordinates
					clearField.call(this, obj.x, obj.y);

					// if object of this type is on the board, replace it
					var layers = this.obj_arr[obj.x][obj.y];
					for (var z = 0; z < layers.length; z++) {
						if (layers[z].type == obj.type) {
							layers[z] = obj;
							drawField.call(this, obj.x, obj.y);
							return;
						}
					}

					// if object is a stone, add it at the beginning, otherwise at the end
					if (!obj.type) layers.unshift(obj);else layers.push(obj);

					// draw all objects
					drawField.call(this, obj.x, obj.y);
				} catch (err) {
					// If the board is too small some canvas painting function can throw an exception, but we don't want to break our app
					console.log("WGo board failed to render. Error: " + err.message);
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

				try {
					var i;
					for (var j = 0; j < this.obj_arr[obj.x][obj.y].length; j++) {
						if (this.obj_arr[obj.x][obj.y][j].type == obj.type) {
							i = j;
							break;
						}
					}
					if (i === undefined) return;

					// clear all objects on object's coordinates
					clearField.call(this, obj.x, obj.y);

					this.obj_arr[obj.x][obj.y].splice(i, 1);

					drawField.call(this, obj.x, obj.y);
				} catch (err) {
					// If the board is too small some canvas painting function can throw an exception, but we don't want to break our app
					console.log("WGo board failed to render. Error: " + err.message);
				}
			}
		}, {
			key: "removeObjectsAt",
			value: function removeObjectsAt(x, y) {
				if (!this.obj_arr[x][y].length) return;

				clearField.call(this, x, y);
				this.obj_arr[x][y] = [];
			}
		}, {
			key: "removeAllObjects",
			value: function removeAllObjects() {
				this.obj_arr = [];
				for (var i = 0; i < this.size; i++) {
					this.obj_arr[i] = [];
					for (var j = 0; j < this.size; j++) {
						this.obj_arr[i][j] = [];
					}
				}
				this.redraw();
			}
		}, {
			key: "addCustomObject",
			value: function addCustomObject(handler, args) {
				this.obj_list.push({ handler: handler, args: args });
				this.redraw();
			}
		}, {
			key: "removeCustomObject",
			value: function removeCustomObject(handler, args) {
				for (var i = 0; i < this.obj_list.length; i++) {
					var obj = this.obj_list[i];
					if (obj.handler == handler && obj.args == args) {
						this.obj_list.splice(i, 1);
						this.redraw();
						return true;
					}
				}
				return false;
			}
		}, {
			key: "addEventListener",
			value: function addEventListener(type, callback) {
				var _this = this,
				    evListener = {
					type: type,
					callback: callback,
					handleEvent: function handleEvent(e) {
						var coo = getMousePos.call(_this, e);
						callback(coo.x, coo.y, e);
					}
				};

				this.element.addEventListener(type, evListener, true);
				this.listeners.push(evListener);
			}
		}, {
			key: "removeEventListener",
			value: function removeEventListener(type, callback) {
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

			/*getState() {
	  	return {
	  		objects: WGo.clone(this.obj_arr),
	  		custom: WGo.clone(this.obj_list)
	  	};
	  }
	  
	  restoreState(state) {
	  	this.obj_arr = state.objects || this.obj_arr;
	  	this.obj_list = state.custom || this.obj_list;
	  	
	  	this.redraw();
	  }*/

		}]);
		return CanvasBoard;
	}();

	var defaultConfig = {
		size: 19,
		width: 0,
		height: 0,
		font: "Calibri", // deprecated
		lineWidth: 1, // deprecated
		autoLineWidth: false, // deprecated
		starPoints: {
			19: [{ x: 3, y: 3 }, { x: 9, y: 3 }, { x: 15, y: 3 }, { x: 3, y: 9 }, { x: 9, y: 9 }, { x: 15, y: 9 }, { x: 3, y: 15 }, { x: 9, y: 15 }, { x: 15, y: 15 }],
			13: [{ x: 3, y: 3 }, { x: 9, y: 3 }, { x: 3, y: 9 }, { x: 9, y: 9 }],
			9: [{ x: 4, y: 4 }]
		},
		stoneHandler: drawHandlers.SHELL,
		starSize: 1, // deprecated
		shadowSize: 1, // deprecated
		stoneSize: 1, // deprecated
		section: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		},
		//background: WGo.DIR+"wood1.jpg",
		theme: {}
	};

	/**
	 * Kifu class - handles kifu - it can traverse and edit it. Has powerfull api.
	 * In previous WGo it would be KifuReader.
	 */

	var Kifu /*extends EventMixin()*/ = function () {
		/**
	  * Constructs a new Kifu object.
	  * 
	  * @param {KNode?} kNode - some KNode object of the kifu.
	  */

		function Kifu(kNode) {
			babelHelpers.classCallCheck(this, Kifu);

			//super();

			this.rootNode = kNode ? kNode.root : new KNode();
			this.currentNode = kNode || this.rootNode;
		}

		babelHelpers.createClass(Kifu, [{
			key: "setRules",
			value: function setRules(gameRules) {}
		}, {
			key: "first",
			value: function first() {}
		}, {
			key: "previous",
			value: function previous() {}
		}, {
			key: "next",
			value: function next(ind) {}
		}, {
			key: "last",
			value: function last() {}
		}, {
			key: "goTo",
			value: function goTo(kifuPath) {}
		}, {
			key: "blackName",
			get: function get() {
				return this.rootNode.getProperty("PB");
			},
			set: function set(name) {
				this.rootNode.setProperty("PB", name);
			}
		}, {
			key: "blackRank",
			get: function get() {
				return this.rootNode.getProperty("BR");
			},
			set: function set(rank) {
				this.rootNode.setProperty("BR", rank);
			}
		}, {
			key: "blackTeam",
			get: function get() {
				return this.rootNode.getProperty("BT");
			},
			set: function set(team) {
				this.rootNode.setProperty("BT", rank);
			}
		}, {
			key: "whiteName",
			get: function get() {
				return this.rootNode.getProperty("PW");
			},
			set: function set(name) {
				this.rootNode.setProperty("PW", name);
			}
		}, {
			key: "whiteRank",
			get: function get() {
				return this.rootNode.getProperty("WR");
			},
			set: function set(rank) {
				this.rootNode.setProperty("WR", rank);
			}
		}, {
			key: "whiteTeam",
			get: function get() {
				return this.rootNode.getProperty("WT");
			},
			set: function set(team) {
				this.rootNode.setProperty("WT", rank);
			}
		}]);
		return Kifu;
	}();

	/*WGo.Game = Game;
	WGo.Position = Position;
	WGo.SGFParser = SGFParser;
	WGo.KNode = KNode;*/
	//WGo.CanvasBoard = CanvasBoard;

	SGFParser.SGFSyntaxError = SGFSyntaxError;

	exports.Game = Game;
	exports.Position = Game;
	exports.SGFParser = SGFParser;
	exports.KNode = KNode;
	exports.CanvasBoard = CanvasBoard;
	exports.Kifu = Kifu;
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

}));