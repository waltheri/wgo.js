import CanvasBoard from '..';
import { DrawHandler } from '../types';

// size reducing modifier

export default function (drawHandler: DrawHandler) {
  return {
    stone: {
      draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
        const stoneRadius = board.stoneRadius;

        // temporary reduce stone radius
        board.stoneRadius = board.stoneRadius / 2;
        drawHandler.stone.draw.call(null, canvasCtx, args, board);

        // revert it
        board.stoneRadius = stoneRadius;
      },
    },
  };
}
