import DrawHandler from './DrawHandler';
import { CanvasBoardConfig } from '../types';
import { BoardLineObject } from '../boardObjects';
interface LineParams {
    color?: string;
    lineWidth?: number;
}
export default class Line extends DrawHandler<LineParams> {
    stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig, boardObject: BoardLineObject): void;
}
export {};
