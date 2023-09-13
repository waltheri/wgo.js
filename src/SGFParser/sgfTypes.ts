export enum PropIdent {
  // Move Properties
  BlackMove = 'B',
  ExecuteIllegal = 'KO',
  MoveNumber = 'MN',
  WhiteMove = 'W',

  // Setup Properties
  AddBlack = 'AB',
  ClearField = 'AE',
  AddWhite = 'AW',
  SetTurn = 'PL',

  // Node Annotation Properties
  Comment = 'C',
  EvenPosition = 'DM',
  GoodForBlack = 'GB',
  GoodForWhite = 'GW',
  Hotspot = 'HO',
  NodeName = 'N',
  UnclearPosition = 'UC',
  NodeValue = 'V',

  // Move Annotation Properties
  BadMove = 'BM',
  DoubtfulMove = 'DM',
  InterestingMove = 'IT',
  GoodMove = 'TE',

  // Markup Properties
  Arrow = 'AR',
  Circle = 'CR',
  Dim = 'DD',
  Label = 'LB',
  Line = 'LN',
  XMark = 'MA',
  Selected = 'SL',
  Square = 'SQ',
  Triangle = 'TR',

  // Root Properties
  Application = 'AP',
  Charset = 'CA',
  SgfVersion = 'FF',
  GameType = 'GM',
  VariationsStyle = 'ST',
  BoardSize = 'SZ',

  // Game Info Properties
  Annotator = 'AN',
  BlackRank = 'BR',
  BlackTeam = 'BT',
  Copyright = 'CP',
  Date = 'DT',
  Event = 'EV',
  GameName = 'GN',
  GameComment = 'GC',
  OpeningInfo = 'ON',
  OverTime = 'OT',
  BlackName = 'BN',
  Plack = 'PC',
  WhiteName = 'PW',
  Result = 'RE',
  Round = 'RO',
  Rules = 'RU',
  Source = 'SO',
  TimeLimits = 'TM',
  Author = 'US',
  WhiteRank = 'WR',
  WhiteTeam = 'WT',

  // Timing Properties
  BlackTimeLeft = 'BL',
  BlackStonesLeft = 'OB',
  WhiteStonesLeft = 'OW',
  WhiteTimeLeft = 'WL',

  // Miscellaneous Properties
  Figure = 'FG',
  PrintMoveNumbers = 'PM',
  BoardSection = 'VW',
  Handicap = 'HA',

  // GO specific Properties
  Komi = 'KM',
  BlackTerritory = 'TB',
  WhiteTerritory = 'TW',
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
