import { CanvasBoardConfig } from '../types';
import Stone from './Stone';
export default class ShellStoneBlack extends Stone {
    stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig): void;
}
