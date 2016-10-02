import KNode from "./KNode";
import EventMixin from "../EventMixin";
import Game, {rules, DEFAULT_RULES} from "../Game";
import {markupProperties, setupProperties} from "./propertyValueTypes";

const setupPropertiesReversed = Object.keys(setupProperties).reduce((obj, key) => {
	obj[setupProperties[key]] = key;
	return obj;
},{});

/**
 * Kifu class - handles kifu - it can traverse and edit it. Has powerful api.
 * In previous WGo it would be KifuReader.
 */

export default class Kifu extends EventMixin() {
	/**
	 * Creates a Kifu object from the JSGF object
	 * 
	 * @param   {Object} jsgf object
	 * @returns {Kifu}   Kifu object
	 */
	static fromJS(jsgf) {
		return new Kifu(KNode.fromJS(jsgf));
	}
	
	/**
	 * Creates a Kifu object from the SGF string
	 * 
	 * @param   {string} sgf string
	 * @returns {Kifu}   Kifu instance
	 */
	static fromSGF(sgf) {
		return new Kifu(KNode.fromSGF(sgf));
	}
	
	/**
	 * Constructs a new empty Kifu object or Kifu object from a KNode.
	 * 
	 * @param {KNode} [kNode] - KNode object which will serve as root node of the kifu.
	 */
    
	//constructor()
	//constructor(kNode)
	//constructor(boardSize)
	constructor(boardSize, ruleSet) {
		super();
		
		// Board size argument
		if(typeof boardSize == "number") {
			this.currentNode = this.rootNode = new KNode();
			this.rootNode.setProperty("SZ", boardSize);
			
			// ... and rules argument as string
			if(typeof ruleSet == "string") {
				this.rootNode.setProperty("RU", ruleSet);
				this.ruleSet = rules[ruleSet] || rules[DEFAULT_RULES];
			}
			// ... and rules argument as object
			else if(ruleSet != null) {
				this.ruleSet = ruleSet;
			}
			// ... and no second argument
			else {
				this.rootNode.setProperty("RU", DEFAULT_RULES);
				this.ruleSet = rules[DEFAULT_RULES];
			}
		}
		// KNode argument
		else if(boardSize != null) {
			let kNode = boardSize;
			this.rootNode = kNode.root;
			this.currentNode = kNode;
			
			this.ruleSet = rules[this.rootNode.getProperty("RU")] || rules[DEFAULT_RULES];
			boardSize = this.rootNode.getProperty("SZ");
		}
		// No argument
		else {
			this.currentNode = this.rootNode = new KNode();
			this.ruleSet = rules[DEFAULT_RULES];
			this.rootNode.setProperty("SZ", 19);
			this.rootNode.setProperty("RU", DEFAULT_RULES);
		}
		
		this.game = new Game(boardSize, this.ruleSet);
	}
	
	get blackName() {
		return this.rootNode.getProperty("PB");
	}
	
	set blackName(name) {
		this.setGameInfo("PB", name);
	}
	
	get blackRank() {
		return this.rootNode.getProperty("BR");
	}
	
	set blackRank(rank) {
		this.setGameInfo("BR", rank);
	}
	
	get blackTeam() {
		return this.rootNode.getProperty("BT");
	}
	
	set blackTeam(team) {
		this.setGameInfo("BT", team);
	}
	
	get whiteName() {
		return this.rootNode.getProperty("PW");
	}
	
	set whiteName(name) {
		this.setGameInfo("PW", name);
	}
	
	get whiteRank() {
		return this.rootNode.getProperty("WR");
	}
	
	set whiteRank(rank) {
		this.setGameInfo("WR", rank);
		
	}
	
	get whiteTeam() {
		return this.rootNode.getProperty("WT");
	}
	
	set whiteTeam(team) {
		this.setGameInfo("WT", team);
	}
	
	get rules() {
		return this.rootNode.getProperty("RU");
	}
	
	set rules(rules) {
		this.setRulesSet(rules[rules] || rules[DEFAULT_RULES]);
		this.setGameInfo("RU", rules);		
	}
	
	get boardSize() {
		return this.rootNode.getProperty("SZ") || 19;
	}
	
	set boardSize(size) {
		this.setGameInfo("SZ", size);	
	}
		
	setRulesSet(ruleSet) {
		this.ruleSet = ruleSet;
		this.game.setRules(ruleSet);
	}
	
	/**
	 * Gets specified property or all available game info as an object. In this context, all properties 
	 * of the root node are considered as game info.
	 * 
	 * @param {string} [property] of info (sgf identificator), if omitted you will get all properties.
	 */
	getGameInfo(property) {
		if(property != null) return this.rootNode.getProperty(property);
		else return Object.assign({}, this.rootNode.SGFProperties);
	}
	
	/**
	 * Sets game info (as SGF property to root node).
	 * 
	 * @param {string} property of info (sgf identificator)
	 * @param {string} value    of info (sgf value)
	 */
	setGameInfo(property, value) {
		var oldValue = this.rootNode.getProperty(property);
		this.rootNode.setProperty(property, value);
		this.trigger("infoChange", {
			target: this,
			node: this.rootNode,
			key: property,
			oldValue: oldValue,
			value: value
		});
	}
	
	/* ======= NODE MANIPULATION FUNCTIONALITY ================================================== */
	
	/**
	 * Adds a child node to the current node, you can specify a position.
	 * 
	 * @param {KNode}  node  a node to add, if omitted a new node will be created.
	 * @param {number} index - position of node (0 means first position), if omitted the node will be added as last child of current node.
	 */
	addBranch(node, index) {
		if(typeof node == "number") {
			index = node;
			node = new KNode();
		}
		if(node == null) {
			node = new KNode();
		}
		
		if(index == null || index >= this.currentNode.children.length) {
			this.currentNode.appendChild(node);
		}
		else {
			this.currentNode.insertBefore(node, this.currentNode.children[index]);
		}
	}

	/**
	 * Moves current's node child from one position to another
	 * 
	 * @param {number} from index
	 * @param {number} to   index
	 */
	moveBranch(from, to) {
		if(from > to) {
			this.currentNode.children.splice(to, 0, this.currentNode.children.splice(from, 1)[0]);
		}
		else if(from < to) {
			this.currentNode.children.splice(to+1, 1, this.currentNode.children.splice(from, 1)[0]);
		}
	}
	
	/**
	 * Removes current's node child and all its descendants.
	 * 
	 * @param {number} index of child node
	 */
	removeBranch(index) {
		if(index == null) {
			index = this.currentNode.children.length - 1;
		}
		this.currentNode.removeChild(this.currentNode.children[index]);
	}
	
	/**
	 * Adds a child node to the current node, you can specify a position.
	 * 
	 * @param {KNode}  node  a node to add, if omitted a new node will be created.
	 * @param {number} index - position of node (0 means first position), if omitted the node will be added as last child of current node.
	 */
	addNode(node, index) {
		if(typeof node == "number") {
			index = node;
			node = new KNode();
		}
		if(node == null) {
			node = new KNode();
		}
		
		if(index == null || index >= this.currentNode.children.length) {
			this.currentNode.appendChild(node);
		}
		else {
			// find last node of branch
			var lastNode = node;
			while(lastNode.children[0]) {
				lastNode = lastNode.children[0];
			}
			
			// replace nodes
			lastNode.appendChild(this.currentNode.children[index]);
			this.currentNode.children.splice(index, 0, node);
		}
	}
	
	/**
	 * Removes current's node child and all its descendants.
	 * 
	 * @param {number} index of child node
	 */
	removeNode(index) {
		if(index == null) {
			index = this.currentNode.children.length - 1;
		}
		
		var removedNode = this.currentNode.children[index];
		this.currentNode.removeChild(removedNode);		
		this.currentNode.children.splice(index, 0, ...removedNode.children);
	}
	
	/* ======= NODE PROPERTIES ==================================================================== */
	
	/**
	 * Gets move associated to the current node.
	 * 
	 * @returns {Object} move object
	 */
	getMove() {
		
	}
	
	/**
	 * Sets (or removes) move directly to the current node.
	 * 
	 * @param {Object} [move] object, if omitted, move will be removed from the node.
	 */
	setMove(move) {
		
	}
	
	getTurn() {
	
	}
	
	setTurn(turn) {
	
	}
	
	/**
	 * Gets markup on given coordination (as markup object). If coordinates are omitted, you will get all markup in array.
	 * 
	 * @param {number}                      x coordinate
	 * @param {number}                      y coordinate
	 *                                        
	 * @returns {(BoardObject[]|BoardObject)} Markup object or array of markup objects                  
	 */
	getMarkup(x, y) {
		if(arguments.length == 2) {
			for(let propIdent in this.currentNode.SGFProperties) {
				if(markupProperties.indexOf(propIdent) >= 0 && this.currentNode.SGFProperties[propIdent].some(markup => markup.x === x && markup.y === y)) {
					return {x: x, y: y, type: propIdent};
				}
			}
		}
		else {
			let markup = [];
			for(let propIdent in this.currentNode.SGFProperties) {
				if(markupProperties.indexOf(propIdent) >= 0) {
					markup = markup.concat(this.currentNode.SGFProperties[propIdent].map(markup => ({x: markup.x, y: markup.y, type: propIdent})));
				}
			}
			return markup;
		}
	}
	
	/**
	 * Adds markup into the kifu. If there is already markup on the given coordinates, markup won't be added.
	 * 
	 * @param {(BoardObject|BoardObject[]|number)} markupOrX Markup object or array of markup object or x coordinate.
	 * @param {number}                             y         Y coordinate if first argument is coordinate.
	 * @param {string}                             type      Type of markup (if first 2 arguments are coordinates).
	 *                                                       
	 * @returns {boolean}                                    if operation is successfull (markup is added).
	 */
	addMarkup(x, y, type) {
		if(typeof x == "object") {
			type = x.type;
			y = x.y;
			x = x.x;
		}
		if(this.getMarkup(x, y)) {
			return false;
		}
		
		let markup = this.currentNode.getProperty(type) || [];
		markup.push({x, y});
		this.currentNode.setProperty(type, markup);
		
		return true;
	}
	
	/**
	 * The same as addMarkup, but markers can be overridden
	 * @param {[[Type]]} markupOrX [[Description]]
	 * @param {[[Type]]} x         [[Description]]
	 * @param {[[Type]]} type      [[Description]]
	 */
	setMarkup(x, y, type) {
		if(typeof x == "object") {
			type = x.type;
			y = x.y;
			x = x.x;
		}
		
		this.removeMarkup(x, y);
		
		let markup = this.currentNode.getProperty(type) || [];
		markup.push({x, y});
		this.currentNode.setProperty(type, markup);
	}
	
	/**
	 * Removes given markup or markup on coordinates.
	 * 
	 * @param {[[Type]]} markupOrX [[Description]]
	 * @param {[[Type]]} y         [[Description]]
	 */
	removeMarkup(x, y) {
		if(typeof x == "object") {
			y = x.y;
			x = x.x;
		}
		
		for(let propIdent in this.currentNode.SGFProperties) {
			if(markupProperties.indexOf(propIdent) >= 0) {
				this.currentNode.setProperty(propIdent, this.currentNode.SGFProperties[propIdent].filter(markup => markup.x !== x || markup.y !== y));
			}
		}
	}
	
	getSetup(x, y) {
		if(arguments.length == 2) {
			for(let propIdent in this.currentNode.SGFProperties) {
				if(setupProperties[propIdent] != null && this.currentNode.SGFProperties[propIdent].some(setup => setup.x === x && setup.y === y)) {
					return {x: x, y: y, c: setupProperties[propIdent]};
				}
			}
		}
		else {
			let setup = [];
			for(let propIdent in this.currentNode.SGFProperties) {
				if(setupProperties[propIdent] != null) {
					setup = setup.concat(this.currentNode.SGFProperties[propIdent].map(setup => ({x: setup.x, y: setup.y, c: setupProperties[propIdent]})));
				}
			}
			return setup;
		}
	}
	
	addSetup(x, y, color) {
		if(typeof x == "object") {
			color = x.c;
			y = x.y;
			x = x.x;
		}
		if(this.getSetup(x, y)) {
			return false;
		}
		
		let setup = this.currentNode.getProperty(setupPropertiesReversed[color]) || [];
		setup.push({x, y});
		this.currentNode.setProperty(setupPropertiesReversed[color], setup);
		
		return true;
	}
	
	setSetup(x, y, color) {
		if(typeof x == "object") {
			color = x.c;
			y = x.y;
			x = x.x;
		}
		
		for(let propIdent in this.currentNode.SGFProperties) {
			if(setupProperties[propIdent] != null) {
				this.currentNode.setProperty(propIdent, this.currentNode.SGFProperties[propIdent].filter(setup => setup.x !== x || setup.y !== y));
			}
		}
			
		let setup = this.currentNode.getProperty(setupPropertiesReversed[color]) || [];
		setup.push({x, y});
		this.currentNode.setProperty(setupPropertiesReversed[color], setup);
		
		return true;
	}
	
	//removeSetup(x, y) {
	//
	//}
	
	getNodeInfo(property) {
	
	}
	
	setNodeInfo(property, value) {
	
	}
	
	/**
	 * Plays a move (in correct color). It creates a new node and perform next method.
	 * 
	 * @param {Object}  move              coordinates
	 * @param {boolean} [newVariant=true] if false, following nodes will be appended to the new node, instead of creating a new branch (default true)
	 */
	play(move, newVariant) {
		var node = new KNode();
		var ind;
		node.setMove(Object.assign(move, {c: this.game.turn}));
		
		if(newVariant === false && this.node.children[0]) {
			this.node.insertBefore(node, this.node.children[0]);
			ind = 0;
		}
		else {
			ind = this.node.appendChild(node);
		}
		
		this.next(ind);
	}
	
	first() {
	
	}
	
	previous() {
	
	}
	
	next(ind) {
	
	}
	
	last() {
	
	}
	
	goTo(kifuPath) {
	
	}
	
}
