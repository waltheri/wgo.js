import CanvasBoard from '..';
import { FieldDrawHandler } from '../types';
export default function (drawHandler: FieldDrawHandler): {
    drawField: {
        stone(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard): void;
    };
};
