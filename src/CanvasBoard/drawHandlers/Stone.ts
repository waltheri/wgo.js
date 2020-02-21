import DrawHandler from './DrawHandler';
import { CanvasBoardConfig } from '../types';

/**
 * Provides shadow for the stone.
 */
export default class Stone extends DrawHandler {
  shadow(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig) {
    const stoneRadius = boardConfig.theme.stoneSize;
    const blur = boardConfig.theme.shadowBlur;

    const startRadius = Math.max(stoneRadius - stoneRadius * blur, 0.00001);
    const stopRadius = stoneRadius + (1 / 7 * stoneRadius) * blur;

    const gradient = canvasCtx.createRadialGradient(0, 0, startRadius, 0, 0, stopRadius);
    gradient.addColorStop(0, boardConfig.theme.shadowColor);
    gradient.addColorStop(1, boardConfig.theme.shadowTransparentColor);

    canvasCtx.beginPath();
    canvasCtx.fillStyle = gradient;
    canvasCtx.arc(0, 0, stopRadius, 0, 2 * Math.PI, true);
    canvasCtx.fill();
  }
}
