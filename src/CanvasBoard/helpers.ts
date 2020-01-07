import { Color } from '../types';
import CanvasBoard from './CanvasBoard';

export function isHereStone(b: CanvasBoard, x: number, y: number) {
  return (
    b.fieldObjects[x][y][0] && b.fieldObjects[x][y][0].c === Color.W || b.fieldObjects[x][y][0].c === Color.B
  );
}

export function defaultFieldClear(canvasCtx: CanvasRenderingContext2D, _args: any, board: CanvasBoard) {
  canvasCtx.clearRect(-board.fieldWidth / 2, -board.fieldHeight / 2, board.fieldWidth, board.fieldHeight);
}
