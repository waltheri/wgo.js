import shadow from './stoneShadow';
import CanvasBoard from '..';
import { BoardFieldObject } from '../types';

export default {
  drawField: {
    stone(canvasCtx: CanvasRenderingContext2D, args: BoardFieldObject, board: CanvasBoard) {
      const stoneRadius = board.config.theme.stoneSize;

      canvasCtx.beginPath();
      canvasCtx.fillStyle = '#000';
      canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
      canvasCtx.fill();

      let radGrad = canvasCtx.createRadialGradient(
        0.4 * stoneRadius,
        0.4 * stoneRadius,
        0,
        0.5 * stoneRadius,
        0.5 * stoneRadius,
        stoneRadius,
      );
      radGrad.addColorStop(0, 'rgba(32,32,32,1)');
      radGrad.addColorStop(1, 'rgba(0,0,0,0)');

      canvasCtx.beginPath();
      canvasCtx.fillStyle = radGrad;
      canvasCtx.arc(
        0,
        0,
        stoneRadius,
        0,
        2 * Math.PI,
        true,
      );
      canvasCtx.fill();

      radGrad = canvasCtx.createRadialGradient(
        -0.4 * stoneRadius,
        -0.4 * stoneRadius,
        0.05 * stoneRadius,
        -0.5 * stoneRadius,
        -0.5 * stoneRadius,
        1.5 * stoneRadius,
      );
      radGrad.addColorStop(0, 'rgba(64,64,64,1)');
      radGrad.addColorStop(1, 'rgba(0,0,0,0)');

      canvasCtx.beginPath();
      canvasCtx.fillStyle = radGrad;
      canvasCtx.arc(
        0,
        0,
        stoneRadius,
        0,
        2 * Math.PI,
        true,
      );
      canvasCtx.fill();
    },
    shadow,
  },
};
