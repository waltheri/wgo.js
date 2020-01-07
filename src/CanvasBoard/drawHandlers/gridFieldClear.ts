import CanvasBoard from '..';

export default {
  grid: {
    draw (canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      const stoneRadius = board.config.theme.stoneSize;
      canvasCtx.clearRect(-stoneRadius, -stoneRadius, 2 * stoneRadius, 2 * stoneRadius);
    },
    clear (canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      args._nodraw = true;
      canvasCtx.restore(); // small hack for now
      board.redrawLayer('grid');
      canvasCtx.save();
      delete args._nodraw;
    },
  },
};
