import CanvasBoard from '..';
import { FieldDrawHandler, BoardFieldObject } from '../types';
export default function (drawHandler: FieldDrawHandler): {
    drawField: {
        stone(canvasCtx: CanvasRenderingContext2D, args: BoardFieldObject, board: CanvasBoard): void;
    };
};
