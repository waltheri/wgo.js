import shadow from './stoneShadow';
import CanvasBoard from '..';
import { Color } from '../../types';

export default {
  stone: {
    draw (canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      const stoneRadius = board.stoneRadius;
      let radgrad;

      if (args.c === Color.WHITE) {
        radgrad = canvasCtx.createRadialGradient(
          -2 * stoneRadius / 5,
          -2 * stoneRadius / 5,
          2,
          -stoneRadius / 5,
          -stoneRadius / 5,
          4 * stoneRadius / 5,
        );
        radgrad.addColorStop(0, '#fff');
        radgrad.addColorStop(1, '#ddd');
      } else {
        radgrad = canvasCtx.createRadialGradient(
          -2 * stoneRadius / 5,
          -2 * stoneRadius / 5,
          1,
          -stoneRadius / 5, -stoneRadius / 5,
          4 * stoneRadius / 5,
        );
        radgrad.addColorStop(0, '#111');
        radgrad.addColorStop(1, '#000');
      }

      canvasCtx.beginPath();
      canvasCtx.fillStyle = radgrad;
      canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
      canvasCtx.fill();

      canvasCtx.beginPath();
      canvasCtx.lineWidth = stoneRadius / 6;

      if (args.c === Color.WHITE) {
        canvasCtx.strokeStyle = '#999';
        canvasCtx.arc(stoneRadius / 8, stoneRadius / 8, stoneRadius / 2, 0, Math.PI / 2, false);
      } else {
        canvasCtx.strokeStyle = '#ccc';
        canvasCtx.arc(-stoneRadius / 8, -stoneRadius / 8, stoneRadius / 2, Math.PI, 1.5 * Math.PI);
      }

      canvasCtx.stroke();
    },
  },
  shadow,
};
