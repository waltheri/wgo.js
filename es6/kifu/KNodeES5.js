var WGo = require("../WGo");
var SGFParser = require("./SGFParser");

// helper function for translating letters to numbers (a => 0, b => 1, ...)
var str2coo = function(str) {
	return {
		x: str.charCodeAt(0)-97,
		y: str.charCodeAt(1)-97
	}
}

// helper function for translating numbers to letters (0 => a, 1 => b, ...)
var coo2str = function(field) {
	return String.fromCharCode(field.x+97)+String.fromCharCode(field.y+97);
}

// helper to remove setup or markup from SGF properties
var removeSGFValue = function(properties, ident, field) {
	if(properties[ident]) {
		var pos = properties[ident].indexOf(coo2str(field));
		if(pos >= 0) {
			properties[ident].splice(pos, 1);
			if(!properties[ident].length) delete properties[ident];
		}
	}
}

var moveSGFReaderFactory = function(color) {
	return function(node, value) {
		if(value == null) {
			node.setMove();
		}
		else if(!value[0]) {
			node.setMove({
				pass: true,
				c: color
			});
		}
		else {
			var move = str2coo(value[0]);
			move.c = color;
			node.setMove(move);
		}
	}
}

var setupSGFReaderFactory = function(color, propIdent) {
	return function(node, value) {
		if(value == null) {
			var keys = Object.keys(node.setup);
			for(var i = 0; i < keys.length; i++) {
				if(node.setup[keys[i]] == color) {
					delete node.setup[keys[i]];
				}
			}
			delete node.SGFProperties[propIdent];
			return;
		}

		node.addSetup(value.map(function(elem) {
			var setup = str2coo(elem);
			setup.c = color;
			return setup;
		}));
	}
}

var markupSGFReaderFactory = function(type) {
	return function(node, value) {
		if(value == null) {
			var keys = Object.keys(node.markup);
			for(var i = 0; i < keys.length; i++) {
				if(node.markup[keys[i]].type == type) {
					delete node.markup[keys[i]];
				}
			}
			delete node.SGFProperties[type];
			return;
		}
		
		node.addMarkup(value.map(function(elem) {
			var markup = str2coo(elem);
			markup.type = type;
			return markup;
		}));
	}
}

var playerInfoSGFReaderFactory = function(color, type) {
	return function(node, value) {
		node.gameInfo = node.gameInfo || {};
		node.gameInfo[color] = node.gameInfo[color] || {};
		node.gameInfo[color][type] = value.join("");
	}
}

var gameInfoSGFReaderFactory = function(property) {
	return function(node, value) {
		node.gameInfo = node.gameInfo || {};
		node.gameInfo[property] = value.join("");
	}
}

var KNode = function() {
	// parent node (readonly) 
	this.parent = null; 
	
	// array of child nodes (readonly)
	this.children = [];
	
	// map of SGF properties (readonly) - {<PropIdent>: Array<PropValue>}
	this.SGFProperties = {};
	
	// game information - should be inherited from root (readonly)
	this.gameInfo = null;
	
	// kifu properties - should be inherited from root (readonly)
	this.kifuInfo = null;
	
	// init some general proeprties
	this._init();
}

// SGF property -> KNode property
KNode.SGFreaders = {
	B: moveSGFReaderFactory(WGo.B),
	W: moveSGFReaderFactory(WGo.W),
	AB: setupSGFReaderFactory(WGo.B, "AB"),
	AW: setupSGFReaderFactory(WGo.W, "AW"),
	AE: setupSGFReaderFactory(WGo.E, "AE"),
	PL: function(node, value) {
		if(value) {
			if(value[0] == "b" || value[0] == "B") node.setTurn(WGo.B);
			else if(value[0] == "w" || value[0] == "W") node.setTurn(WGo.W);
		}
		else {
			node.setTurn();
		}
	},
	C: function(node, value) {
		node.setComment(value ? value.join("") : "");
	},
	CR: markupSGFReaderFactory("CR"), // circle
	SQ: markupSGFReaderFactory("SQ"), // square
	TR: markupSGFReaderFactory("TR"), // triangle
	SL: markupSGFReaderFactory("SL"), // dot
	MA: markupSGFReaderFactory("MA"), // X
	LB: function(node, value) {
		if(value == null) {
			var keys = Object.keys(node.markup);
			for(var i = 0; i < keys.length; i++) {
				if(node.markup[keys[i]].type == "LB") {
					delete node.markup[keys[i]];
				}
			}
			delete node.SGFProperties.LB;
			return;	
		}

		node.addMarkup(value.map(function(elem) {
			var markup = str2coo(elem);
			markup.type = "LB";
			markup.text = elem.substr(3);
			return markup;
		}));
	},
	BR: playerInfoSGFReaderFactory("black", "rank"),
	PB: playerInfoSGFReaderFactory("black", "name"),
	BT: playerInfoSGFReaderFactory("black", "team"),
	WR: playerInfoSGFReaderFactory("white", "rank"),
	PW: playerInfoSGFReaderFactory("white", "name"),
	WT: playerInfoSGFReaderFactory("white", "team"),
	TM: gameInfoSGFReaderFactory("basicTime"),
	OT: gameInfoSGFReaderFactory("byoyomi"),
	AN: gameInfoSGFReaderFactory("annotations"),
	CP: gameInfoSGFReaderFactory("copyright"),
	DT: gameInfoSGFReaderFactory("date"),
	EV: gameInfoSGFReaderFactory("event"),
	GN: gameInfoSGFReaderFactory("gameName"),
	GC: gameInfoSGFReaderFactory("gameComment"),
	ON: gameInfoSGFReaderFactory("opening"),
	PC: gameInfoSGFReaderFactory("place"),
	RE: gameInfoSGFReaderFactory("result"),
	RO: gameInfoSGFReaderFactory("round"),
	RU: gameInfoSGFReaderFactory("rules"),
	SO: gameInfoSGFReaderFactory("source"),
	US: gameInfoSGFReaderFactory("user"),
}

KNode.SGFwriters = {
	LB: function(value) {
		return coo2str(value)+":"+value.text;
	}
}

KNode.markupProperties = ["CR", "LB", "MA", "SL", "SQ", "TR"];

var temp = function(parent, jsgf, pos) {
	if(jsgf[pos]) {
		if(jsgf[pos].constructor == Array) {
			// more children (fork)
			jsgf[pos].forEach(function(jsgf2) {
				temp(parent, jsgf2, 0);
			});
		}
		else {
			// one child
			var node = new KNode();
			node.setSGFProperties(jsgf[pos]);
			parent.appendChild(node);
			temp(node, jsgf, pos+1);
		}
	}
}

KNode.fromJSGF = function(jsgf) {
	var root = new KNode();

	root.setSGFProperties(jsgf[0]);
	temp(root, jsgf, 1);

	return root;
}

KNode.fromSGF = function(sgf, ind) {
	var parser = new SGFParser(sgf);
	return KNode.fromJSGF(parser.parseCollection()[ind || 0]);
}

KNode.prototype = {
	constructor: KNode,
	
	/**
	 * Initialize KNode object. Called in constructor, it can be overriden to add some general properties.
	 */
	 
	_init: function() {
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
	},
	
	/// GENERAL TREE NODE MANIPULATION METHODS (subset of DOM API's Node)
	
	/**
	 * Insert a KNode as the last child node of this node.
	 * 
	 * @throws  {Error} when argument is invalid.
	 * @param   {KNode} node to append.
	 * @returns {Knode} this node.
	 */
	
	appendChild: function(node) {
		if(node == null || !(node instanceof KNode) || node == this) throw new Error("Invalid argument passed to `appendChild` method, KNode was expected.");
		
		if(node.parent) node.parent.removeChild(node);
		
		node.parent = this;
		node.gameInfo = this.gameInfo;
		node.kifuInfo = this.kifuInfo;
		
		this.children.push(node);
		return this;
	},
	
	// Clones a KNode and all of its contents
	cloneNode: function() {
		
	},

	/**
	 * Returns a Boolean value indicating whether a node is a descendant of a given node or not.
	 * 
	 * @param   {KNode}   node to be tested
	 * @returns {boolean} true, if this node contains given node.
	 */
	
	contains: function(node) {
		if(this.children.indexOf(node) >= 0) return true;
		
		return this.children.some(function(child) {
			return child.contains(node);
		});
	},

	/**
	 * Inserts the first KNode given in a parameter immediately before the second, child of this KNode.
	 * 
	 * @throws  {Error}   when argument is invalid.
	 * @param   {KNode}   newNode       node to be inserted
	 * @param   {(KNode)} referenceNode reference node, if omitted, new node will be inserted at the end. 
	 * @returns {KNode}   this node
	 */
	
	insertBefore: function(newNode, referenceNode) {
		if(newNode == null || !(newNode instanceof KNode) || newNode == this) throw new Error("Invalid argument passed to `insertBefore` method, KNode was expected.");
		else if(referenceNode == null) return this.appendChild(newNode);
		
		if(newNode.parent) newNode.parent.removeChild(newNode);
		
		newNode.parent = this;
		newNode.gameInfo = this.gameInfo;
		newNode.kifuInfo = this.kifuInfo;
		
		this.children.splice(this.children.indexOf(referenceNode), 0, newNode);
		return this;
	},
	
	/**
	 * Removes a child node from the current element, which must be a child of the current node.
	 * 
	 * @param   {object} child node to be removed
	 * @returns {KNode}  this node
	 */
	
	removeChild: function(child) {
		this.children.splice(this.children.indexOf(child), 1);
		
		child.gameInfo = null;
		child.kifuInfo = null;
		child.parent = null;
		
		return this;
	},
	
	/**
	 * Replaces one child Node of the current one with the second one given in parameter.
	 * 
	 * @throws  {Error} when argument is invalid
	 * @param   {KNode} newChild node to be inserted
	 * @param   {KNode} oldChild node to be replaced
	 * @returns {KNode} this node
	 */
	
	replaceChild: function(newChild, oldChild) {
		if(newChild == null || !(newChild instanceof KNode) || newChild == this) throw new Error("Invalid argument passed to `replaceChild` method, KNode was expected.");
		
		this.insertBefore(newChild, oldChild);
		this.removeChild(oldChild);
		
		return this;
	},
	
	/// SGF RAW METHODS
	
	/**
	 * Sets one SGF property.
	 * 
	 * @param   {string}          propIdent SGF property idetificator
	 * @param   {string|string[]} propValue SGF property value
	 * @returns {KNode}           this KNode for chaining
	 */
	 
	setSGFProperty: function(propIdent, propValue) {
		if(typeof propValue == "string") {
			var parser = new SGFParser(propValue);
			propValue = parser.parsePropertyValues();
		}
		
		if(KNode.SGFreaders[propIdent]) {
			KNode.SGFreaders[propIdent](this, propValue);
		}
		else {
			if(propValue == null) delete this.SGFProperties[propIdent];
			else this.SGFProperties[propIdent] = propValue;
		}
		
		return this;
	},
	
	/**
	 * Gets one SGF property value.
	 * 
	 * @param   {string} propIdent SGF property identificator.
	 * @returns {string} SGF property values or empty string, if node doesn't containg this property.
	 */
	getSGFProperty: function(propIdent) {
		if(this.SGFProperties[propIdent]) {
			return "["+this.SGFProperties[propIdent].map(function(propValue) {
				return propValue.replace(/\]/g, "\\]");
			}).join("][")+"]";	
		}
		return "";
	},
	
	setSGFProperties: function(properties) {
		for(var ident in properties) {
			if(properties.hasOwnProperty(ident)) {
				this.setSGFProperty(ident, properties[ident]);
			}
		}
	},
	
	/**
	 * Sets properties of Kifu node based on the sgf string. 
	 * 
	 * Basically it parsers the sgf, takes properties from it and adds them to the node. 
	 * Then if there are other nodes in the string, they will be appended to the node as well.
	 * 
	 * @param {string} sgf SGF text for current node. It must be without trailing `;`, however it can contain following nodes.
	 * @throws {SGFSyntaxError} throws exception, if sgf string contains invalid SGF.
	 */
	 
	setSGF: function(sgf) {
		// clean up
		for(var i = this.children.length-1; i >= 0; i--) {
			this.removeChild(i);
		}
		this._init();
		this.SGFProperties = {};
		
		// prepare parser
		var parser = typeof sgf == "string" ? new SGFParser(sgf) : sgf;
		
		// and parse properties
		this.setSGFProperties(parser.parseProperties());
		
		// then we parse the rest of sgf
		if(parser.currentChar == ";") {
			// single kifu node child
			var childNode = new KNode();
			this.appendChild(childNode);
			parser.next();
			childNode.setSGF(parser);
		}
		else if(parser.currentChar == "(") {
			// two or more children
			parser.parseCollection().forEach((function(jsgf) {
				this.appendChild(KNode.fromJSGF(jsgf));
			}).bind(this));
		}
		else if(parser.currentChar) {
			// syntax error
			throw new SGFParser.SGFSyntaxError("Illegal character in SGF node", parser);
		}
	},
	
	/**
	 * Gets SGF corresponding to this node.
	 * 
	 * @returns {string} SGF containing all properties and also children SGF nodes.
	 */
	getSGF: function() {
		var output = "";
		
		for(var propIdent in this.SGFProperties) {
			if(this.SGFProperties.hasOwnProperty(propIdent)) {
				output += propIdent+this.getSGFProperty(propIdent);
			}
		}
		if(this.children.length == 1) {
			return output+";"+this.children[0].getSGF();
		}
		else if(this.children.length > 1) {
			return this.children.reduce(function(prev, current) {
				return prev+"(;"+current.getSGF()+")";
			}, output);
		}
		else {
			return output;
		}
	},
	
	toSGF: function() {
		return "(;"+this.getSGF()+")";
	},
	
	/// KIFU SPECIFIC METHODS
	
	// Adds or changes setup (may be array)
	addSetup: function(setup) {
		if(setup.constructor != Array) setup = [setup];
		
		this.removeSetup(setup);
		
		for(var i = 0, property; i < setup.length; i++) {
			this.setup[setup[i].x+":"+setup[i].y] = setup[i].c;
			
			if(setup[i].c == WGo.B)	property = "AB";
			else if(setup[i].c == WGo.W) property = "AW";
			else property = "AE";
			
			if(!this.SGFProperties[property]) this.SGFProperties[property] = [];
			
			this.SGFProperties[property].push(coo2str(setup[i]));
		}
		
		return this;
	},
	
	// Removes setup
	removeSetup: function(setup) {
		if(setup.constructor != Array) setup = [setup];

		for(var i = 0; i < setup.length; i++) {
			delete this.setup[setup[i].x+":"+setup[i].y];
			
			removeSGFValue(this.SGFProperties, "AB", setup[i]);
			removeSGFValue(this.SGFProperties, "AW", setup[i]);
			removeSGFValue(this.SGFProperties, "AE", setup[i]);
		}
	},
	
	// Adds or changes markup
	addMarkup: function(markup) {
		if(markup.constructor != Array) markup = [markup];
		
		this.removeMarkup(markup);
		
		for(var i = 0; i < markup.length; i++) {
			this.markup[markup[i].x+":"+markup[i].y] = markup[i];
			
			if(!this.SGFProperties[markup[i].type]) this.SGFProperties[markup[i].type] = [];
			
			this.SGFProperties[markup[i].type].push((KNode.SGFwriters[markup[i].type] ? KNode.SGFwriters[markup[i].type] : coo2str)(markup[i]));
		}
	},
	
	// Removes markup
	removeMarkup: function(markup) {
		if(markup.constructor != Array) markup = [markup];
		
		for(var i = 0; i < markup.length; i++) {
			delete this.markup[markup[i].x+":"+markup[i].y];
			
			for(var j = 0; j < KNode.markupProperties.length; j++) {
				removeSGFValue(this.SGFProperties, KNode.markupProperties[j], markup[i]);
			}
		}
	},
	
	setMove: function(move) {
		this.move = move;
		
		if(!move || !move.c) {
			delete this.SGFProperties.B;
			delete this.SGFProperties.W;
		}
		else if(move.c == WGo.W) {
			delete this.SGFProperties.B;
			this.SGFProperties.W = [coo2str(move)];
		}
		else {
			delete this.SGFProperties.W;
			this.SGFProperties.B = [coo2str(move)];
		}
	},
	
	setTurn: function(turn) {
		this.turn = turn;
		
		if(turn) {
			if(turn == WGo.B) {
				this.SGFProperties.PL = ["B"];
			}
			else {
				this.SGFProperties.PL = ["W"];
			}
		}
		else {
			delete this.SGFProperties.PL;
		}
	},
	
	// Returns anticipated turn (player color) for next move
	getTurn: function() {
		if(this.turn) return this.turn;
		else if(this.move) return -this.move.c;
		else if(this.parent) return this.parent.getTurn();
		else return WGo.B;
	},
	
	setComment: function(comment) {
		this.comment = comment;
		if(comment) {
			this.SGFProperties.C = [comment];
		}
		else {
			delete this.SGFProperties.C;
		}
	}
}

module.exports = KNode;

/*
 * 
 * (
 *   ;SZ[19];B[pc];W[pe]C[You have many choices - for example: R13]
 *   ;B[qg]C[Click on a letter to select a variation]
 *   (
 *   	;W[of]C[Old joseki]
 *    	;B[mc]
 *     	;W[qc]
 *      ;B[qb]
 * 		;W[qd]
 * 		;B[qj]
 * 		;W[ob]
 * 		;B[pb]
 *   	;W[oc]
 *    	;B[od]
 *     	;W[pd]
 *      ;B[oa]
 * 		;W[nd]
 *   	;B[nb]
 *    	;W[oe]
 *     	;B[jc]
 *   )
 *   (
 *   	;W[qc];B[qb];W[qd];B[mc](;W[og];B[pg];W[oh];B[pi];W[ob];B[pb];W[oc];B[pd];W[od];B[qe];W[re];B[qf];W[rb];B[oe];W[ne];B[pf];W[md]TR[rb][qc][qd][re]C[Marked stones are not dead yet.])(;W[pg];B[ph];W[ob];B[pb];W[oc];B[od];W[pd];B[nc];W[nd]MA[og]C[White can play at X as well.];B[oe];W[nf];B[oa];W[of];B[nb];W[qh];B[qf];W[pi];B[oh];W[ri];B[rh];W[qi];B[pf];W[nh];B[re];W[oc];B[ob];W[ne];B[oc];W[rg];B[rf];W[sh];B[rc]C[Interesting joseki])))
 */