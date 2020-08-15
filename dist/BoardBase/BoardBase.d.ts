import EventEmitter from '../utils/EventEmitter';
import { PartialRecursive } from '../utils/makeConfig';
import { Board, BoardBaseConfig, BoardViewport } from './types';
import { BoardObject } from '.';
/**
 * Board class with basic functionality which can be used for creating custom boards.
 */
export default class BoardBase extends EventEmitter implements Board {
    config: BoardBaseConfig;
    element: HTMLElement;
    objects: BoardObject[];
    constructor(element: HTMLElement, config?: PartialRecursive<BoardBaseConfig>);
    /**
     * Updates dimensions and redraws everything
     */
    resize(): void;
    /**
     * Redraw everything.
     */
    redraw(): void;
    /**
     * Add board object. Main function for adding graphics on the board.
     *
     * @param boardObject
     */
    addObject(boardObject: BoardObject | BoardObject[]): void;
    /**
     * Method to update board object. Can be called, when some params of boardObject changes.
     * It is similar to redraw(), but only boardObject can be redrawn, so performance can/should be better.
     *
     * @param boardObject
     */
    updateObject(boardObject: BoardObject | BoardObject[]): void;
    /**
     * Remove board object. Main function for removing graphics on the board.
     *
     * @param boardObject
     */
    removeObject(boardObject: BoardObject | BoardObject[]): void;
    /**
     * Removes all objects on specified field.
     *
     * @param x
     * @param y
     */
    removeObjectsAt(x: number, y: number): void;
    /**
     * Removes all objects on the board.
     */
    removeAllObjects(): void;
    /**
     * Returns true if object is already on the board.
     *
     * @param boardObject
     */
    hasObject(boardObject: BoardObject): boolean;
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
       * Get currently visible section of the board.
       */
    getViewport(): BoardViewport;
    /**
       * Set section of the board to be displayed.
       */
    setViewport(viewport: BoardViewport): void;
    /**
     * Helper to get board size.
     */
    getSize(): number;
    /**
     * Helper to set board size.
     */
    setSize(size?: number): void;
    /**
     * Returns true, if coordinates around board are visible.
     */
    getCoordinates(): boolean;
    /**
     * Enable or disable coordinates around board.
     */
    setCoordinates(coordinates: boolean): void;
}
