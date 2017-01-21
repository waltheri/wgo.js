// Definitions of types and public interfaces

/**
 * Represents object on the board. It can be stone, marker, or even empty field. If you specify property `c` it will express a stone,
 * if you specify property `type` it will be handled as a marker. If you specify only coordinates, it will express an empty field.
 * For markers you can add another properties, for example: `text` for marker `LB` (label).
 * 
 * @typedef {Object} BoardObject
 * @property {number} x - X coordinate.
 * @property {number} y - Y coordinate.
 * @property {(WGo.B|WGo.W)} [c] - Color of the stone.
 * @property {string} [type] - Type of the marker.
 *
 * @example
 * // Black stone on coordinates D5
 * var stone = {
 * 	x: 3,
 * 	y: 4,
 * 	c: WGo.B
 * }
 */
 
/**
 * Object containing differences between two positions.
 *
 * @typedef {Object} ChangeObject
 * @property {BoardObject[]} add - Array with board objects to add.
 * @property {BoardObject[]} remove - Array with board objects to remove.
 */
 
/**
 * @callback boardMouseListener
 * @param {number} x - Board's X coordinate of the mouse.
 * @param {number} y - Board's Y coordinate of the mouse.
 * @param {MouseEvent} mouseEvent - Standard mouse event emitted by the browser.
 */

/**
 * Interface for graphical Go board. Any board class has to implement this interface to be used in the player.
 *
 * @interface
 * @alias WGo.Board
 * @param {HTMLElement} [elem] - HTML Element to put board in
 * @param {Object} [config] - Configuration object for the board
 */
 
function Board(elem, config) {
}

Board.prototype = {
	/** 
	 * Current width of the board. 
	 *
	 * @type {number} 
	 */
	 
	width: 0,

	/** 
	 * Current height of the board.
	 *
	 * @type {number} 
	 */
	 
	height: 0,
	
	/** 
	 * Current field (stone) radius. 
	 *
	 * @member {number}
	 */
	 
	stoneRadius: 0,
	
	/** 
	 * Sets width of the board. Height is computed.
	 *
	 * @param {number} width - New width of the board.
	 */
	 
	setWidth: function(width) {
		throw new Error('not implemented');
	},
	
	/** 
	 * Sets height of the board. Width is computed.
	 *
	 * @param {number} height - New height of the board.
	 */
	 
	setHeight: function(height) {
		throw new Error('not implemented');
	},
	
	/** 
	 * Sets both dimensions of the board.
	 *
	 * @param {number} width - New width of the board.
	 * @param {number} height - New height of the board.
	 */
	 
	setDimensions: function(width, height) {
		throw new Error('not implemented');
	},
	
	/** 
	 * Sets size of the board (eg: 9, 13, 19).
	 *
	 * @param {number} size - New size of the board.
	 */
	 
	setSize: function(size) {
		throw new Error('not implemented');
	},
	
	/**
	 * Appends the board to HTML element.
	 *
	 * @param {HTMLElement} element - New HTML element for the board.
	 */
	 
	appendTo: function(elem) {
	
	},
	
	/** 
	 * Adds an object on the board.
	 *
	 * @param {BoardObject} object - Board object to be added.
	 */
	 
	addObject: function(object) {
		throw new Error('not implemented');
	},
	
	/** 
	 * Removes an object from the board.
	 *
	 * @param {BoardObject} object - Board object to be removed.
	 */
	 
	removeObject: function(object) {
		throw new Error('not implemented');
	},
	
	/** 
	 * Removes all objects on certain field.
	 *
	 * @param {number} x - X coordinate.
	 * @param {number} y - Y coordinate.
	 */
	 
	removeObjectsAt: function(x, y) {
		throw new Error('not implemented');
	},
	
	/** 
	 * Removes all objects from the board.
	 */
	 
	removeAllObjects: function() {
		throw new Error('not implemented');
	},
	
	/** 
	 * Adds or removes multiple objects at once. Use this method for performance reasons.
	 *
	 * @param {ChangeObject} changes - Object with the changes.
	 */
	
	update: function(changes) {
		throw new Error('not implemented');
	},
	
	/** 
	 * Adds an event listener to the board, can be 'click', 'mouseover' or any other mouse event.
	 * The board is responsible to convert real mouse coordinates to board coordinates.
	 * 
	 * @param {string} type - Name of the listener.
	 * @param {boardMouseListener} listener - Listener function for the event.
	 */
	 
	addEventListener: function(type, listener) {
		throw new Error('not implemented');
	},
	
	/**
	 * Removes an event listener from the board.
	 *
	 * @param {string} type - Name of the listener.
	 * @param {boardMouseListener} listener - Listener function for the event.
	 */
	 
	removeEventListener: function(type, listener) {
		throw new Error('not implemented');
	},
	
	/** 
	 * Sets or unsets board coordinates 
	 *
	 * @param {boolean} b - If true, board should display coordinate labels around the board. Otherwise hide them.
	 */ 
	setCoordinates: function(b) {
		throw new Error('not implemented');
	}
}
