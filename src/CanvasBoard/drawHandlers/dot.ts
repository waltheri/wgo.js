import CanvasBoard from '..';

export default {
  stone: {
    draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      canvasCtx.fillStyle = args.color || board.config.theme.markupNoneColor;
      canvasCtx.beginPath();
      canvasCtx.rect(-0.5, -0.5, 1, 1);
      canvasCtx.fill();
    },
  },
};
