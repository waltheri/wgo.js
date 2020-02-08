import { CanvasBoardConfig } from '../types';
import DrawHandler from './DrawHandler';
export default class SimpleStone extends DrawHandler<{
    color: string;
}> {
    constructor(color: string);
    stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig): void;
}
