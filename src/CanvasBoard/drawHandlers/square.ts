import { gridClearField } from '../helpers';
import CanvasBoard from '..';

export default {
  stone: {
    draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      canvasCtx.strokeStyle = args.color || board.config.theme.markupNoneColor;
      canvasCtx.lineWidth = args.lineWidth || board.config.theme.markupLinesWidth;
      canvasCtx.beginPath();
      canvasCtx.rect(-0.25, -0.25, 0.5, 0.5);
      canvasCtx.stroke();
    },
  },
  grid: gridClearField,
};
