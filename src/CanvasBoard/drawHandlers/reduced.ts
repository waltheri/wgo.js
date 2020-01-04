import CanvasBoard from '..';
import { DrawHandler } from '../types';

// size reducing modifier

export default function (drawHandler: DrawHandler) {
  return {
    stone: {
      draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
        canvasCtx.scale(0.5, 0.5);
        drawHandler.stone.draw.call(null, canvasCtx, args, board);
        canvasCtx.scale(2, 2);
      },
    },
  };
}
