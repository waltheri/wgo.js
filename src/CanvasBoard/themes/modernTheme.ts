import * as drawHandlers from '../drawHandlers';
import coordinates from '../drawHandlers/coordinates';
import CanvasBoard from '..';
import { CanvasBoardTheme } from '../types';

/**
 * Object containing default graphical properties of a board.
 * A value of all properties can be even static value or function, returning final value.
 * Theme object doesn't set board and stone textures - they are set separately.
 */

const modernTheme: CanvasBoardTheme = {
    // stones
  stoneHandler: drawHandlers.shellStone,
  stoneSize: 0.47,

    // shadow
  shadowColor: 'rgba(62,32,32,0.5)',
  shadowTransparentColor: 'rgba(62,32,32,0)',
  shadowBlur: 0.25,
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
  starSize: 0.05,

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
  backgroundColor: '',
  backgroundImage: '',
};

export default modernTheme;
