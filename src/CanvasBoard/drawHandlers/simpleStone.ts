// Black and white stone
import { themeVariable } from '../helpers';
import CanvasBoard from '..';
import { Color } from '../../types';

export default {
  stone: {
    draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      const lw = themeVariable('markupLinesWidth', board);

      if (args.c === Color.WHITE) {
        canvasCtx.fillStyle = 'white';
      } else {
        canvasCtx.fillStyle = 'black';
      }

      canvasCtx.beginPath();
      canvasCtx.arc(0, 0, Math.max(0, 1 - lw), 0, 2 * Math.PI, true);
      canvasCtx.fill();

      canvasCtx.lineWidth = lw;
      canvasCtx.strokeStyle = 'black';
      canvasCtx.stroke();
    },
  },
};
