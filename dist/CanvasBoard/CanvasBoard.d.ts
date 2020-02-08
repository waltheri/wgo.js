import CanvasLayer from './CanvasLayer';
import { CanvasBoardConfig, BoardViewport } from './types';
import { PartialRecursive } from '../utils/makeConfig';
import EventEmitter from '../utils/EventEmitter';
import { Point } from '../types';
import { BoardObject } from './boardObjects';
export default class CanvasBoard extends EventEmitter {
    config: CanvasBoardConfig;
    element: HTMLElement;
    boardElement: HTMLElement;
    pixelRatio: number;
    objects: BoardObject[];
    layers: {
        grid: CanvasLayer;
        shadow: CanvasLayer;
        stone: CanvasLayer;
        [key: string]: CanvasLayer;
    };
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
    constructor(elem: HTMLElement, config?: PartialRecursive<CanvasBoardConfig>);
    /**
     * Initialization method, it is called in constructor. You shouldn't call it, but you can alter it.
     */
    private init;
    /**
     * Updates dimensions and redraws everything
     */
    resize(): void;
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
     * Sets width of the board, height will be automatically computed. Then everything will be redrawn.
     *
     * @param width
     */
    setWidth(width: number): void;
    /**
     * Sets height of the board, width will be automatically computed. Then everything will be redrawn.
     *
     * @param height
     */
    setHeight(height: number): void;
    /**
     * Sets exact dimensions of the board. Then everything will be redrawn.
     *
     * @param width
     * @param height
     */
    setDimensions(width: number, height: number): void;
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
    getCoordinates(): boolean;
    setCoordinates(coordinates: boolean): void;
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
     * Add board object. Main function for adding graphics on the board.
     *
     * @param boardObject
     */
    addObject(boardObject: BoardObject | BoardObject[]): void;
    /**
     * Shortcut method to add object and set its position.
     */
    addObjectAt(x: number, y: number, boardObject: BoardObject): void;
    /**
     * Remove board object. Main function for removing graphics on the board.
     *
     * @param boardObject
     */
    removeObject(boardObject: BoardObject | BoardObject[]): void;
    removeObjectsAt(x: number, y: number): void;
    removeAllObjects(): void;
    on(type: string, callback: (event: UIEvent, point: Point) => void): void;
    registerBoardListener(type: string): void;
    getRelativeCoordinates(absoluteX: number, absoluteY: number): {
        x: number;
        y: number;
    };
}
