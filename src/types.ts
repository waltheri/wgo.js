/* eslint-disable @typescript-eslint/no-duplicate-enum-values */
/**
 * Enumeration representing stone color, can be used for representing board position.
 * Colors are implemented as numbers 1 an -1, so you can easily switch colors with `color * -1`.
 */
export enum Color {
  /** Black stone */
  Black = 1,

  /** @alias Color.Black */
  B = 1,

  /** White stone */
  White = -1,

  /** @alias Color.White */
  W = -1,

  /** Represents empty field */
  Empty = 0,

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
  readonly x: number;

  /** Y coordinate - 0 is first row from the top, boardSize - 1 is the last row.  */
  readonly y: number;
}

/**
 * Vector represented with starting and ending point. Can be used to reference arrow or
 * line segment on the board.
 */
export interface Vector {
  /** Starting X coordinate - 0 is first column from the left, boardSize - 1 is the last column.  */
  readonly x1: number;

  /** Starting Y coordinate - 0 is first row from the top, boardSize - 1 is the last row.  */
  readonly y1: number;

  /** Ending X coordinate - 0 is first column from the left, boardSize - 1 is the last column.  */
  readonly x2: number;

  /** Ending Y coordinate - 0 is first row from the top, boardSize - 1 is the last row.  */
  readonly y2: number;
}

/**
 * Represents text label on specified field of the board.
 */
export interface Label extends Point {
  /** Text to display, shouldn't be too long (max. 3 characters are recommended) */
  readonly text: string;
}

/**
 * Represents one field on the board. It consists from coordinates and color.
 */
export interface Field extends Point {
  readonly c: Color;
}

/**
 * Represents one move. Similar to field, but only black or white color is allowed. Also if coordinates
 * can be omitted to represent a pass.
 */
export type Move =
  | ({
      readonly c: Color.Black | Color.White;
    } & Point)
  | {
      readonly c: Color.Black | Color.White;
    };

export type BoardSize = number | { readonly cols: number; readonly rows: number };

/**
 * Marks provided type as a class, so its values will have different syntax highlighting in VSCode - same as namespace.
 */
export type Namespace<T> = {
  new (): never;
} & T;
