import KNode from "./KNode.js";
import EventMixin from "../EventMixin.js";

/**
 * Kifu class - handles kifu - it can traverse and edit it. Has powerfull api.
 * In previous WGo it would be KifuReader.
 */

export default class Kifu /*extends EventMixin()*/ {
	/**
	 * Constructs a new Kifu object.
	 * 
	 * @param {KNode?} kNode - some KNode object of the kifu.
	 */
	constructor(kNode) {
		//super();
		
		this.rootNode = kNode ? kNode.root : new KNode();
		this.currentNode = kNode || this.rootNode;
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
	
	setRules(gameRules) {
	
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
