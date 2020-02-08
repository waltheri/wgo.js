import { CanvasBoardConfig } from '../types';
import Stone from './Stone';
export default class GlassStoneBlack extends Stone {
    stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig): void;
}
