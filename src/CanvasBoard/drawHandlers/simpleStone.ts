// Black and white stone
import { CanvasBoardConfig } from '../types';
import DrawHandler from './DrawHandler';

export default class SimpleStone extends DrawHandler<{ color: string }> {
  constructor (color: string) {
    super({ color });
  }

  stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig) {
    const stoneSize = boardConfig.theme.stoneSize;
    const lw = boardConfig.theme.markupLineWidth;

    canvasCtx.fillStyle = this.params.color;

    canvasCtx.beginPath();
    canvasCtx.arc(0, 0, stoneSize - lw / 2, 0, 2 * Math.PI, true);
    canvasCtx.fill();

    canvasCtx.lineWidth = lw;
    canvasCtx.strokeStyle = 'black';
    canvasCtx.stroke();
  }
}
