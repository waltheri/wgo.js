// WGo global object with helpers

var scripts = document.getElementsByTagName('script');
var path = scripts[scripts.length-1].src.split('?')[0];      // remove any ?query
var mydir = path.split('/').slice(0, -1).join('/')+'/';  

/**
 * Main namespace - it initializes WGo in first run and then execute main function. 
 * You must call WGo.init() if you want to use library, without calling WGo.
 * @namespace
 */
 
var WGo = {
	// basic information
	version: "3",
	
	// constants for colors (rather use WGo.B or WGo.W)
	/** Constant for black color */
	B: 1,
	BLACK: 1,
	/** Constant for white color */
	W: -1,
	WHITE: -1,
	/** Constant for empty field */
	E: 0,
	EMPTY: 0,

	// if true errors will be shown in dialog window, otherwise they will be ignored
	ERROR_REPORT: true,
	DIR: mydir,
	
	// Language of player, you can change this global variable any time. Object WGo.i18n.<your lang> must exist.
	lang: "en",
	
	// Add terms for each language here 
	i18n: {
		en: {}
	}
}

// browser detection - can be handy
WGo.opera = navigator.userAgent.search(/(opera)(?:.*version)?[ \/]([\w.]+)/i) != -1;
WGo.webkit = navigator.userAgent.search(/(webkit)[ \/]([\w.]+)/i) != -1;
WGo.msie = navigator.userAgent.search(/(msie) ([\w.]+)/i) != -1;
WGo.mozilla = navigator.userAgent.search(/(mozilla)(?:.*? rv:([\w.]+))?/i) != -1 && !WGo.webkit && !WGo.msie;

// translating function
WGo.t = function(str) {
	var loc = WGo.i18n[WGo.lang][str] || WGo.i18n.en[str];
	if(loc) {
		for(var i = 1; i < arguments.length; i++) {
			loc = loc.replace("$", arguments[i]);
		}
		return loc;
	}
	return str;
}

// helping function for class inheritance
WGo.extendClass = function(parent, child) {
	child.prototype = Object.create(parent.prototype);
	child.prototype.constructor = child;
	child.prototype.super = parent;
	
	return child;
};

// helping function for class inheritance
WGo.abstractMethod = function() {
	throw Error('unimplemented abstract method');
};

// helping function for deep cloning of simple objects,
WGo.clone = function(obj) {
	if(obj && typeof obj == "object") {
		var n_obj = obj.constructor == Array ? [] : {};
		
		for(var key in obj) {
			if(obj[key] == obj) n_obj[key] = obj;
			else n_obj[key] = WGo.clone(obj[key]);
		}
		
		return n_obj;
	}
	else return obj;
}

/**
 * Filters html tags from the string to avoid XSS. Characters `<` and `>` are transformed to their entities. 
 * You can use this function when you display foreign texts.
 *
 * @param {string} text - text to filter
 * @return {string} Filtered text 
 */
 
WGo.filterHTML = function(text) {
	if(!text || typeof text != "string") return text;
	return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

module.exports = WGo;
