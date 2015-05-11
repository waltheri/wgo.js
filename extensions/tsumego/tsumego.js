
/**
 * Tsumego (go problems) viewer for WGo.js.
 * It requires files: wgo.js, player.js, sgfparser.js, kifu.js
 */

(function(WGo){

"use strict";

// decide whether variation is good or bad
var evaluate_variation_rec = function(node) {
	var tmp, val = 0;

	if(node.children.length) {
		// node has descendants
		for(var i = 0; i < node.children.length; i++) {
			// extract the best variation
			tmp = evaluate_variation_rec(node.children[i]);
			if(tmp > val) val = tmp;
		}
	}
	else {
		// node is a leaf
		if(node.DO) val = 1; // doubtful move (not entirely incorrect)
		else if(node.IT) val = 2; // interesting move (not the best one but correct solution)
		else if(node.TE) val = 3; // correct solution
	}
	
	// store in the node as integer
	node._ev = val;
	
	return val;
}

var get_coordinates = function(sgf_cords) {
	return [sgf_cords.charCodeAt(0)-97, sgf_cords.charCodeAt(1)-97];
}

// function extending board clicks
var board_click = function(x,y) {
	if(this.frozen || this.turn != this.kifuReader.game.turn || this.kifuReader.node.children.length == 0 || !this.kifuReader.game.isValid(x, y)) return;
	this.kifuReader.node.appendChild(new WGo.KNode({
		move: {
			x: x, 
			y: y, 
			c: this.kifuReader.game.turn
		}, 
		_ev: -1,
	}));
	this.next(this.kifuReader.node.children.length-1);
}

/**
 * Class containing logic for tsumego mode (backend).
 */
var TsumegoApi = WGo.extendClass(WGo.Player, function(config) {
	this.config = config;
	
	// add default configuration of TsumegoApi
	for(var key in TsumegoApi.default) if(this.config[key] === undefined && TsumegoApi.default[key] !== undefined) this.config[key] = TsumegoApi.default[key];
	
	// add default configuration of Player class
	for(var key in WGo.Player.default) if(this.config[key] === undefined && WGo.Player.default[key] !== undefined) this.config[key] = WGo.Player.default[key];
	
	// create element with board - it can be inserted to DOM
	this.boardElement = document.createElement("div");

	this.board = new WGo.Board(this.boardElement, this.config.board);
	
	// Player object has to contain element.
	this.element = this.element || this.boardElement;
	
	this.upper_left = [0,0];
	this.lower_right = [18,18];
	
	this.init();
	this.board.addEventListener("click", board_click.bind(this));
	this.listeners.variationEnd = [function(e){console.log(e)}];
	this.listeners.nextMove = [function(e){console.log(e)}];
});


/**
 * Overrides loading of kifu, we must decide correct and incorrect variations and who turn it is.
 */
TsumegoApi.prototype.loadKifu = function(kifu, path) {
	// analyze kifu
	if(kifu.root.children.length && kifu.root.children[0].move) {
		this.turn = kifu.root.children[0].move.c;
	}
	else {
		console.log("invalid kifu");
	}
	
	for(var i = 0; i < kifu.root.children.length; i++) {
		evaluate_variation_rec(kifu.root.children[i]);
	}
	
	this.kifu = kifu;
	this.kifuReader = new WGo.KifuReader(this.kifu, this.config.rememberPath, this.config.allowIllegalMoves);
	
	// fire kifu loaded event
	this.dispatchEvent({
		type: "kifuLoaded",
		target: this,
		kifu: this.kifu,
	});
	
	this.update("init");
	
	if(path) {
		this.goTo(path);
	}
	
	// execute VW property
	if(kifu.info.VW) {
		var cords = kifu.info.VW.split(":");
		
		this.upper_left = get_coordinates(cords[0]);
		this.lower_right = get_coordinates(cords[1]);
		
		var upper_left = [this.upper_left[0], this.upper_left[1]]; 
		var lower_right = [this.lower_right[0], this.lower_right[1]];
		
		if(this.coordinates) {
			if(this.upper_left[0] == 0) upper_left[0] = -0.5;
			if(this.upper_left[1] == 0) upper_left[1] = -0.5;
			if(this.lower_right[0] == 18) lower_right[0] = 18.5;
			if(this.lower_right[1] == 18) lower_right[1] = 18.5;
		}
		
		this.board.setSection(upper_left[1], this.board.size-1-lower_right[0], this.board.size-1-lower_right[1], upper_left[0]);
	}
}
	
/**
 * Overrides player's next() method. We must play 1 extra move
 */
TsumegoApi.prototype.next = function(i) {
	if(this.frozen || !this.kifu || this.kifuReader.node.children.length == 0) return;
	
	try {
		this.kifuReader.next(i);
		this.update();
		
		this.dispatchEvent({
			type: "nextMove",
			target: this,
			node: this.kifuReader.node,
			evaluation: this.kifuReader.node._ev
		});
				
		if(this.kifuReader.node.move.c == this.turn && this.kifuReader.node.children.length) {
			var _this = this;
			window.setTimeout(function(){
				if(_this.kifuReader.node.move.c == _this.turn) {
					try {
						_this.kifuReader.next(0);
						_this.update();
					}
					catch(err) {
						console.log(err);
						_this.error(err);
						return;
					}
					
					if(_this.kifuReader.node.children.length == 0) {
						_this.dispatchEvent({
							type: "variationEnd",
							target: _this,
							node: _this.kifuReader.node,
							evaluation: _this.kifuReader.node._ev
						});
					}
				}
			}, this.config.answerDelay);
		}
		else if(this.kifuReader.node.children.length == 0) {
			this.dispatchEvent({
				type: "variationEnd",
				target: this,
				node: this.kifuReader.node,
				evaluation: this.kifuReader.node._ev
			});
		}
	}
	catch(err) {
		this.error(err);
	}
}

TsumegoApi.prototype.setCoordinates = function(b) {
	if(!this.coordinates && b) {
		var upper_left = [this.upper_left[0], this.upper_left[1]]; 
		var lower_right = [this.lower_right[0], this.lower_right[1]];
		
		if(this.upper_left[0] == 0) upper_left[0] = -0.5;
		if(this.upper_left[1] == 0) upper_left[1] = -0.5;
		if(this.lower_right[0] == 18) lower_right[0] = 18.5;
		if(this.lower_right[1] == 18) lower_right[1] = 18.5;
		
		this.board.setSection(upper_left[0], this.board.size-1-lower_right[0], this.board.size-1-lower_right[1], upper_left[1]);
		this.board.setWidth(this.board.width);
		this.board.addCustomObject(WGo.Board.coordinates);
	}
	else if(this.coordinates && !b) {
		this.board.setSection(this.upper_left[0], this.board.size-1-this.lower_right[0], this.board.size-1-this.lower_right[1], this.upper_left[1]);
		this.board.removeCustomObject(WGo.Board.coordinates);
	}
	this.coordinates = b;
}
	
TsumegoApi.default = {
	movePlayed: undefined, // callback function of move played by a player
	endOfVariation: undefined, // callback function for end of a variation (it can be solution of the problem or incorrect variation)
	answerDelay: 500, // delay of the answer (in ms)
	enableWheel: false, // override player's setting
	lockScroll: false, // override player's setting
	enableKeys: false, // override player's setting
	rememberPath: false, // override player's setting
	displayVariations: false, // override player's setting
}

WGo.TsumegoApi = TsumegoApi;

var generate_dom = function() {
	// clean up
	this.element.innerHTML = "";
	
	// main wrapper
	this.wrapper = document.createElement("div");
	this.wrapper.className = "wgo-tsumego";
	this.element.appendChild(this.wrapper);
	
	// top part
	this.top = document.createElement("div");
	this.comment = document.createElement("div")
	this.comment.className = "wgo-tsumego-comment";
	this.top.appendChild(this.comment);
	this.wrapper.appendChild(this.top);
	
	// board center part
	this.center = document.createElement("div");
	this.wrapper.appendChild(this.center);
	this.center.appendChild(this.boardElement);
	console.log(this.center.offsetWidth);
	this.board.setWidth(this.center.offsetWidth);
	
	// bottom part
	this.bottom = document.createElement("div");
	this.bottom.className = "wgo-tsumego-bottom";
	this.wrapper.appendChild(this.bottom);
	
	// control panel
	this.controlPanel = document.createElement("div");
	this.controlPanel.className = "wgo-tsumego-control";
	this.bottom.appendChild(this.controlPanel);
	
	// previous button
	this.resetWrapper = document.createElement("div");
	this.resetWrapper.className = "wgo-tsumego-btnwrapper";
	this.controlPanel.appendChild(this.resetWrapper);
	
	this.resetButton = document.createElement("button");
	this.resetButton.className = "wgo-tsumego-btn";
	this.resetButton.innerHTML = "Retry";
	this.resetButton.addEventListener("click", this.reset.bind(this));
	this.resetWrapper.appendChild(this.resetButton);
	
	// previous button
	this.prevWrapper = document.createElement("div");
	this.prevWrapper.className = "wgo-tsumego-btnwrapper";
	this.controlPanel.appendChild(this.prevWrapper);
	
	this.prevButton = document.createElement("button");
	this.prevButton.className = "wgo-tsumego-btn";
	this.prevButton.innerHTML = "Undo";
	this.prevButton.addEventListener("click", this.undo.bind(this));
	this.prevWrapper.appendChild(this.prevButton);
	
	// hint button
	this.hintWrapper = document.createElement("div");
	this.hintWrapper.className = "wgo-tsumego-btnwrapper";
	if(this.config.displayHintButton) this.controlPanel.appendChild(this.hintWrapper);
	
	this.hintButton = document.createElement("button");
	this.hintButton.className = "wgo-tsumego-btn";
	this.hintButton.innerHTML = "Hint"
	this.hintButton.addEventListener("click", this.hint.bind(this));
	this.hintWrapper.appendChild(this.hintButton);
}

/**
 * Simple front end for TsumegoApi. It provides all html but isn't very adjustable.
 */
var Tsumego = WGo.extendClass(WGo.TsumegoApi, function(elem, config) {
	this.element = elem;
	
	this.super.call(this, config);
	
	// add default configuration of Tsumego
	for(var key in Tsumego.default) if(config[key] === undefined && Tsumego.default[key] !== undefined) this.config[key] = Tsumego.default[key];

	generate_dom.call(this);
	
	this.listeners.update.push(this.updateTsumego.bind(this));
	this.listeners.variationEnd.push(this.variationEnd.bind(this));
	
	window.addEventListener("resize", this.updateDimensions.bind(this));
	
	// show variations
	if(this.config.debug) {
		this.variationLetters = [];
		this.listeners.update.push(this.showVariations.bind(this));
	}
	
	this.initGame();
	
	this.updateDimensions();
});

Tsumego.prototype.updateTsumego = function(e) {
	if(e.node.comment) this.setInfo(WGo.filterHTML(e.node.comment));
	else this.comment.innerHTML = (this.turn == WGo.B ? "Black" : "White")+" to play";
	
	if(e.node.children.length == 0) this.hintButton.disabled = "disabled";
	else this.hintButton.disabled = "";
	
	if(!e.node.parent) {
		this.resetButton.disabled = "disabled";
		this.prevButton.disabled = "disabled";
	}
	else {
		this.resetButton.disabled = "";
		this.prevButton.disabled = "";
	}
	
	this.setClass();
}

Tsumego.prototype.setInfo = function(msg) {
	this.comment.innerHTML = msg;
}

Tsumego.prototype.setClass = function(className) {
	this.wrapper.className = "wgo-tsumego"+(className ? " "+className : "");
}

Tsumego.prototype.reset = function() {
	this.first();
}

Tsumego.prototype.undo = function() {
	this.previous();
	if(this.kifuReader.node.move && this.kifuReader.node.move.c == this.turn) {
		this.previous();
	}
}

Tsumego.prototype.hint = function(e) {
	for(var i in this.kifuReader.node.children) {
		if(this.kifuReader.node.children[i]._ev == 3) {
			this.next(i);
			return;
		}
	}
	this.setInfo("Already wrong variation! Try again.");
}

Tsumego.prototype.variationEnd = function(e) {
	if(!e.node.comment) {
		switch(e.node._ev){
			case 0:	this.setInfo("Incorrect solution! Try again."); break;
			case 1: this.setInfo("There is a better way to solve this! Try again."); break;
			case 2: this.setInfo("Correct solution, but there is a better move."); break;
			case 3: this.setInfo("You have solved it!"); break;
			default: this.setInfo("Unknown move - probably incorrect."); break;
		}
	}
	
	switch(e.node._ev){
		case 0:	this.setClass("wgo-tsumego-incorrect"); break;
		case 1: this.setClass("wgo-tsumego-doubtful"); break;
		case 2: this.setClass("wgo-tsumego-interesting"); break;
		case 3: this.setClass("wgo-tsumego-correct"); break;
		default: this.setClass("wgo-tsumego-unknown"); break;
	}
}

Tsumego.prototype.showVariations = function(e) {
	// remove old variations
	this.board.removeObject(this.variationLetters);
	
	// show variations
	this.variationLetters = [];
	for(var i = 0; i < e.node.children.length; i++) {
		if(e.node.children[i].move && e.node.children[i].move.c == this.turn && !e.node.children[i].move.pass) this.variationLetters.push({
			type: "LB",
			text: String.fromCharCode(65+i),
			x: e.node.children[i].move.x,
			y: e.node.children[i].move.y,
			c: e.node.children[i]._ev == 3 ? "rgba(0,128,0,0.8)" : "rgba(196,0,0,0.8)"
		});
	}
	this.board.addObject(this.variationLetters);
}

/**
 * Set right width of board.
 */
	
Tsumego.prototype.updateDimensions = function() {
	this.board.setWidth(this.center.offsetWidth);
}

// Tsumego viewer settings
Tsumego.default = {
	displayHintButton: true,
	debug: false
}

WGo.Tsumego = Tsumego;

})(WGo);
