import EventEmitter from '../utils/EventEmitter';
import BoardObject from './BoardObject';
import { Point } from '../types';
/**
 * Represent graphical board renderer.
 */
export interface Board extends EventEmitter {
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
    addObject(boardObject: BoardObject | BoardObject[]): void;
    updateObject(boardObject: BoardObject | BoardObject[]): void;
    removeObject(boardObject: BoardObject | BoardObject[]): void;
    removeObjectsAt(x: number, y: number): void;
    removeAllObjects(): void;
    hasObject(boardObject: BoardObject): boolean;
}
export interface BoardViewport {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
export interface BoardBaseTheme {
    stoneSize: number;
    marginSize: number;
    font: string;
    backgroundColor: string;
    backgroundImage: string;
    grid: {
        linesWidth: number;
        linesColor: string;
        starColor: string;
        starSize: number;
    };
    markupBlackColor: string;
    markupWhiteColor: string;
    markupNoneColor: string;
    markupLineWidth: number;
    shadowColor: string;
    shadowTransparentColor: string;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    coordinates: {
        color: string;
        bold: boolean;
        labelsX: string | (string | number)[];
        labelsY: string | (string | number)[];
    };
    starPoints: {
        [size: number]: Point[];
    };
}
export interface BoardBaseConfig {
    size: number;
    width: number;
    height: number;
    viewport: BoardViewport;
    coordinates: boolean;
    theme: BoardBaseTheme;
}
