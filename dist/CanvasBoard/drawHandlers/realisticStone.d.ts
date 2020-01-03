import CanvasBoard from '..';
import { DrawHandler } from '../types';
export default function (graphics: {
    whiteStoneGraphic: any[];
    blackStoneGraphic: any[];
}, fallback: DrawHandler): {
    stone: {
        draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard): void;
    };
    shadow: {
        draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard): void;
    };
};
