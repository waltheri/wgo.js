import CanvasBoard from './CanvasBoard';
import { DrawFunction, BoardFieldObject, BoardFreeObject } from './types';
import { Point } from '../types';
/**
 * @class
 * Implements one layer of the HTML5 canvas
 */
export default class CanvasLayer {
    element: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    pixelRatio: number;
    board: CanvasBoard;
    constructor(board: CanvasBoard);
    init(): void;
    resize(width: number, height: number): void;
    draw<P extends BoardFreeObject>(drawingFn: DrawFunction<P>, args: P): void;
    drawField<P extends BoardFieldObject>(drawingFn: DrawFunction<P>, args: P): void;
    clear(): void;
    clearField(field: Point): void;
}
