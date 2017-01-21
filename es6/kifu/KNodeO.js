import {BLACK, WHITE, EMPTY} from "../core";
import SGFParser, {SGFSyntaxError} from "./SGFParser";

// helper function for translating letters to numbers (a => 0, b => 1, ...)
var str2coo = (str) => ({
	x: str.charCodeAt(0)-97,
	y: str.charCodeAt(1)-97
});

// helper function for translating numbers to letters (0 => a, 1 => b, ...)
var coo2str = (field) => String.fromCharCode(field.x+97) + String.fromCharCode(field.y+97);

// helper to remove setup or markup from SGF properties
var removeSGFValue = function(properties, ident, field) {
	if(properties[ident]) {
		var pos = properties[ident].indexOf(coo2str(field));
		if(pos >= 0) {
			properties[ident].splice(pos, 1);
			if(!properties[ident].length) delete properties[ident];
		}
	}
};

// jsgf helper
var processJsgf = function(parent, jsgf, pos) {
	if(jsgf[pos]) {
		if(jsgf[pos].constructor == Array) {
			// more children (fork)
			jsgf[pos].forEach(function(jsgf2) {
				processJsgf(parent, jsgf2, 0);
			});
		}
		else {
			// one child
			var node = new KNode();
			node.setSGFProperties(jsgf[pos]);
			parent.appendChild(node);
			processJsgf(node, jsgf, pos+1);
		}
	}
}

export var rMove = (color) => function(node, value) {
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
};

export var rSetup = (color, propIdent) => function(node, value) {
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

	node.addSetup(value.map((elem) => {
		var setup = str2coo(elem);
		setup.c = color;
		return setup;
	}));
};

export var rMarkup = (type) => function(node, value) {
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

	node.addMarkup(value.map((elem) => {
		var markup = str2coo(elem);
		markup.type = type;
		return markup;
	}));
};

export var rPlayerInfo = (color, type) => function(node, value) {
	if(node.parent) console.warn("Adding player information("+color+"."+type+") to non-root node, probably will be ignored.");
	node.gameInfo = node.gameInfo || {};
	node.gameInfo[color] = node.gameInfo[color] || {};
	node.gameInfo[color][type] = value.join("");
};

export var rGameInfo = (property) => function(node, value) {
	if(node.parent) console.warn("Adding game information("+property+") to non-root node, probably will be ignored.");
	node.gameInfo = node.gameInfo || {};
	node.gameInfo[property] = value.join("");
};

/**
 * List of functions which transforms string SGF property values into javascript kifu property.
 */
export var SGFreaders = {
	B: rMove(BLACK),
	W: rMove(WHITE),
	AB: rSetup(BLACK, "AB"),
	AW: rSetup(WHITE, "AW"),
	AE: rSetup(EMPTY, "AE"),
	PL: function(node, value) {
		if(value) {
			if(value[0] == "b" || value[0] == "B") node.setTurn(BLACK);
			else if(value[0] == "w" || value[0] == "W") node.setTurn(WHITE);
		}
		else {
			node.setTurn();
		}
	},
	C: function(node, value) {
		node.setComment(value ? value.join("") : "");
	},
	CR: rMarkup("CR"), // circle
	SQ: rMarkup("SQ"), // square
	TR: rMarkup("TR"), // triangle
	SL: rMarkup("SL"), // dot
	MA: rMarkup("MA"), // X
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
	US: rGameInfo("user"),
}

/**
 * List of functions which transforms javascript kifu property into SGF property.
 */
export var SGFwriters = {
	LB: (value) => coo2str(value)+":"+value.text
}

/**
 * List of SGF markup properties.
 */
export var markupProperties = ["CR", "LB", "MA", "SL", "SQ", "TR"];

/**
 * List of 'boolean' SGF properties. These properties don't have a value, but their presence has a meaning. 
 * Other properties without a value won't do anything and may be discarded.
 */

export var booleanProperties = ["DO", "IT", "KO"];
 
/**
 * Class representing one kifu node.
 */
export default class KNode {

	static fromJSGF(jsgf) {
		var root = new KNode();

		root.setSGFProperties(jsgf[0]);
		processJsgf(root, jsgf, 1);

		return root;
	}
	
	static fromSGF(sgf, ind) {
		var parser = new SGFParser(sgf);
		return KNode.fromJSGF(parser.parseCollection()[ind || 0]);
	}
	
	constructor() {
		// parent node (readonly) 
		this.parent = null; 

		// array of child nodes (readonly)
		this.children = [];

		// map of SGF properties (readonly) - {<PropIdent>: Array<PropValue>}
		this.SGFProperties = {};

		// init some general proeprties
		this._init();
	}
	
	get root() {
		var node = this;
		while(node.parent != null) node = node.parent;
		return node;
	}
	
	set innerSGF(sgf) {
		// prepare parser
		this.setFromSGF(new SGFParser(sgf));
	}

	get innerSGF() {
		var output = "";
		
		for(let propIdent in this.SGFProperties) {
			if(this.SGFProperties.hasOwnProperty(propIdent)) {
				output += propIdent+this.getSGFProperty(propIdent);
			}
		}
		if(this.children.length == 1) {
			return output+";"+this.children[0].innerSGF;
		}
		else if(this.children.length > 1) {
			return this.children.reduce((prev, current) => prev+"(;"+current.innerSGF+")", output);
		}
		else {
			return output;
		}
	}
	
	/**
	 * Initialize KNode object. Called in constructor, it can be overriden to add some general properties.
	 */
	 
	_init() {
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
	 * @returns {number} position(index) of appended node.
	 */
	
	appendChild(node) {
		if(node == null || !(node instanceof KNode) || node == this) throw new Error("Invalid argument passed to `appendChild` method, KNode was expected.");
		
		if(node.parent) node.parent.removeChild(node);
		
		node.parent = this;
		
		return this.children.push(node)-1;
	}
	
	// Clones a KNode and all of its contents (TODO)
	cloneNode() {
		
	}
	
	/**
	 * Returns a Boolean value indicating whether a node is a descendant of a given node or not.
	 * 
	 * @param   {KNode}   node to be tested
	 * @returns {boolean} true, if this node contains given node.
	 */
	
	contains(node) {
		if(this.children.indexOf(node) >= 0) return true;
		
		return this.children.some((child) => child.contains(node));
	}
	
	/**
	 * Inserts the first KNode given in a parameter immediately before the second, child of this KNode.
	 * 
	 * @throws  {Error}   when argument is invalid.
	 * @param   {KNode}   newNode       node to be inserted
	 * @param   {(KNode)} referenceNode reference node, if omitted, new node will be inserted at the end. 
	 * @returns {KNode}   this node
	 */
	
	insertBefore(newNode, referenceNode) {
		if(newNode == null || !(newNode instanceof KNode) || newNode == this) throw new Error("Invalid argument passed to `insertBefore` method, KNode was expected.");
		else if(referenceNode == null) return this.appendChild(newNode);
		
		if(newNode.parent) newNode.parent.removeChild(newNode);
		
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
	
	removeChild(child) {
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
	
	replaceChild(newChild, oldChild) {
		if(newChild == null || !(newChild instanceof KNode) || newChild == this) throw new Error("Invalid argument passed to `replaceChild` method, KNode was expected.");
		
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
	getProperty(propIdent) {
		if(this.SGFProperties[propIdent]) {
			if(this.SGFProperties[propIdent].length == 1) {
				if(this.SGFProperties[propIdent][0] == "" && booleanProperties.indexOf(propIdent) >= 0) return true;
				return this.SGFProperties[propIdent][0];
			}
			else if(this.SGFProperties[propIdent].length > 1) return this.SGFProperties[propIdent];
		}
		if(booleanProperties.indexOf(propIdent) >= 0) return false;
		else return "";
	}
	
	/**
	 * Sets property by SGF property identificator. Currently it isn't consistent with other API!!!! [TODO] revisit
	 * 
	 * @param   {string}          propIdent - SGF property idetificator
	 * @param   {string|string[]} value - property value or values
	 */
	setProperty(propIdent, value) {
		if(value == null || value === false || value == "") {
			// remove property
			delete this.SGFProperties[propIdent];
		}
		else if(value.constructor === Array) {
			// add multiple values
			this.SGFProperties[propIdent] = value.slice(0);
		}
		else if(value === true) {
			// add property without value
			this.SGFProperties[propIdent] = [""];
		}
		else {
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
	 
	setSGFProperty(propIdent, propValue) {
		if(typeof propValue == "string") {
			let parser = new SGFParser(propValue);
			propValue = parser.parsePropertyValues();
		}
		
		if(SGFreaders[propIdent]) {
			SGFreaders[propIdent](this, propValue);
		}
		else {
			if(propValue == null) delete this.SGFProperties[propIdent];
			else this.SGFProperties[propIdent] = propValue;
		}
		
		return this;
	}
	
	/**
	 * Gets one SGF property value.
	 * 
	 * @param   {string} propIdent SGF property identificator.
	 * @returns {string} SGF property values or empty string, if node doesn't containg this property.
	 */
	getSGFProperty(propIdent) {
		if(this.SGFProperties[propIdent]) {
			return "["+this.SGFProperties[propIdent].map((propValue) => propValue.replace(/\]/g, "\\]")).join("][")+"]";	
		}
		return "";
	}
	
	setSGFProperties(properties) {
		for(let ident in properties) {
			if(properties.hasOwnProperty(ident)) {
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
	 
	setFromSGF(parser) {
		// clean up
		for(let i = this.children.length-1; i >= 0; i--) {
			this.removeChild(this.children[i]);
		}
		this._init();
		this.SGFProperties = {};
		
		// and parse properties
		this.setSGFProperties(parser.parseProperties());
		
		// then we parse the rest of sgf
		if(parser.currentChar == ";") {
			// single kifu node child
			let childNode = new KNode();
			this.appendChild(childNode);
			parser.next();
			childNode.setFromSGF(parser);
		}
		else if(parser.currentChar == "(") {
			// two or more children
			parser.parseCollection().forEach((function(jsgf) {
				this.appendChild(KNode.fromJSGF(jsgf));
			}).bind(this));
		}
		else if(parser.currentChar) {
			// syntax error
			throw new SGFSyntaxError("Illegal character in SGF node", parser);
		}
	}
	
	toSGF() {
		return "(;"+this.innerSGF+")";
	}
	
	/// KIFU SPECIFIC METHODS
	
	// Adds or changes setup (may be array)
	addSetup(setup) {
		if(setup.constructor != Array) setup = [setup];
		
		this.removeSetup(setup);
		
		for(let i = 0, property; i < setup.length; i++) {
			this.setup[setup[i].x+":"+setup[i].y] = setup[i].c;
			
			if(setup[i].c == BLACK)	property = "AB";
			else if(setup[i].c == WHITE) property = "AW";
			else property = "AE";
			
			if(!this.SGFProperties[property]) this.SGFProperties[property] = [];
			
			this.SGFProperties[property].push((SGFwriters[property] ? SGFwriters[property] : coo2str)(setup[i]));
		}
		
		return this;
	}
	
	// Removes setup
	removeSetup(setup) {
		if(setup.constructor != Array) setup = [setup];

		for(let i = 0; i < setup.length; i++) {
			delete this.setup[setup[i].x+":"+setup[i].y];
			
			removeSGFValue(this.SGFProperties, "AB", setup[i]);
			removeSGFValue(this.SGFProperties, "AW", setup[i]);
			removeSGFValue(this.SGFProperties, "AE", setup[i]);
		}
	}
	
	// Adds or changes markup
	addMarkup(markup) {
		if(markup.constructor != Array) markup = [markup];
		
		this.removeMarkup(markup);
		
		for(let i = 0; i < markup.length; i++) {
			this.markup[markup[i].x+":"+markup[i].y] = markup[i];
			
			if(!this.SGFProperties[markup[i].type]) this.SGFProperties[markup[i].type] = [];
			
			this.SGFProperties[markup[i].type].push((SGFwriters[markup[i].type] ? SGFwriters[markup[i].type] : coo2str)(markup[i]));
		}
	}
	
	// Removes markup
	removeMarkup(markup) {
		if(markup.constructor != Array) markup = [markup];
		
		for(let i = 0; i < markup.length; i++) {
			delete this.markup[markup[i].x+":"+markup[i].y];
			
			for(let j = 0; j < markupProperties.length; j++) {
				removeSGFValue(this.SGFProperties, markupProperties[j], markup[i]);
			}
		}
	}
	
	setMove(move) {
		this.move = move;
		
		if(!move || !move.c) {
			delete this.SGFProperties.B;
			delete this.SGFProperties.W;
		}
		else if(move.c == WHITE) {
			delete this.SGFProperties.B;
			this.SGFProperties.W = [coo2str(move)];
		}
		else {
			delete this.SGFProperties.W;
			this.SGFProperties.B = [coo2str(move)];
		}
	}
	
	setTurn(turn) {
		this.turn = turn;
		
		if(turn) {
			if(turn == BLACK) {
				this.SGFProperties.PL = ["B"];
			}
			else {
				this.SGFProperties.PL = ["W"];
			}
		}
		else {
			delete this.SGFProperties.PL;
		}
	}
	
	// Returns anticipated turn (player color) for next move
	getTurn() {
		if(this.turn) return this.turn;
		else if(this.move) return -this.move.c;
		else if(this.parent) return this.parent.getTurn();
		else return BLACK;
	}
	
	setComment(comment) {
		this.comment = comment;
		if(comment) {
			this.SGFProperties.C = [comment];
		}
		else {
			delete this.SGFProperties.C;
		}
	}
}

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