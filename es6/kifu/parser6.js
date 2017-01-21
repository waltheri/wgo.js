"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.SGFSyntaxError = SGFSyntaxError;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
		_classCallCheck(this, SGFParser);

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

	_createClass(SGFParser, [{
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

exports.default = SGFParser;
function SGFSyntaxError(message, parser) {
	var tempError = Error.apply(this);
	tempError.name = this.name = 'SGFSyntaxError';

	this.message = message || 'There was an unspecified syntax error in the SGF';
	if (parser) {
		this.message += " on line " + parser.lineNo + ", char " + parser.charNo + ":\n";
		this.message += "\t" + this.getLine(parser.sgfString, parser.lineNo) + "\n";
		this.message += "\t" + Array(parser.charNo + 1).join(" ") + "^";
	}
	this.stack = tempError.stack;
}

SGFSyntaxError.prototype = Object.create(Error.prototype);
SGFSyntaxError.prototype.constructor = SGFSyntaxError;

SGFSyntaxError.prototype.getLine = function (str, lineNo) {
	return str.split("\n")[lineNo - 1];
};

/*

export class SGFSyntaxError {
	constructor(message, parser) {
		var tempError = Error.apply(this);
		tempError.name = this.name = 'SGFSyntaxError';
		this.message = message || 'There was an unspecified syntax error in the SGF';
		
		if(parser) {
			this.message += " on line "+parser.lineNo+", char "+parser.charNo+":\n";
			this.message += "\t"+parser.sgfString.split("\n")[parser.lineNo-1]+"\n";
			this.message += "\t"+Array(parser.charNo+1).join(" ")+"^";
		}
		
		this.stack = tempError.stack;
	}
}
*/
// a small ES5 hack because currently in ES6 you can't extend Errors
