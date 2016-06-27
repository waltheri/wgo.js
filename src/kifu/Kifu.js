import KNode from "./KNode.js";
import EventMixin from "../EventMixin.js";
import {JAPANESE_RULES, CHINESE_RULES, ING_RULES, NO_RULES} from "../Game.js";

/**
 * Kifu class - handles kifu - it can traverse and edit it. Has powerful api.
 * In previous WGo it would be KifuReader.
 */

export default class Kifu /*extends EventMixin()*/ {
	/**
	 * Creates a Kifu object from the JSGF object
	 * 
	 * @param   {Object} jsgf object
	 * @returns {Kifu}   Kifu object
	 */
	static fromJSGF(jsgf) {
		return new Kifu(KNode.fromJSGF(jsgf));
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
	constructor(kNode) {
		//super();
		
		this.rootNode = kNode ? kNode.root : new KNode();
		this.currentNode = kNode || this.rootNode;
		this.ruleSet = 
		this.game = new Game(this.boardSize, this.getRulesSet());
	}
	
	get blackName() {
		return this.rootNode.getProperty("PB");
	}
	
	set blackName(name) {
		this.rootNode.setProperty("PB", name);
	}
	
	get blackRank() {
		return this.rootNode.getProperty("BR");
	}
	
	set blackRank(rank) {
		this.rootNode.setProperty("BR", rank);
	}
	
	get blackTeam() {
		return this.rootNode.getProperty("BT");
	}
	
	set blackTeam(team) {
		this.rootNode.setProperty("BT", rank);
	}
	
	get whiteName() {
		return this.rootNode.getProperty("PW");
	}
	
	set whiteName(name) {
		this.rootNode.setProperty("PW", name);
	}
	
	get whiteRank() {
		return this.rootNode.getProperty("WR");
	}
	
	set whiteRank(rank) {
		this.rootNode.setProperty("WR", rank);
	}
	
	get whiteTeam() {
		return this.rootNode.getProperty("WT");
	}
	
	set whiteTeam(team) {
		this.rootNode.setProperty("WT", rank);
	}
	
	get rules() {
		return this.rootNode.getProperty("RU");
	}
	
	set rules(rules) {
		switch(rules) {
			case "Japanese":
				this.setRulesSet(JAPANESE_RULES);
				break;
			case "GOE", "NZ":
				this.setRulesSet(ING_RULES);
				break;
			case "AGA", "Chinese":
				this.setRulesSet(CHINESE_RULES);
				break;
			default:
				this.setRulesSet(NO_RULES);
		}
		
		this.rootNode.setProperty("RU", rules);
	}
	
	get boardSize() {
		return this.rootNode.getProperty("SZ") || 19;
	}
	
	set boardSize(size) {
		return this.rootNode.setProperty("SZ", size);
	}
	
	setRulesSet(gameRules) {
		this.rulesSet = gameRules;
		this.game.setRules(gameRules);
	}
	
	getRulesSet() {
		return this.rulesSet;
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
		this.rootNode.setProperty(property, value);
	}
	
	/**
	 * Gets move associated to the current node.
	 * 
	 * @returns {Object} move object
	 */
	getMove() {
		return this.node.move;
	}
	
	/**
	 * Sets (or removes) move directly to the current node.
	 * 
	 * @param {Object} [move] object, if omitted, move will be removed from the node.
	 */
	setMove(move) {
		this.node.setMove(move);
	}
	
	getTurn() {
	
	}
	
	setTurn(turn) {
	
	}
	
	getMarkup() {
	
	}
	
	setMarkup(markup) {
	
	}
	
	getNodeInfo(property) {
	
	}
	
	setNodeInfo(property, value) {
	
	}
	
	getSetup() {
	
	}
	
	setSetup(setup) {
	
	}
	
	/**
	 * Plays a move (in correct color). It creates a new node and perform next method.
	 * 
	 * @param {Object}  move              coordinates
	 * @param {boolean} [newVariant=true] if false, following nodes will be appended to the new node, instead of creating a new branch (default true)
	 */
	play(move, newVariant) {
		var node = new Node();
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
