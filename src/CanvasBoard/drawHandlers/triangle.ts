import { gridClearField } from '../helpers';
import CanvasBoard from '..';

export default {
  stone: {
    draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      canvasCtx.strokeStyle = args.color || board.config.theme.markupNoneColor;
      canvasCtx.lineWidth = args.lineWidth || board.config.theme.markupLinesWidth;
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
