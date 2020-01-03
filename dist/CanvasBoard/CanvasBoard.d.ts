import CanvasLayer from './CanvasLayer';
import { CanvasBoardConfig, BoardViewport, BoardFieldObject, BoardCustomObject, DrawHandler } from './types';
import { PartialRecursive } from '../utils/makeConfig';
import EventEmitter from '../utils/EventEmitter';
export default class CanvasBoard extends EventEmitter {
    config: CanvasBoardConfig;
    element: HTMLElement;
    pixelRatio: number;
    fieldObjects: BoardFieldObject[][][];
    customObjects: BoardCustomObject[];
    layers: {
        grid: CanvasLayer;
        shadow: CanvasLayer;
        stone: CanvasLayer;
        [key: string]: CanvasLayer;
    };
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
    constructor(elem: HTMLElement, config?: PartialRecursive<CanvasBoardConfig>);
    /**
     * Initialization method, it is called in constructor. You shouldn't call it, but you can alter it.
     */
    private init;
    private updateDim;
    setWidth(width: number): void;
    setHeight(height: number): void;
    setDimensions(width?: number, height?: number): void;
    /**
       * Get currently visible section of the board
       */
    getViewport(): BoardViewport;
    /**
       * Set section of the board to be displayed
       */
    setViewport(viewport: BoardViewport): void;
    getSize(): number;
    setSize(size?: number): void;
    /**
     * Redraw everything.
     */
    redraw(): void;
    /**
       * Redraw just one layer. Use in special cases, when you know, that only that layer needs to be redrawn.
       * For complete redrawing use method redraw().
       */
    redrawLayer(layer: string): void;
    /**
       * Get absolute X coordinate
       *
       * @param {number} x relative coordinate
       */
    getX(x: number): number;
    /**
       * Get absolute Y coordinate
       *
       * @param {number} y relative coordinate
       */
    getY(y: number): number;
    /**
       * Add layer to the board. It is meant to be only for canvas layers.
       *
       * @param {CanvasBoard.CanvasLayer} layer to add
       * @param {number} weight layer with biggest weight is on the top
       */
    addLayer(layer: CanvasLayer, weight: number): void;
    /**
       * Remove layer from the board.
       *
       * @param {CanvasBoard.CanvasLayer} layer to remove
       */
    removeLayer(layer: CanvasLayer): void;
    update(fieldObjects: BoardFieldObject[][][]): void;
    getChanges(fieldObjects: BoardFieldObject[][][]): {
        add: BoardFieldObject[];
        remove: BoardFieldObject[];
    };
    addObject(obj: BoardFieldObject): void;
    removeObject(obj: BoardFieldObject): void;
    removeObjectsAt(x: number, y: number): void;
    removeAllObjects(): void;
    addCustomObject(handler: DrawHandler<BoardCustomObject>, args: any): void;
    removeCustomObject(handler: DrawHandler<BoardCustomObject>, args: any): boolean;
}
