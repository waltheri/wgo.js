/* global document, window */

/**
 * Contains implementation of go board.
 * @module CanvasBoard
 */

import ShadowLayer from './ShadowLayer';
import CanvasLayer from './CanvasLayer';
import defaultConfig from './defaultConfig';
import {
  CanvasBoardConfig,
  BoardViewport,
  BoardObject,
  BoardFieldObject,
  BoardFreeObject,
  DrawHandler,
  FreeDrawHandler,
  FieldDrawHandler,
} from './types';
import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import EventEmitter from '../utils/EventEmitter';
import coordinates from './drawHandlers/coordinates';
import grid from './drawHandlers/grid';
import { Point } from '../types';

// Private methods of WGo.CanvasBoard

/*const calcLeftMargin = (b: CanvasBoard) => (
  //(3 * b.width) / (4 * (b.bottomRightFieldX + 1 - b.topLeftFieldX) + 2) - b.fieldWidth * b.topLeftFieldX
);

const calcTopMargin = (b: CanvasBoard) => (
  //(3 * b.height) / (4 * (b.bottomRightFieldY + 1 - b.topLeftFieldY) + 2) - b.fieldHeight * b.topLeftFieldY
);*/

function affectsLayer(layer: string) {
  return (handler: DrawHandler): handler is FreeDrawHandler => !!('drawFree' in handler && handler.drawFree[layer]);
}

function isSameField(field1: Point, field2: Point) {
  return field1.x === field2.x && field1.y === field2.y;
}


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
  objects: BoardObject[] = [];
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
      grid: new CanvasLayer(),
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

  getObjectHandler(boardObject: BoardObject) {
    return boardObject.type ? this.config.theme.drawHandlers[boardObject.type] : boardObject.handler;
  }

  /**
   * Redraw everything.
   */
  redraw() {
    // redraw all layers
    Object.keys(this.layers).forEach((layer) => {
      this.redrawLayer(layer);
    });
  }

  /**
	 * Redraw just one layer. Use in special cases, when you know, that only that layer needs to be redrawn.
	 * For complete redrawing use method redraw().
	 */
  redrawLayer(layer: string) {
    this.layers[layer].clear(this);

    this.getObjectsToDraw().forEach((boardObject) => {
      const handler = this.getObjectHandler(boardObject);
      if ('drawField' in handler && handler.drawField[layer]) {
        this.layers[layer].drawField(handler.drawField[layer], boardObject as BoardFieldObject, this);
      }
      if ('drawFree' in handler && handler.drawFree[layer]) {
        this.layers[layer].draw(handler.drawFree[layer], boardObject as BoardFreeObject, this);
      }
    });
  }

  /**
   * Add board object. Main function for adding graphics on the board.
   *
   * @param boardObject
   */
  addObject(boardObject: BoardObject | BoardObject[]) {
    // handling multiple objects
    if (Array.isArray(boardObject)) {
      for (let i = 0; i < boardObject.length; i++) {
        this.addObject(boardObject[i]);
      }
      return;
    }

    const handler = this.getObjectHandler(boardObject);

    if (!handler) {
      throw new TypeError('Board object has invalid or missing `handler` draw function and cannot be added.');
    }

    if ('drawField' in handler) {
      if (!('field' in boardObject)) {
        throw new TypeError('Board object has field draw `handler` but `field` property is missing.');
      }

      this.objects.push(boardObject);
      Object.keys(this.layers).forEach((layer) => {
        if (handler.drawField[layer]) {
          this.layers[layer].drawField(handler.drawField[layer], boardObject, this);
        }
      });
    }

    if ('drawFree' in handler) {
      this.objects.push(boardObject);
      Object.keys(this.layers).forEach((layer) => {
        if (handler.drawFree[layer]) {
          this.layers[layer].draw(handler.drawFree[layer], boardObject as BoardFreeObject, this);
        }
      });
    }
  }

  /**
   * Shortcut method to add field object.
   */
  addFieldObject(x: number, y: number, handler: string | FieldDrawHandler, params?: { [key: string]: any }) {
    const object: BoardFieldObject = {
      field: { x, y },
      params,
    };

    if (typeof handler === 'string') {
      object.type = handler;
    } else {
      object.handler = handler;
    }

    this.addObject(object);
  }

  /**
   * Remove board object. Main function for removing graphics on the board.
   *
   * @param boardObject
   */
  removeObject(boardObject: BoardObject | BoardObject[]) {
    // handling multiple objects
    if (Array.isArray(boardObject)) {
      for (let i = 0; i < boardObject.length; i++) {
        this.removeObject(boardObject[i]);
      }
      return;
    }

    const objectPos = this.objects.indexOf(boardObject);

    if (objectPos === -1) {
      // object isn't on the board, ignore it
      return;
    }

    this.objects.splice(objectPos, 1);

    const objects = this.getObjectsToDraw();
    const objectHandler = this.getObjectHandler(boardObject);
    const handlers = objects.map(obj => this.getObjectHandler(obj));

    Object.keys(this.layers).forEach((layer) => {
      // if there is a free object affecting the layer, we must redraw layer completely
      const affectsCurrentLayer = affectsLayer(layer);
      if (affectsCurrentLayer(objectHandler) || handlers.some(affectsCurrentLayer)) {
        this.redrawLayer(layer);
        return;
      }

      this.layers[layer].clearField((boardObject as BoardFieldObject).field, this);

      for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];
        if ('field' in obj && isSameField(obj.field, (boardObject as BoardFieldObject).field)) {
          const handler = handlers[i];
          if ('drawField' in handler && handler.drawField[layer]) {
            this.layers[layer].drawField(handler.drawField[layer], obj, this);
          }
        }
      }
    });
  }

  removeObjectsAt(x: number, y: number) {
    const toRemove: BoardObject[] = [];
    const field = { x, y };

    this.objects.forEach((obj) => {
      if ('field' in obj && isSameField(obj.field, field)) {
        toRemove.push(obj);
      }
    });

    this.removeObject(toRemove);
  }

  removeAllObjects() {
    this.objects = [];
    this.redraw();
  }

  getObjectsToDraw() {
    // add grid
    const fixedObjects: BoardObject[] = [{ handler: grid }];

    // add coordinates
    if (this.config.coordinates) {
      fixedObjects.push({ handler: coordinates });
    }

    return fixedObjects.concat(this.objects);
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
