import * as drawHandlers from '../drawHandlers';
import coordinates from '../drawHandlers/coordinates';
import CanvasBoard from '..';
import { CanvasBoardTheme } from '../types';

/**
 * Object containing default graphical properties of a board.
 * A value of all properties can be even static value or function, returning final value.
 * Theme object doesn't set board and stone textures - they are set separately.
 */

const realisticTheme: CanvasBoardTheme = {
  // stones
  stoneHandler: drawHandlers.realisticStone({
    whiteStoneGraphic: [
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
    ],
    blackStoneGraphic: [
      'stones/black00_128.png',
      'stones/black01_128.png',
      'stones/black02_128.png',
      'stones/black03_128.png',
    ],
  }, drawHandlers.shellStone),
  stoneSize: 0.5,

  // shadow
  shadowColor: 'rgba(62,32,32,0.5)',
  shadowTransparentColor: 'rgba(62,32,32,0)',
  shadowBlur: 0.5,
  shadowOffsetX: 0.08,
  shadowOffsetY: 0.16,

  // markup
  markupBlackColor: 'rgba(255,255,255,0.9)',
  markupWhiteColor: 'rgba(0,0,0,0.7)',
  markupNoneColor: 'rgba(0,0,0,0.7)',
  markupLinesWidth: 0.05,
  markupHandlers: {
    CR: drawHandlers.circle,
    LB: drawHandlers.label,
    SQ: drawHandlers.square,
    TR: drawHandlers.triangle,
    MA: drawHandlers.xMark,
    SL: drawHandlers.dot,
    SM: drawHandlers.smileyFace,
  },

  // grid & star points
  gridLinesWidth: 0.03,
  gridLinesColor: '#654525',
  starColor: '#531',
  starSize: 0.06,

  // coordinates
  coordinatesHandler: coordinates,
  coordinatesColor: '#531',
  coordinatesX: 'ABCDEFGHJKLMNOPQRSTUV',
  coordinatesY: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],

  // other
  variationColor: 'rgba(0,32,128,0.8)',
  font: 'calibri',
  linesShift: -0.25,
  imageFolder: '../images/',
  backgroundColor: '#CEB053',
  backgroundImage: '',
};

export default realisticTheme;
