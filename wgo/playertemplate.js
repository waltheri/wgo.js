
(function(WGo){

// player counter - for creating unique ids
var pl_count = 0;

// basic updating function - handles board changes
var update_board = function(e) {
	if(!e.change) return;
	
	// update board's position
	this.board.update(e.change);
	
	// remove old markers from the board
	if(this.temp_marks) this.board.removeObject(this.temp_marks);
	
	// init array for new objects
	var add = [];
	
	// add current move marker
	if(e.node.move) add.push({
		type: "CR",
		x: e.node.move.x, 
		y: e.node.move.y
	});
	
	// add variantion letters
	if(e.node.children.length > 1) {
		for(var i = 0; i < e.node.children.length; i++) {
			if(e.node.children[i].move)	add.push({
				type: "LB",
				text: String.fromCharCode(65+i),
				x: e.node.children[i].move.x,
				y: e.node.children[i].move.y
			});
		}
	}
	
	// add other markup
	if(e.node.markup) {
		for(var i in e.node.markup) {
			for(var j = 0; j < add.length; j++) {
				if(e.node.markup[i].x == add[j].x && e.node.markup[i].y == add[j].y) {
					add.splice(j,1);
					j--;
				}
			}
		}
		add = add.concat(e.node.markup);
	}
	
	// add new markers on the board
	this.temp_marks = add;
	this.board.addObject(add);
}

var prepare_board = function() {
	this.board.removeAllObjects();
	if(this.config.enableWheel) this.enableWheel();
}

// detecting scrolling of element - e.g. when we are scrolling text in comment box, we want to be aware. 
var detect_scrolling = function(node, bp) {
	if(node == bp.element || node == bp.element) return false;
	else if(node._wgo_scrollable || (node.scrollHeight > node.offsetHeight)) return true;
	else return detect_scrolling(node.parentNode, bp);
}

// mouse wheel event callback, for replaying a game
var wheel_lis = function(e) {
	var delta = e.wheelDelta || e.detail*(-1);
	
	// if there is scrolling in progress within an element, don't change position
	if(detect_scrolling(e.target, this)) return true;
	
	if(delta < 0) {
		this.player.next();
		if(this.config.lockScroll && e.preventDefault) e.preventDefault();
		return !this.config.lockScroll;
	}
	else if(delta > 0) {
		this.player.previous();
		if(this.config.lockScroll && e.preventDefault) e.preventDefault();
		return !this.config.lockScroll;
	}
	return true;
};

// function handling board clicks in normal mode
var board_click_default = function(x,y) {
	if(!this.kifuReader || !this.kifuReader.node) return false;
	for(var i in this.kifuReader.node.children) {
		if(this.kifuReader.node.children[i].move && this.kifuReader.node.children[i].move.x == x && this.kifuReader.node.children[i].move.y == y) {
			this.next(i);
			return;
		}
	}
}

// coordinates drawing handler - adds coordinates on the board
var coordinates = {
	grid: {
		draw: function(args, board) {
			var ch, t, xright, xleft, ytop, ybottom;
			
			this.fillStyle = "rgba(0,0,0,0.7)";
			this.textBaseline="middle";
			this.textAlign="center";
			this.font = board.stoneRadius+"px "+(board.font || "");
			
			xright = board.getX(-0.75);
			xleft = board.getX(board.size-0.25);
			ytop = board.getY(-0.75);
			ybottom = board.getY(board.size-0.25);
			
			for(var i = 0; i < board.size; i++) {
				ch = i+"A".charCodeAt(0);
				if(ch >= "I".charCodeAt(0)) ch++;
				
				t = board.getY(i);
				this.fillText(board.size-i, xright, t);
				this.fillText(board.size-i, xleft, t);
				
				t = board.getX(i);
				this.fillText(String.fromCharCode(ch), t, ytop);
				this.fillText(String.fromCharCode(ch), t, ybottom);
			}
			
			this.fillStyle = "black";
		}
	}
}

var PlayerTemplate = function(config) {
	this.config = config;
	
	// add default configuration
	for(var key in PlayerTemplate.default) if(this.config[key] === undefined && PlayerTemplate.default[key] !== undefined) this.config[key] = PlayerTemplate.default[key];
	
	this.element = document.createElement("div");
	this.player = new WGo.Player({});
	this.board = new WGo.Board(this.element, this.config.board);
}

PlayerTemplate.prototype = {
	constructor: PlayerTemplate,
	
	init: function() {
		this.player.addEventListener("kifuLoaded", prepare_board.bind(this));
		this.player.addEventListener("update", update_board.bind(this));
		
		this.board.addEventListener("click", board_click_default.bind(this.player));
		
		// try to load game passed in configuration
		if(this.config.sgf) {
			this.player.loadSgf(this.config.sgf);
		}
		else if(this.config.json) {
			this.player.loadJSON(this.config.json);
		}
		else if(this.config.sgfFile) {
			this.player.loadSgfFromFile(this.config.sgfFile);
		}
	},
	
	appendTo: function(elem) {
		elem.appendChild(this.element);
	},
	
	/**
	 * Enable mouse wheel to control player.
	 */
	
	enableWheel: function() {
		if(this._wheel_listener) return;
		
		this._wheel_listener = wheel_lis.bind(this);
		var type = WGo.mozilla ? "DOMMouseScroll" : "mousewheel";
		this.element.addEventListener(type,this._wheel_listener);
	}, 
	
	/**
	 * Disable mouse wheel listener
	 */
	
	disableWheel: function() {
		if(!this._wheel_listener) return;

		var type = WGo.mozilla ? "DOMMouseScroll" : "mousewheel";
		this.element.removeEventListener(type,this._wheel_listener);
		delete this._wheel_listener;
	},
	
	/**
	 * Toggle coordinates around the board.
	 */
	 
	toggleCoordinates: function() {
		this.coordinates = !this.coordinates;
		if(this.coordinates) {
			this.board.setSection(-0.5, -0.5, -0.5, -0.5);
			this.board.addCustomObject(coordinates);
		}
		else {
			this.board.setSection(0, 0, 0, 0);
			this.board.removeCustomObject(coordinates);
		}
		return this.coordinates;
	},
}

PlayerTemplate.default = {
	sgf: undefined,
	json: undefined,
	sgfFile: undefined,
	board: {},
	enableWheel: true,
	lockScroll: true,
	enableKeys: true,
}

WGo.PlayerTemplate = PlayerTemplate;

})(WGo);
