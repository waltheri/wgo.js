import { GoRules } from './rules';
import Position from './Position';
import { Color } from '../types';
export default class Game {
    size: number;
    rules: GoRules;
    komi: number;
    positionStack: Position[];
    /**
     * Creates instance of game class.
     *
     * @class
     * This class implements game logic. It basically analyses given moves and returns capture stones.
     * WGo.Game also stores every position from beginning, so it has ability to check repeating positions
     * and it can effectively restore old positions.
     *
     *
     * @param {number} [size = 19] Size of the board
     * @param {string} [checkRepeat = KO] How to handle repeated position:
     *
     * * KO - ko is properly handled - position cannot be same like previous position
     * * ALL - position cannot be same like any previous position - e.g. it forbids triple ko
     * * NONE - position can be repeated
     *
     * @param {boolean} [allowRewrite = false] Allow to play moves, which were already played
     * @param {boolean} [allowSuicide = false] Allow to play suicides, stones are immediately captured
     */
    constructor(size?: number, rules?: GoRules);
    get position(): Position;
    set position(pos: Position);
    get turn(): Color.WHITE | Color.BLACK;
    set turn(color: Color.WHITE | Color.BLACK);
    get capCount(): {
        black: number;
        white: number;
    };
    /**
     * Play move. You can specify color.
     */
    play(x: number, y: number): false | Position;
    /**
     * Tries to play on given coordinates, returns new position after the play, or error code.
     */
    protected tryToPlay(x: number, y: number): false | Position;
    /**
     * @param {Position} position to check
     * @return {boolean} Returns true if the position didn't occurred in the past (according to the rule set)
     */
    hasPositionRepeated(position: Position): boolean;
    /**
     * Play pass.
     *
     * @param {(BLACK|WHITE)} c color
     */
    pass(c?: Color.BLACK | Color.WHITE): void;
    /**
     * Finds out validity of the move.
     *
     * @param {number} x coordinate
     * @param {number} y coordinate
     * @return {boolean} true if move can be played.
     */
    isValid(x: number, y: number): boolean;
    /**
     * Controls position of the move.
     *
     * @param {number} x coordinate
     * @param {number} y coordinate
     * @return {boolean} true if move is on board.
     */
    isOnBoard(x: number, y: number): boolean;
    /**
     * Inserts move into current position. Use for setting position, for example in handicap game. Field must be empty.
     *
     * @param {number} x coordinate
     * @param {number} y coordinate
     * @param {Color} c color
     * @return {boolean} true if operation is successful.
     */
    addStone(x: number, y: number, c: Color.BLACK | Color.WHITE): boolean;
    /**
     * Removes move from current position.
     *
     * @param {number} x coordinate
     * @param {number} y coordinate
     * @return {boolean} true if operation is successful.
     */
    removeStone(x: number, y: number): boolean;
    /**
     * Set or insert move of current position.
     *
     * @param {number} x coordinate
     * @param {number} y coordinate
     * @param {(BLACK|WHITE)} [c] color
     * @return {boolean} true if operation is successful.
     */
    setStone(x: number, y: number, c: Color): boolean;
    /**
     * Get stone on given position.s
     *
     * @param {number} x coordinate
     * @param {number} y coordinate
     * @return {(Color|null)} color
     */
    getStone(x: any, y: any): (Color | null);
    /**
     * Add position to stack. If position isn't specified current position is cloned and stacked.
     * Pointer of actual position is moved to the new position.
     *
     * @param {WGo.Position} tmp position (optional)
     */
    pushPosition(pos: Position): number;
    /**
     * Remove current position from stack. Pointer of actual position is moved to the previous position.
     */
    popPosition(): Position;
    /**
     * Removes all positions except the initial.
     */
    clear(): void;
}
