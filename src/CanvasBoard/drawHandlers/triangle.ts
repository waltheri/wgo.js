import { getMarkupColor, themeVariable, gridClearField } from '../helpers';
import CanvasBoard from '..';

export default {
  stone: {
    draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
      canvasCtx.lineWidth = args.lineWidth || themeVariable('markupLinesWidth', board);
      canvasCtx.beginPath();
      canvasCtx.moveTo(0, 0 - 0.25);
      canvasCtx.lineTo(-0.25, 0.166666);
      canvasCtx.lineTo(0.25, 0.166666);
      canvasCtx.closePath();
      canvasCtx.stroke();
    },
  },
  grid: gridClearField,
};
