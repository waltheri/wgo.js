import { CanvasBoardTheme } from '../CanvasBoard/types';
import { DrawHandler } from '../CanvasBoard/drawHandlers';

export interface PlayerConfig {
  boardTheme: CanvasBoardTheme;
  sgf: string;
  currentMoveBlackMark: DrawHandler;
  currentMoveWhiteMark: DrawHandler;
}
