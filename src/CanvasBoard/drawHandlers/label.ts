import { getMarkupColor, themeVariable, gridClearField } from '../helpers';
import CanvasBoard from '..';

export default {
  stone: {
    draw (canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      const stoneRadius = board.stoneRadius;
      const font = args.font || themeVariable('font', board) || '';

      canvasCtx.fillStyle = args.c || getMarkupColor(board, args.x, args.y);

      if (args.text.length === 1) {
        canvasCtx.font = `${Math.round(stoneRadius * 1.5)}px ${font}`;
      } else if (args.text.length === 2) {
        canvasCtx.font = `${Math.round(stoneRadius * 1.2)}px ${font}`;
      } else {
        canvasCtx.font = `${Math.round(stoneRadius)}px ${font}`;
      }

      canvasCtx.beginPath();
      canvasCtx.textBaseline = 'middle';
      canvasCtx.textAlign = 'center';
      canvasCtx.fillText(args.text, 0, 0, 2 * stoneRadius);

    },
  },
  grid: gridClearField,
};
