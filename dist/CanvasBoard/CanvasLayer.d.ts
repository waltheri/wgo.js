import CanvasBoard from './CanvasBoard';
import { DrawFunction } from './types';
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
    initialDraw(_board: CanvasBoard): void;
    draw<P>(drawingFn: DrawFunction<P>, args: P, board: CanvasBoard): void;
    drawField<P>(drawingFn: DrawFunction<P>, args: any, board: CanvasBoard): void;
    clear(_board: CanvasBoard): void;
}
