/* global document, window */

/**
 * Contains implementation of go board.
 * @module CanvasBoard
 */

import ShadowLayer from './ShadowLayer';
import CanvasLayer from './CanvasLayer';
import { CanvasBoardConfig } from './types';
import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import { Point } from '../types';
import { BoardObject, BoardBase } from '../BoardBase';
import GridLayer from './GridLayer';
import DrawHandler from './drawHandlers/DrawHandler';
import canvasBoardDefaultConfig from './defaultConfig';

const zIndexSorter = (obj1: BoardObject<DrawHandler>, obj2: BoardObject<DrawHandler>) => obj1.zIndex - obj2.zIndex;

export default class CanvasBoard extends BoardBase<DrawHandler> {
  config: CanvasBoardConfig;
  element: HTMLElement;
  wrapperElement: HTMLElement;
  boardElement: HTMLElement;
  pixelRatio: number;
  objects: BoardObject<DrawHandler>[] = [];
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
	 */
  constructor(elem: HTMLElement, config: PartialRecursive<CanvasBoardConfig> = {}) {
    super(elem, makeConfig(canvasBoardDefaultConfig, config));

    // init board HTML
    this.wrapperElement = document.createElement('div');
    this.wrapperElement.className = 'wgo-board';
    this.wrapperElement.style.position = 'relative';
    this.element.appendChild(this.wrapperElement);

    this.boardElement = document.createElement('div');
    this.boardElement.style.position = 'absolute';
    this.boardElement.style.left = '0';
    this.boardElement.style.top = '0';
    this.boardElement.style.right = '0';
    this.boardElement.style.bottom = '0';
    this.boardElement.style.margin = 'auto';
    this.wrapperElement.appendChild(this.boardElement);

    this.layers = {
      grid: new GridLayer(this),
      shadow: new ShadowLayer(this),
      stone: new CanvasLayer(this),
    };

    // set the pixel ratio for HDPI (e.g. Retina) screens
    this.pixelRatio = window.devicePixelRatio || 1;

    this.resize();
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
      this.wrapperElement.style.width = 'auto';
      this.width = this.wrapperElement.offsetWidth * this.pixelRatio;
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

    this.wrapperElement.style.width = `${(this.width / this.pixelRatio)}px`;
    this.wrapperElement.style.height = `${(this.height / this.pixelRatio)}px`;

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
        if (this.config.theme.style) {
          Object.keys(this.config.theme.style).forEach(
            style => (this.boardElement.style as any)[style] = (this.config.theme.style as any)[style],
          );
        }

        // sort objects by zIndex
        this.objects.sort(zIndexSorter);

        // redraw all layers
        Object.keys(this.layers).forEach((layer) => {
          this.layers[layer].clear();

          this.objects.forEach((object) => {
            const handler = typeof object.type === 'string' ? this.config.theme.drawHandlers[object.type] : object.type;
            if ((handler as any)[layer]) {
              this.layers[layer].draw((handler as any)[layer].bind(handler), object);
            }
          });
        });
      });
    }
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
}
