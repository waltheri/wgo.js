import { CanvasBoardTheme } from '../types';
import * as drawHandlers from '../drawHandlers';
//import { boardObjects } from '../boardObjects';

const baseTheme: CanvasBoardTheme = {
  // basic
  stoneSize: 0.47,

  // markup
  markupBlackColor: 'rgba(255,255,255,0.9)',
  markupWhiteColor: 'rgba(0,0,0,0.7)',
  markupNoneColor: 'rgba(0,0,0,0.7)',
  markupLineWidth: 0.05,

  // shadows
  shadowColor: 'rgba(62,32,32,0.5)',
  shadowTransparentColor: 'rgba(62,32,32,0)',
  shadowBlur: 0.25,
  shadowOffsetX: 0.07,
  shadowOffsetY: 0.13,

  // other
  font: 'calibri',
  linesShift: -0.5,
  backgroundColor: '#CEB053',
  backgroundImage: '',

  // grid
  grid: {
    linesWidth: 0.03,
    linesColor: '#654525',
    starColor: '#531',
    starSize: 0.07,
  },

  // coordinates
  coordinates: {
    color: '#531',
    bold: false,
    x: 'ABCDEFGHJKLMNOPQRSTUVWXYZ',
    y: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
  },

  drawHandlers: {
    B: new drawHandlers.SimpleStone('#222'),
    W: new drawHandlers.SimpleStone('#eee'),
    CR: new drawHandlers.Circle(),
    SQ: new drawHandlers.Square(),
    LB: new drawHandlers.Label(),
    TR: new drawHandlers.Triangle(),
    MA: new drawHandlers.XMark({ lineWidth: 0.075 }),
    SL: new drawHandlers.Dot(),
    LN: new drawHandlers.Line(),
    AR: new drawHandlers.Arrow(),
  },
};

export default baseTheme;
