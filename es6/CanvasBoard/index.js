/* global document, window */

/**
 * Contains implementation of go board.
 * @module CanvasBoard
 */

import { themeVariable, defaultFieldClear } from "./helpers";
import GridLayer from "./GridLayer";
import ShadowLayer from "./ShadowLayer";
import CanvasLayer from "./CanvasLayer";
import * as themes from "./themes";
import * as drawHandlers from "./drawHandlers";
import defaultsDeep from "lodash/defaultsDeep";

// Private methods of WGo.CanvasBoard

var calcLeftMargin = function (board) {
	return (3 * board.width) / (4 * (board.bx + 1 - board.tx) + 2) - board.fieldWidth * board.tx;
}

var calcTopMargin = function (board) {
	return (3 * board.height) / (4 * (board.by + 1 - board.ty) + 2) - board.fieldHeight * board.ty;
}

var calcFieldWidth = function (board) {
	return (4 * board.width) / (4 * (board.bx + 1 - board.tx) + 2);
}

var calcFieldHeight = function (board) {
	return (4 * board.height) / (4 * (board.by + 1 - board.ty) + 2);
}

var clearField = function (board, x, y) {
	var handler;
	for (var z = 0; z < board.obj_arr[x][y].length; z++) {
		var obj = board.obj_arr[x][y][z];
		if (!obj.type) handler = themeVariable("stoneHandler", board);
		else if (typeof obj.type == "string") handler = themeVariable("markupHandlers", board)[obj.type];
		else handler = obj.type;

		for (var layer in handler) {
			board[layer].drawField(handler[layer].clear ? handler[layer].clear : defaultFieldClear, obj, board);
		}
	}
}

// Draws all object on specified field
var drawField = function (board, x, y) {
	let handler;
	for (let z = 0; z < board.obj_arr[x][y].length; z++) {
		let obj = board.obj_arr[x][y][z];

		if (!obj.type) handler = themeVariable("stoneHandler", board);
		else if (typeof obj.type == "string") handler = themeVariable("markupHandlers", board)[obj.type];
		else handler = obj.type;

		for (let layer in handler) {
			board[layer].drawField(handler[layer].draw, obj, board);
		}
	}
}

var getMousePos = function (board, e) {
	// new hopefully better translation of coordinates

	var x, y;

	x = e.layerX * board.pixelRatio;
	x -= board.left;
	x /= board.fieldWidth;
	x = Math.round(x);

	y = e.layerY * board.pixelRatio;
	y -= board.top;
	y /= board.fieldHeight;
	y = Math.round(y);

	return {
		x: x >= board.size ? -1 : x,
		y: y >= board.size ? -1 : y
	};
}

var updateDim = function (board) {
	board.element.style.width = (board.width / board.pixelRatio) + "px";
	board.element.style.height = (board.height / board.pixelRatio) + "px";

	board.stoneRadius = themeVariable("stoneSize", board);
	board.linesShift = themeVariable("linesShift", board);

	for (var i = 0; i < board.layers.length; i++) {
		board.layers[i].setDimensions(board.width, board.height, board);
	}
}

export default class CanvasBoard {
	/**
	 * CanvasBoard class constructor - it creates a canvas board.
	 *
	 * @alias WGo.CanvasBoard
	 * @class
	 * @implements BLACKoard
	 * @param {HTMLElement} elem DOM element to put in
	 * @param {Object} config Configuration object. It is object with "key: value" structure. Possible configurations are:
	 *
	 * * size: number - size of the board (default: 19)
	 * * width: number - width of the board (default: 0)
	 * * height: number - height of the board (default: 0)
	 * * font: string - font of board writings (!deprecated)
	 * * lineWidth: number - line width of board drawings (!deprecated)
	 * * autoLineWidth: boolean - if set true, line width will be automatically computed accordingly to board size - this option rewrites 'lineWidth' /and it will keep markups sharp/ (!deprecated)
	 * * starPoints: Object - star points coordinates, defined for various board sizes. Look at CanvasBoard.default for more info.
	 * * stoneHandler: CanvasBoard.DrawHandler - stone drawing handler (default: CanvasBoard.drawHandlers.SHELL)
	 * * starSize: number - size of star points (default: 1). Radius of stars is dynamic, however you can modify it by given constant. (!deprecated)
	 * * stoneSize: number - size of stone (default: 1). Radius of stone is dynamic, however you can modify it by given constant. (!deprecated)
	 * * shadowSize: number - size of stone shadow (default: 1). Radius of shadow is dynamic, however you can modify it by given constant. (!deprecated)
	 * * background: string - background of the board, it can be either color (#RRGGBB) or url. Empty string means no background. (default: WGo.DIR+"wood1.jpg")
	 * * section: {
	 *     top: number,
	 *     right: number,
	 *     bottom: number,
	 *     left: number
	 *   }
	 *   It defines a section of board to be displayed. You can set a number of rows(or cols) to be skipped on each side.
	 *   Numbers can be negative, in that case there will be more empty space. In default all values are zeros.
	 * * theme: Object - theme object, which defines all graphical attributes of the board. Default theme object is "WGo.CanvasBoard.themes.default". For old look you may use "WGo.CanvasBoard.themes.old".
	 *
	 * Note: properties lineWidth, autoLineWidth, starPoints, starSize, stoneSize and shadowSize will be considered only if you set property 'theme' to 'WGo.CanvasBoard.themes.old'.
	 */

	constructor(elem, config) {
		// merge user config with default
		this.config = defaultsDeep(config || {}, CanvasBoard.defaultConfig);

		// and store it directly on `this`
		Object.keys(this.config).forEach(key => {
			this[key] = this.config[key];
		});

		// set section if set
		this.tx = this.section.left;
		this.ty = this.section.top;
		this.bx = this.size - 1 - this.section.right;
		this.by = this.size - 1 - this.section.bottom;

		// init board
		this.init();

		// append to element
		elem.appendChild(this.element);

		// set initial dimensions

		// set the pixel ratio for HDPI (e.g. Retina) screens
		this.pixelRatio = window.devicePixelRatio || 1;

		if (this.width && this.height) this.setDimensions(this.width, this.height);
		else if (this.width) this.setWidth(this.width);
		else if (this.height) this.setHeight(this.height);
	}

	/**
     * Initialization method, it is called in constructor. You shouldn't call it, but you can alter it.
	 */

	init() {

		// placement of objects (in 3D array)
		this.obj_arr = [];
		for (var i = 0; i < this.size; i++) {
			this.obj_arr[i] = [];
			for (var j = 0; j < this.size; j++) this.obj_arr[i][j] = [];
		}

		// other objects, stored in list
		this.obj_list = [];

		// layers
		this.layers = [];

		// event listeners, binded to board
		this.listeners = [];

		this.element = document.createElement('div');
		this.element.className = 'wgo-board';
		this.element.style.position = 'relative';

		if (this.background) {
			if (this.background[0] == "#") this.element.style.backgroundColor = this.background;
			else {
				this.element.style.backgroundImage = "url('" + this.background + "')";
				/*this.element.style.backgroundRepeat = "repeat";*/
			}
		}

		this.grid = new GridLayer();
		this.shadow = new ShadowLayer();
		this.stone = new CanvasLayer();

		this.addLayer(this.grid, 100);
		this.addLayer(this.shadow, 200);
		this.addLayer(this.stone, 300);
	}

	setWidth(width) {
		this.width = width;
		this.width *= this.pixelRatio;
		this.fieldHeight = this.fieldWidth = calcFieldWidth(this);
		this.left = calcLeftMargin(this);

		this.height = (this.by - this.ty + 1.5) * this.fieldHeight;
		this.top = calcTopMargin(this);

		updateDim(this);
		this.redraw();
	}

	setHeight(height) {
		this.height = height;
		this.height *= this.pixelRatio;
		this.fieldWidth = this.fieldHeight = calcFieldHeight(this);
		this.top = calcTopMargin(this);

		this.width = (this.bx - this.tx + 1.5) * this.fieldWidth;
		this.left = calcLeftMargin(this);

		updateDim(this);
		this.redraw();
	}

	setDimensions(width, height) {
		this.width = width || parseInt(this.element.style.width, 10);
		this.width *= this.pixelRatio;
		this.height = height || parseInt(this.element.style.height, 10);
		this.height *= this.pixelRatio;

		this.fieldWidth = calcFieldWidth(this);
		this.fieldHeight = calcFieldHeight(this);
		this.left = calcLeftMargin(this);
		this.top = calcTopMargin(this);

		updateDim(this);
		this.redraw();
	}

	/**
	 * Get currently visible section of the board
	 */

	getSection() {
		return this.section;
	}

	/**
	 * Set section of the board to be displayed
	 */

	setSection(section_or_top, right, bottom, left) {
		if (typeof section_or_top == "object") {
			this.section = section_or_top;
		}
		else {
			this.section = {
				top: section_or_top,
				right: right,
				bottom: bottom,
				left: left,
			}
		}

		this.tx = this.section.left;
		this.ty = this.section.top;
		this.bx = this.size - 1 - this.section.right;
		this.by = this.size - 1 - this.section.bottom;

		this.setDimensions();
	}

	setSize(size) {
		size = size || 19;

		if (size != this.size) {
			this.size = size;

			this.obj_arr = [];
			for (var i = 0; i < this.size; i++) {
				this.obj_arr[i] = [];
				for (var j = 0; j < this.size; j++) this.obj_arr[i][j] = [];
			}

			this.bx = this.size - 1 - this.section.right;
			this.by = this.size - 1 - this.section.bottom;
			this.setDimensions();
		}
	}

	/**
	 * Redraw everything.
	 */

	redraw() {
		try {
			// redraw layers
			for (let i = 0; i < this.layers.length; i++) {
				this.layers[i].clear(this);
				this.layers[i].initialDraw(this);
			}

			// redraw field objects
			for (let i = 0; i < this.size; i++) {
				for (let j = 0; j < this.size; j++) {
					drawField(this, i, j);
				}
			}

			// redraw custom objects
			for (let i = 0; i < this.obj_list.length; i++) {
				var obj = this.obj_list[i];
				var handler = obj.handler;

				for (var layer in handler) {
					this[layer].draw(handler[layer].draw, obj, this);
				}
			}
		}
		catch (err) {
			// If the board is too small some canvas painting function can throw an exception, but we don't want to break our app
			console.error("WGo board failed to render. Error: " + err.message);
		}
	}

	/**
	 * Redraw just one layer. Use in special cases, when you know, that only that layer needs to be redrawn.
	 * For complete redrawing use method redraw().
	 */

	redrawLayer(layer) {
		var obj, handler;

		this[layer].clear();
		this[layer].initialDraw(this);

		for (var x = 0; x < this.size; x++) {
			for (var y = 0; y < this.size; y++) {
				for (var z = 0; z < this.obj_arr[x][y].length; z++) {
					obj = this.obj_arr[x][y][z];
					if (!obj.type) handler = themeVariable("stoneHandler", this);
					else if (typeof obj.type == "string") handler = themeVariable("markupHandlers", this)[obj.type];
					else handler = obj.type;

					if (handler[layer]) this[layer].drawField(handler[layer].draw, obj, this);
				}
			}
		}

		for (var i = 0; i < this.obj_list.length; i++) {
			obj = this.obj_list[i];
			handler = obj.handler;

			if (handler[layer]) this[layer].draw(handler[layer].draw, obj, this);
		}
	}

	/**
	 * Get absolute X coordinate
	 *
	 * @param {number} x relative coordinate
	 */

	getX(x) {
		return this.left + x * this.fieldWidth;
	}

	/**
	 * Get absolute Y coordinate
	 *
	 * @param {number} y relative coordinate
	 */

	getY(y) {
		return this.top + y * this.fieldHeight;
	}

	/**
	 * Add layer to the board. It is meant to be only for canvas layers.
	 *
	 * @param {CanvasBoard.CanvasLayer} layer to add
	 * @param {number} weight layer with biggest weight is on the top 
	 */

	addLayer(layer, weight) {
		layer.appendTo(this.element, weight);
		//layer.setDimensions(this.width, this.height, this);
		this.layers.push(layer);
	}

	/**
	 * Remove layer from the board.
	 *
	 * @param {CanvasBoard.CanvasLayer} layer to remove
	 */

	removeLayer(layer) {
		var i = this.layers.indexOf(layer);
		if (i >= 0) {
			this.layers.splice(i, 1);
			layer.removeFrom(this.element);
		}
	}

	update(changes) {
		var i;
		if (changes.remove && changes.remove == "all") this.removeAllObjects();
		else if (changes.remove) {
			for (i = 0; i < changes.remove.length; i++) this.removeObject(changes.remove[i]);
		}

		if (changes.add) {
			for (i = 0; i < changes.add.length; i++) this.addObject(changes.add[i]);
		}
	}

	addObject(obj) {
		// handling multiple objects
		if (obj.constructor == Array) {
			for (var i = 0; i < obj.length; i++) this.addObject(obj[i]);
			return;
		}

		// TODO: should be warning or error
		if (obj.x < 0 || obj.y < 0 || obj.x >= this.size || obj.y >= this.size) return;

		try {
			// clear all objects on object's coordinates
			clearField(this, obj.x, obj.y);

			// if object of this type is on the board, replace it
			var layers = this.obj_arr[obj.x][obj.y];
			for (var z = 0; z < layers.length; z++) {
				if (layers[z].type == obj.type) {
					layers[z] = obj;
					drawField(this, obj.x, obj.y);
					return;
				}
			}

			// if object is a stone, add it at the beginning, otherwise at the end
			if (!obj.type) layers.unshift(obj);
			else layers.push(obj);

			// draw all objects
			drawField(this, obj.x, obj.y);
		}
		catch (err) {
			// If the board is too small some canvas painting function can throw an exception, but we don't want to break our app
			console.error("WGo board failed to render. Error: " + err.message);
		}
	}

	removeObject(obj) {
		// handling multiple objects
		if (obj.constructor == Array) {
			for (var n = 0; n < obj.length; n++) this.removeObject(obj[n]);
			return;
		}

		if (obj.x < 0 || obj.y < 0 || obj.x >= this.size || obj.y >= this.size) return;

		try {
			let i;
			for (let j = 0; j < this.obj_arr[obj.x][obj.y].length; j++) {
				if (this.obj_arr[obj.x][obj.y][j].type == obj.type) {
					i = j;
					break;
				}
			}
			if (i == null) return;

			// clear all objects on object's coordinates
			clearField(this, obj.x, obj.y);

			this.obj_arr[obj.x][obj.y].splice(i, 1);

			drawField(this, obj.x, obj.y);
		}
		catch (err) {
			// If the board is too small some canvas painting function can throw an exception, but we don't want to break our app
			console.error("WGo board failed to render. Error: " + err.message);
		}
	}

	removeObjectsAt(x, y) {
		if (!this.obj_arr[x][y].length) return;

		clearField(this, x, y);
		this.obj_arr[x][y] = [];
	}

	removeAllObjects() {
		this.obj_arr = [];
		for (var i = 0; i < this.size; i++) {
			this.obj_arr[i] = [];
			for (var j = 0; j < this.size; j++) this.obj_arr[i][j] = [];
		}
		this.redraw();
	}

	addCustomObject(handler, args) {
		this.obj_list.push({ handler: handler, args: args });
		this.redraw();
	}

	removeCustomObject(handler, args) {
		for (var i = 0; i < this.obj_list.length; i++) {
			var obj = this.obj_list[i];
			if (obj.handler == handler && obj.args == args) {
				this.obj_list.splice(i, 1);
				this.redraw();
				return true;
			}
		}
		return false;
	}

	addEventListener(type, callback) {
		var _this = this,
			evListener = {
				type: type,
				callback: callback,
				handleEvent: function (e) {
					var coo = getMousePos(_this, e);
					callback(coo.x, coo.y, e);
				}
			};

		this.element.addEventListener(type, evListener, true);
		this.listeners.push(evListener);
	}

	removeEventListener(type, callback) {
		for (var i = 0; i < this.listeners.length; i++) {
			var listener = this.listeners[i];
			if (listener.type == type && listener.callback == callback) {
				this.element.removeEventListener(listener.type, listener, true);
				this.listeners.splice(i, 1);
				return true;
			}
		}
		return false;
	}
}

CanvasBoard.defaultConfig = {
	size: 19,
	width: 0,
	height: 0,
	starPoints: {
		5: [{ x: 2, y: 2 }],
		7: [{ x: 3, y: 3 }],
		8: [{ x: 2, y: 2 }, { x: 5, y: 2 }, { x: 2, y: 5 }, { x: 5, y: 5 }],
		9: [{ x: 2, y: 2 }, { x: 6, y: 2 }, { x: 4, y: 4 }, { x: 2, y: 6 }, { x: 6, y: 6 }],
		10: [{ x: 2, y: 2 }, { x: 7, y: 2 }, { x: 2, y: 7 }, { x: 7, y: 7 }],
		11: [{ x: 2, y: 2 }, { x: 8, y: 2 }, { x: 5, y: 5 }, { x: 2, y: 8 }, { x: 8, y: 8 }],
		12: [{ x: 3, y: 3 }, { x: 8, y: 3 }, { x: 3, y: 8 }, { x: 8, y: 8 }],
		13: [{ x: 3, y: 3 }, { x: 9, y: 3 }, { x: 6, y: 6 }, { x: 3, y: 9 }, { x: 9, y: 9 }],
		14: [{ x: 3, y: 3 }, { x: 10, y: 3 }, { x: 3, y: 10 }, { x: 10, y: 10 }],
		15: [{ x: 3, y: 3 }, { x: 11, y: 3 }, { x: 7, y: 7 }, { x: 3, y: 11 }, { x: 11, y: 11 }],
		16: [{ x: 3, y: 3 }, { x: 12, y: 3 }, { x: 3, y: 12 }, { x: 12, y: 12 }],
		17: [{ x: 3, y: 3 }, { x: 8, y: 3 }, { x: 13, y: 3 }, { x: 3, y: 8 }, { x: 8, y: 8 },
		{ x: 13, y: 8 }, { x: 3, y: 13 }, { x: 8, y: 13 }, { x: 13, y: 13 }],
		18: [{ x: 3, y: 3 }, { x: 14, y: 3 }, { x: 3, y: 14 }, { x: 14, y: 14 }],
		19: [{ x: 3, y: 3 }, { x: 9, y: 3 }, { x: 15, y: 3 }, { x: 3, y: 9 }, { x: 9, y: 9 },
		{ x: 15, y: 9 }, { x: 3, y: 15 }, { x: 9, y: 15 }, { x: 15, y: 15 }],
		20: [{ x: 3, y: 3 }, { x: 16, y: 3 }, { x: 3, y: 16 }, { x: 16, y: 16 }],
		21: [{ x: 3, y: 3 }, { x: 10, y: 3 }, { x: 17, y: 3 }, { x: 3, y: 10 }, { x: 10, y: 10 },
		{ x: 17, y: 10 }, { x: 3, y: 17 }, { x: 10, y: 17 }, { x: 17, y: 17 }],
	},
	section: {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	coordinates: false,
	theme: themes.realisticTheme
}

CanvasBoard.drawHandlers = drawHandlers;
CanvasBoard.themes = themes;
