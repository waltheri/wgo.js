import { CanvasBoardConfig } from '../types';
import MarkupShape from './MarkupShape';
export default class Circle extends MarkupShape {
    drawShape(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig): void;
}
