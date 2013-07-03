(function(WGo, undefined) {

/**
 * Base class for player's component
 */

var Component = function() {
	this.element = document.createElement("div");
}

Component.prototype = {
	constructor: Component,
	
	appendTo: function(target) {
		target.appendChild(this.element);
	},
	
	getWidth: function() {
		var css = window.getComputedStyle(this.element);
		return parseInt(css.width);
	},
	
	getHeight: function() {
		var css = window.getComputedStyle(this.element);
		return parseInt(css.height);
	},
	
	updateDimensions: function() {
	
	}
}

WGo.BasicPlayer.component.Component = Component;

})(WGo);