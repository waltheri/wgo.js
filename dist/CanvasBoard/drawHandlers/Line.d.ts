import DrawHandler from './DrawHandler';
import { CanvasBoardConfig } from '../types';
import { BoardLineObject } from '../../boardBase';
interface LineParams {
    color?: string;
    lineWidth?: number;
}
export default class Line extends DrawHandler<LineParams> {
    stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig, boardObject: BoardLineObject<DrawHandler<LineParams>>): void;
}
export {};
