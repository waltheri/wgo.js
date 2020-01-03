/**
 * Draws coordinates on the board
 */

import { themeVariable } from '../helpers';
import CanvasBoard from '..';

export default {
  grid: {
    draw (canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      let t;

      canvasCtx.fillStyle = themeVariable('coordinatesColor', board);
      canvasCtx.textBaseline = 'middle';
      canvasCtx.textAlign = 'center';
      canvasCtx.font = `${board.stoneRadius}px ${board.config.theme.font || ''}`;

      const xright = board.getX(-0.75);
      const xleft = board.getX(board.size - 0.25);
      const ytop = board.getY(-0.75);
      const ybottom = board.getY(board.size - 0.25);

      const coordinatesX = themeVariable('coordinatesX', board);
      const coordinatesY = themeVariable('coordinatesY', board);

      for (let i = 0; i < board.size; i++) {
        t = board.getY(i);
        canvasCtx.fillText(coordinatesX[i], xright, t);
        canvasCtx.fillText(coordinatesX[i], xleft, t);

        t = board.getX(i);
        canvasCtx.fillText(coordinatesY[i], t, ytop);
        canvasCtx.fillText(coordinatesY[i], t, ybottom);
      }

      canvasCtx.fillStyle = 'black';
    },
  },
};
