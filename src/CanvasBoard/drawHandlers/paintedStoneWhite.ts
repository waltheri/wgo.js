import shadow from './stoneShadow';
import CanvasBoard from '..';

export default {
  stone: {
    draw (canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      const stoneRadius = board.config.theme.stoneSize;
      const radGrad = canvasCtx.createRadialGradient(
        -2 * stoneRadius / 5,
        -2 * stoneRadius / 5,
        2 * stoneRadius / 5,
        -stoneRadius / 5,
        -stoneRadius / 5,
        4 * stoneRadius / 5,
      );
      radGrad.addColorStop(0, '#fff');
      radGrad.addColorStop(1, '#ddd');

      canvasCtx.beginPath();
      canvasCtx.fillStyle = radGrad;
      canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
      canvasCtx.fill();

      canvasCtx.beginPath();
      canvasCtx.lineWidth = stoneRadius / 6;

      canvasCtx.strokeStyle = '#999';
      canvasCtx.arc(stoneRadius / 8, stoneRadius / 8, stoneRadius / 2, 0, Math.PI / 2, false);

      canvasCtx.stroke();
    },
  },
  shadow,
};
