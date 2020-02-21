import EventEmitter from '../utils/EventEmitter';
import { PartialRecursive } from '../utils/makeConfig';
import { Board, BoardBaseConfig, BoardViewport } from './types';
import { BoardObject } from '.';
import FieldObject from './FieldObject';
export default class BoardBase<T> extends EventEmitter implements Board<T> {
    config: BoardBaseConfig;
    element: HTMLElement;
    objects: BoardObject<T>[];
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
    addObject(boardObject: BoardObject<T> | BoardObject<T>[]): void;
    /**
     * Shortcut method to add object and set its position.
     */
    addObjectAt(x: number, y: number, boardObject: FieldObject<T>): void;
    /**
     * Remove board object. Main function for removing graphics on the board.
     *
     * @param boardObject
     */
    removeObject(boardObject: BoardObject<T> | BoardObject<T>[]): void;
    removeObjectsAt(x: number, y: number): void;
    removeAllObjects(): void;
    hasObject(boardObject: BoardObject<T>): boolean;
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
}
