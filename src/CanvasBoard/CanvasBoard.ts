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
} from './types';
import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import EventEmitter from '../utils/EventEmitter';
import { Point } from '../types';
import { BoardObject } from './boardObjects';
import GridLayer from './GridLayer';
import DrawHandler from './drawHandlers/DrawHandler';

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

export default class CanvasBoard extends EventEmitter {
  config: CanvasBoardConfig;
  element: HTMLElement;
  boardElement: HTMLElement;
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
  leftOffset: number;
  topOffset: number;
  fieldSize: number;
  resizeCallback: (this: Window, ev: UIEvent) => any;
  redrawScheduled: boolean;

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
    elem.appendChild(this.element);

    this.boardElement = document.createElement('div');
    this.boardElement.style.position = 'absolute';
    this.boardElement.style.left = '0';
    this.boardElement.style.top = '0';
    this.boardElement.style.right = '0';
    this.boardElement.style.bottom = '0';
    this.boardElement.style.margin = 'auto';
    this.element.appendChild(this.boardElement);

    this.layers = {
      grid: new GridLayer(this),
      shadow: new ShadowLayer(this),
      stone: new CanvasLayer(this),
    };
  }

  /**
   * Updates dimensions and redraws everything
   */
  resize() {
    const countX = this.config.size - this.config.viewport.left - this.config.viewport.right;
    const countY = this.config.size - this.config.viewport.top - this.config.viewport.bottom;
    const topOffset = this.config.marginSize + (this.config.coordinates && !this.config.viewport.top ? 0.5 : 0);
    const rightOffset = this.config.marginSize + (this.config.coordinates && !this.config.viewport.right ? 0.5 : 0);
    const bottomOffset = this.config.marginSize + (this.config.coordinates && !this.config.viewport.bottom ? 0.5 : 0);
    const leftOffset = this.config.marginSize + (this.config.coordinates && !this.config.viewport.left ? 0.5 : 0);

    if (this.config.width && this.config.height) {
      // exact dimensions
      this.width = this.config.width * this.pixelRatio;
      this.height = this.config.height * this.pixelRatio;
      this.fieldSize = Math.min(
        this.width / (countX + leftOffset + rightOffset),
        this.height / (countY + topOffset + bottomOffset),
      );

      if (this.resizeCallback) {
        window.removeEventListener('resize', this.resizeCallback);
      }
    } else if (this.config.width) {
      this.width = this.config.width * this.pixelRatio;
      this.fieldSize = this.width / (countX + leftOffset + rightOffset);
      this.height = this.fieldSize * (countY + topOffset + bottomOffset);

      if (this.resizeCallback) {
        window.removeEventListener('resize', this.resizeCallback);
      }
    } else if (this.config.height) {
      this.height = this.config.height * this.pixelRatio;
      this.fieldSize = this.height / (countY + topOffset + bottomOffset);
      this.width = this.fieldSize * (countX + leftOffset + rightOffset);

      if (this.resizeCallback) {
        window.removeEventListener('resize', this.resizeCallback);
      }
    } else {
      this.element.style.width = 'auto';
      this.width = this.element.offsetWidth * this.pixelRatio;
      this.fieldSize = this.width / (countX + leftOffset + rightOffset);
      this.height = this.fieldSize * (countY + topOffset + bottomOffset);

      if (!this.resizeCallback) {
        this.resizeCallback = () => {
          this.resize();
        };
        window.addEventListener('resize', this.resizeCallback);
      }
    }

    if (this.config.snapToGrid) {
      this.fieldSize = Math.floor(this.fieldSize);
    }

    this.leftOffset = this.fieldSize * (leftOffset + 0.5 - this.config.viewport.left);
    this.topOffset = this.fieldSize * (topOffset + 0.5 - this.config.viewport.top);

    this.element.style.width = `${(this.width / this.pixelRatio)}px`;
    this.element.style.height = `${(this.height / this.pixelRatio)}px`;

    const boardWidth = (countX + leftOffset + rightOffset) * this.fieldSize;
    const boardHeight = (countY + topOffset + bottomOffset) * this.fieldSize;

    this.boardElement.style.width = `${(boardWidth / this.pixelRatio)}px`;
    this.boardElement.style.height = `${(boardHeight / this.pixelRatio)}px`;

    Object.keys(this.layers).forEach((layer) => {
      this.layers[layer].resize(boardWidth, boardHeight);
    });

    this.redraw();
  }

  /**
	 * Get absolute X coordinate
	 *
	 * @param {number} x relative coordinate
	 */

  getX(x: number) {
    return this.leftOffset + x * this.fieldSize;
  }

  /**
	 * Get absolute Y coordinate
	 *
	 * @param {number} y relative coordinate
	 */

  getY(y: number) {
    return this.topOffset + y * this.fieldSize;
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
    if (!this.redrawScheduled) {
      this.redrawScheduled = true;

      window.requestAnimationFrame(() => {
        this.redrawScheduled = false;

        // set correct background
        this.boardElement.style.backgroundColor = this.config.theme.backgroundColor;

        if (this.config.theme.backgroundImage) {
          this.boardElement.style.backgroundImage = `url("${this.config.theme.backgroundImage}")`;
        }

        // redraw all layers
        Object.keys(this.layers).forEach((layer) => {
          this.redrawLayer(layer);
        });
      });
    }
  }

  /**
	 * Redraw just one layer. Use in special cases, when you know, that only that layer needs to be redrawn.
	 * For complete redrawing use method redraw().
	 */
  redrawLayer(layer: string) {
    this.layers[layer].clear();

    this.objects.forEach((object) => {
      const handler = typeof object.type === 'string' ? this.config.theme.drawHandlers[object.type] : object.type;
      if ((handler as any)[layer]) {
        this.layers[layer].draw((handler as any)[layer].bind(handler), object);
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

    if (typeof boardObject.type === 'string') {
      if (!this.config.theme.drawHandlers[boardObject.type]) {
        throw new TypeError(`Board object type "${boardObject.type}" doesn't exist in \`config.theme.drawHandlers\`.`);
      }
    } else {
      if (boardObject.type == null || !(boardObject.type instanceof DrawHandler)) {
        throw new TypeError('Invalid board object type.');
      }
    }

    this.objects.push(boardObject);
    this.redraw();
  }

  /**
   * Shortcut method to add object and set its position.
   */
  addObjectAt(x: number, y: number, boardObject: BoardObject) {
    boardObject.setPosition(x, y);
    this.addObject(boardObject);
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
    this.redraw();
  }

  removeObjectsAt(x: number, y: number) {
    this.objects.forEach((obj) => {
      if (obj.x === x && obj.y === y) {
        this.removeObject(obj);
      }
    });
  }

  removeAllObjects() {
    this.objects = [];
    this.redraw();
  }

  hasObject(boardObject: BoardObject) {
    return this.objects.indexOf(boardObject) >= 0;
  }

  on(type: string, callback: (event: UIEvent, point: Point) => void) {
    super.on(type, callback);
    this.registerBoardListener(type);
  }

  registerBoardListener(type: string) {
    this.boardElement.addEventListener(type, (evt) => {
      if ((evt as any).layerX != null) {
        const pos = this.getRelativeCoordinates((evt as any).layerX, (evt as any).layerY);
        this.emit(type, evt, pos);
      } else {
        this.emit(type, evt);
      }
    });
  }

  getRelativeCoordinates(absoluteX: number, absoluteY: number) {
    // new hopefully better translation of coordinates

    const x = Math.round((absoluteX * this.pixelRatio - this.leftOffset) / this.fieldSize);
    const y = Math.round((absoluteY * this.pixelRatio - this.topOffset) / this.fieldSize);

    if (x < 0 || x >= this.config.size || y < 0 || y >= this.config.size) {
      return null;
    }

    return { x, y };
  }

  /*
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
