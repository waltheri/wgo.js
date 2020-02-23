/**
 * Contains implementation of go board.
 * @module CanvasBoard
 */
import CanvasLayer from './CanvasLayer';
import { CanvasBoardConfig } from './types';
import { PartialRecursive } from '../utils/makeConfig';
import { Point } from '../types';
import { BoardObject, BoardBase, BoardViewport } from '../BoardBase';
import DrawHandler from './drawHandlers/DrawHandler';
export default class CanvasBoard extends BoardBase<DrawHandler> {
    config: CanvasBoardConfig;
    element: HTMLElement;
    wrapperElement: HTMLElement;
    boardElement: HTMLElement;
    pixelRatio: number;
    objects: BoardObject<DrawHandler>[];
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
       */
    constructor(elem: HTMLElement, config?: PartialRecursive<CanvasBoardConfig>);
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
     * Redraw everything.
     */
    redraw(): void;
    addObject(boardObject: BoardObject<DrawHandler> | BoardObject<DrawHandler>[]): void;
    removeObject(boardObject: BoardObject<DrawHandler> | BoardObject<DrawHandler>[]): void;
    removeAllObjects(): void;
    on(type: string, callback: (event: UIEvent, point: Point) => void): void;
    registerBoardListener(type: string): void;
    getRelativeCoordinates(absoluteX: number, absoluteY: number): {
        x: number;
        y: number;
    };
    setSize(size: number): void;
    setViewport(viewport: BoardViewport): void;
    setCoordinates(coordinates: boolean): void;
}
