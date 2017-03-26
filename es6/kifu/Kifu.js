import KNode from "./KNode";
import EventEmitter from "../EventEmitter";
import KifuError from "./KifuError";
import Game, {rules, defaultRules} from "../Game";
import {markupProperties, setupProperties, setupPropertiesReversed} from "./propertyGroups";
import {BLACK, WHITE} from "../core";
import {
	BLACK_NAME,
	BLACK_RANK,
	BLACK_TEAM,
	WHITE_NAME,
	WHITE_RANK,
	WHITE_TEAM,
	DATE,
	EVENT,
	RESULT,
	KOMI,
	BLACK_MOVE,
	WHITE_MOVE,
	SET_TURN,
} from "./properties";

function onCoordinates(x, y) {
	return obj => obj.x === x && obj.y === y;
}

function notOnCoordinates(x, y) {
	return obj => obj.x !== x || obj.y !== y;
}

function normalizeMarkupArguments(setupOrX, y, type) {
	if(typeof setupOrX == "object") {
		return {
			x: setupOrX.x,
			y: setupOrX.y,
			type: setupOrX.type,
		}
	}
	
	return {
		x: setupOrX,
		y,
		type,
	}
}

function getMarkupProperties(kNode) {
	return Object.keys(kNode.SGFProperties).filter(propIdent => markupProperties.indexOf(propIdent) >= 0).map(propIdent => ({
		propIdent,
		value: kNode.SGFProperties[propIdent],
	}));
}

function normalizeSetupArguments(setupOrX, y, c) {
	if(typeof setupOrX == "object") {
		return {
			x: setupOrX.x,
			y: setupOrX.y,
			c: setupOrX.c,
		}
	}
	
	return {
		x: setupOrX,
		y,
		c,
	}
}

function getSetupProperties(kNode) {
	return Object.keys(kNode.SGFProperties).filter(propIdent => setupProperties[propIdent] != null).map(propIdent => ({
		propIdent,
		value: kNode.SGFProperties[propIdent],
	}));
}

/**
 * Kifu class - handles kifu - it can traverse and edit it. Has powerful api.
 * In previous WGo it would be KifuReader.
 */

export default class Kifu extends EventEmitter {
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

	constructor(boardSize, ruleSet) {
		super();
		
		// Board size argument
		if(typeof boardSize == "number") {
			this.currentNode = this.rootNode = new KNode();
			this.rootNode.setProperty("SZ", boardSize);
			
			// ... and rules argument as string
			if(typeof ruleSet == "string") {
				this.rootNode.setProperty("RU", ruleSet);
				this.ruleSet = rules[ruleSet] || rules[defaultRules];
			}
			// ... and rules argument as object
			else if(ruleSet != null) {
				this.ruleSet = ruleSet;
			}
			// ... and no second argument
			else {
				this.rootNode.setProperty("RU", defaultRules);
				this.ruleSet = rules[defaultRules];
			}
		}
		// KNode argument
		else if(boardSize != null) {
			let kNode = boardSize;
			this.rootNode = kNode.root;
			this.currentNode = kNode;
			
			this.ruleSet = rules[this.rootNode.getProperty("RU")] || rules[defaultRules];
			boardSize = this.rootNode.getProperty("SZ");
		}
		// No argument
		else {
			this.currentNode = this.rootNode = new KNode();
			this.ruleSet = rules[defaultRules];
			this.rootNode.setProperty("SZ", 19);
			this.rootNode.setProperty("RU", defaultRules);
		}
		
		this.game = new Game(boardSize, this.ruleSet);
	}
	
	get blackName() {
		return this.rootNode.getProperty(BLACK_NAME);
	}
	
	set blackName(name) {
		this.setGameInfo(BLACK_NAME, name);
	}
	
	get blackRank() {
		return this.rootNode.getProperty(BLACK_RANK);
	}
	
	set blackRank(rank) {
		this.setGameInfo(BLACK_RANK, rank);
	}
	
	get blackTeam() {
		return this.rootNode.getProperty(BLACK_TEAM);
	}
	
	set blackTeam(team) {
		this.setGameInfo(BLACK_TEAM, team);
	}
	
	get whiteName() {
		return this.rootNode.getProperty(WHITE_NAME);
	}
	
	set whiteName(name) {
		this.setGameInfo(WHITE_NAME, name);
	}
	
	get whiteRank() {
		return this.rootNode.getProperty(WHITE_RANK);
	}
	
	set whiteRank(rank) {
		this.setGameInfo(WHITE_RANK, rank);
		
	}
	
	get whiteTeam() {
		return this.rootNode.getProperty(WHITE_TEAM);
	}
	
	set whiteTeam(team) {
		this.setGameInfo(WHITE_TEAM, team);
	}
	
	get date() {
		var date = this.rootNode.getProperty(DATE);
		return date ? new Date(date) : null;
	}
	
	set date(date) {
		var month = date.getMonth();
		var day = date.getDate();

		month = month < 9 ? "0" + (month+1) : month+1;
		day = day < 10 ? "0"+day : day;

		this.setGameInfo(DATE, date.getFullYear()+"-"+month+"-"+day);
	}

	get event() {
		return this.rootNode.getProperty(EVENT);
	}
	
	set event(team) {
		this.setGameInfo(EVENT, team);
	}

	get result() {
		return this.rootNode.getProperty(RESULT);
	}
	
	set result(result) {
		this.setGameInfo(RESULT, result);
	}

	get komi() {
		return this.rootNode.getProperty(KOMI);
	}
	
	set komi(komi) {
		this.setGameInfo(KOMI, komi);
	}

	get rules() {
		return this.rootNode.getProperty("RU");
	}
	
	set rules(rules) {
		this.setRulesSet(rules[rules] || rules[defaultRules]);
		this.setGameInfo("RU", rules);		
	}
	
	get boardSize() {
		return this.rootNode.getProperty("SZ") || 19;
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
	addNode(node, index) {
		if(typeof node == "number") {
			index = node;
			node = new KNode();
		}
		else if(node == null) {
			node = new KNode();
		}
		
		if(index == null || index >= this.currentNode.children.length) {
			this.currentNode.appendChild(node);
		}
		else {
			this.currentNode.insertBefore(node, this.currentNode.children[index]);
		}

		this.trigger("treeChanged", {
			target: this,
			currentNode: this.currentNode,
			type: "addNode",
			node,
			position: index,
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
	moveNode(from, to) {
		var nodeFrom = this.currentNode.children[from];
		var nodeTo = this.currentNode.children[to];

		if(nodeFrom == null || nodeTo == null) {
			throw new KifuError("Argument `from` or argument `to` of method `moveNode()` points to nonexisting node.");
		}

		if(from > to) {
			this.currentNode.children.splice(to, 0, this.currentNode.children.splice(from, 1)[0]);
		}
		else if(from < to) {
			this.currentNode.children.splice(to+1, 1, this.currentNode.children.splice(from, 1)[0]);
		}

		this.trigger("treeChanged", {
			target: this,
			currentNode: this.currentNode,
			type: "moveNode",
			nodeFrom,
			positionFrom: from,
			nodeTo,
			positionTo: to,
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
	removeNode(index) {
		if(index == null) {
			index = this.currentNode.children.length - 1;
		}

		var removedNode = this.currentNode.children[index];

		this.currentNode.removeChild(removedNode);

		this.trigger("treeChanged", {
			target: this,
			currentNode: this.currentNode,
			type: "removeNode",
			node: removedNode,
			position: index,
		});

		return removedNode;
	}

	/* ======= GENERAL NODE PROPERTIES =============================================================*/

	hasMoveProperty() {
		return Object.keys(this.currentNode.SGFProperties).some(propIdent => (
			propIdent == BLACK_MOVE || propIdent == WHITE_MOVE
		));
	}

	hasSetupProperties() {
		return Object.keys(this.currentNode.SGFProperties).some(propIdent => (
			setupProperties[propIdent] != null || setupProperties[propIdent] == SET_TURN
		));
	}

	/* ======= MOVE RELATED PROPERTIES ============================================================== */
	
	/**
	 * Gets move associated to the current node.
	 * 
	 * @returns {Object} move object
	 */
	getMove() {
		if(this.currentNode.SGFProperties[BLACK_MOVE]) {
			return Object.assign({c: BLACK}, this.currentNode.SGFProperties[BLACK_MOVE]);
		}
		else if(this.currentNode.SGFProperties[WHITE_MOVE]) {
			return Object.assign({c: WHITE}, this.currentNode.SGFProperties[WHITE_MOVE]);
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
	setMove(x, y, c) {
		if(this.hasSetupProperties()) {
			throw new KifuError("Move cannot be set. Move properties mustn't be mixed with setup properties.");
		}
		else if(this.currentNode.parent == null) {
			throw new KifuError("Move cannot be set. Root node mustn't contain move properties.");
		}

		({x, y, c} = normalizeSetupArguments(x, y, c));
		this.removeMove();

		if(c == BLACK) this.currentNode.setProperty(BLACK_MOVE, {x, y});
		else if(c == WHITE) this.currentNode.setProperty(WHITE_MOVE, {x, y});
	}

	/**
	 * Removes any move proprty in the current node.
	 */
	removeMove() {
		this.currentNode.setProperty(BLACK_MOVE);
		this.currentNode.setProperty(WHITE_MOVE);
	}
	
	/**
	 * Gets color of currently playing player.
	 */
	getTurn() {
		return this.game.turn;
	}
	
	/**
	 * Sets player of next move.
	 * 
	 * @param {(WGo.B|WGo.W)} turn 
	 */
	setTurn(turn) {
		if(this.hasMoveProperty()) {
			throw new KifuError("Turn can't be set. Setup properties mustn't be mixed with move properties.");
		}

		this.currentNode.setProperty(SET_TURN, turn);
		this.game.turn = turn;
	}
	
	/* ======= MARKUP ==================================================================== */

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

			return null;
		}

		let markupList = [];

		getMarkupProperties(this.currentNode).forEach(({propIdent, value}) => {
			markupList = [
				...markupList,
				value.map(markup => ({
					x: markup.x, 
					y: markup.y, 
					type: propIdent,
				})),
			];
		});

		return markupList;
	}
		
	/**
	 * Adds markup into the kifu. If there is already a markup on given coordinates, it will be overridden.
	 * 
	 * @param {(BoardObject|number)} x         Markup object or x coordinate.
	 * @param {number}               y         Y coordinate if first argument is coordinate.
	 * @param {string}               type      Type of markup (if first 2 arguments are coordinates).
	 */
	setMarkup(x, y, type) {
		({x, y, type} = normalizeMarkupArguments(x, y, type));
		
		this.removeMarkup(x, y);
		
		let markupList = this.currentNode.getProperty(type) || [];
		markupList.push({x, y});
		this.currentNode.setProperty(type, markupList);
	}
	
	/**
	 * Removes given markup or markup on coordinates.
	 * 
	 * @param {(BoardObject|number)} x         Markup object or x coordinate.
	 * @param {number}               y         Y coordinate if first argument is coordinate.
	 */
	removeMarkup(x, y) {
		({x, y} = normalizeMarkupArguments(x, y));
		
		getMarkupProperties(this.currentNode).forEach(({propIdent, value}) => {
			this.currentNode.setProperty(propIdent, value.filter(notOnCoordinates(x, y)));
		});
	}
	
	/* ======= SETUP ==================================================================== */

	/**
	 * Gets setup stone on given coordination (as setup object). If coordinates are omitted, you will get all setup stones in array.
	 * 
	 * @param {number}                      x coordinate
	 * @param {number}                      y coordinate
	 *                                        
	 * @returns {(BoardObject[]|BoardObject)} Markup object or array of markup objects    
	 */
	getSetup(x, y) {
		if(arguments.length == 2) {
			for(let propIdent in this.currentNode.SGFProperties) {
				if(setupProperties[propIdent] != null && this.currentNode.SGFProperties[propIdent].some(onCoordinates(x, y))) {
					return {x: x, y: y, c: setupProperties[propIdent]};
				}
			}

			return null;
		}

		let setupList = [];

		getSetupProperties(this.currentNode).forEach(({propIdent, value}) => {
			setupList = [
				...setupList,
				value.map(setup => ({
					x: setup.x, 
					y: setup.y, 
					c: setupProperties[propIdent],
				})),
			];
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
	setSetup(x, y, c) {
		if(this.hasMoveProperty()) {
			throw new KifuError("Stone cannot be set. Setup properties mustn't be mixed with move properties.");
		}

		({x, y, c} = normalizeSetupArguments(x, y, c));
		
		this.removeSetup(x, y);
		
		let setupList = this.currentNode.getProperty(setupPropertiesReversed[c]) || [];
		setupList.push({x, y});
		this.currentNode.setProperty(setupPropertiesReversed[c], setupList);
	}
	
	/**
	 * Removes given setup or setup stone on coordinates.
	 * 
	 * @param {(BoardObject|number)} x         Setup object or x coordinate.
	 * @param {number}               y         Y coordinate if first argument is coordinate.
	 */
	removeSetup(x, y) {
		({x, y} = normalizeSetupArguments(x, y));
		
		getSetupProperties(this.currentNode).forEach(({propIdent, value}) => {
			this.currentNode.setProperty(propIdent, value.filter(notOnCoordinates(x, y)));
		});
	}
	
	/* ======= TRAVERSING ==================================================================== */

	first() {
		this.currentNode = this.rootNode;
		this.game.firstPosition();
	}
	
	previous() {
		if(this.currentNode.parent != null) {
			this.currentNode = this.currentNode.parent;
			this.game.popPosition();
		}
	}
	
	next(index = 0) {
		if(this.currentNode.children[index] != null) {
			this.currentNode = this.currentNode.children[index];
			this.executeNode();
		}
	}
	
	last() {
		while(this.currentNode.children[0]) {
			this.currentNode = this.currentNode.children[0];
			this.executeNode();
		}
	}

	goTo(kifuPath) {
	
	}

	/**
	 * Executes current node - new position will be created in game object.
	 * This method should be called when there is new current node and you want to
	 * to reflect node properties in game object (play move, set stones...).
	 */
	executeNode() {
		const move = this.getMove();

		if(move != null) {
			this.game.play(move.x, move.y, move.c);
		}
		else {
			this.game.pushPosition(this.game.position.clone());

			getSetupProperties(this.currentNode).forEach(({propIdent, value}) => {
				value.forEach(({x, y}) => this.game.addStone(x, y, setupProperties[propIdent]));
			});
		}
	}

	/**
	 * Refresh game object - should be called, when current node's move or setup stones have changed.
	 */
	refreshGame() {
		if(this.currentNode.parent == null) {
			getSetupProperties(this.currentNode).forEach(({propIdent, value}) => {
				value.forEach(({x, y}) => this.game.addStone(x, y, setupProperties[propIdent]));
			});
		}
		else {
			this.game.popPosition();
			this.executeNode();
		}
	}

	/* ======= SHORTCUTS AND HELPERS ========================================================= */

	getPosition() {
		return this.game.position;
	}

	isValidMove(move) {
		return this.game.isValid(move.x, move.y);
	}

	/**
	 * Plays a move. This is a shortcut for creating a node, setting a move property and traversing on it.
	 * 
	 * @param {Object}  move              coordinates
	 * @param {boolean} [newVariant=true] if false, following nodes will be appended to the new node, instead of creating a new branch (default true)
	 */
	play(move, newVariant = true) {
		const newNode = new KNode();
		const {x, y, c} = newNode;

		if(c == BLACK) newNode.setProperty(BLACK_MOVE, {x, y});
		else if(c == WHITE) newNode.setProperty(WHITE_MOVE, {x, y});

		if(newVariant === false && this.node.children[0]) {

			this.currentNode.children.forEach((node) => {
				newNode.appendChild(node);
			});

			this.next(this.currentNode.appendChild(newNode));
		}
		else {
			this.next(this.currentNode.appendChild(newNode));
		}
	}
	
}
