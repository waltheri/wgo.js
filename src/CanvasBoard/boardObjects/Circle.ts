import BoardObject from './BoardObject';
import { CanvasBoardConfig } from '../types';

interface CircleParams {
  color?: string;
  lineWidth?: number;
  fillColor?: string;
}

export default class Circle extends BoardObject<CircleParams> {
  drawStone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig) {
    canvasCtx.strokeStyle = this.params.color || boardConfig.theme.markupNoneColor;
    canvasCtx.lineWidth = this.params.lineWidth || boardConfig.theme.markupLinesWidth;
    canvasCtx.beginPath();
    canvasCtx.arc(0, 0, 0.25, 0, 2 * Math.PI, true);
    canvasCtx.stroke();

    if (this.params.fillColor) {
      canvasCtx.fillStyle = this.params.fillColor;
      canvasCtx.fill();
    }
  }

  drawGrid(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig) {
    canvasCtx.clearRect(
      -boardConfig.theme.stoneSize,
      -boardConfig.theme.stoneSize,
      boardConfig.theme.stoneSize * 2,
      boardConfig.theme.stoneSize * 2,
    );
  }
}
