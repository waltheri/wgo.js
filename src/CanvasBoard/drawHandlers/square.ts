import CanvasBoard from '..';
import { BoardFieldObject } from '../types';

export default {
  drawField: {
    stone(canvasCtx: CanvasRenderingContext2D, args: BoardFieldObject, board: CanvasBoard) {
      const params = args.params || {};

      canvasCtx.strokeStyle = params.color || board.config.theme.markupNoneColor;
      canvasCtx.lineWidth = params.lineWidth || board.config.theme.markupLinesWidth;
      canvasCtx.beginPath();
      canvasCtx.rect(-0.25, -0.25, 0.5, 0.5);
      canvasCtx.stroke();

      if (params.fillColor) {
        canvasCtx.fillStyle = params.fillColor;
        canvasCtx.fill();
      }
    },
  },
};
