import { getMarkupColor, themeVariable, gridClearField } from '../helpers';
import CanvasBoard from '..';

export default {
  stone: {
    draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
      canvasCtx.lineCap = 'round';
      canvasCtx.lineWidth = (args.lineWidth || themeVariable('markupLinesWidth', board)) * 1.5;
      canvasCtx.beginPath();
      canvasCtx.moveTo(-0.20, -0.20);
      canvasCtx.lineTo(0.20, 0.20);
      canvasCtx.moveTo(0.20, -0.20);
      canvasCtx.lineTo(-0.20, 0.20);
      canvasCtx.stroke();
      canvasCtx.lineCap = 'butt';
    },
  },
  grid: gridClearField,
};
