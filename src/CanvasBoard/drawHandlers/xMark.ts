import { getMarkupColor, themeVariable, gridClearField } from '../helpers';
import CanvasBoard from '..';

export default {
  stone: {
    draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      const stoneRadius = board.stoneRadius;

      canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
      canvasCtx.lineCap = 'round';
      canvasCtx.lineWidth = (args.lineWidth || themeVariable('markupLinesWidth', board) || 1) * 2 - 1;
      canvasCtx.beginPath();
      canvasCtx.moveTo(Math.round(-stoneRadius / 2), Math.round(-stoneRadius / 2));
      canvasCtx.lineTo(Math.round(stoneRadius / 2), Math.round(stoneRadius / 2));
      canvasCtx.moveTo(Math.round(stoneRadius / 2) - 1, Math.round(-stoneRadius / 2));
      canvasCtx.lineTo(Math.round(-stoneRadius / 2) - 1, Math.round(stoneRadius / 2));
      canvasCtx.stroke();
      canvasCtx.lineCap = 'butt';
    },
  },
  grid: gridClearField,
};
