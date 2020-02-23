import { defaultBoardBaseTheme } from '../BoardBase/defaultConfig';
import { SVGBoardTheme } from './types';
import * as drawHandlers from './svgDrawHandlers';

const defaultSVGTheme: SVGBoardTheme = {
  ...defaultBoardBaseTheme,
  backgroundImage: 'images/wood1.jpg',
  coordinates: {
    ...defaultBoardBaseTheme.coordinates,
    fontSize: 0.5,
  },

  grid: {
    ...defaultBoardBaseTheme.grid,
    linesWidth: 0.03,
    starSize: 0.09,
  },

  drawHandlers: {
    B: new drawHandlers.GlassStoneBlack(),
    W: new drawHandlers.GlassStoneWhite(),
    CR: new drawHandlers.Circle(),
    SQ: new drawHandlers.Square(),
    LB: new drawHandlers.Label(),
    TR: new drawHandlers.Triangle(),
    MA: new drawHandlers.XMark({ lineWidth: 0.075 }),
    SL: new drawHandlers.Dot({ color: 'rgba(32, 32, 192, 0.75)' }),
    LN: new drawHandlers.Line(),
    AR: new drawHandlers.Arrow(),
    DD: new drawHandlers.Dim({ color: 'rgba(0, 0, 0, 0.5)' }),
  },
};

export default defaultSVGTheme;
