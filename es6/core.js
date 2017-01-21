// WGo global object with helpers

/**
 * Main namespace - it initializes WGo in first run and then execute main function. 
 * You must call WGo.init() if you want to use library, without calling WGo.
 * @namespace
 */

export const B = 1;
export const BLACK = B;
export const W = -1;
export const WHITE = W;
export const E = 0;
export const EMPTY = E;
export const ERROR_REPORT = false;

export var lang = "en";
export var i18n = {
	en: {}
}

// i18n helper
export function t(str) {
	var loc = WGo.i18n[WGo.lang][str] || WGo.i18n.en[str];
	if(loc) {
		for(var i = 1; i < arguments.length; i++) {
			loc = loc.replace("$", arguments[i]);
		}
		return loc;
	}
	return str;
};

/*
if(global["document"]) {
	var scripts = document.getElementsByTagName('script');
	var path = scripts[scripts.length-1].src.split('?')[0];      // remove any ?query
	WGo.DIR = path.split('/').slice(0, -1).join('/')+'/';  
}

if(global["navigator"]) {
	// browser detection - can be handy
	WGo.opera = navigator.userAgent.search(/(opera)(?:.*version)?[ \/]([\w.]+)/i) != -1;
	WGo.webkit = navigator.userAgent.search(/(webkit)[ \/]([\w.]+)/i) != -1;
	WGo.msie = navigator.userAgent.search(/(msie) ([\w.]+)/i) != -1;
	WGo.mozilla = navigator.userAgent.search(/(mozilla)(?:.*? rv:([\w.]+))?/i) != -1 && !WGo.webkit && !WGo.msie;
}
*/

/*// helping function for class inheritance
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
};
*/

/**
 * Filters html tags from the string to avoid XSS. Characters `<` and `>` are transformed to their entities. 
 * You can use this function when you display foreign texts.
 *
 * @param {string} text - text to filter
 * @return {string} Filtered text 
 */
/* 
WGo.filterHTML = function(text) {
	if(!text || typeof text != "string") return text;
	return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};*/

//export default WGo;
