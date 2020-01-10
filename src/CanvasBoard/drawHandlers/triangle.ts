import CanvasBoard from '..';
import { BoardFieldObject } from '../types';

export default {
  drawField: {
    stone(canvasCtx: CanvasRenderingContext2D, args: BoardFieldObject, board: CanvasBoard) {
      const params = args.params || {};

      canvasCtx.strokeStyle = params.color || board.config.theme.markupNoneColor;
      canvasCtx.lineWidth = params.lineWidth || board.config.theme.markupLinesWidth;
      canvasCtx.beginPath();
      canvasCtx.moveTo(0, 0 - 0.25);
      canvasCtx.lineTo(-0.25, 0.166666);
      canvasCtx.lineTo(0.25, 0.166666);
      canvasCtx.closePath();
      canvasCtx.stroke();

      if (params.fillColor) {
        canvasCtx.fillStyle = params.fillColor;
        canvasCtx.fill();
      }
    },
  },
};
