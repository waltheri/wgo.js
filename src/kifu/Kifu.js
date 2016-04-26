/**
 * Contains implementation of Kifu's object used in WGo
 * @module Kifu
 */

var KNode = require("./KNode");
var WGo = require("../WGo");

var recursive_save = function(gameTree, node) {
	gameTree.push(JSON.parse(JSON.stringify(node.getProperties())));
	if(node.children.length > 1) {
		var nt = [];
		for(var i = 0; i < node.children.length; i++) {
			var t = [];
			recursive_save(t, node.children[i]);
			nt.push(t);
		}
		gameTree.push(nt);
	}
	else if(node.children.length) {
		recursive_save(gameTree, node.children[0]);
	}
}

var recursive_save2 = function(gameTree, node) {
	var anode = node;
	var tnode;
	
	for(var i = 1; i < gameTree.length; i++) {
		if(gameTree[i].constructor == Array) {
			for(var j = 0; j < gameTree[i].length; j++) {
				tnode = new KNode(gameTree[i][j][0]);
				anode.appendChild(tnode);
				recursive_save2(gameTree[i][j], tnode);
			}
		}
		else {
			tnode = new KNode(gameTree[i]);
			anode.insertAfter(tnode);
			anode = tnode;
		}
	}
}

/**
 * Kifu class - for storing go game record and easy manipulation with it
 * 
 * @alias WGo.kifu.Kifu
 * @class
 */

var Kifu = function() {
	this.size = 19;
	this.info = {};
	this.root = new KNode();
	this.nodeCount = 0;
	this.propertyCount = 0;
}

Kifu.prototype ={
	constructor: Kifu,
	
	clone: function() {
		var clone = new Kifu();
		clone.size = this.size;
		clone.info = JSON.parse(JSON.stringify(this.info));
		clone.root = this.root.clone();
		clone.nodeCount = this.nodeCount;
		clone.propertyCount = this.propertyCount;
		return clone;
	},
	
	// to be removed (probably)
	hasComments: function() {
		return !!this.root.findProperty("comment");
	},
}

/**
 * Create kifu object from SGF string
 */

/*Kifu.fromSgf = function(sgf) {
	return WGo.SGF.parse(sgf);
}*/

/**
 * Create kifu object from JGO
 */

Kifu.fromJGO = function(arg) {
	var jgo = typeof arg == "string" ? JSON.parse(arg) : arg;
	var kifu = new Kifu();
	kifu.info = JSON.parse(JSON.stringify(jgo.info));
	kifu.size = jgo.size;
	kifu.nodeCount = jgo.nodeCount;
	kifu.propertyCount = jgo.propertyCount;
		
	kifu.root = new KNode(jgo.game[0]);
	recursive_save2(jgo.game, kifu.root);
	
	return kifu;
}

/**
 * Return SGF string from kifu object
 */

/*Kifu.prototype.toSgf = function() {
	var output = {sgf: "(\n;"};
	
	var root_props = {};
	
	// other info
	for(var key in this.info) {
		if(key == "black") {
			if(this.info.black.name) root_props.PB = sgf_escape(this.info.black.name);
			if(this.info.black.rank) root_props.BR = sgf_escape(this.info.black.rank);
			if(this.info.black.team) root_props.BT = sgf_escape(this.info.black.team);
		}
		else if(key == "white") {
			if(this.info.white.name) root_props.PW = sgf_escape(this.info.white.name);
			if(this.info.white.rank) root_props.WR = sgf_escape(this.info.white.rank);
			if(this.info.white.team) root_props.WT = sgf_escape(this.info.white.team);
		}
		else root_props[key] = sgf_escape(this.info[key]);
	}
	
	// board size
	if(this.size) root_props.SZ = this.size;
	
	// add missing info
	if(!root_props.AP) root_props.AP = "WGo.js:2";
	if(!root_props.FF) root_props.FF = "4";
	if(!root_props.GM) root_props.GM = "1";
	if(!root_props.CA) root_props.CA = "UTF-8";
	
	// write root
	for(var key in root_props) {
		if(root_props[key]) output.sgf += key+"["+root_props[key]+"]";
	}
	
	sgf_write_node(this.root, output);
	
	output.sgf += ")";
	
	return output.sgf;
}

/**
 * Return JGO from kifu object
 */

Kifu.prototype.toJGO = function(stringify) {
	var jgo = {};
	jgo.size = this.size;
	jgo.info = JSON.parse(JSON.stringify(this.info));
	jgo.nodeCount = this.nodeCount;
	jgo.propertyCount = this.propertyCount;
	jgo.game = [];
	recursive_save(jgo.game, this.root);
	if(stringify) return JSON.stringify(jgo);
	else return jgo;
}

var player_formatter = function(value) {
	var str;
	if(value.name) {
		str = WGo.filterHTML(value.name);
		if(value.rank) str += " ("+WGo.filterHTML(value.rank)+")";
		if(value.team) str += ", "+WGo.filterHTML(value.team);
	}
	else {
		if(value.team) str = WGo.filterHTML(value.team);
		if(value.rank) str += " ("+WGo.filterHTML(value.rank)+")";
	}
	return str;
}

/**
 * Game information formatters. Each formatter is a function which somehow formats input text.
 */

Kifu.infoFormatters = {
	black: player_formatter,
	white: player_formatter,
	TM: function(time) {
		if(time == 0) return WGo.t("none");
		
		var res, t = Math.floor(time/60);
		
		if(t == 1) res = "1 "+WGo.t("minute");
		else if(t > 1) res = t+" "+WGo.t("minutes");
		
		t = time%60;
		if(t == 1) res += " 1 "+WGo.t("second");
		else if(t > 1) res += " "+t+" "+WGo.t("seconds");
		
		return res;
	},
	RE: function(res) {
		return '<a href="javascript: void(0)" onclick="this.parentNode.innerHTML = \''+WGo.filterHTML(res)+'\'" title="'+WGo.t('res-show-tip')+'">'+WGo.t('show')+'</a>';
	},
}

/**
 * List of game information properties
 */

Kifu.infoList = ["black", "white", "AN", "CP", "DT", "EV", "GN", "GC", "HA", "ON", "OT", "RE", "RO", "RU", "SO", "TM", "US","PC", "KM"];

module.exports = Kifu;