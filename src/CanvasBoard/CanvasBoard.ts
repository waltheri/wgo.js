/* global document, window */

/**
 * Contains implementation of go board.
 * @module CanvasBoard
 */

import GridLayer from './GridLayer';
import ShadowLayer from './ShadowLayer';
import CanvasLayer from './CanvasLayer';
import defaultConfig from './defaultConfig';
import { CanvasBoardConfig, BoardViewport, BoardFieldObject, BoardCustomObject, DrawHandler } from './types';
import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import EventEmitter from '../utils/EventEmitter';
import coordinates from './drawHandlers/coordinates';

// Private methods of WGo.CanvasBoard

/*const calcLeftMargin = (b: CanvasBoard) => (
  //(3 * b.width) / (4 * (b.bottomRightFieldX + 1 - b.topLeftFieldX) + 2) - b.fieldWidth * b.topLeftFieldX
);

const calcTopMargin = (b: CanvasBoard) => (
  //(3 * b.height) / (4 * (b.bottomRightFieldY + 1 - b.topLeftFieldY) + 2) - b.fieldHeight * b.topLeftFieldY
);*/

function defaultFieldClear(canvasCtx: CanvasRenderingContext2D, _args: any, board: CanvasBoard) {
  canvasCtx.clearRect(-board.fieldSize / 2, -board.fieldSize / 2, board.fieldSize, board.fieldSize);
}

const clearField = (board: CanvasBoard, x: number, y: number) => {
  let handler: DrawHandler<any>;
  for (let z = 0; z < board.fieldObjects[x][y].length; z++) {
    const obj = board.fieldObjects[x][y][z];
    if (typeof obj.type === 'string') {
      handler = board.config.theme.drawHandlers[obj.type];
    } else {
      handler = obj.type;
    }

    for (const layer in handler) {
      board.layers[layer].drawField(handler[layer].clear ? handler[layer].clear : defaultFieldClear, obj, board);
    }
  }
};

const coordinatesObject = { handler: coordinates };

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

  // following props are computed in resize() method for performance
  width: number;
  height: number;
  margin: number;
  fieldSize: number;
  resizeCallback: (this: Window, ev: UIEvent) => any;

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

    // init board html
    this.init(elem);

    // set the pixel ratio for HDPI (e.g. Retina) screens
    this.pixelRatio = window.devicePixelRatio || 1;

    this.resize();
  }

  /**
   * Initialization method, it is called in constructor. You shouldn't call it, but you can alter it.
   */

  private init(elem: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'wgo-board';
    this.element.style.position = 'relative';

    this.element.style.backgroundColor = this.config.theme.backgroundColor;

    if (this.config.theme.backgroundImage) {
      this.element.style.backgroundImage = `url("${this.config.theme.backgroundImage}")`;
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

  /**
   * Updates dimensions and redraws everything
   */
  resize() {
    const countX = this.getCountX();
    const countY = this.getCountY();
    const margins = 2 * this.getMargin();

    if (this.config.width && this.config.height) {
      // exact dimensions
      this.width = this.config.width * this.pixelRatio;
      this.height = this.config.height * this.pixelRatio;
      this.fieldSize = Math.min(
        this.height / (countY + margins),
        this.width / (countX + margins),
      );

      if (this.resizeCallback) {
        window.removeEventListener('resize', this.resizeCallback);
      }
    } else if (this.config.width) {
      this.width = this.config.width * this.pixelRatio;
      this.fieldSize = this.width / (countX + margins);
      this.height = this.fieldSize * (countY + margins);

      if (this.resizeCallback) {
        window.removeEventListener('resize', this.resizeCallback);
      }
    } else if (this.config.height) {
      this.height = this.config.height * this.pixelRatio;
      this.fieldSize = this.height / (countY + margins);
      this.width = this.fieldSize * (countX + margins);

      if (this.resizeCallback) {
        window.removeEventListener('resize', this.resizeCallback);
      }
    } else {
      this.element.style.width = 'auto';
      this.width = this.element.offsetWidth * this.pixelRatio;
      this.fieldSize = this.width / (countX + margins);
      this.height = this.fieldSize * (countY + margins);

      if (!this.resizeCallback) {
        this.resizeCallback = () => {
          this.resize();
        };
        window.addEventListener('resize', this.resizeCallback);
      }
    }

    this.margin = this.fieldSize * (this.getMargin() + 0.5);

    this.element.style.width = `${(this.width / this.pixelRatio)}px`;
    this.element.style.height = `${(this.height / this.pixelRatio)}px`;

    Object.keys(this.layers).forEach((layer) => {
      this.layers[layer].setDimensions(
        (countX + margins) * this.fieldSize,
        (countY + margins) * this.fieldSize,
        this,
      );
    });

    this.redraw();
  }

  getCountX() {
    return this.config.size - this.config.viewport.left - this.config.viewport.right;
  }

  getCountY() {
    return this.config.size - this.config.viewport.top - this.config.viewport.bottom;
  }

  getMargin() {
    return this.config.marginSize + (this.config.coordinates ? 0.5 : 0);
  }

  /**
   * Sets width of the board, height will be automatically computed. Then everything will be redrawn.
   *
   * @param width
   */
  setWidth(width: number) {
    this.config.width = width;
    this.config.height = 0;
    this.resize();
  }

  /**
   * Sets height of the board, width will be automatically computed. Then everything will be redrawn.
   *
   * @param height
   */
  setHeight(height: number) {
    this.config.width = 0;
    this.config.height = height;
    this.resize();
  }

  /**
   * Sets exact dimensions of the board. Then everything will be redrawn.
   *
   * @param width
   * @param height
   */
  setDimensions(width: number, height: number) {
    this.config.width = width;
    this.config.height = height;
    this.resize();
  }

  /**
	 * Get currently visible section of the board
	 */

  getViewport() {
    return this.config.viewport;
  }

  /**
	 * Set section of the board to be displayed
	 */

  setViewport(viewport: BoardViewport) {
    this.config.viewport = viewport;
    this.resize();
  }

  getSize() {
    return this.config.size;
  }

  setSize(size: number = 19) {
    if (size !== this.config.size) {
      this.config.size = size;
      this.resize();
    }
  }

  getCoordinates() {
    return this.config.coordinates;
  }

  setCoordinates(coordinates: boolean) {
    if (this.config.coordinates !== coordinates) {
      this.config.coordinates = coordinates;
      this.resize();
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

      if (this.config.coordinates && this.customObjects.indexOf(coordinatesObject) === -1) {
        // add coordinates handler if there should be coordinates
        this.customObjects.push(coordinatesObject);
      } else if (!this.config.coordinates && this.customObjects.indexOf(coordinatesObject) >= 0) {
        // remove coordinates handler if there should not be coordinates
        this.customObjects = this.customObjects.filter(obj => coordinatesObject !== obj);
      }

      // redraw field objects
      for (let x = 0; x < this.config.size; x++) {
        for (let y = 0; y < this.config.size; y++) {
          this.drawField(x, y);
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

    for (let x = 0; x < this.config.size; x++) {
      for (let y = 0; y < this.config.size; y++) {
        for (let z = 0; z < this.fieldObjects[x][y].length; z++) {
          const obj = this.fieldObjects[x][y][z];
          let handler: any;
          if (typeof obj.type === 'string') {
            handler = this.config.theme.drawHandlers[obj.type];
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
    return this.margin + x * this.fieldSize;
  }

  /**
	 * Get absolute Y coordinate
	 *
	 * @param {number} y relative coordinate
	 */

  getY(y: number) {
    return this.margin + y * this.fieldSize;
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

    for (let x = 0; x < this.config.size; x++) {
      if (fieldObjects[x] !== this.fieldObjects[x]) {
        for (let y = 0; y < this.config.size; y++) {
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
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) { this.addObject(obj[i]); }
      return;
    }

    // TODO: should be warning or error
    if (obj.x < 0 || obj.y < 0 || obj.x >= this.config.size || obj.y >= this.config.size) { return; }

    try {
      // clear all objects on object's coordinates
      clearField(this, obj.x, obj.y);

      // if object of this type is on the board, replace it
      const layers = this.fieldObjects[obj.x][obj.y];
      for (let z = 0; z < layers.length; z++) {
        if (layers[z].type === obj.type) {
          layers[z] = obj;
          this.drawField(obj.x, obj.y);
          return;
        }
      }

      // if object is a stone, add it at the beginning, otherwise at the end
      if (!obj.type) { layers.unshift(obj); }
      else { layers.push(obj); }

      // draw all objects
      this.drawField(obj.x, obj.y);
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

    if (obj.x < 0 || obj.y < 0 || obj.x >= this.config.size || obj.y >= this.config.size) { return; }

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

      this.drawField(obj.x, obj.y);
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
    for (let i = 0; i < this.config.size; i++) {
      this.fieldObjects[i] = [];
      for (let j = 0; j < this.config.size; j++) { this.fieldObjects[i][j] = []; }
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

  private drawField(x: number, y: number) {
    let handler;
    for (let z = 0; z < this.fieldObjects[x][y].length; z++) {
      const obj = this.fieldObjects[x][y][z];

      if (typeof obj.type === 'string') {
        handler = this.config.theme.drawHandlers[obj.type];
      } else {
        handler = obj.type;
      }

      for (const layer in handler) {
        this.layers[layer].drawField(handler[layer].draw, obj, this);
      }
    }
  }
}
