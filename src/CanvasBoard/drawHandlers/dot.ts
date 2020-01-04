import { getMarkupColor, gridClearField } from '../helpers';
import CanvasBoard from '..';

export default {
  stone: {
    draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      canvasCtx.fillStyle = args.c || getMarkupColor(board, args.x, args.y);
      canvasCtx.beginPath();
      canvasCtx.rect(-0.5, -0.5, 1, 1);
      canvasCtx.fill();
    },
  },
  grid: gridClearField,
};
