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
  DoubtfulMove = 'DO',
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
  SGFVersion = 'FF',
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
  BlackName = 'PB',
  Place = 'PC',
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

/**
 * TODO - move this comment somewhere else (if it has some use) or remove
 *
 * From SGF specification, there are these types of property values:
 *
 * CValueType = (ValueType | *Compose*)
 * ValueType  = (*None* | *Number* | *Real* | *Double* | *Color* | *SimpleText* | *Text* | *Point*  | *Move* | *Stone*)
 *
 * WGo's kifu node (KNode object) implements similar types with few exceptions:
 *
 * - Types `Number`, `Real` and `Double` are implemented by javascript's `number`.
 * - Types `SimpleText` and `Text` are considered as the same.
 * - Types `Point`, `Move` and `Stone` are all the same, implemented as simple object with `x` and `y` coordinates.
 * - Type `None` is implemented as `true`
 *
 * Each `Compose` type, which is used in SGF, has its own type.
 *
 * - `Point ':' Point` (used in AR property) has special type `Line` - object with two sets of coordinates.
 * - `Point ':' Simpletext` (used in LB property) has special type `Label` - object with coordinates and text property
 * - `Simpletext ":" Simpletext` (used in AP property) - not implemented
 * - `Number ":" SimpleText` (used in FG property) - not implemented
 *
 * Moreover each property value has these settings:
 *
 * - *Single value* / *Array* (more values)
 * - *Not empty* / *Empty* (value or array can be empty)
 *
 * {@link http://www.red-bean.com/sgf/sgf4.html}
 */
