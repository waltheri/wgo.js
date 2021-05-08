import { defaultBoardBaseTheme } from '../BoardBase/defaultConfig';
import { SVGBoardTheme } from './types';
import * as drawHandlers from './svgDrawHandlers';
import ModernStoneWhite from './svgDrawHandlers/ModernStoneWhite';
import ModernStoneBlack from './svgDrawHandlers/ModernStoneBlack';

const defaultSVGTheme: SVGBoardTheme = {
  ...defaultBoardBaseTheme,
  // backgroundImage: 'images/wood1.jpg',
  markupGridMask: 0.8,
  stoneSize: 0.48,

  coordinates: {
    ...defaultBoardBaseTheme.coordinates,
    fontSize: 0.5,
    top: true,
    right: true,
    bottom: true,
    left: true,
  },

  grid: {
    ...defaultBoardBaseTheme.grid,
    linesWidth: 0.03,
    starSize: 0.09,
  },

  drawHandlers: {
    CR: new drawHandlers.Circle(),
    SQ: new drawHandlers.Square(),
    LB: new drawHandlers.Label(),
    TR: new drawHandlers.Triangle(),
    MA: new drawHandlers.XMark({ lineWidth: 0.075 }),
    SL: new drawHandlers.Dot({ color: 'rgba(32, 32, 192, 0.75)' }),
    LN: new drawHandlers.Line(),
    AR: new drawHandlers.Arrow(),
    DD: new drawHandlers.Dim({ color: 'rgba(0, 0, 0, 0.5)' }),
    // B: new drawHandlers.GlassStoneBlack(),
    // W: new drawHandlers.GlassStoneWhite(),
    W: new ModernStoneWhite(),
    B: new ModernStoneBlack(),
    /*B: new drawHandlers.RealisticStone([
      'images/stones/black00_128.png',
      'images/stones/black01_128.png',
      'images/stones/black02_128.png',
      'images/stones/black03_128.png',
    ], new drawHandlers.GlassStoneBlack()),
    W: new drawHandlers.RealisticStone([
      'images/stones/white00_128.png',
      'images/stones/white01_128.png',
      'images/stones/white02_128.png',
      'images/stones/white03_128.png',
      'images/stones/white04_128.png',
      'images/stones/white05_128.png',
      'images/stones/white06_128.png',
      'images/stones/white07_128.png',
      'images/stones/white08_128.png',
      'images/stones/white09_128.png',
      'images/stones/white10_128.png',
    ], new drawHandlers.GlassStoneWhite()),*/
  },
};

export default defaultSVGTheme;
