import CanvasBoard from './CanvasBoard';
import { BoardObject } from '../BoardBase';
import { DrawFunction } from './types';
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
    draw(drawFunction: DrawFunction, boardObject: BoardObject): void;
    clear(): void;
}
