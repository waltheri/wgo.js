// Black and white stone
import CanvasBoard from '..';
import { BoardFieldObject } from '../types';

export default function (color: string) {
  return {
    drawField: {
      stone(canvasCtx: CanvasRenderingContext2D, args: BoardFieldObject, board: CanvasBoard) {
        const stoneSize = board.config.theme.stoneSize;
        const lw = board.config.theme.markupLinesWidth;

        canvasCtx.fillStyle = color;

        canvasCtx.beginPath();
        canvasCtx.arc(0, 0, stoneSize - lw / 2, 0, 2 * Math.PI, true);
        canvasCtx.fill();

        canvasCtx.lineWidth = lw;
        canvasCtx.strokeStyle = 'black';
        canvasCtx.stroke();
      },
    },
  };
}
