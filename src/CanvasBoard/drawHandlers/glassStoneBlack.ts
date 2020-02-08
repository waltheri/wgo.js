import { CanvasBoardConfig } from '../types';
import Stone from './Stone';

export default class GlassStoneBlack extends Stone {
  stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig) {
    const stoneRadius = boardConfig.theme.stoneSize;
    const radGrad = canvasCtx.createRadialGradient(
      -2 * stoneRadius / 5,
      -2 * stoneRadius / 5,
      1,
      -stoneRadius / 5,
      -stoneRadius / 5,
      4 * stoneRadius / 5,
    );
    radGrad.addColorStop(0, '#666');
    radGrad.addColorStop(1, '#000');

    canvasCtx.beginPath();
    canvasCtx.fillStyle = radGrad;
    canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
    canvasCtx.fill();
  }
}
