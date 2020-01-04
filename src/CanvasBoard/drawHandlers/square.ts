import { getMarkupColor, themeVariable, gridClearField } from '../helpers';
import CanvasBoard from '..';

export default {
  stone: {
    draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
      canvasCtx.lineWidth = args.lineWidth || themeVariable('markupLinesWidth', board);
      canvasCtx.beginPath();
      canvasCtx.rect(-0.25, -0.25, 0.5, 0.5);
      canvasCtx.stroke();
    },
  },
  grid: gridClearField,
};
