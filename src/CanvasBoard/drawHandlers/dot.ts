import { getMarkupColor, gridClearField } from '../helpers';
import CanvasBoard from '..';

export default {
  stone: {
    draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      const stoneRadius = board.stoneRadius;

      canvasCtx.fillStyle = args.c || getMarkupColor(board, args.x, args.y);
      canvasCtx.beginPath();
      canvasCtx.rect(-stoneRadius / 2, -stoneRadius / 2, stoneRadius, stoneRadius);
      canvasCtx.fill();
    },
  },
  grid: gridClearField,
};
