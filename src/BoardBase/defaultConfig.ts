export const defaultBoardBaseTheme = {
  // basic
  stoneSize: 0.47,
  marginSize: 0.25,
  font: 'calibri',
  backgroundColor: '#CEB053',
  backgroundImage: '',

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
    labelsX: 'ABCDEFGHJKLMNOPQRSTUVWXYZ',
    labelsY: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
  },

  starPoints: {
    5: [{ x: 2, y: 2 }],
    7: [{ x: 3, y: 3 }],
    8: [{ x: 2, y: 2 }, { x: 5, y: 2 }, { x: 2, y: 5 }, { x: 5, y: 5 }],
    9: [{ x: 2, y: 2 }, { x: 6, y: 2 }, { x: 4, y: 4 }, { x: 2, y: 6 }, { x: 6, y: 6 }],
    10: [{ x: 2, y: 2 }, { x: 7, y: 2 }, { x: 2, y: 7 }, { x: 7, y: 7 }],
    11: [{ x: 2, y: 2 }, { x: 8, y: 2 }, { x: 5, y: 5 }, { x: 2, y: 8 }, { x: 8, y: 8 }],
    12: [{ x: 3, y: 3 }, { x: 8, y: 3 }, { x: 3, y: 8 }, { x: 8, y: 8 }],
    13: [{ x: 3, y: 3 }, { x: 9, y: 3 }, { x: 6, y: 6 }, { x: 3, y: 9 }, { x: 9, y: 9 }],
    14: [{ x: 3, y: 3 }, { x: 10, y: 3 }, { x: 3, y: 10 }, { x: 10, y: 10 }],
    15: [{ x: 3, y: 3 }, { x: 11, y: 3 }, { x: 7, y: 7 }, { x: 3, y: 11 }, { x: 11, y: 11 }],
    16: [{ x: 3, y: 3 }, { x: 12, y: 3 }, { x: 3, y: 12 }, { x: 12, y: 12 }],
    17: [{ x: 3, y: 3 }, { x: 8, y: 3 }, { x: 13, y: 3 }, { x: 3, y: 8 }, { x: 8, y: 8 },
    { x: 13, y: 8 }, { x: 3, y: 13 }, { x: 8, y: 13 }, { x: 13, y: 13 }],
    18: [{ x: 3, y: 3 }, { x: 14, y: 3 }, { x: 3, y: 14 }, { x: 14, y: 14 }],
    19: [{ x: 3, y: 3 }, { x: 9, y: 3 }, { x: 15, y: 3 }, { x: 3, y: 9 }, { x: 9, y: 9 },
    { x: 15, y: 9 }, { x: 3, y: 15 }, { x: 9, y: 15 }, { x: 15, y: 15 }],
    20: [{ x: 3, y: 3 }, { x: 16, y: 3 }, { x: 3, y: 16 }, { x: 16, y: 16 }],
    21: [{ x: 3, y: 3 }, { x: 10, y: 3 }, { x: 17, y: 3 }, { x: 3, y: 10 }, { x: 10, y: 10 },
    { x: 17, y: 10 }, { x: 3, y: 17 }, { x: 10, y: 17 }, { x: 17, y: 17 }],
  },
};

export const defaultBoardBaseConfig = {
  size: 19,
  width: 0,
  height: 0,
  viewport: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  coordinates: false,
  theme: defaultBoardBaseTheme,
};
