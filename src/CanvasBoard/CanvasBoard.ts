/* global document, window */

/**
 * Contains implementation of go board.
 * @module CanvasBoard
 */

import { themeVariable, defaultFieldClear } from './helpers';
import GridLayer from './GridLayer';
import ShadowLayer from './ShadowLayer';
import CanvasLayer from './CanvasLayer';
import defaultConfig from './defaultConfig';
import { CanvasBoardConfig, BoardViewport, BoardFieldObject, BoardCustomObject, DrawHandler } from './types';
import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import EventEmitter from '../utils/EventEmitter';

// Private methods of WGo.CanvasBoard

const calcLeftMargin = (b: CanvasBoard) => (
  (3 * b.width) / (4 * (b.bottomRightFieldX + 1 - b.topLeftFieldX) + 2) - b.fieldWidth * b.topLeftFieldX
);

const calcTopMargin = (b: CanvasBoard) => (
  (3 * b.height) / (4 * (b.bottomRightFieldY + 1 - b.topLeftFieldY) + 2) - b.fieldHeight * b.topLeftFieldY
);

const calcFieldWidth = (b: CanvasBoard) => (
  (4 * b.width) / (4 * (b.bottomRightFieldX + 1 - b.topLeftFieldX) + 2)
);

const calcFieldHeight = (b: CanvasBoard) => (
  (4 * b.height) / (4 * (b.bottomRightFieldY + 1 - b.topLeftFieldY) + 2)
);

const clearField = (board: CanvasBoard, x: number, y: number) => {
  let handler: DrawHandler<any>;
  for (let z = 0; z < board.fieldObjects[x][y].length; z++) {
    const obj = board.fieldObjects[x][y][z];
    if (!obj.type) {
      handler = themeVariable('stoneHandler', board);
    } else if (typeof obj.type === 'string') {
      handler = themeVariable('markupHandlers', board)[obj.type];
    } else {
      handler = obj.type;
    }

    for (const layer in handler) {
      board.layers[layer].drawField(handler[layer].clear ? handler[layer].clear : defaultFieldClear, obj, board);
    }
  }
};

// Draws all object on specified field
const drawField = function (board: CanvasBoard, x: number, y: number) {
  let handler;
  for (let z = 0; z < board.fieldObjects[x][y].length; z++) {
    const obj = board.fieldObjects[x][y][z];

    if (!obj.type) {
      handler = themeVariable('stoneHandler', board);
    } else if (typeof obj.type === 'string') {
      handler = themeVariable('markupHandlers', board)[obj.type];
    } else {
      handler = obj.type;
    }

    for (const layer in handler) {
      board.layers[layer].drawField(handler[layer].draw, obj, board);
    }
  }
};

/*const getMousePos = function (board: CanvasBoard, e: MouseEvent) {
  // new hopefully better translation of coordinates

  let x: number;
  let y: number;

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
    y: y >= board.size ? -1 : y,
  };
};*/

const objectMissing = function (objectsArray: any[]) {
  return function (object: any) {
    return !objectsArray.some((obj: any) => {
      if (object === obj) { return true; }

      return Object.keys(object).every(key => object[key] === obj[key]);
    });
  };
};

export default class CanvasBoard extends EventEmitter {
  config: CanvasBoardConfig;
  element: HTMLElement;
  pixelRatio: number;
  fieldObjects: BoardFieldObject[][][] = [];
  customObjects: BoardCustomObject[] = [];
  layers: {
    grid: CanvasLayer;
    shadow: CanvasLayer;
    stone: CanvasLayer;
    [key: string]: CanvasLayer;
  };

  // following props are temporary and should be removed
  viewport: BoardViewport;
  width: number;
  height: number;
  fieldWidth: number;
  fieldHeight: number;
  left: number;
  top: number;
  size: number;
  topLeftFieldX: number;
  topLeftFieldY: number;
  bottomRightFieldX: number;
  bottomRightFieldY: number;
  stoneRadius: number;

  /**
	 * CanvasBoard class constructor - it creates a canvas board.
	 *
	 * @alias WGo.CanvasBoard
	 * @class
	 * @param {HTMLElement} elem DOM element to put in
	 * @param {Object} config Configuration object. It is object with "key: value" structure. Possible configurations are:
	 *
	 * * size: number - size of the board (default: 19)
	 * * width: number - width of the board (default: 0)
	 * * height: number - height of the board (default: 0)
	 * * font: string - font of board writings (!deprecated)
	 * * lineWidth: number - line width of board drawings (!deprecated)
	 * * autoLineWidth: boolean - if set true, line width will be automatically computed accordingly to board size - this
   *   option rewrites 'lineWidth' /and it will keep markups sharp/ (!deprecated)
	 * * starPoints: Object - star points coordinates, defined for various board sizes. Look at CanvasBoard.default for
   *   more info.
	 * * stoneHandler: CanvasBoard.DrawHandler - stone drawing handler (default: CanvasBoard.drawHandlers.SHELL)
	 * * starSize: number - size of star points (default: 1). Radius of stars is dynamic, however you can modify it by
   *   given constant. (!deprecated)
	 * * stoneSize: number - size of stone (default: 1). Radius of stone is dynamic, however you can modify it by given
   *   constant. (!deprecated)
	 * * shadowSize: number - size of stone shadow (default: 1). Radius of shadow is dynamic, however you can modify it by
   *   given constant. (!deprecated)
	 * * background: string - background of the board, it can be either color (#RRGGBB) or url. Empty string means no
   *   background. (default: WGo.DIR+"wood1.jpg")
	 * * section: {
	 *     top: number,
	 *     right: number,
	 *     bottom: number,
	 *     left: number
	 *   }
	 *   It defines a section of board to be displayed. You can set a number of rows(or cols) to be skipped on each side.
	 *   Numbers can be negative, in that case there will be more empty space. In default all values are zeros.
	 * * theme: Object - theme object, which defines all graphical attributes of the board. Default theme object
   *   is "WGo.CanvasBoard.themes.default". For old look you may use "WGo.CanvasBoard.themes.old".
	 *
	 * Note: properties lineWidth, autoLineWidth, starPoints, starSize, stoneSize and shadowSize will be considered only
   * if you set property 'theme' to 'WGo.CanvasBoard.themes.old'.
	 */

  constructor(elem: HTMLElement, config: PartialRecursive<CanvasBoardConfig> = {}) {
    super();

    // merge user config with default
    this.config = makeConfig(defaultConfig, config);

    // create array for field objects (as 3d array)
    for (let x = 0; x < this.config.size; x++) {
      this.fieldObjects[x] = [];
      for (let y = 0; y < this.config.size; y++) {
        this.fieldObjects[x][y] = [];
      }
    }

    // init params - TODO: remove - should be computed as needed
    this.size = this.config.size;
    this.viewport = this.config.viewport;
    this.topLeftFieldX = this.config.viewport.left;
    this.topLeftFieldY = this.config.viewport.top;
    this.bottomRightFieldX = this.size - 1 - this.config.viewport.right;
    this.bottomRightFieldY = this.size - 1 - this.config.viewport.bottom;

    // init board html
    this.init(elem);

    // set the pixel ratio for HDPI (e.g. Retina) screens
    this.pixelRatio = window.devicePixelRatio || 1;

    if (config.width && config.height) {
      this.setDimensions(config.width, config.height);
    } else if (config.width) {
      this.setWidth(config.width);
    } else if (config.height) {
      this.setHeight(config.height);
    }
  }

  /**
   * Initialization method, it is called in constructor. You shouldn't call it, but you can alter it.
   */

  private init(elem: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'wgo-board';
    this.element.style.position = 'relative';

    this.element.style.backgroundColor = themeVariable('backgroundColor', this);

    if (this.config.theme.backgroundImage) {
      this.element.style.backgroundImage = `url("${themeVariable('backgroundImage', this)}")`;
    }

    this.layers = {
      grid: new GridLayer(),
      shadow: new ShadowLayer(),
      stone: new CanvasLayer(),
    };

    this.addLayer(this.layers.grid, 100);
    this.addLayer(this.layers.shadow, 200);
    this.addLayer(this.layers.stone, 300);

    // append to element
    elem.appendChild(this.element);
  }

  private updateDim() {
    this.element.style.width = `${(this.width / this.pixelRatio)}px`;
    this.element.style.height = `${(this.height / this.pixelRatio)}px`;

    this.stoneRadius = themeVariable('stoneSize', this);

    Object.keys(this.layers).forEach((layer) => {
      this.layers[layer].setDimensions(this.width, this.height, this);
    });
  }

  setWidth(width: number) {
    this.width = width * this.pixelRatio;

    this.fieldHeight = this.fieldWidth = calcFieldWidth(this);
    this.left = calcLeftMargin(this);

    this.height = (this.bottomRightFieldY - this.topLeftFieldY + 1.5) * this.fieldHeight;
    this.top = calcTopMargin(this);

    this.updateDim();
    this.redraw();
  }

  setHeight(height: number) {
    this.height = height * this.pixelRatio;
    this.fieldWidth = this.fieldHeight = calcFieldHeight(this);
    this.top = calcTopMargin(this);

    this.width = (this.bottomRightFieldX - this.topLeftFieldX + 1.5) * this.fieldWidth;
    this.left = calcLeftMargin(this);

    this.updateDim();
    this.redraw();
  }

  setDimensions(width?: number, height?: number) {
    this.width = (width || parseInt(this.element.style.width, 10)) * this.pixelRatio;
    this.height = (height || parseInt(this.element.style.height, 10)) * this.pixelRatio;

    this.fieldWidth = calcFieldWidth(this);
    this.fieldHeight = calcFieldHeight(this);
    this.left = calcLeftMargin(this);
    this.top = calcTopMargin(this);

    this.updateDim();
    this.redraw();
  }

  /**
	 * Get currently visible section of the board
	 */

  getViewport() {
    return this.viewport;
  }

  /**
	 * Set section of the board to be displayed
	 */

  setViewport(viewport: BoardViewport) {
    this.viewport = viewport;

    this.topLeftFieldX = this.viewport.left;
    this.topLeftFieldY = this.viewport.top;
    this.bottomRightFieldX = this.size - 1 - this.viewport.right;
    this.bottomRightFieldY = this.size - 1 - this.viewport.bottom;

    this.setDimensions();
  }

  getSize() {
    return this.size;
  }

  setSize(size: number = 19) {
    if (size !== this.size) {
      this.size = size;

      this.fieldObjects = [];
      for (let i = 0; i < this.size; i++) {
        this.fieldObjects[i] = [];
        for (let j = 0; j < this.size; j++) { this.fieldObjects[i][j] = []; }
      }

      this.bottomRightFieldX = this.size - 1 - this.viewport.right;
      this.bottomRightFieldY = this.size - 1 - this.viewport.bottom;
      this.setDimensions();
    }
  }

  /**
   * Redraw everything.
   */

  redraw() {
    try {
      // redraw layers
      Object.keys(this.layers).forEach((layer) => {
        this.layers[layer].clear(this);
        this.layers[layer].initialDraw(this);
      });

      // redraw field objects
      for (let x = 0; x < this.size; x++) {
        for (let y = 0; y < this.size; y++) {
          drawField(this, x, y);
        }
      }

      // redraw custom objects
      for (let i = 0; i < this.customObjects.length; i++) {
        const obj = this.customObjects[i];
        const handler = obj.handler;

        for (const layer in handler) {
          this.layers[layer].draw(handler[layer].draw, obj, this);
        }
      }
    } catch (err) {
      // If the board is too small some canvas painting function can throw an exception, but we don't
      // want to break our app
      console.error(`WGo board failed to render. Error: ${err.message}`);
    }
  }

  /**
	 * Redraw just one layer. Use in special cases, when you know, that only that layer needs to be redrawn.
	 * For complete redrawing use method redraw().
	 */

  redrawLayer(layer: string) {
    this.layers[layer].clear(this);
    this.layers[layer].initialDraw(this);

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        for (let z = 0; z < this.fieldObjects[x][y].length; z++) {
          const obj = this.fieldObjects[x][y][z];
          let handler: any;
          if (!obj.type) {
            handler = themeVariable('stoneHandler', this);
          } else if (typeof obj.type === 'string') {
            handler = themeVariable('markupHandlers', this)[obj.type];
          } else {
            handler = obj.type;
          }

          if (handler[layer]) {
            this.layers[layer].drawField(handler[layer].draw, obj, this);
          }
        }
      }
    }

    for (let i = 0; i < this.customObjects.length; i++) {
      const obj = this.customObjects[i];
      const handler = obj.handler;

      if (handler[layer]) {
        this.layers[layer].draw(handler[layer].draw, obj, this);
      }
    }
  }

  /**
	 * Get absolute X coordinate
	 *
	 * @param {number} x relative coordinate
	 */

  getX(x: number) {
    return this.left + x * this.fieldWidth;
  }

  /**
	 * Get absolute Y coordinate
	 *
	 * @param {number} y relative coordinate
	 */

  getY(y: number) {
    return this.top + y * this.fieldHeight;
  }

  /**
	 * Add layer to the board. It is meant to be only for canvas layers.
	 *
	 * @param {CanvasBoard.CanvasLayer} layer to add
	 * @param {number} weight layer with biggest weight is on the top
	 */

  addLayer(layer: CanvasLayer, weight: number) {
    layer.appendTo(this.element, weight);
  }

  /**
	 * Remove layer from the board.
	 *
	 * @param {CanvasBoard.CanvasLayer} layer to remove
	 */

  removeLayer(layer: CanvasLayer) {
    layer.removeFrom(this.element);
  }

  update(fieldObjects: BoardFieldObject[][][]) {
    const changes = this.getChanges(fieldObjects);

    if (!changes) {
      return;
    }

    for (let i = 0; i < changes.remove.length; i++) {
      this.removeObject(changes.remove[i]);
    }

    for (let i = 0; i < changes.add.length; i++) {
      this.addObject(changes.add[i]);
    }
  }

  getChanges(fieldObjects: BoardFieldObject[][][]) {
    if (fieldObjects === this.fieldObjects) { return null; }

    let add: BoardFieldObject[] = [];
    let remove: BoardFieldObject[] = [];

    for (let x = 0; x < this.size; x++) {
      if (fieldObjects[x] !== this.fieldObjects[x]) {
        for (let y = 0; y < this.size; y++) {
          // tslint:disable-next-line:max-line-length
          if (fieldObjects[x][y] !== this.fieldObjects[x][y] && (fieldObjects[x][y].length || this.fieldObjects[x][y].length)) {
            add = add.concat(fieldObjects[x][y].filter(objectMissing(this.fieldObjects[x][y])));
            remove = remove.concat(this.fieldObjects[x][y].filter(objectMissing(fieldObjects[x][y])));
          }
        }
      }
    }

    return { add, remove };
  }

  addObject(obj: BoardFieldObject) {
    // handling multiple objects
    if (obj.constructor === Array) {
      for (let i = 0; i < obj.length; i++) { this.addObject(obj[i]); }
      return;
    }

    // TODO: should be warning or error
    if (obj.x < 0 || obj.y < 0 || obj.x >= this.size || obj.y >= this.size) { return; }

    try {
      // clear all objects on object's coordinates
      clearField(this, obj.x, obj.y);

      // if object of this type is on the board, replace it
      const layers = this.fieldObjects[obj.x][obj.y];
      for (let z = 0; z < layers.length; z++) {
        if (layers[z].type === obj.type) {
          layers[z] = obj;
          drawField(this, obj.x, obj.y);
          return;
        }
      }

      // if object is a stone, add it at the beginning, otherwise at the end
      if (!obj.type) { layers.unshift(obj); }
      else { layers.push(obj); }

      // draw all objects
      drawField(this, obj.x, obj.y);
    } catch (err) {
      // If the board is too small some canvas painting function can throw an exception,
      // but we don't want to break our app
      console.error('WGo board failed to render. Error: ' + err.message);
    }
  }

  removeObject(obj: BoardFieldObject) {
    // handling multiple objects
    if (obj.constructor === Array) {
      for (let n = 0; n < obj.length; n++) { this.removeObject(obj[n]); }
      return;
    }

    if (obj.x < 0 || obj.y < 0 || obj.x >= this.size || obj.y >= this.size) { return; }

    try {
      let i;
      for (let j = 0; j < this.fieldObjects[obj.x][obj.y].length; j++) {
        if (this.fieldObjects[obj.x][obj.y][j].type === obj.type) {
          i = j;
          break;
        }
      }
      if (i == null) { return; }

      // clear all objects on object's coordinates
      clearField(this, obj.x, obj.y);

      this.fieldObjects[obj.x][obj.y].splice(i, 1);

      drawField(this, obj.x, obj.y);
    } catch (err) {
      // If the board is too small some canvas painting function can throw an exception,
      // but we don't want to break our app
      console.error('WGo board failed to render. Error: ' + err.message);
    }
  }

  removeObjectsAt(x: number, y: number) {
    if (!this.fieldObjects[x][y].length) { return; }

    clearField(this, x, y);
    this.fieldObjects[x][y] = [];
  }

  removeAllObjects() {
    this.fieldObjects = [];
    for (let i = 0; i < this.size; i++) {
      this.fieldObjects[i] = [];
      for (let j = 0; j < this.size; j++) { this.fieldObjects[i][j] = []; }
    }
    this.redraw();
  }

  addCustomObject(handler: DrawHandler<BoardCustomObject>, args: any) {
    this.customObjects.push({ handler, args });
    this.redraw();
  }

  removeCustomObject(handler: DrawHandler<BoardCustomObject>, args: any) {
    for (let i = 0; i < this.customObjects.length; i++) {
      const obj = this.customObjects[i];
      if (obj.handler === handler && obj.args === args) {
        this.customObjects.splice(i, 1);
        this.redraw();
        return true;
      }
    }
    return false;
  }

  /*on(type, callback) {
    const evListener = {
      type,
      callback,
      handleEvent: event => {
        const coo = getMousePos(this, event);
        callback(coo.x, coo.y, event);
      },
    };

    this.element.addEventListener(type, evListener, true);
    this.listeners.push(evListener);
  }

  off(type, callback) {
    for (let i = 0; i < this.listeners.length; i++) {
      const listener = this.listeners[i];
      if (listener.type === type && listener.callback === callback) {
        this.element.removeEventListener(listener.type, listener, true);
        this.listeners.splice(i, 1);
        return true;
      }
    }
    return false;
  }*/
}
