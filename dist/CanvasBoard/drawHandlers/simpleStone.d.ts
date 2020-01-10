import CanvasBoard from '..';
import { BoardFieldObject } from '../types';
export default function (color: string): {
    drawField: {
        stone(canvasCtx: CanvasRenderingContext2D, args: BoardFieldObject, board: CanvasBoard): void;
    };
};
