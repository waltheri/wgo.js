import CanvasBoard from '..';
import { FieldDrawHandler, BoardFieldObject } from '../types';

// size reducing modifier

export default function (drawHandler: FieldDrawHandler) {
  return {
    drawField: {
      stone(canvasCtx: CanvasRenderingContext2D, args: BoardFieldObject, board: CanvasBoard) {
        canvasCtx.scale(0.5, 0.5);
        drawHandler.drawField.stone.call(null, canvasCtx, args, board);
        canvasCtx.scale(2, 2);
      },
    },
  };
}
