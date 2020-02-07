// Black and white stone
import { CanvasBoardConfig } from '../types';
import BoardObject from './BoardObject';

export default function simpleStoneFactory(color: string) {
  return (class SimpleStone extends BoardObject {
    drawStone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig) {
      const stoneSize = boardConfig.theme.stoneSize;
      const lw = boardConfig.theme.markupLinesWidth;

      canvasCtx.fillStyle = color;

      canvasCtx.beginPath();
      canvasCtx.arc(0, 0, stoneSize - lw / 2, 0, 2 * Math.PI, true);
      canvasCtx.fill();

      canvasCtx.lineWidth = lw;
      canvasCtx.strokeStyle = 'black';
      canvasCtx.stroke();
    }
  });
}
