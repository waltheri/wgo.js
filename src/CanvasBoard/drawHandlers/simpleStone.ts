// Black and white stone
import CanvasBoard from '..';

export default function (color: string) {
  return {
    stone: {
      draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
        const stoneSize = board.config.theme.stoneSize;
        const lw = board.config.theme.markupLinesWidth;

        canvasCtx.fillStyle = color;

        canvasCtx.beginPath();
        canvasCtx.arc(0, 0, stoneSize, 0, 2 * Math.PI, true);
        canvasCtx.fill();

        canvasCtx.lineWidth = lw;
        canvasCtx.strokeStyle = 'black';
        canvasCtx.stroke();
      },
    },
  };
}
