import CanvasBoard from '..';

export default {
  stone: {
    draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
      canvasCtx.strokeStyle = args.color || board.config.theme.markupNoneColor;
      canvasCtx.lineWidth = (args.lineWidth || board.config.theme.markupLinesWidth) * 2;
      canvasCtx.beginPath();
      canvasCtx.arc(
        -0.5 / 3,
        -0.5 / 3,
        0.5 / 6,
        0,
        2 * Math.PI,
        true,
      );
      canvasCtx.stroke();
      canvasCtx.beginPath();
      canvasCtx.arc(
        0.5 / 3,
        -0.5 / 3,
        0.5 / 6,
        0,
        2 * Math.PI,
        true,
      );
      canvasCtx.stroke();
      canvasCtx.beginPath();
      canvasCtx.moveTo(-0.5 / 1.5, 0);
      canvasCtx.bezierCurveTo(
        -0.5 / 1.5,
        0.5 / 2,
        0.5 / 1.5,
        0.5 / 2,
        0.5 / 1.5,
        0,
      );
      canvasCtx.stroke();
    },
  },
};
