import * as drawHandlers from '../drawHandlers';
import { CanvasBoardTheme } from '../types';
import baseTheme from './baseTheme';

const realisticTheme: CanvasBoardTheme = {
  ...baseTheme,
  font: 'calibri',
  backgroundImage: '',

  drawHandlers: {
    ...baseTheme.drawHandlers,
    B: drawHandlers.realisticStone([
      'stones/black00_128.png',
      'stones/black01_128.png',
      'stones/black02_128.png',
      'stones/black03_128.png',
    ], drawHandlers.shellStoneBlack),
    W: drawHandlers.realisticStone([
      'stones/white00_128.png',
      'stones/white01_128.png',
      'stones/white02_128.png',
      'stones/white03_128.png',
      'stones/white04_128.png',
      'stones/white05_128.png',
      'stones/white06_128.png',
      'stones/white07_128.png',
      'stones/white08_128.png',
      'stones/white09_128.png',
      'stones/white10_128.png',
    ], drawHandlers.shellStoneWhite),
  },
};

export default realisticTheme;
