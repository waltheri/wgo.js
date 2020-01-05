import {  gridClearField } from '../helpers';
import CanvasBoard from '..';

export default {
  stone: {
    draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      canvasCtx.strokeStyle = args.color || board.config.theme.markupNoneColor;
      canvasCtx.lineWidth = args.lineWidth || board.config.theme.markupLinesWidth * 1.5;
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
  grid: gridClearField,
};
