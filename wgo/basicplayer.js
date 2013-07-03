
(function(WGo){

// player counter - for creating unique ids
var pl_count = 0;

// generate DOM of region
var playerBlock = function(name, parent, visible) {
	var e = {};
	e.element = document.createElement("div");
	e.element.className = "wgo-player-"+name;
	e.wrapper = document.createElement("div");
	e.wrapper.className = "wgo-player-"+name+"-wrapper";
	e.element.appendChild(e.wrapper);
	parent.appendChild(e.element);
	if(!visible) e.element.style.display = "none";
	return e;
}

// generate all DOM of player
var BPgenerateDom = function() {
	// wrapper object for common DOM
	this.dom = {};
	
	// center element
	this.dom.center = document.createElement("div");
	this.dom.center.className = "wgo-player-center";
	
	// board wrapper element
	this.dom.board = document.createElement("div");
	this.dom.board.className = "wgo-player-board";
	
	// object wrapper for regions (left, right, top, bottom)
	this.regions = {};
	
	/*
	DOM structure:
	<main>
		<left></left>
		<center>
			<top></top>
			<board></board>
			<bottom></bottom>
		</center>
		<right></right>
	</main>
	*/
	
	this.regions.left = playerBlock("left", this.element);
	this.element.appendChild(this.dom.center);
	this.regions.right = playerBlock("right", this.element);
	
	this.regions.top = playerBlock("top", this.dom.center);
	this.dom.center.appendChild(this.dom.board);
	this.regions.bottom = playerBlock("bottom", this.dom.center);
}

var getCurrentLayout = function() {
	var cl = this.config.layout;
	if(cl.constructor != Array) return cl;
	
	var bh = this.height || this.maxHeight;
	for(var i = 0; i < cl.length; i++) {
		
		if(!cl[i].conditions || (
			(!cl[i].conditions.minWidth || cl[i].conditions.minWidth <= this.width) &&
			(!cl[i].conditions.minHeight || !bh || cl[i].conditions.minHeight <= bh) &&
			(!cl[i].conditions.maxWidth || cl[i].conditions.maxWidth >= this.width) &&
			(!cl[i].conditions.maxHeight || !bh || cl[i].conditions.maxHeight >= bh) &&
			(!cl[i].conditions.custom || cl[i].conditions.custom.call(this))
		  )) {
			return cl[i];
		}
	}
}

var appendComponents = function(area) {
	var components = this.currentLayout.layout[area];
	
	if(components) {
		this.regions[area].element.style.display = "block";
		
		for(var i in components) {
			if(!this.components[components[i]]) this.components[components[i]] = new BasicPlayer.component[components[i]](this);
			
			this.components[components[i]].appendTo(this.regions[area].wrapper);
			
			// remove detach flag
			this.components[components[i]]._detachFromPlayer = false;
		}
	}
	else {
		this.regions[area].element.style.display = "none";
	}

}

var manageComponents = function() {
	// add detach flags to every widget
	for(var key in this.components) {
		this.components[key]._detachFromPlayer = true;
	}
	
	appendComponents.call(this, "left");
	appendComponents.call(this, "right");
	appendComponents.call(this, "top");
	appendComponents.call(this, "bottom");
	
	// detach all invisible components
	for(var key in this.components) {
		if(this.components[key]._detachFromPlayer && this.components[key].element.parentNode) this.components[key].element.parentNode.removeChild(this.components[key].element);
	}
}

var BasicPlayer = WGo.extendClass(WGo.PlayerTemplate, function(elem, config) {
	this.config = config;
	
	// add default configuration
	for(var key in BasicPlayer.default) if(this.config[key] === undefined && BasicPlayer.default[key] !== undefined) this.config[key] = BasicPlayer.default[key];
	
	this.player = new WGo.Player({
		kifuLoaded: this.config.kifuLoaded,
		update: this.config.update,
	});
	
	this.element = elem
	this.element.innerHTML = "";
	this.element.className += " wgo-player-main";
	this.element.id = "wgo_"+(pl_count++);
	
	BPgenerateDom.call(this);
	
	this.board = new WGo.Board(this.dom.board, this.config.board);
	
	this.components = {};
	
	window.addEventListener("resize", function() {
		if(!this.noresize) {
			this.element.style.position = "absolute";
	
			var css = window.getComputedStyle(this.element.parentNode);
			this.width = parseInt(css.width);
			this.height = parseInt(css.height);
			this.maxHeight = parseInt(css.maxHeight);
			
			this.element.style.position = "static";
		}
		this.updateDimensions();
	}.bind(this));
	
	var css = window.getComputedStyle(this.element);
	this.width = parseInt(css.width);
	this.height = parseInt(css.height);
	this.maxHeight = parseInt(css.maxHeight);
	this.updateDimensions();
	
	this.init();
});

BasicPlayer.prototype.appendTo = function(elem) {
	var css = window.getComputedStyle(elem);

	this.width = parseInt(css.width);
	this.height = parseInt(css.height);
	this.maxHeight = parseInt(css.maxHeight);
	
	elem.appendChild(this.element);
	this.updateDimensions();
}
	
BasicPlayer.prototype.updateDimensions = function() {
	this.currentLayout = getCurrentLayout.call(this);

	if(this.currentLayout && this.lastLayout != this.currentLayout) {
		if(this.currentLayout.className) this.element.className = "wgo-player-main "+this.currentLayout.className;
		else this.element.className = "wgo-player-main";
		manageComponents.call(this);
		this.lastLayout = this.currentLayout;
	}
	
	//var bw = this.width - this.regions.left.element.clientWidth - this.regions.right.element.clientWidth;
	var bw = this.dom.board.clientWidth;
	var bh = this.height || this.maxHeight;
	
	if(bh) {
		bh -= this.regions.top.element.clientHeight + this.regions.bottom.element.clientHeight;
	}
	
	if(bh && bh < bw) {
		if(bh != this.board.height) this.board.setHeight(bh);
	}
	else {
		if(bw != this.board.width) this.board.setWidth(bw);
	}
	
	var diff = bh - bw;
	
	if(diff > 0) {
		this.dom.board.style.height = bh+"px";
		this.dom.board.style.paddingTop = (diff/2)+"px";
	}
	else {
		this.dom.board.style.height = "auto";
		this.dom.board.style.paddingTop = "0";
	}
	
	this.regions.left.element.style.height = this.dom.center.clientHeight+"px";
	this.regions.right.element.style.height = this.dom.center.clientHeight+"px";

	for(var i in this.components) {
		if(this.components[i].updateDimensions) this.components[i].updateDimensions();
	}
}
	
/**
 * Layout contains built-in info box, for displaying of text(html) messages.
 * You can use this method to display a message.
 * 
 * @param text or html to display
 * @param closeCallback optional callback function which is called when message is closed
 */

BasicPlayer.prototype.showMessage = function(text, closeCallback, permanent) {
	this.info_overlay = document.createElement("div");
	this.info_overlay.style.width = this.element.clientWidth+"px";
	this.info_overlay.style.height = this.element.clientHeight+"px";
	this.info_overlay.className = "wgo-info-overlay";
	this.element.appendChild(this.info_overlay);
	
	var info_message = document.createElement("div");
	info_message.className = "wgo-info-message";
	info_message.innerHTML = text;
	
	var close_info = document.createElement("div");
	close_info.className = "wgo-info-close";
	if(!permanent) close_info.innerHTML = "click anywhere to close this window";
	
	info_message.appendChild(close_info);
	
	this.info_overlay.appendChild(info_message);
	
	if(closeCallback) {
		this.info_overlay.addEventListener("click",function(e) {
			closeCallback(e);
		});
	}
	else if(!permanent) {
		this.info_overlay.addEventListener("click",function(e) {
			this.hideMessage();
		}.bind(this));
	}
}

/**
 * Hide a message box.
 */
 
BasicPlayer.prototype.hideMessage = function() {
	this.element.removeChild(this.info_overlay);
}

BasicPlayer.component = {};

/**
 * Preset layouts
 * They have defined regions as arrays, which can contain components. Each component specifies where it should be.
 * User can create custom layout. TODO: write better description
 */
 
BasicPlayer.layouts = {
	"one_column": {
		top: [],
		bottom: [],
	},
	"no_comment": {
		top: [],
		bottom: [],
	},
	"right_top": {
		top: [],
		right: [],
	},
	"right": {
		right: [],
	},
	"minimal": {
		bottom: []
	},
};

/**
 * WGo player can have more layouts. It allows responsive design of the player.
 * Possible layouts are defined as array of object with this structure:
 * 
 * layout = {
 *   Object layout, // layout as specified above
 *   Object conditions, // conditions that has to be valid to apply this layout
 *   String className // custom classnames
 * }
 *
 * possible conditions:
 *  - minWidth - minimal width of player in px
 *  - maxWidth - maximal width of player in px
 *  - minHeight - minimal height of player in px
 *  - maxHeight - maximal height of player in px
 *  - custom - function which is called in template context, must return true or false
 *
 * Player template evaluates layouts step by step and first layout that matches the conditions is applied.
 *
 * Look below at the default dynamic layout. Layout is tested after every window resize.
 */

BasicPlayer.dynamicLayout = [
	{
		conditions: {
			minWidth: 650,
		},
		layout: BasicPlayer.layouts["right_top"], 
		className: "wgo-twocols",
	},
	{
		conditions: {
			minWidth: 550,
			minHeight: 600,
		},
		layout: BasicPlayer.layouts["one_column"],
	},
	{
		conditions: {
			minWidth: 450,
			minHeight: 400,
		},
		layout: BasicPlayer.layouts["no_comment"],
	},
	{
		conditions: {
			minWidth: 350,
		},
		layout: BasicPlayer.layouts["minimal"],
		className: "wgo-400", 
	},
	{	// if conditions object id omitted, layout is applied 
		layout: BasicPlayer.layouts["minimal"],
		className: "wgo-400 wgo-300", 
	},
];

// default settings, they are merged with user settings in constructor.
BasicPlayer.default = {
	layout: BasicPlayer.dynamicLayout,
	board: {},
	sgf: undefined,
	sgfFile: undefined,
	kifuLoaded: undefined,
	update: undefined,
	permalinks: true,
	enableWheel: true,
	lockScroll: true,
	enableKeys: true,
	formatNicks:true,
	formatMoves:true,
}

//--- Handling <div> with data attributes -----------------------------------------------------------------

BasicPlayer.attributes = {
	"data-wgo": function(value) {
		if(value) {
			if(value[0] == "(") this.sgf = value;
			else this.sgfFile = value;
		}
	},
	
	"data-wgo-board": function(value) {
		// using eval to parse strings like "stoneStyle: 'painted'"
		this.board = eval("({"+value+"})");
	},
	
	"data-wgo-onkifuload": function(value) {
		this.kifuLoaded = new Function(value);
	},
	
	"data-wgo-onupdate": function(value) {
		this.update = new Function(value);
	},
	
	"data-wgo-layout": function(value) {
		this.layout = eval("({"+value+"})");
	}	
}

var player_from_tag = function(elem) {
	var att, config, pl;
	
	config = {};

	for(var a = 0; a < elem.attributes.length; a++) {
		att = elem.attributes[a];
		if(BasicPlayer.attributes[att.name]) BasicPlayer.attributes[att.name].call(config, att.value, att.name);
	}

	pl = new BasicPlayer(elem, config);
	
	window.__pl__ = pl;
}

WGo.BasicPlayer = BasicPlayer;

window.addEventListener("DOMContentLoaded", function() {
	var pl_elems = document.querySelectorAll("[data-wgo]");
	
	for(var i = 0; i < pl_elems.length; i++) {
		player_from_tag(pl_elems[i]);
	}
});

})(WGo);
