import * as drawHandlers from '../drawHandlers';
import coordinatesHandler from '../drawHandlers/coordinates';
import { CanvasBoardTheme } from '../types';
import gridFieldClear from '../drawHandlers/gridFieldClear';
import gridHandler from '../drawHandlers/grid';
import { Circle, simpleStoneFactory } from '../boardObjects';
//import { boardObjects } from '../boardObjects';

const baseTheme: CanvasBoardTheme = {
  // basic
  stoneSize: 0.47,

  // markup
  markupBlackColor: 'rgba(255,255,255,0.9)',
  markupWhiteColor: 'rgba(0,0,0,0.7)',
  markupNoneColor: 'rgba(0,0,0,0.7)',
  markupLinesWidth: 0.05,

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
    CR: Circle as any,
    B: simpleStoneFactory('#222'),
    W: simpleStoneFactory('#eee'),
    //CR: drawHandlers.circle,
    //LB: drawHandlers.label,
    //SQ: drawHandlers.square,
    //TR: drawHandlers.triangle,
    //MA: drawHandlers.xMark,
    //SL: drawHandlers.dot,
    //SM: drawHandlers.smileyFace,
    //gridFieldClear,
  },
};

export default baseTheme;
