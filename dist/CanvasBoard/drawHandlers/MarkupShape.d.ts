import { CanvasBoardConfig } from '../types';
import DrawHandler from './DrawHandler';
import { Color } from '../../types';
interface MarkupShapeParams {
    stoneColor?: Color;
    color?: string;
    lineWidth?: number;
    fillColor?: string;
}
export default abstract class MarkupShape extends DrawHandler<MarkupShapeParams> {
    stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig): void;
    grid(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig): void;
    abstract drawShape(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig): void;
}
export {};
