import CanvasBoard from '..';
import { DrawHandler } from '../types';

// transparent modificator

export default function (drawHandler: DrawHandler) {
  return {
    stone: {
      draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
        if (args.alpha) {
          canvasCtx.globalAlpha = args.alpha;
        } else {
          canvasCtx.globalAlpha = 0.3;
        }
        drawHandler.stone.draw.call(null, canvasCtx, args, board);
        canvasCtx.globalAlpha = 1;
      },
    },
  };
}
