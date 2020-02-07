import BoardObject from './BoardObject';
import { CanvasBoardConfig } from '../types';
interface CircleParams {
    color?: string;
    lineWidth?: number;
    fillColor?: string;
}
export default class Circle extends BoardObject<CircleParams> {
    drawStone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig): void;
    drawGrid(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig): void;
}
export {};
