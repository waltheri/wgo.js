import { CanvasBoardConfig } from '../types';
import { BoardObject } from '../boardObjects';
import DrawHandler from './DrawHandler';
import Stone from './Stone';
export default class RealisticStone extends Stone {
    images: HTMLImageElement[];
    fallback: DrawHandler;
    randSeed: number;
    redrawRequest: number;
    constructor(paths: string[], fallback: DrawHandler);
    loadImages(paths: string[]): void;
    stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig, boardObject: BoardObject): void;
}
