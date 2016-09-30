import KNode from "./KNode.js";
import EventMixin from "../EventMixin.js";
import Game, {rules, DEFAULT_RULES} from "../Game.js";

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
	addNode(node, index) {
	
	}
	
	/**
	 * Removes current's node child, its children will be passed to the current node. 
	 */
	removeNode(index) {
		
	}
	
	/**
	 * Moves current's node child from one position to another
	 * 
	 * @param {number} from index
	 * @param {number} to   index
	 */
	moveNode(from, to) {
	
	}
	
	/**
	 * Removes current's node child and all its descendants.
	 * 
	 * @param {number} index of child node
	 */
	removeBranch(index) {
		
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
	addMarkup(markupOrX, y, type) {
		return;
	}
	
	/**
	 * The same as addMarkup, but markers can be overridden
	 * @param {[[Type]]} markupOrX [[Description]]
	 * @param {[[Type]]} x         [[Description]]
	 * @param {[[Type]]} type      [[Description]]
	 */
	setMarkup(markupOrX, x, type) {
	
	}
	
	/**
	 * Removes given markup or markup on coordinates.
	 * 
	 * @param {[[Type]]} markupOrX [[Description]]
	 * @param {[[Type]]} y         [[Description]]
	 */
	removeMarkup(markupOrX, y) {
	
	}
	
	getSetup() {
	
	}
	
	addSetup() {
	
	}
	
	setSetup(setup) {
	
	}
	
	removeSetup() {
	
	}
	
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
