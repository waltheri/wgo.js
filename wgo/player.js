
(function(WGo){

// player counter - for creating unique ids
var pl_count = 0;

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

// ajax function for loading of files
var loadFromUrl = function(url, callback, error) {
	var error = error || console.log;
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET",url,true);
	xmlhttp.send();
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if(xmlhttp.status == 200) {
				if(xmlhttp.responseText.length == 0) {
					error(new WGo.FileError(url, 1));
				}
				else {
					callback(xmlhttp.responseText);
				}
			}
			else {
				error(new WGo.FileError(url));
			}
		}
	}
}

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

// board click callback for edit mode
var edit_board_click = function(x,y) {
	if(!this.kifuReader.game.isValid(x, y)) return;
	
	this.kifuReader.node.appendChild(new WGo.KNode({
		move: {
			x: x, 
			y: y, 
			c: this.kifuReader.game.turn
		}, 
		edited: true
	}));
	this.next(this.kifuReader.node.children.length-1);
}

// board mousemove callback for edit move - adds highlighting
var edit_board_mouse_move = function(x,y) {
	if(this._lastX == x && this._lastY == y) return;
	
	this._lastX = x;
	this._lastY = y;
	
	if(this._last_mark) {
		this.board.removeObject(this._last_mark);
	}
	
	if(x != -1 && y != -1 && this.kifuReader.game.isValid(x,y)) {
		this._last_mark = {
			type: "outline",
			x: x,
			y: y, 
			c: this.kifuReader.game.turn
		};
		this.board.addObject(this._last_mark);
	}
	else {
		delete this._last_mark;
	}
}

// board mouseout callback for edit move	
var edit_board_mouse_out = function() {
	if(this._last_mark) {
		this.board.removeObject(this._last_mark);
		delete this._last_mark;
		delete this._lastX;
		delete this._lastY;
	}
}

// detecting scrolling of element - e.g. when we are scrolling text in comment box, we want to be aware. 
var detect_scrolling = function(node, player) {
	if(node == player.view.element || node == player.board.element) return false;
	else if(node._wgo_scrollable || (node.scrollHeight > node.offsetHeight)) return true;
	else return detect_scrolling(node.parentNode, player);
}

// mouse wheel event callback, for replaying a game
var wheel_lis = function(e) {
	var delta = e.wheelDelta || e.detail*(-1);
	
	// if there is scrolling in progress within an element, don't change position
	if(detect_scrolling(e.target, this)) return true;
	
	if(delta < 0) {
		this.next();
		if(this.config.lockScroll && e.preventDefault) e.preventDefault();
		return !this.config.lockScroll;
	}
	else if(delta > 0) {
		this.previous();
		if(this.config.lockScroll && e.preventDefault) e.preventDefault();
		return !this.config.lockScroll;
	}
	return true;
};

// keyboard click callback, for replaying a game
var key_lis = function(e) {
	switch(e.keyCode) {
		case 39: this.next(); break;
		case 37: this.previous(); break;
		//case 40: this.selectAlternativeVariation(); break;
		default: return true;
	}
	if(this.config.lockScroll && e.preventDefault) e.preventDefault()
	return !this.config.lockScroll;
};

//--- Fullscreen mode ---------------------------------------------------------------------------------------------------

var FSCHANGE = document.onfullscreenchange !== undefined ? "onfullscreenchange" : (
			     document.onmozfullscreenchange !== undefined ? "onmozfullscreenchange" : (
			       document.onwebkitfullscreenchange !== undefined ? "onwebkitfullscreenchange" : (
			         document.onmsfullscreenchange !== undefined ? "onmsfullscreenchange" : false
			       )
				 )
			   );
var FSCLOSE = document.exitFullscreen ? "exitFullscreen" : (
			    document.mozCancelFullScreen ? "mozCancelFullScreen" : (
			      document.webkitCancelFullScreen ? "webkitCancelFullScreen" : (
			        document.msCancelFullScreene !== undefined ? "document.msCancelFullScreen" : false
			      )
			    )
			  );
var FSREQUEST = Element.prototype.requestFullscreen !== undefined ? "requestFullscreen" : (
			      Element.prototype.mozRequestFullScreen !== undefined ? "mozRequestFullScreen" : (
			        Element.prototype.webkitRequestFullScreen !== undefined ? "webkitRequestFullScreen" : (
			          Element.prototype.msRequestFullScreen !== undefined ? "msRequestFullScreen" : false
			        )
				  )
				);

var fullscreenChange = function() {
	if (document.fullscreenElement || document.mozFullScreen || document.webkitIsFullScreen || document.msFullScreen) {
		this.dispatchEvent({
			type: "fullscreenChange",
			target: this,
			on: true,
		});
	} 
	else {
		this.dispatchEvent({
			type: "fullscreenChange",
			target: this,
			on: false,
		});
		document[FSCHANGE] = "";
	}
}

var fullscreenProcess = function(elem) {
	if (document.fullscreenElement || document.mozFullScreen || document.webkitIsFullScreen || document.msFullScreen) {
		document[FSCLOSE]();
		return false;
	}
	else {
		elem[FSREQUEST]();
		return true;
	}
}

//--- /Fullscreen mode ---------------------------------------------------------------------------------------------------

// get differences of two positions as a change object (TODO create a better solution, without need of this function)
var pos_diff = function(old_p, new_p) {
	var size = old_p.size, add = [], remove = [];
	
	for(var i = 0; i < size*size; i++) {
		if(old_p.schema[i] && !new_p.schema[i]) remove.push({x:Math.floor(i/size),y:i%size});
		else if(old_p.schema[i] != new_p.schema[i]) add.push({x:Math.floor(i/size),y:i%size,c:new_p.schema[i]});
	}
	
	return {
		add: add,
		remove: remove
	}
}

var Player = function(elem, config) {
	// save main DOM element
	this.element = elem
	
	// set user configuration
	this.config = config;
	
	// add default configuration
	for(var key in Player.default) if(this.config[key] === undefined && Player.default[key] !== undefined) this.config[key] = Player.default[key];
	
	// call initialization function
	this.init();
}

Player.prototype = {
	constructor: Player,
	
	/**
	 * Initialization method of the player. It is called in constructor. 
	 * You can override it but don't forget to call original method.
	 * Cofiguration of the player is already saved in this.config.
	 */
	 
	init: function() {
		// creating listeners
		this.listeners = {
			kifuLoaded: [prepare_board.bind(this)],
			update: [update_board.bind(this)],
		};
		
		// add listeners from config object
		if(this.config.kifuLoaded) this.addEventListener("kifuLoaded", this.config.kifuLoaded);
		if(this.config.update) this.addEventListener("update", this.config.update);
		
		// create board object and the view, the view is actually all visible HTML
		this.view = new WGo.Player.BasicTemplate(this);
		this.board = this.view.board;
		
		// save player into DOM - it is used to get player object from player's id (TODO analyze this solution)
		this.view.element._wgo_player = this;
		
		// declare kifu
		this.kifu = null;
		
		// try to load game passed in configuration
		if(this.config.sgf) {
			this.loadSgf(this.config.sgf);
		}
		else if(this.config.json) {
			this.loadJSON(this.config.json);
		}
		else if(this.config.sgfFile) {
			this.loadSgfFromFile(this.config.sgfFile);
		}
		
		// register board click event
		this.board.addEventListener("click", board_click_default.bind(this));
	},
	
	/**
	 * Create update event and dispatch it. It is called after position's changed.
	 *
	 * @param {string} op an operation that produced update (e.g. next, previous...)
	 */
	
	update: function(op) {
		if(!this.kifuReader) return;
		
		var ev = {
			type: "update",
			op: op,
			target: this,
			node: this.kifuReader.node,
			position: this.kifuReader.getPosition(),
			path: this.kifuReader.path,
			change: this.kifuReader.change,
		}
		
		//if(!this.kifuReader.node.parent) ev.msg = this.getGameInfo();
		
		this.dispatchEvent(ev);
	},
	
	/**
	 * Prepare kifu for replaying. Event 'kifuLoaded' is triggered.
	 *
	 * @param kifu Kifu object
	 */
	
	kifuLoad: function(kifu) {
		this.kifu = kifu;
		
		try {
			// kifu is replayed by KifuReader, it manipulates a Kifu object and gets all changes
			this.kifuReader = new WGo.KifuReader(this.kifu);

			// fire kifu loaded event
			this.dispatchEvent({
				type: "kifuLoaded",
				target: this,
				kifu: this.kifu,
			});
			
			// handle permalink
			if(this.config.permalinks) {
				if(!permalinks.active) init_permalinks();
				if(permalinks.query.length && permalinks.query[0] == this.view.element.id) {
					handle_hash(this);
				}
			}
			
			// update player - initial position in kifu doesn't have to be an empty board
			this.update("init");
			
			// enable mouse and keyboard listeners
			if(this.config.enableWheel) this.enableWheel();
			if(this.config.enableKeys) this.enableKeys();
		}
		catch(err) {
			this.kifu = null;
			this.error(err);
		}
	},
	
	/**
	 * Load go kifu from sgf string.
	 *
	 * @param {string} sgf
	 */
	 
	loadSgf: function(sgf) {
		this.kifuLoad(WGo.Kifu.fromSgf(sgf));
	},
	
	/**
	 * Load go kifu from JSON object.
	 */
	
	loadJSON: function(json) {
		// not implemented yet
	},
	
	/**
	 * Load kifu from sgf file specified with path. AJAX is used to load sgf content. 
	 */
	
	loadSgfFromFile: function(path) {
		loadFromUrl(path, this.loadSgf.bind(this), this.error.bind(this));
	},
	
	/**
	 * Implementation of EventTarget interface, though it's a little bit simplified.
	 * You need to save listener if you would like to remove it later.
	 *
	 * @param {string} type of listeners
	 * @param {Function} listener callback function
	 */

	addEventListener: function(type, listener) {
		this.listeners[type] = this.listeners[type] || [];
		this.listeners[type].push(listener);
	},
	
	/**
	 * Remove event listener previously added with addEventListener.
	 *
	 * @param {string} type of listeners
	 * @param {Function} listener function
	 */
	
	removeEventListener: function(type, listener) {
		if(!this.listeners[type]) return;
		var i = this.listeners[type].indexOf(listener);
		if(i != -1) this.listeners[type].splice(i,1);
	},
	
	/**
	 * Dispatch an event. In default there are two events: "kifuLoaded" and "update"
	 * 
	 * @param {string} evt event
	 */
	 
	dispatchEvent: function(evt) {
		if(!this.listeners[evt.type]) return;
		for(var l in this.listeners[evt.type]) this.listeners[evt.type][l](evt);
	},
	
	/**
	 * Show dialog window with message.
	 *
	 * @param {string} text of message
	 */
	
	showMessage: function(text) {
		this.frozen = true;
		this.view.showMessage(text, this.hideMessage.bind(this));
	},
	
	/**
	 * Hide dialog window
	 */
	
	hideMessage: function() {
		this.frozen = false;
		this.view.hideMessage();
	},
	
	/**
	 * Handle cought error. TODO: reporting of errors - by cross domain AJAX
	 */
	
	error: function(err) {
		if(!WGo.ERROR_REPORT) throw err;

		var url = "http://wgo.waltheri.net/er.php?u="+btoa(location.href)+"&m="+btoa(err.message)+"&s="+btoa(err.stacktrace);
		if(url.length > 2000) url = "http://wgo.waltheri.net/er.php?u="+btoa(location.href)+"&m="+btoa(err.message);
		
		switch(err.name) {
			case "InvalidMoveError": 
				this.showMessage("<h1>"+err.name+"</h1><p>"+err.message+"</p><p>If this message isn't correct, please report it by clicking <a href=\""+url+"\">here</a>, otherwise contact maintainer of this site.</p>");
			break;
			case "FileError":
				this.showMessage("<h1>"+err.name+"</h1><p>"+err.message+"</p><p>Please contact maintainer of this site. Note: it is possible to read files only from this host.</p>");
			break;
			default:
				this.showMessage("<h1>"+err.name+"</h1><p>"+err.message+"</p><pre>"+err.stacktrace+"</pre><p>Please contact maintainer of this site. You can also report it <a href=\""+url+"\">here</a>.</p>");
		}
	},
	
	/**
	 * Play next move.
	 * 
	 * @param {number} i if there is more option, you can specify it by index
	 */
	
	next: function(i) {
		if(this.frozen || !this.kifu) return;
		try {
			this.kifuReader.next(i);
			this.update();
		}
		catch(err) {
			this.error(err);
		}
	},
	
	/**
	 * Get previous position.
	 */
	
	previous: function() {
		if(this.frozen || !this.kifu) return;
		try {
			this.kifuReader.previous();
			this.update();
		}
		catch(err) {
			this.error(err);
		}
	},

	/**
	 * Play all moves and get last position.
	 */
	
	last: function() {
		if(this.frozen || !this.kifu) return;
		try {
			this.kifuReader.last();
		}
		catch(err) {
			this.error(err);
		}
		this.update();
	},
	
	/**
	 * Get a first position.
	 */
	
	first: function() {
		if(this.frozen || !this.kifu) return;
		try {
			this.kifuReader.first();
		}
		catch(err) {
			this.error(err);
		}
		this.update();
	},

	/**
	 * Go to a specified move.
	 * 
	 * @param {number|Array} move number of move, or path array
	 */
	
	goTo: function(move) {
		if(this.frozen || !this.kifu) return;
		var path;
		if(typeof move == "number") {
			path = WGo.clone(this.kifuReader.path);
			path.m = move || 0;
		}
		else path = move;
		
		try {
			this.kifuReader.goTo(path);
		}
		catch(err) {
			this.error(err);
		}
		this.update();
	},
	
	/**
	 * Get information about actual game(kifu)
	 *
	 * @return {Object} game info
	 */
	 
	getGameInfo: function() {
		if(!this.kifu) return null;
		var info = {};
		for(var key in this.kifu.info) {
			if(WGo.Kifu.infoList.indexOf(key) == -1) continue;
			if(WGo.Kifu.infoFormatters[key]) {
				info[WGo.t(key)] = WGo.Kifu.infoFormatters[key](this.kifu.info[key]);
			}
			else info[WGo.t(key)] = WGo.filterHTML(this.kifu.info[key]);
		}
		return info;
	},
	
	/**
	 * Shortcut for this.view.appendTo
	 */
	
	appendTo: function(elem) {
		this.view.appendTo(elem);
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
	
	/**
	 * Toggle edit mode.
	 */
	
	toggleEditMode: function() {
		this.editMode = !this.editMode;
		if(this.editMode) {
			// save original kifu reader
			this._originalReader = this.kifuReader;
			
			// create new reader with cloned kifu
			this.kifuReader = new WGo.KifuReader(this.kifu.clone());
			
			// go to current position
			this.kifuReader.goTo(this._originalReader.path);
			
			// register edit listeners
			this._ev_click = edit_board_click.bind(this);
			this._ev_move = edit_board_mouse_move.bind(this);
			this._ev_out = edit_board_mouse_out.bind(this);
			this.board.addEventListener("click", this._ev_click);
			this.board.addEventListener("mousemove", this._ev_move);
			this.board.addEventListener("mouseout", this._ev_out);
		}
		else {
			// go to the last original position
			this._originalReader.goTo(this.kifuReader.path);
			
			// change object isn't actual - update it, not elegant solution, but simple
			this._originalReader.change = pos_diff(this.kifuReader.getPosition(), this._originalReader.getPosition());
			
			// update kifu reader
			this.kifuReader = this._originalReader;
			this.update(true);
			
			// remove edit listeners
			this.board.removeEventListener("click", this._ev_click);
			this.board.removeEventListener("mousemove", this._ev_move);
			this.board.removeEventListener("mouseout", this._ev_out);
			
			delete this._originalReader;
			delete this._ev_click;
			delete this._ev_move;
			delete this._ev_out;
		}
		return this.editMode;
	},
	
	/**
	 * Toggle fullscreen mode.
	 */
	
	toggleFullscreen: function() {
		if(FSCHANGE) {
			document[FSCHANGE] = fullscreenChange.bind(this);
			fullscreenProcess.call(undefined, this.view.element);
		}
	},
	
	/**
	 * Enable keys to control player. TODO: maybe create toggle functions.
	 */
	 
	enableKeys: function() {
		if(this._keys_listener) return;
		
		this._keys_listener = key_lis.bind(this);
		var type = WGo.mozilla ? "keypress" : "keydown";
		document.addEventListener(type, this._keys_listener);
	},

	/**
	 * Enable mouse wheel to control player.
	 */
	
	enableWheel: function() {
		if(this._wheel_listener) return;
		
		this._wheel_listener = wheel_lis.bind(this);
		var type = WGo.mozilla ? "DOMMouseScroll" : "mousewheel";
		this.view.element.addEventListener(type,this._wheel_listener);
	}, 
	
	/**
	 * Disable keyboard listener
	 */
	
	disableKeys: function() {
		if(!this._keys_listener) return;
		
		var type = WGo.mozilla ? "keypress" : "keydown";
		document.removeEventListener(type, this._keys_listener);
		delete this.keys_listener;
	},
	
	/**
	 * Disable mouse wheel listener
	 */
	
	disableWheel: function() {
		if(!this._wheel_listener) return;

		var type = WGo.mozilla ? "DOMMouseScroll" : "mousewheel";
		this.view.element.removeEventListener(type,this._wheel_listener);
		delete this._wheel_listener;
	},
}

Player.component = {};

/**
 * Preset layouts
 * They have defined regions as arrays, which can contain components. Each component specifies where it should be.
 * User can create custom layout. TODO: write better description
 */
 
Player.layouts = {
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

Player.dynamicLayout = [
	{
		conditions: {
			minWidth: 650,
		},
		layout: Player.layouts["right_top"], 
		className: "wgo-twocols",
	},
	{
		conditions: {
			minWidth: 550,
			minHeight: 600,
		},
		layout: Player.layouts["one_column"],
	},
	{
		conditions: {
			minWidth: 450,
			minHeight: 400,
		},
		layout: Player.layouts["no_comment"],
	},
	{
		conditions: {
			minWidth: 350,
		},
		layout: Player.layouts["minimal"],
		className: "wgo-400", 
	},
	{	// if conditions object id omitted, layout is applied 
		layout: Player.layouts["minimal"],
		className: "wgo-400 wgo-300", 
	},
];

// default settings, they are merged with user settings in constructor.
Player.default = {
	layout: Player.dynamicLayout,
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

WGo.Player = Player;

//--- Basic template ------------------------------------------------------------------------------------------

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
var BTgenerateDom = function() {
	// wrapper object for common DOM
	this.dom = {};
	
	// center element
	this.dom.center = document.createElement("div");
	this.dom.center.className = "wgo-player-center";
	
	// board wrapper element
	this.dom.board = document.createElement("div");
	this.dom.board.className = "wgo-player-board";
	this.board = new WGo.Board(this.dom.board, this.player.config.board);
	
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
	var cl = this.player.config.layout;
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
			if(!this.components[components[i]]) this.components[components[i]] = new WGo.Player.component[components[i]](this.player);
			
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

var BasicTemplate = function(player) {
	this.player = player;
	this.board = player.board;
	//this.layout = playerlayout;
	this.element = document.createElement("div");
	this.element.className += "wgo-player-main";
	this.element.id = "wgo_"+(pl_count++);
	
	BTgenerateDom.call(this);
	
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
	
	player.element.innerHTML = "";
	this.appendTo(player.element);
}

BasicTemplate.prototype = {
	constructor: BasicTemplate,
	
	appendTo: function(elem) {
		var css = window.getComputedStyle(elem);

		this.width = parseInt(css.width);
		this.height = parseInt(css.height);
		this.maxHeight = parseInt(css.maxHeight);
		console.log(this.height)
		elem.appendChild(this.element);
		this.updateDimensions();
	},
	
	updateDimensions: function() {
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
	},
	
	/**
	 * Layout contains built-in info box, for displaying of text(html) messages.
	 * You can use this method to display a message.
	 * 
	 * @param text or html to display
	 * @param closeCallback optional callback function which is called when message is closed
	 */

	showMessage: function(text, closeCallback, permanent) {
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
	},

	/**
	 * Hide a message box.
	 */
	 
	hideMessage: function() {
		this.element.removeChild(this.info_overlay);
	},
}

WGo.Player.BasicTemplate = BasicTemplate;

//--- Permalinks -----------------------------------------------------------------------------------------------

var permalinks = {
	active: false,
	query: [],
	handlers: {
		p: function(status) {
			status.i++;
			var t, path = [];
			while(permalinks.query[status.i]) {
				t = parseInt(permalinks.query[status.i]); 
				if(t || t === 0) {
					path.push(t);
					status.i++;
				}
				else break;
			}
			this.goTo(path);
		}
	},
};

var init_permalinks = function() {
	// add hashchange event
	window.addEventListener("hashchange", function() {
		if(window.location.hash != "") {
			permalinks.query = window.location.hash.substr(1).split(",");
			handle_hash();
		}
	});
	
	// save hash query
	if(window.location.hash != "") {
		permalinks.query = window.location.hash.substr(1).split(",");
	}
	// set active flag
	permalinks.active = true;
}

var handle_hash = function(player) {
	var player = player || (permalinks.query.length ? document.getElementById(permalinks.query[0]) : {})._wgo_player;

	if(player) {
		console.log(player);
		player.view.element.scrollIntoView();
		var status = {i:1};
		while(permalinks.query[status.i]) {
			if(permalinks.handlers[permalinks.query[status.i]]) permalinks.handlers[permalinks.query[status.i]].call(player, status);
			else break;
		}
	}
}

WGo.permalinks = permalinks;

//--- i18n support ------------------------------------------------------------------------------------------

WGo.t = function(str) {
	return WGo.Player.i18n[WGo.lang][str] || str;
}

WGo.lang = "en";

WGo.Player.i18n = {
	"en": {
		"about": "About",
		"first": "First",
		"multiprev": "10 moves back",
		"prev": "Previous",
		"next": "Next",
		"multinext": "10 moves forward",
		"last": "Last",
		"switch-coo": "Display coordinates",
		"rank": "Rank",
		"caps": "Caps",
		"time": "Time",
		"black": "Black",
		"white": "White",
		"comments": "Comments",
		"DT": "Date",
		"KM": "Komi",
		"HA": "Handicap",
		"AN": "Annotations",
		"CP": "Copyright",
		"OT": "Overtime",
		"TM": "Basic time",
		"RE": "Result",
		"RU": "Rules",
		"PC": "Place",
		"EV": "Event",
		"SO": "Source",
		"gameinfo": "Game info",
		"show": "show",
		"res-show-tip": "Click to show result.",
		"editmode": "Edit mode",
		"fullscreen": "Fullscreen",
		"print": "Print game",
		"permalink": "Permanent link",
	}	
}

//--- Handling <div> with data attributes -----------------------------------------------------------------

Player.attributes = {
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
		if(Player.attributes[att.name]) Player.attributes[att.name].call(config, att.value, att.name);
	}

	pl = new WGo.Player(elem, config);
	console.log(pl);
}

window.addEventListener("DOMContentLoaded", function() {
	var pl_elems = document.querySelectorAll("[data-wgo]");
	
	for(var i = 0; i < pl_elems.length; i++) {
		player_from_tag(pl_elems[i]);
	}
});

})(WGo);
