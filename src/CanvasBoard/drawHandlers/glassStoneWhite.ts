import Stone from './Stone';
import { CanvasBoardConfig } from '../types';

export default class GlassStoneWhite extends Stone {
  stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig) {
    const stoneRadius = boardConfig.theme.stoneSize;
    const radGrad = canvasCtx.createRadialGradient(
      -2 * stoneRadius / 5,
      -2 * stoneRadius / 5,
      stoneRadius / 3,
      -stoneRadius / 5,
      -stoneRadius / 5,
      5 * stoneRadius / 5,
    );

    radGrad.addColorStop(0, '#fff');
    radGrad.addColorStop(1, '#aaa');

    canvasCtx.beginPath();
    canvasCtx.fillStyle = radGrad;
    canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
    canvasCtx.fill();
  }
}
