import CanvasBoard from '..';

export default {
  grid: {
    draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      // draw grid
      let tmp;

      canvasCtx.beginPath();
      canvasCtx.lineWidth = board.config.theme.gridLinesWidth * board.fieldWidth;
      canvasCtx.strokeStyle = board.config.theme.gridLinesColor;

      const tx = Math.round(board.left);
      const ty = Math.round(board.top);
      const bw = Math.round(board.fieldWidth * (board.size - 1));
      const bh = Math.round(board.fieldHeight * (board.size - 1));

      canvasCtx.strokeRect(tx, ty, bw, bh);

      for (let i = 1; i < board.size - 1; i++) {
        tmp = Math.round(board.getX(i));
        canvasCtx.moveTo(tmp, ty);
        canvasCtx.lineTo(tmp, ty + bh);

        tmp = Math.round(board.getY(i));
        canvasCtx.moveTo(tx, tmp);
        canvasCtx.lineTo(tx + bw, tmp);
      }

      canvasCtx.stroke();

      // draw stars
      canvasCtx.fillStyle = board.config.theme.starColor;

      if (board.config.starPoints[board.size]) {
        for (const key in board.config.starPoints[board.size]) {
          canvasCtx.beginPath();
          canvasCtx.arc(
            board.getX(board.config.starPoints[board.size][key].x),
            board.getY(board.config.starPoints[board.size][key].y),
            board.config.theme.starSize * board.fieldWidth, 0, 2 * Math.PI, true,
          );
          canvasCtx.fill();
        }
      }
    },
  },
};
