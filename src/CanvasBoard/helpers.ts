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

export let gridClearField = {
  draw (canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
    if (!isHereStone(board, args.x, args.y) && !args._nodraw) {
      const stoneRadius = board.config.theme.stoneSize;

      canvasCtx.clearRect(-stoneRadius, -stoneRadius, 2 * stoneRadius, 2 * stoneRadius);
    }
  },
  clear (canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard) {
    if (!isHereStone(board, args.x, args.y)) {
      args._nodraw = true;
      canvasCtx.restore(); // small hack for now
      board.redrawLayer('grid');
      canvasCtx.save();
      delete args._nodraw;
    }
  },
};
