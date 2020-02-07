import BoardObject from './BoardObject';
import { CanvasBoardConfig } from '../types';
interface CoordinatesParams {
    color: string;
    bold: boolean;
    x: string | (string | number)[];
    y: string | (string | number)[];
}
export default class Coordinates extends BoardObject<CoordinatesParams> {
    drawGrid(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig): void;
}
export {};
