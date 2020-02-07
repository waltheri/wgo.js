import CanvasBoard from './CanvasBoard';
import BoardObject from './boardObjects/BoardObject';
/**
 * @class
 * Implements one layer of the HTML5 canvas
 */
export default class CanvasLayer {
    element: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    pixelRatio: number;
    board: CanvasBoard;
    drawFunctionName: string;
    constructor(board: CanvasBoard, drawFunctionName: string);
    init(): void;
    resize(width: number, height: number): void;
    draw(boardObject: BoardObject): void;
    clear(): void;
}
