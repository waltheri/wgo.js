import { getMarkupColor, themeVariable, gridClearField } from '../helpers';
import CanvasBoard from '..';

export default {
  stone: {
    draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      const stoneRadius = board.stoneRadius;

      canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
      canvasCtx.lineWidth = (args.lineWidth || themeVariable('markupLinesWidth', board) || 1) * 2;
      canvasCtx.beginPath();
      canvasCtx.arc(
        -stoneRadius / 3,
        -stoneRadius / 3,
        stoneRadius / 6,
        0,
        2 * Math.PI,
        true,
      );
      canvasCtx.stroke();
      canvasCtx.beginPath();
      canvasCtx.arc(
        stoneRadius / 3,
        -stoneRadius / 3,
        stoneRadius / 6,
        0,
        2 * Math.PI,
        true,
      );
      canvasCtx.stroke();
      canvasCtx.beginPath();
      canvasCtx.moveTo(-stoneRadius / 1.5, 0);
      canvasCtx.bezierCurveTo(
        -stoneRadius / 1.5,
        stoneRadius / 2,
        stoneRadius / 1.5,
        stoneRadius / 2,
        stoneRadius / 1.5,
        0,
      );
      canvasCtx.stroke();
    },
  },
  grid: gridClearField,
};
