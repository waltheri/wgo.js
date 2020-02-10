import DrawHandler from './DrawHandler';
import { CanvasBoardConfig } from '../types';
import { BoardLineObject } from '../boardObjects';
interface ArrowParams {
    color?: string;
    lineWidth?: number;
}
export default class Arrow extends DrawHandler<ArrowParams> {
    stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig, boardObject: BoardLineObject): void;
}
export {};
