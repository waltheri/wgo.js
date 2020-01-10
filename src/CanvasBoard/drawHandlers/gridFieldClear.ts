import CanvasBoard from '..';
import { BoardFieldObject } from '../types';

export default {
  drawField: {
    grid (canvasCtx: CanvasRenderingContext2D, args: BoardFieldObject, board: CanvasBoard) {
      const stoneRadius = board.config.theme.stoneSize;
      canvasCtx.clearRect(-stoneRadius, -stoneRadius, 2 * stoneRadius, 2 * stoneRadius);
    },
  },
};
