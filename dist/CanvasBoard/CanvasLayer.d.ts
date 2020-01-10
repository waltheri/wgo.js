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
    constructor();
    setDimensions(width: number, height: number, board: CanvasBoard): void;
    appendTo(element: HTMLElement, weight: number): void;
    removeFrom(element: HTMLElement): void;
    getContext(): CanvasRenderingContext2D;
    draw<P extends BoardFreeObject>(drawingFn: DrawFunction<P>, args: P, board: CanvasBoard): void;
    drawField<P extends BoardFieldObject>(drawingFn: DrawFunction<P>, args: P, board: CanvasBoard): void;
    clear(_board: CanvasBoard): void;
    clearField(field: Point, board: CanvasBoard): void;
}
