import CanvasBoard from '..';
import { DrawHandler } from '../types';
export default function (drawHandler: DrawHandler): {
    stone: {
        draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard): void;
    };
};
