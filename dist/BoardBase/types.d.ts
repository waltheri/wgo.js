import EventEmitter from '../utils/EventEmitter';
import BoardObject from './BoardObject';
import FieldObject from './FieldObject';
/**
 * Represent graphical board renderer.
 */
export interface Board<T> extends EventEmitter {
    resize(): void;
    setWidth(width: number): void;
    setHeight(height: number): void;
    setDimensions(width: number, height: number): void;
    getViewport(): BoardViewport;
    setViewport(viewport: BoardViewport): void;
    getSize(): number;
    setSize(size: number): void;
    getCoordinates(): boolean;
    setCoordinates(coordinates: boolean): void;
    redraw(): void;
    addObject(boardObject: BoardObject<T> | BoardObject<T>[]): void;
    addObjectAt(x: number, y: number, boardObject: FieldObject<T>): void;
    removeObject(boardObject: BoardObject<T> | BoardObject<T>[]): void;
    removeObjectsAt(x: number, y: number): void;
    removeAllObjects(): void;
    hasObject(boardObject: BoardObject<T>): boolean;
}
export interface BoardViewport {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
