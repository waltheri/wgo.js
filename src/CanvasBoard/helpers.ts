import { Color } from '../types';
import CanvasBoard from './CanvasBoard';

/**
 * Utilities methods for Canvas board
 */

export function themeVariable(key: string, board: CanvasBoard) {
  const theme = board.config.theme as any;
  return typeof theme[key] === 'function' ? theme[key](board) : theme[key];
}

export function getMarkupColor(board: CanvasBoard, x: number, y: number) {
  if (board.fieldObjects[x][y][0].c === Color.BLACK) {
    return themeVariable('markupBlackColor', board);
  }
  if (board.fieldObjects[x][y][0].c === Color.WHITE) {
    return themeVariable('markupWhiteColor', board);
  }
  return themeVariable('markupNoneColor', board);
}

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
      const stoneRadius = themeVariable('stoneSize', board);

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
