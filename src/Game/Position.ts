/**
 * Contains implementation of go position class.
 * @module Position
 */

import { Color, Field } from '../types';

// creates 2-dim array
function createGrid<T>(sizeX: number, sizeY: number) {
  const grid: T[][] = [];
  for (let i = 0; i < sizeX; i++) {
    grid.push([]);
  }
  return grid;
}

/**
 * Position class represents a state of the go game in one moment in time. It is composed from a grid containing black
 * and white stones, capture counts, and actual turn. It is designed to be mutable.
 */
export default class Position {
  /**
   * Size (width/x axis) of the board.
   * @constant
   */
  readonly sizeX: number;

  /**
   * Size (height/y axis) of the board.
   * @constant
   */
  readonly sizeY: number;

  /**
   * One dimensional array containing stones of the position.
   */
  private _grid: Color[] = [];

  /**
   * Contains numbers of stones that both players captured.
   *
   * @property {number} black - Count of white stones captured by **black**.
   * @property {number} white - Count of black stones captured by **white**.
   */

  capCount = {
    black: 0,
    white: 0,
  };

  /**
   * Who plays next move.
   */

  turn: Color.BLACK | Color.WHITE = Color.BLACK;

  /**
   * Creates instance of position object.
   *
   * @alias WGo.Position
   * @class
   *
   * @param {number} [size = 19] - Size of the board.
   */
  constructor(sizeX: number = 19, sizeY: number = sizeX) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;

    // init grid
    this.clear();
  }

  /**
   * Returns true, if specified coordinates are valid within the position.
   * Returns false, if coordinates are negative or bigger than size.
   *
   * @param x
   * @param y
   * @returns
   */
  has(x: number, y: number) {
    return x >= 0 && y >= 0 && x < this.sizeX && y < this.sizeY;
  }

  /**
   * Returns stone on the given field.
   *
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @return {Color} Color
   */
  get(x: number, y: number): Color {
    if (!this.has(x, y)) {
      return undefined;
    }

    return this._grid[x * this.sizeY + y];
  }

  /**
   * Sets stone on the given field.
   *
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Color} c - Color
   */
  set(x: number, y: number, c: Color) {
    if (!this.has(x, y)) {
      throw new TypeError('Attempt to set field outside of position.');
    }

    this._grid[x * this.sizeY + y] = c;
    return this;
  }

  /**
   * Clears the whole position (every value is set to EMPTY).
   */
  clear() {
    for (let i = 0; i < this.sizeX * this.sizeY; i++) {
      this._grid[i] = Color.EMPTY;
    }
    return this;
  }

  /**
   * Clones the whole position.
   *
   * @return {WGo.Position} Copy of the position.
   * @todo Clone turn as well.
   */

  clone(): Position {
    const clone = new Position(this.sizeX, this.sizeY);
    clone._grid = this._grid.slice(0);
    clone.capCount.black = this.capCount.black;
    clone.capCount.white = this.capCount.white;
    clone.turn = this.turn;
    return clone;
  }

  /**
   * Compares this position with another position and return object with changes
   *
   * @param {WGo.Position} position - Position to compare to.
   * @return {Field[]} Array of different fields
   */
  compare(position: Position): Field[] {
    if (position.sizeX !== this.sizeX && position.sizeY !== this.sizeY) {
      throw new TypeError('Positions of different sizes cannot be compared.');
    }

    const diff: Field[] = [];

    for (let i = 0; i < this.sizeX * this.sizeY; i++) {
      if (this._grid[i] !== position._grid[i]) {
        diff.push({
          x: Math.floor(i / this.sizeY),
          y: i % this.sizeY,
          c: position._grid[i],
        });
      }
    }

    return diff;
  }

  /**
   * Sets stone on given coordinates and capture adjacent stones without liberties if there are any.
   * If move is invalid, false is returned.
   */
  applyMove(x: number, y: number, c: Color = this.turn, allowSuicide = false, allowRewrite = false) {
    // check if move is on empty field of the board
    if (!(allowRewrite || this.get(x, y) === Color.EMPTY)) {
      return false;
    }

    // clone position and add a stone
    const prevColor = this.get(x, y);
    this.set(x, y, c);

    // check capturing of all surrounding stones
    const capturesAbove = this.get(x, y - 1) === -c && this._captureIfNoLiberties(x, y - 1);
    const capturesRight = this.get(x + 1, y) === -c && this._captureIfNoLiberties(x + 1, y);
    const capturesBelow = this.get(x, y + 1) === -c && this._captureIfNoLiberties(x, y + 1);
    const capturesLeft = this.get(x - 1, y) === -c && this._captureIfNoLiberties(x - 1, y);
    const hasCaptured = capturesAbove || capturesRight || capturesBelow || capturesLeft;

    // check suicide
    if (!hasCaptured) {
      if (!this.hasLiberties(x, y)) {
        if (allowSuicide) {
          this._capture(x, y, c);
        } else {
          // revert position
          this.set(x, y, prevColor);
          return false;
        }
      }
    }

    this.turn = -c;
    return true;
  }

  /**
   * Validate position. Position is tested from 0:0 to size:size, if there are some moves,
   * that should be captured, they will be removed. Returns a new Position object.
   * This position isn't modified.
   */
  validatePosition() {
    for (let x = 0; x < this.sizeX; x++) {
      for (let y = 0; y < this.sizeY; y++) {
        this._captureIfNoLiberties(x - 1, y);
      }
    }
    return this;
  }

  /**
   * Returns true if stone or group on the given coordinates has at least one liberty.
   */
  hasLiberties(x: number, y: number, alreadyTested = createGrid(this.sizeX, this.sizeY), c = this.get(x, y)): boolean {
    // out of the board there aren't liberties
    if (!this.has(x, y)) {
      return false;
    }

    // however empty field means liberty
    if (this.get(x, y) === Color.EMPTY) {
      return true;
    }

    // already tested field or stone of enemy isn't a liberty.
    if (alreadyTested[x][y] || this.get(x, y) === -c) {
      return false;
    }

    // set this field as tested
    alreadyTested[x][y] = true;

    // in this case we are checking our stone, if we get 4 false, it has no liberty
    return (
      this.hasLiberties(x, y - 1, alreadyTested, c) ||
      this.hasLiberties(x, y + 1, alreadyTested, c) ||
      this.hasLiberties(x - 1, y, alreadyTested, c) ||
      this.hasLiberties(x + 1, y, alreadyTested, c)
    );
  }

  /**
   * For debug purposes.
   */
  toString() {
    const TL = '┌';
    const TM = '┬';
    const TR = '┐';
    const ML = '├';
    const MM = '┼';
    const MR = '┤';
    const BL = '└';
    const BM = '┴';
    const BR = '┘';
    const BS = '●';
    const WS = '○';
    const HF = '─'; // horizontal fill

    let output = '   ';

    for (let i = 0; i < this.sizeX; i++) {
      output += i < 9 ? `${i} ` : i;
    }

    output += '\n';

    for (let y = 0; y < this.sizeY; y++) {
      for (let x = 0; x < this.sizeX; x++) {
        const color = this._grid[x * this.sizeY + y];

        if (x === 0) {
          output += `${(y < 10 ? ` ${y}` : y)} `;
        }

        if (color !== Color.EMPTY) {
          output += color === Color.BLACK ? BS : WS;
        } else {
          let char;

          if (y === 0) {
            // top line
            if (x === 0) {
              char = TL;
            } else if (x < this.sizeX - 1) {
              char = TM;
            } else {
              char = TR;
            }
          } else if (y < this.sizeY - 1) {
            // middle line
            if (x === 0) {
              char = ML;
            } else if (x < this.sizeX - 1) {
              char = MM;
            } else {
              char = MR;
            }
          } else {
            // bottom line
            if (x === 0) {
              char = BL;
            } else if (x < this.sizeX - 1) {
              char = BM;
            } else {
              char = BR;
            }
          }

          output += char;
        }

        if (x === this.sizeX - 1) {
          if (y !== this.sizeY - 1) {
            output += '\n';
          }
        } else {
          output += HF;
        }
      }
    }

    return output;
  }

  /**
   * Returns position grid as two dimensional array.
   */
  toTwoDimensionalArray() {
    const arr: Color[][] = [];

    for (let x = 0; x < this.sizeX; x++) {
      arr[x] = [];
      for (let y = 0; y < this.sizeY; y++) {
        arr[x][y] = this._grid[x * this.sizeY + y];
      }
    }

    return arr;
  }

  /**
   * Checks if specified stone/group has zero liberties and if so it captures/removes stones from the position.
   */
  private _captureIfNoLiberties(x: number, y: number) {
    // if it has zero liberties capture it
    if (!this.hasLiberties(x, y)) {
      // capture stones from game
      this._capture(x, y);
      return true;
    }

    return false;
  }

  /**
   * Captures/removes stone on specified position and all adjacent and connected stones. This method ignores liberties.
   */
  private _capture(x: number, y: number, c: Color = this.get(x, y)) {
    if (this.has(x, y) && c !== Color.EMPTY && this.get(x, y) === c) {
      this.set(x, y, Color.EMPTY);

      if (c === Color.BLACK) {
        this.capCount.white = this.capCount.white + 1;
      } else {
        this.capCount.black = this.capCount.black + 1;
      }

      this._capture(x, y - 1, c);
      this._capture(x, y + 1, c);
      this._capture(x - 1, y, c);
      this._capture(x + 1, y, c);
    }
  }
}
