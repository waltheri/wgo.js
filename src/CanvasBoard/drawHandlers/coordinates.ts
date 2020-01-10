/**
 * Draws coordinates on the board
 */

import CanvasBoard from '..';
import { BoardFreeObject } from '../types';

export default {
  drawFree: {
    grid (canvasCtx: CanvasRenderingContext2D, args: BoardFreeObject, board: CanvasBoard) {
      let t;
      const params = args.params;

      canvasCtx.fillStyle = params.color;
      canvasCtx.textBaseline = 'middle';
      canvasCtx.textAlign = 'center';
      canvasCtx.font = `${board.fieldSize / 2}px ${board.config.theme.font || ''}`;

      const xright = board.getX(-0.75);
      const xleft = board.getX(board.config.size - 0.25);
      const ytop = board.getY(-0.75);
      const ybottom = board.getY(board.config.size - 0.25);

      const coordinatesX = params.x;
      const coordinatesY = params.y;

      for (let i = 0; i < board.config.size; i++) {
        t = board.getY(i);
        canvasCtx.fillText(coordinatesX[i] as string, xright, t);
        canvasCtx.fillText(coordinatesX[i] as string, xleft, t);

        t = board.getX(i);
        canvasCtx.fillText(coordinatesY[i] as string, t, ytop);
        canvasCtx.fillText(coordinatesY[i] as string, t, ybottom);
      }

      canvasCtx.fillStyle = 'black';
    },
  },
};
