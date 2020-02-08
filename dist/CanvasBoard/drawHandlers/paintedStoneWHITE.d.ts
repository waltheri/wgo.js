import Stone from './Stone';
import { CanvasBoardConfig } from '../types';
export default class PaintedStoneWhite extends Stone {
    stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig): void;
}
