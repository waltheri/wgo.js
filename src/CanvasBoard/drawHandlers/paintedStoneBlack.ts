import { CanvasBoardConfig } from '../types';
import Stone from './Stone';

export default class PaintedStoneBlack extends Stone {
  stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig) {
    const stoneRadius = boardConfig.theme.stoneSize;
    const radGrad = canvasCtx.createRadialGradient(
      -2 * stoneRadius / 5,
      -2 * stoneRadius / 5,
      1 * stoneRadius / 5,
      -stoneRadius / 5,
      -stoneRadius / 5,
      4 * stoneRadius / 5,
    );
    radGrad.addColorStop(0, '#111');
    radGrad.addColorStop(1, '#000');

    canvasCtx.beginPath();
    canvasCtx.fillStyle = radGrad;
    canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
    canvasCtx.fill();

    canvasCtx.beginPath();
    canvasCtx.lineWidth = stoneRadius / 6;

    canvasCtx.strokeStyle = '#ccc';
    canvasCtx.arc(-stoneRadius / 8, -stoneRadius / 8, stoneRadius / 2, Math.PI, 1.5 * Math.PI);

    canvasCtx.stroke();
  }
}
