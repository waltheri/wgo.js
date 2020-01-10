import CanvasBoard from '..';
import { BoardFieldObject } from '../types';

export default {
  drawField: {
    stone(canvasCtx: CanvasRenderingContext2D, args: BoardFieldObject, board: CanvasBoard) {
      const params = args.params || {};

      canvasCtx.fillStyle = params.color || board.config.theme.markupNoneColor;
      canvasCtx.beginPath();
      canvasCtx.rect(-0.5, -0.5, 1, 1);
      canvasCtx.fill();
    },
  },
};
