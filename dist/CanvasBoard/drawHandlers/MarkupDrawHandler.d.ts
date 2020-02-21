import { CanvasBoardConfig } from '../types';
import DrawHandler from './DrawHandler';
import { BoardMarkupObject } from '../../boardBase';
interface MarkupDrawHandlerParams {
    color?: string;
    lineWidth?: number;
    fillColor?: string;
}
export default abstract class MarkupDrawHandler<P = {}> extends DrawHandler<MarkupDrawHandlerParams & P> {
    grid(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig, boardObject: BoardMarkupObject<DrawHandler<MarkupDrawHandlerParams & P>>): void;
    getColor(boardConfig: CanvasBoardConfig, boardObject: BoardMarkupObject<DrawHandler<MarkupDrawHandlerParams & P>>): string;
}
export {};
