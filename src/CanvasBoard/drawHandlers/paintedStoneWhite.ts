import Stone from './Stone';
import { CanvasBoardConfig } from '../types';

export default class PaintedStoneWhite extends Stone {
  stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig) {
    const stoneRadius = boardConfig.theme.stoneSize;
    const radGrad = canvasCtx.createRadialGradient(
      -2 * stoneRadius / 5,
      -2 * stoneRadius / 5,
      2 * stoneRadius / 5,
      -stoneRadius / 5,
      -stoneRadius / 5,
      4 * stoneRadius / 5,
    );
    radGrad.addColorStop(0, '#fff');
    radGrad.addColorStop(1, '#ddd');

    canvasCtx.beginPath();
    canvasCtx.fillStyle = radGrad;
    canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
    canvasCtx.fill();

    canvasCtx.beginPath();
    canvasCtx.lineWidth = stoneRadius / 6;

    canvasCtx.strokeStyle = '#999';
    canvasCtx.arc(stoneRadius / 8, stoneRadius / 8, stoneRadius / 2, 0, Math.PI / 2, false);

    canvasCtx.stroke();
  }
}
