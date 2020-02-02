import CanvasBoard from '..';
import { BoardFreeObject } from '../types';

export default {
  drawFree: {
    grid(canvasCtx: CanvasRenderingContext2D, args: BoardFreeObject, board: CanvasBoard) {
      // draw grid
      let tmp;
      const params = args.params;

      canvasCtx.beginPath();
      canvasCtx.lineWidth = params.linesWidth * board.fieldSize;
      canvasCtx.strokeStyle = params.linesColor;

      const tx = Math.round(board.getX(0));
      const ty = Math.round(board.getY(0));
      const bw = Math.round((board.config.size - 1) * board.fieldSize);
      const bh = Math.round((board.config.size - 1) * board.fieldSize);

      canvasCtx.strokeRect(tx, ty, bw, bh);

      for (let i = 1; i < board.config.size - 1; i++) {
        tmp = Math.round(board.getX(i));
        canvasCtx.moveTo(tmp, ty);
        canvasCtx.lineTo(tmp, ty + bh);

        tmp = Math.round(board.getY(i));
        canvasCtx.moveTo(tx, tmp);
        canvasCtx.lineTo(tx + bw, tmp);
      }

      canvasCtx.stroke();

      // draw stars
      canvasCtx.fillStyle = params.starColor;

      if (board.config.starPoints[board.config.size]) {
        for (const key in board.config.starPoints[board.config.size]) {
          canvasCtx.beginPath();
          canvasCtx.arc(
            board.getX(board.config.starPoints[board.config.size][key].x),
            board.getY(board.config.starPoints[board.config.size][key].y),
            params.starSize * board.fieldSize, 0, 2 * Math.PI, true,
          );
          canvasCtx.fill();
        }
      }
    },
  },
};
