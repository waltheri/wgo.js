import { defaultBoardConfig } from '../CanvasBoard';
import { PlayerConfig } from './types';

const playerDefaultConfig: PlayerConfig = {
  boardTheme: defaultBoardConfig.theme,
  sgf: null,
};

export default playerDefaultConfig;
