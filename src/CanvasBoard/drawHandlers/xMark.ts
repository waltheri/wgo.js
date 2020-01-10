import CanvasBoard from '..';
import { BoardFieldObject } from '../types';

export default {
  drawField: {
    stone(canvasCtx: CanvasRenderingContext2D, args: BoardFieldObject, board: CanvasBoard) {
      const params = args.params || {};

      canvasCtx.strokeStyle = params.color || board.config.theme.markupNoneColor;
      canvasCtx.lineWidth = params.lineWidth || board.config.theme.markupLinesWidth * 1.5;
      canvasCtx.lineCap = 'round';
      canvasCtx.beginPath();
      canvasCtx.moveTo(-0.20, -0.20);
      canvasCtx.lineTo(0.20, 0.20);
      canvasCtx.moveTo(0.20, -0.20);
      canvasCtx.lineTo(-0.20, 0.20);
      canvasCtx.stroke();
      canvasCtx.lineCap = 'butt';
    },
  },
};
