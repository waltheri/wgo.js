import * as drawHandlers from '../drawHandlers';
import { CanvasBoardTheme } from '../types';
import baseTheme from './baseTheme';

const modernTheme: CanvasBoardTheme = {
  ...baseTheme,
  font: 'calibri',
  backgroundImage: '',

  drawHandlers: {
    ...baseTheme.drawHandlers,
    B: drawHandlers.shellStoneBlack,
    W: drawHandlers.shellStoneWhite,
  },
};

export default modernTheme;
