import { CanvasBoardTheme } from '../types';
import * as drawHandlers from '../drawHandlers';
import { defaultBoardBaseTheme } from '../../BoardBase/defaultConfig';

const baseTheme: CanvasBoardTheme = {
  ...defaultBoardBaseTheme,
  snapToGrid: false,
  linesShift: -0.5,

  drawHandlers: {
    B: new drawHandlers.SimpleStone('#222'),
    W: new drawHandlers.SimpleStone('#eee'),
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

export default baseTheme;
