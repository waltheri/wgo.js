import DrawHandler from './DrawHandler';
import { CanvasBoardConfig } from '../types';
/**
 * Provides shadow for the stone.
 */
export default class Stone extends DrawHandler {
    shadow(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig): void;
}
