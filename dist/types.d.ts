/**
 * Enumeration representing stone color, can be used for representing board position.
 */
export declare enum Color {
    BLACK = 1,
    B = 1,
    WHITE = -1,
    W = -1,
    EMPTY = 0,
    E = 0
}
/**
 * Simple 2 dimensional vector for referencing field on the board.
 */
export interface Point {
    x: number;
    y: number;
}
export interface Label extends Point {
    text: string;
}
export declare type Vector = Point[];
export interface Label extends Point {
    text: string;
}
export interface Field extends Point {
    c: Color;
}
export interface Move extends Point {
    c: Color.BLACK | Color.WHITE;
}
