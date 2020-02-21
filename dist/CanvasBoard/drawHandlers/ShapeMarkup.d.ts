import { CanvasBoardConfig } from '../types';
import { BoardMarkupObject } from '../../BoardBase';
import MarkupDrawHandler from './MarkupDrawHandler';
export default abstract class ShapeMarkup extends MarkupDrawHandler {
    stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig, boardObject: BoardMarkupObject<MarkupDrawHandler>): void;
    abstract drawShape(canvasCtx: CanvasRenderingContext2D): void;
}
