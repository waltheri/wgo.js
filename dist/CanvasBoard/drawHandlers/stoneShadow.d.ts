/**
 * Generic shadow draw handler for all stones
 *
 * "shadowBlur" 0-1
 * 0 - no blur - createRadialGradient(0, 0, stoneRadius, 0, 0, stoneRadius)
 * 1 - maximal blur - createRadialGradient(0, 0, 0, 0, 0, 8/7*stoneRadius)
 */
import CanvasBoard from '..';
import { BoardFieldObject } from '../types';
export default function (canvasCtx: CanvasRenderingContext2D, args: BoardFieldObject, board: CanvasBoard): void;
