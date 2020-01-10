import shadow from './stoneShadow';
import CanvasBoard from '..';
import { BoardFieldObject } from '../types';
declare const _default: {
    drawField: {
        stone(canvasCtx: CanvasRenderingContext2D, args: BoardFieldObject, board: CanvasBoard): void;
        shadow: typeof shadow;
    };
};
export default _default;
