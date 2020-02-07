import BoardObject from './BoardObject';
import { CanvasBoardConfig } from '../types';
interface GridParams {
    linesWidth: number;
    linesColor: string;
    starSize: number;
    starColor: string;
}
export default class Grid extends BoardObject<GridParams> {
    drawGrid(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig): void;
}
export {};
