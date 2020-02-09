import { CanvasBoardConfig } from '../types';
import { BoardObject } from '../boardObjects';
import DrawHandler from './DrawHandler';
import Stone from './Stone';
export default class RealisticStone extends Stone {
    paths: string[];
    images: {
        [path: string]: HTMLImageElement;
    };
    fallback: DrawHandler;
    randSeed: number;
    redrawRequest: number;
    constructor(paths: string[], fallback: DrawHandler);
    loadImage(path: string): Promise<HTMLImageElement>;
    stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig, boardObject: BoardObject): Promise<void>;
}
