import { defaultBoardConfig } from '../CanvasBoard';
import { PlayerConfig } from './types';
import { Circle } from '../CanvasBoard/drawHandlers';

const playerDefaultConfig: PlayerConfig = {
  boardTheme: defaultBoardConfig.theme,
  sgf: null,
  currentMoveBlackMark: new Circle({ color: 'rgba(255,255,255,0.8)' }),
  currentMoveWhiteMark: new Circle({ color: 'rgba(0,0,0,0.8)' }),
};

export default playerDefaultConfig;
