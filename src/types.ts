/**
 * Enumeration representing stone color, can be used for representing board position.
 * Colors are implemented as numbers 1 an -1, so you can easily switch colors with `color * -1`.
 */
export enum Color {
  /** Black stone */
  BLACK = 1,

  /** @alias Color.BLACK */
  B = 1,

  /** White stone */
  WHITE = -1,

  /** @alias Color.WHITE */
  W = -1,

  /** Represents empty field */
  EMPTY = 0,

  /** @alias Color.E */
  E = 0,
}

/**
 * Simple 2 dimensional vector for referencing fields on the board. {x: 0, y: 0} represents
 * top left corner (or A19 in standard 19x19 board notation), {x: 18, y: 18} represents
 * bottom right corner (or T1 in standard 19x19 board notation).
 */
export interface Point {
  /** X coordinate - 0 is first column from the left, boardSize - 1 is the last column.  */
  x: number;

  /** Y coordinate - 0 is first row from the top, boardSize - 1 is the last row.  */
  y: number;
}

/** 
 * Vector represented with starting and ending point. Can be used to reference arrow or
 * line segment on the board.
 */
 export type Vector = [Point, Point];

/**
 * Represents text label on specified field of the board.
 */
export interface Label extends Point {
  /** Text to display, shouldn't be too long (max. 3 characters are recommended) */
  text: string;
}

/**
 * Represents one field on the board. It consists from coordinates and color.
 */
export interface Field extends Point {
  c: Color;
}

/**
 * Represents one move. Similar to field, but only black or white color is allowed.
 */
export interface Move extends Point {
  c: Color.BLACK | Color.WHITE;
}
