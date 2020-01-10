import shadow from './stoneShadow';
import CanvasBoard from '..';
import { BoardFieldObject } from '../types';

export default {
  // draw handler for stone layer
  drawField: {
    // drawing function - args object contain info about drawing object, board is main board object
    stone (canvasCtx: CanvasRenderingContext2D, args: BoardFieldObject, board: CanvasBoard) {
      const stoneRadius = board.config.theme.stoneSize;
      const radgrad = canvasCtx.createRadialGradient(
        -2 * stoneRadius / 5,
        -2 * stoneRadius / 5,
        stoneRadius / 3,
        -stoneRadius / 5,
        -stoneRadius / 5,
        5 * stoneRadius / 5,
      );

      radgrad.addColorStop(0, '#fff');
      radgrad.addColorStop(1, '#aaa');

      canvasCtx.beginPath();
      canvasCtx.fillStyle = radgrad;
      canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
      canvasCtx.fill();
    },
    shadow,
  },
};
