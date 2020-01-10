import CanvasBoard from '..';
import { FieldDrawHandler, BoardFieldObject } from '../types';

// transparent modificator

export default function (drawHandler: FieldDrawHandler) {
  return {
    drawField: {
      stone(canvasCtx: CanvasRenderingContext2D, args: BoardFieldObject, board: CanvasBoard) {
        const params = args.params || {};

        if (params.alpha) {
          canvasCtx.globalAlpha = params.alpha;
        } else {
          canvasCtx.globalAlpha = 0.3;
        }
        drawHandler.drawField.stone.call(null, canvasCtx, args, board);
        canvasCtx.globalAlpha = 1;
      },
    },
  };
}
