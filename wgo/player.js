
(function(WGo){

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

// Player middleware class
var Player = function(config) {
	
	// set user configuration
	this.config = config || {};
	
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
			kifuLoaded: [],
			update: [],
			frozen: [],
			unfrozen: [],
		};
		
		// add listeners from config object
		if(this.config.kifuLoaded) this.addEventListener("kifuLoaded", this.config.kifuLoaded);
		if(this.config.update) this.addEventListener("update", this.config.update);
		
		// declare kifu
		this.kifu = null;
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
	
	setNotification: function(text) {
		if(console) console.log(text);
	},
	
	setHelp: function(text) {
		if(console) console.log(text);
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
	 * Enable keys to control player. TODO: maybe create toggle functions.
	 */
	 
	enableKeys: function() {
		if(this._keys_listener) return;
		
		this._keys_listener = key_lis.bind(this);
		var type = WGo.mozilla ? "keypress" : "keydown";
		document.addEventListener(type, this._keys_listener);
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
	
	setFrozen: function(frozen) {
		this.frozen = frozen;
		this.dispatchEvent({
			type: this.frozen ? "frozen" : "unfrozen",
			target: this,
		});
	}
}

// default settings, they are merged with user settings in constructor.
Player.default = {
	kifuLoaded: undefined,
	update: undefined,
	permalinks: true,
	enableKeys: true,
}

WGo.Player = Player;

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
	var loc = WGo.Player.i18n[WGo.lang][str] || WGo.Player.i18n["en"][str];
	if(loc) {
		for(var i = 1; i < arguments.length; i++) {
			loc = loc.replace("$", arguments[i]);
		}
		return loc;
	}
	return str;
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

})(WGo);
