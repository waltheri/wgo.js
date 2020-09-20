/**
 * Contains implementation of go position class.
 * @module Position
 */
import { Color, Field } from '../types';
/**
 * Position class represents a state of the go game in one moment in time. It is composed from a grid containing black
 * and white stones, capture counts, and actual turn. It is designed to be mutable.
 */
export default class Position {
    /**
       * Size of the board.
       * @constant
       */
    size: number;
    /**
     * One dimensional array containing stones of the position.
     */
    grid: Color[];
    /**
     * Contains numbers of stones that both players captured.
     *
     * @property {number} black - Count of white stones captured by **black**.
     * @property {number} white - Count of black stones captured by **white**.
     */
    capCount: {
        black: number;
        white: number;
    };
    /**
     * Who plays next move.
     */
    turn: Color.BLACK | Color.WHITE;
    /**
     * Creates instance of position object.
     *
     * @alias WGo.Position
     * @class
     *
     * @param {number} [size = 19] - Size of the board.
     */
    constructor(size?: number);
    isOnPosition(x: number, y: number): boolean;
    /**
     * Returns stone on the given field.
     *
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @return {Color} Color
     */
    get(x: number, y: number): Color;
    /**
     * Sets stone on the given field.
     *
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {Color} c - Color
     */
    set(x: number, y: number, c: Color): this;
    /**
     * Clears the whole position (every value is set to EMPTY).
     */
    clear(): this;
    /**
     * Clones the whole position.
     *
     * @return {WGo.Position} Copy of the position.
     * @todo Clone turn as well.
     */
    clone(): Position;
    /**
     * Compares this position with another position and return object with changes
     *
     * @param {WGo.Position} position - Position to compare to.
     * @return {Field[]} Array of different fields
     */
    compare(position: Position): Field[];
    /**
     * Sets stone on given coordinates and capture adjacent stones without liberties if there are any.
     * If move is invalid, false is returned.
     */
    applyMove(x: number, y: number, c?: Color, allowSuicide?: boolean, allowRewrite?: boolean): boolean;
    /**
     * Validate position. Position is tested from 0:0 to size:size, if there are some moves,
     * that should be captured, they will be removed. Returns a new Position object.
     * This position isn't modified.
     */
    validatePosition(): this;
    /**
     * Returns true if stone or group on the given coordinates has at least one liberty.
     */
    hasLiberties(x: number, y: number, alreadyTested?: unknown[][], c?: Color): boolean;
    /**
     * Checks if specified stone/group has zero liberties and if so it captures/removes stones from the position.
     */
    protected captureIfNoLiberties(x: number, y: number): boolean;
    /**
     * Captures/removes stone on specified position and all adjacent and connected stones. This method ignores liberties.
     */
    capture(x: number, y: number, c?: Color): void;
    /**
     * For debug purposes.
     */
    toString(): string;
    /**
     * Returns position grid as two dimensional array.
     */
    toTwoDimensionalArray(): Color[][];
}
