import shadow from './stoneShadow';
import CanvasBoard from '..';
import { FieldDrawHandler, BoardFieldObject } from '../types';
export default function (graphic: any[], fallback: FieldDrawHandler): {
    drawField: {
        stone(canvasCtx: CanvasRenderingContext2D, args: BoardFieldObject, board: CanvasBoard): void;
        shadow: typeof shadow;
    };
};
