/**
 * Contains implementation of go position class.
 * @module Position
 */

import { Color, Field } from '../types';

// creates 2-dim array
function createGrid<T>(size: number) {
  const grid: T[][] = [];
  for (let i = 0; i < size; i++) {
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
	 * Size of the board.
	 * @constant
	 */

  size: number;

  /**
   * One dimensional array containing stones of the position.
   */
  grid: Color[] = [];

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
  constructor(size: number = 19) {
    this.size = size;

    // init grid
    this.clear();
  }

  isOnPosition(x: number, y: number) {
    return x >= 0 && y >= 0 && x < this.size && y < this.size;
  }

  /**
   * Returns stone on the given field.
   *
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @return {Color} Color
   */
  get(x: number, y: number): Color {
    if (!this.isOnPosition(x, y)) {
      return undefined;
    }

    return this.grid[x * this.size + y];
  }

  /**
   * Sets stone on the given field.
   *
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Color} c - Color
   */
  set(x: number, y: number, c: Color) {
    if (!this.isOnPosition(x, y)) {
      throw new TypeError('Attempt to set field outside of position.');
    }

    this.grid[x * this.size + y] = c;
    return this;
  }

  /**
   * Clears the whole position (every value is set to EMPTY).
   */
  clear() {
    for (let i = 0; i < this.size * this.size; i++) {
      this.grid[i] = Color.EMPTY;
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
    const clone = new Position(this.size);
    clone.grid = this.grid.slice(0);
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
    if (position.size !== this.size) {
      throw new TypeError('Positions of different sizes cannot be compared.');
    }

    const diff: Field[] = [];

    for (let i = 0; i < this.size * this.size; i++) {
      if (this.grid[i] !== position.grid[i]) {
        diff.push({
          x: Math.floor(i / this.size),
          y: i % this.size,
          c: position.grid[i],
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
    const capturesAbove = this.get(x, y - 1) === -c && this.captureIfNoLiberties(x, y - 1);
    const capturesRight = this.get(x + 1, y) === -c && this.captureIfNoLiberties(x + 1, y);
    const capturesBelow = this.get(x, y + 1) === -c && this.captureIfNoLiberties(x, y + 1);
    const capturesLeft = this.get(x - 1, y) === -c && this.captureIfNoLiberties(x - 1, y);
    const hasCaptured = capturesAbove || capturesRight || capturesBelow || capturesLeft;

    // check suicide
    if (!hasCaptured) {
      if (!this.hasLiberties(x, y)) {
        if (allowSuicide) {
          this.capture(x, y, c);
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
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        this.captureIfNoLiberties(x - 1, y);
      }
    }
    return this;
  }

  /**
   * Returns true if stone or group on the given coordinates has at least one liberty.
   */
  hasLiberties(x: number, y: number, alreadyTested = createGrid(this.size), c = this.get(x, y)): boolean {
    // out of the board there aren't liberties
    if (!this.isOnPosition(x, y)) {
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
   * Checks if specified stone/group has zero liberties and if so it captures/removes stones from the position.
   */
  protected captureIfNoLiberties(x: number, y: number) {
    // if it has zero liberties capture it
    if (!this.hasLiberties(x, y)) {
      // capture stones from game
      this.capture(x, y);
      return true;
    }

    return false;
  }

  /**
   * Captures/removes stone on specified position and all adjacent and connected stones. This method ignores liberties.
   */
  capture(x: number, y: number, c: Color = this.get(x, y)) {
    if (this.isOnPosition(x, y) && c !== Color.EMPTY && this.get(x, y) === c) {
      this.set(x, y, Color.EMPTY);

      if (c === Color.BLACK) {
        this.capCount.white = this.capCount.white + 1;
      } else {
        this.capCount.black = this.capCount.black + 1;
      }

      this.capture(x, y - 1, c);
      this.capture(x, y + 1, c);
      this.capture(x - 1, y, c);
      this.capture(x + 1, y, c);
    }
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

    for (let i = 0; i < this.size; i++) {
      output += i < 9 ? `${i} ` : i;
    }

    output += '\n';

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const color = this.grid[x * this.size + y];

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
            } else if (x < this.size - 1) {
              char = TM;
            } else {
              char = TR;
            }
          } else if (y < this.size - 1) {
            // middle line
            if (x === 0) {
              char = ML;
            } else if (x < this.size - 1) {
              char = MM;
            } else {
              char = MR;
            }
          } else {
            // bottom line
            if (x === 0) {
              char = BL;
            } else if (x < this.size - 1) {
              char = BM;
            } else {
              char = BR;
            }
          }

          output += char;
        }

        if (x === this.size - 1) {
          if (y !== this.size - 1) {
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

    for (let x = 0; x < this.size; x++) {
      arr[x] = [];
      for (let y = 0; y < this.size; y++) {
        arr[x][y] = this.grid[x * this.size + y];
      }
    }

    return arr;
  }
}

// import { Color, Field, Move } from '../types';

// /**
//  * Position of the board (grid) is represented as 2 dimensional array of colors.
//  */
// export type Position = Color[][];

// /**
//  * Creates empty position (filled with Color.EMPTY) of specified size.
//  * @param size
//  */
// export function createPosition(size: number) {
//   const position: Color[][] = [];
//   for (let i = 0; i < size; i++) {
//     const row: Color[] = [];
//     for (let j = 0; j < size; j++) {
//       row.push(Color.EMPTY);
//     }
//     position.push(row);
//   }
//   return position;
// }

// /**
//  * Deep clones a position.
//  * @param position
//  */
// export function clonePosition(position: Position) {
//   return position.map(row => row.slice(0));
// }

// /**
//  * Compares position `pos1` with position `pos2` and returns all differences on `pos2`.
//  * @param pos1
//  * @param pos2
//  */
// export function comparePositions(pos1: Position, pos2: Position): Field[] {
//   if (pos1.length !== pos2.length) {
//     throw new TypeError('Positions of different sizes cannot be compared.');
//   }

//   const diff: Field[] = [];

//   for (let x = 0; x < pos1.length; x++) {
//     for (let y = 0; y < pos2.length; y++) {
//       if (pos1[x][y] !== pos2[x][y]) {
//         diff.push({ x, y, c: pos2[x][y] });
//       }
//     }
//   }

//   return diff;
// }

// function isOnBoard(position: Position, x: number, y: number) {
//   return x >= 0 && x < position.length && y >= 0 && y < position.length;
// }

// /**
//  * Creates new position with specified move (with rules applied - position won't contain captured stones).
//  * If move is invalid, null is returned.
//  */
// export function applyMove(position: Position, x: number, y: number, c: Color.B | Color.W, allowSuicide = false) {
//   // check if move is on empty field of the board
//   if (!isOnBoard(position, x, y) || position[x][y] !== Color.EMPTY) {
//     return null;
//   }

//   // clone position and add a stone
//   const newPosition = clonePosition(position);
//   newPosition[x][y] = c;

//   // check capturing of all surrounding stones
//   const capturesAbove = captureIfNoLiberties(newPosition, x, y - 1, -c);
//   const capturesRight = captureIfNoLiberties(newPosition, x + 1, y, -c);
//   const capturesBelow = captureIfNoLiberties(newPosition, x, y + 1, -c);
//   const capturesLeft = captureIfNoLiberties(newPosition, x - 1, y, -c);
//   const hasCaptured = capturesAbove || capturesRight || capturesBelow || capturesLeft;

//   // check suicide
//   if (!hasCaptured) {
//     if (!hasLiberties(newPosition, x, y)) {
//       if (allowSuicide) {
//         capture(newPosition, x, y, c);
//       } else {
//         return null;
//       }
//     }
//   }

//   return newPosition;
// }

// /**
//  * Validate position. Position is tested from 0:0 to size:size, if there are some moves,
//  * that should be captured, they will be removed. Returns a new Position object.
//  */

// export function getValidatedPosition(position: Position) {
//   const newPosition = clonePosition(position);

//   for (let x = 0; x < position.length; x++) {
//     for (let y = 0; y < position.length; y++) {
//       captureIfNoLiberties(newPosition, x, y);
//     }
//   }

//   return newPosition;
// }

// /**
//  * Capture stone or group of stones if they are zero liberties. Mutates the given position.
//  *
//  * @param position
//  * @param x
//  * @param y
//  * @param c
//  */
// function captureIfNoLiberties(position: Position, x: number, y: number, c: Color = position[x][y]) {
//   let hasCaptured = false;

//   // is there a stone possible to capture?
//   if (isOnBoard(position, x, y) && c !== Color.EMPTY && position[x][y] === c) {
//     // if it has zero liberties capture it
//     if (!hasLiberties(position, x, y)) {
//       // capture stones from game
//       capture(position, x, y, c);
//       hasCaptured = true;
//     }
//   }

//   return hasCaptured;
// }

// function createTestGrid(size: number) {
//   const grid: boolean[][] = [];
//   for (let i = 0; i < size; i++) {
//     grid.push([]);
//   }
//   return grid;
// }

// /**
//  * Returns true if stone or group on the given position has at least one liberty.
//  */
// function hasLiberties(
//   position: Position,
//   x: number,
//   y: number,
//   alreadyTested = createTestGrid(position.length),
//   c = position[x][y],
// ): boolean {
//   // out of the board there aren't liberties
//   if (!isOnBoard(position, x, y)) {
//     return false;
//   }

//   // however empty field means liberty
//   if (position[x][y] === Color.EMPTY) {
//     return true;
//   }

//   // already tested field or stone of enemy isn't a liberty.
//   if (alreadyTested[x][y] || position[x][y] === -c) {
//     return false;
//   }

//   // set this field as tested
//   alreadyTested[x][y] = true;

//   // in this case we are checking our stone, if we get 4 false, it has no liberty
//   return (
//     hasLiberties(position, x, y - 1, alreadyTested, c) ||
//     hasLiberties(position, x, y + 1, alreadyTested, c) ||
//     hasLiberties(position, x - 1, y, alreadyTested, c) ||
//     hasLiberties(position, x + 1, y, alreadyTested, c)
//   );
// }

// /**
//  * Captures/removes stone on specified position and all adjacent and connected stones. This method ignores liberties.
//  * Mutates the given position.
//  */
// function capture(position: Position, x: number, y: number, c: Color = position[x][y]) {
//   if (isOnBoard(position, x, y) && position[x][y] !== Color.EMPTY && position[x][y] === c) {
//     position[x][y] = Color.EMPTY;

//     capture(position, x, y - 1, c);
//     capture(position, x, y + 1, c);
//     capture(position, x - 1, y, c);
//     capture(position, x + 1, y, c);
//   }
// }

// /**
//  * For debug purposes.
//  */
// export function stringifyPosition(position: Position) {
//   const TL = '┌';
//   const TM = '┬';
//   const TR = '┐';
//   const ML = '├';
//   const MM = '┼';
//   const MR = '┤';
//   const BL = '└';
//   const BM = '┴';
//   const BR = '┘';
//   const BS = '●';
//   const WS = '○';
//   const HF = '─'; // horizontal fill

//   let output = '   ';

//   for (let i = 0; i < position.length; i++) {
//     output += i < 9 ? `${i} ` : i;
//   }

//   output += '\n';

//   for (let y = 0; y < position.length; y++) {
//     for (let x = 0; x < position.length; x++) {
//       const color = position[x][y];

//       if (x === 0) {
//         output += `${(y < 10 ? ` ${y}` : y)} `;
//       }

//       if (color !== Color.EMPTY) {
//         output += color === Color.BLACK ? BS : WS;
//       } else {
//         let char;

//         if (y === 0) {
//           // top line
//           if (x === 0) {
//             char = TL;
//           } else if (x < position.length - 1) {
//             char = TM;
//           } else {
//             char = TR;
//           }
//         } else if (y < position.length - 1) {
//           // middle line
//           if (x === 0) {
//             char = ML;
//           } else if (x < position.length - 1) {
//             char = MM;
//           } else {
//             char = MR;
//           }
//         } else {
//           // bottom line
//           if (x === 0) {
//             char = BL;
//           } else if (x < position.length - 1) {
//             char = BM;
//           } else {
//             char = BR;
//           }
//         }

//         output += char;
//       }

//       if (x === position.length - 1) {
//         if (y !== position.length - 1) {
//           output += '\n';
//         }
//       } else {
//         output += HF;
//       }
//     }
//   }

//   return output;
// }
