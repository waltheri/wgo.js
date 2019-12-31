export enum PropIdent {
  // Move Properties
  BLACK_MOVE = 'B',
  EXECUTE_ILLEGAL = 'KO',
  MOVE_NUMBER = 'MN',
  WHITE_MOVE = 'W',

  // Setup Properties
  ADD_BLACK = 'AB',
  CLEAR_FIELD = 'AE',
  ADD_WHITE = 'AW',
  SET_TURN = 'PL',

  // Node Annotation Properties
  COMMENT = 'C',
  EVEN_POSITION = 'DM',
  GOOD_FOR_BLACK = 'GB',
  GOOD_FOR_WHITE = 'GW',
  HOTSPOT = 'HO',
  NODE_NAME = 'N',
  UNCLEAR_POSITION = 'UC',
  NODE_VALUE = 'V',

  // Move Annotation Properties
  BAD_MOVE = 'BM',
  DOUBTFUL_MOVE = 'DM',
  INTERESTING_MOVE = 'IT',
  GOOD_MOVE = 'TE',

  // Markup Properties
  ARROW = 'AR',
  CIRCLE = 'CR',
  DIM = 'DD',
  LABEL = 'LB',
  LINE = 'LN',
  X_MARK = 'MA',
  SELECTED = 'SL',
  SQUARE = 'SQ',
  TRIANGLE = 'TR',

  // Root Properties
  APPLICATION = 'AP',
  CHARSET = 'CA',
  SGF_VERSION = 'FF',
  GAME_TYPE = 'GM',
  VARIATIONS_STYLE = 'ST',
  BOARD_SIZE = 'SZ',

  // Game Info Properties
  ANNOTATOR = 'AN',
  BLACK_RANK = 'BR',
  BLACK_TEAM = 'BT',
  COPYRIGHT = 'CP',
  DATE = 'DT',
  EVENT = 'EV',
  GAME_NAME = 'GN',
  GAME_COMMENT = 'GC',
  OPENING_INFO = 'ON',
  OVER_TIME = 'OT',
  BLACK_NAME = 'BN',
  PLACE = 'PC',
  WHITE_NAME = 'PW',
  RESULT = 'RE',
  ROUND = 'RO',
  RULES = 'RU',
  SOURCE = 'SO',
  TIME_LIMITS = 'TM',
  AUTHOR = 'US',
  WHITE_RANK = 'WR',
  WHITE_TEAM = 'WT',

  // Timing Properties
  BLACK_TIME_LEFT = 'BL',
  BLACK_STONES_LEFT = 'OB',
  WHITE_STONES_LEFT = 'OW',
  WHITE_TIME_LEFT = 'WL',

  // Miscellaneous Properties
  FIGURE = 'FG',
  PRINT_MOVE_NUMBERS = 'PM',
  BOARD_SECTION = 'VW',
  HANDICAP = 'HA',

  // GO specific Properties
  KOMI = 'KM',
  BLACK_TERRITORY = 'TB',
  WHITE_TERRITORY = 'TW',
}

export type SGFProperties = {
  [key in PropIdent]?: string[];
};

export type SGFNode = SGFProperties;

export interface SGFGameTree {
  sequence: SGFNode[];
  children: SGFGameTree[];
}

export type SGFCollection = SGFGameTree[];
