/**
 * Contains methods for parsing sgf string
 * @module SGFParser
 */

/**
 * Class for parsing of sgf files. Can be used for parsing of SGF fragments as well.
 * 
 * @param {string} sgf to be parsed
 */
 
var SGFParser = function(sgf) {
	this.sgfString = sgf;
	this.position = 0;
	this.currentChar = sgf[0];
	this.lineNo = 1;
	this.charNo = 0;
}

var SGFSyntaxError = SGFParser.SGFSyntaxError = function(message, parser) {
	var tempError = Error.apply(this);
	tempError.name = this.name = 'SGFSyntaxError';

	this.message = message || 'There was an unspecified syntax error in the SGF';
	if(parser) {
		this.message += " on line "+parser.lineNo+", char "+parser.charNo+":\n";
		this.message += "\t"+this.getLine(parser.sgfString, parser.lineNo)+"\n";
		this.message += "\t"+Array(parser.charNo+1).join(" ")+"^";
	}
	this.stack = tempError.stack;
}

SGFSyntaxError.prototype = Object.create(Error.prototype);
SGFSyntaxError.prototype.constructor = SGFSyntaxError;

SGFSyntaxError.prototype.getLine = function(str, lineNo) {
	return str.split("\n")[lineNo-1];
}

// helpers
SGFParser.CODE_A = "A".charCodeAt(0);
SGFParser.CODE_Z = "Z".charCodeAt(0);
SGFParser.CODE_WHITE = " ".charCodeAt(0);

SGFParser.prototype = {
	constructor: SGFParser,
	
	next: function(dontSkipWhite) {
		if(!dontSkipWhite) {
			while(this.sgfString.charCodeAt(++this.position) <= SGFParser.CODE_WHITE) {
				if(this.sgfString[this.position] == "\n") {
					this.charNo = 0;
					this.lineNo++;
				}
				else {
					this.charNo++;
				}
			}
			this.charNo++;
		}
		else {
			this.position++;
			if(this.sgfString[this.position] == "\n") {
				this.charNo = 0;
				this.lineNo++;
			}
			else {
				this.charNo++;
			}
		}
		
		return this.currentChar = this.sgfString[this.position];
	},
	
	parsePropertyValue: function() {
		var value = "";
		
		// then we read the value
		while(this.next(true) != ']') {

			// char mustn't be undefined
			if(!this.currentChar) throw new SGFSyntaxError("End of SGF inside of property", this);

			// if there is character '\' save next character
			else if(this.currentChar == '\\') {
				this.next(true);

				// char have to exis of course
				if(!this.currentChar) throw new SGFSyntaxError("End of SGF inside of property", this);

				// ignore new line, otherwise save
				else if(this.currentChar == '\n') {
					continue;
				}
			}

			// save the character
			value += this.currentChar;
		}
		
		return value;
	},
	
	/**
	 * Expects string containing value(-s) of SGF property and returns array of that values.
	 * Example: `'[jj][kk]' => ['jj', 'kk']`.
	 * 
	 * @param {string}   string - parsed SGF
 	 * @param {number}   start  - starting position
 	 * @returns {string[]} array of property values                       
 	 * @throws {SGFSyntaxError} When sgf string is invalid.
	 */
	 
	parsePropertyValues: function() {
		var value, values = [];
		
		if(this.currentChar != '[') throw new SGFSyntaxError("Property must have at least one value enclosed in '[' and ']'", this);
		
		do {
			value = this.parsePropertyValue();
			if(value != "") values.push(value);
		} while(this.next() == '[');

		return values;
	},
	
	/**
	 * Reads the property identificator (One or more UC letters)
	 * 
	 * @returns {string} the identificator.
	 */
	parsePropertyIdent: function() {
		var ident = "", charCode = this.sgfString.charCodeAt(this.position);
		while(charCode >= SGFParser.CODE_A && charCode <= SGFParser.CODE_Z) {
			ident += this.currentChar;
			this.next();
			charCode = this.sgfString.charCodeAt(this.position);
		}
		return ident;
	},
	
	parseProperties: function() {
		var ident, properties = {};
		while(ident = this.parsePropertyIdent()) {
			properties[ident] = this.parsePropertyValues();
		}
		return properties;
	},
	
	parseNode: function() {
		// in this point I know, that current character is ';' (don't have to check it)
		this.next();
		
		return this.parseProperties();
	},
	
	parseSequence: function() {
		var sequence = [];

		// sequence must start with `;`
		if(this.currentChar != ';') throw new SGFSyntaxError("There must be at least one SGF node in sequence", this);
		
		do {
			sequence.push(this.parseNode());
		} while(this.currentChar == ';');
		
		return sequence;
	},
	
	/**
	 * Parses a SGF *GameTree*.
	 * 
	 * @throws {SGFSyntaxError} [[Description]]
	 * @returns {[[Type]]} [[Description]]
	 */
	parseGameTree: function() {
		// No need to check GameTree (we know it starts with `(`)
		this.next();
		
		// Parse sequence
		var sequence = this.parseSequence();
		
		// Game tree ends with `)`, or add subtree to the end of sequence
		if(this.currentChar != ')') sequence.push(this.parseCollection());
	
		return sequence;
	},
	
	/**
	 * Parses a SGF *Collection*.
	 */
	parseCollection: function() {
		var gameTrees = [];
		
		// Parse all trees
		do {
			// Collection must start with character `(`
			if(this.currentChar != '(') throw new SGFSyntaxError("SGF tree must be enclosed in '(' and ')'", this);
			gameTrees.push(this.parseGameTree());
			this.next();
		} while(this.currentChar && this.currentChar != ')');
		
		return gameTrees;
	}
}

module.exports = SGFParser;
