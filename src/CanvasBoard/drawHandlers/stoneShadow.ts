/**
 * Generic shadow draw handler for all stones
 *
 * "shadowBlur" 0-1
 * 0 - no blur - createRadialGradient(0, 0, stoneRadius, 0, 0, stoneRadius)
 * 1 - maximal blur - createRadialGradient(0, 0, 0, 0, 0, 8/7*stoneRadius)
 */

import { themeVariable } from '../helpers';
import CanvasBoard from '..';

export default {
  draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
    const stoneRadius = themeVariable('stoneSize', board);
    const blur = themeVariable('shadowBlur', board) || 0.00001;

    const startRadius = Math.max(stoneRadius - stoneRadius * blur, 0.00001);
    const stopRadius = stoneRadius + (1 / 7 * stoneRadius) * blur;

    const gradient = canvasCtx.createRadialGradient(0, 0, startRadius, 0, 0, stopRadius);
    gradient.addColorStop(0, themeVariable('shadowColor', board));
    gradient.addColorStop(1, themeVariable('shadowTransparentColor', board));

    canvasCtx.beginPath();
    canvasCtx.fillStyle = gradient;
    canvasCtx.arc(0, 0, stopRadius, 0, 2 * Math.PI, true);
    canvasCtx.fill();

    // canvasCtx.beginPath();
    // canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
    // canvasCtx.stroke();
  }, //
};
