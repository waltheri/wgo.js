import { Color } from '../types';

/**
 * Position class represents a state of the go game in one moment in time. It is composed from a grid containing black
 * and white stones, capture counts, and actual turn. It is designed to be mutable.
 */
export class Position {
  /**
   * One dimensional array containing stones of the position.
   */
  #grid: Color[][];

  /**
   * Creates instance of position object. WGo supports rectangular boards - you can specify number of columns and rows.
   */
  constructor(
    /**
     * Number of columns (width/x axis) of the board. If not specified, default value will be 19.
     */
    public readonly cols: number = 19,
    /**
     * Number of rows (height/y axis) of the board. If not specified, default value be equal to columns, so
     * normal square position (board) will be created.
     */
    public readonly rows: number = cols,
  ) {
    // init grid
    this.clear();
  }

  /**
   * Returns true, if specified coordinates are valid within the position.
   * Returns false, if coordinates are negative or bigger than size.
   */
  has(x: number, y: number) {
    return x >= 0 && y! >= 0 && x < this.cols && y! < this.rows;
  }

  /**
   * Returns stone on the given field.
   */
  get(x: number, y: number) {
    if (!this.has(x, y!)) {
      return undefined;
    }

    return this.#grid[x][y!];
  }

  /**
   * Sets stone on the given field.
   */
  set(x: number, y: number, color: Color) {
    if (!this.has(x, y!)) {
      throw new TypeError('Attempt to set field outside of position.');
    }

    this.#grid[x][y!] = color!;
  }

  /**
   * Clears the whole position (every value is set to EMPTY).
   */
  clear() {
    this.#grid = Array(this.cols)
      .fill(undefined)
      .map(() => Array(this.rows).fill(Color.Empty));
  }

  /**
   * Clones the whole position.
   */
  clone(): Position {
    const clone = new Position(this.rows, this.cols);
    clone.#grid = this.#grid.map((row) => [...row]);
    return clone;
  }

  /**
   * Compares this position with another position, if positions are same true is returned.
   */
  equals(position: Position): boolean {
    if (position.rows !== this.rows && position.cols !== this.cols) {
      return false;
    }

    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        if (this.#grid[x][y] !== position.#grid[x][y]) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Returns true if stone or group on the given coordinates has at least one liberty.
   */
  hasLiberties(x: number, y: number): boolean {
    const color = this.get(x, y);
    if (color) {
      return this.#hasLiberties(
        x,
        y,
        Array(this.rows)
          .fill(undefined)
          .map(() => []),
        color,
      );
    }
    return false;
  }

  #hasLiberties(x: number, y: number, alreadyTested: boolean[][], color: Color): boolean {
    // out of the board there aren't liberties
    if (!this.has(x, y)) {
      return false;
    }

    // however empty field means liberty
    if (this.get(x, y) === Color.Empty) {
      return true;
    }

    // already tested field or stone of enemy isn't a liberty.
    if (alreadyTested[x][y] || this.get(x, y) === -color) {
      return false;
    }

    // set this field as tested
    alreadyTested[x][y] = true;

    // in this case we are checking our stone, if we get 4 false, it has no liberty
    return (
      this.#hasLiberties(x, y - 1, alreadyTested, color) ||
      this.#hasLiberties(x, y + 1, alreadyTested, color) ||
      this.#hasLiberties(x - 1, y, alreadyTested, color) ||
      this.#hasLiberties(x + 1, y, alreadyTested, color)
    );
  }

  /**
   * Captures/removes stone on specified position and all adjacent and connected stones of same color.
   * This method ignores liberties. Returns number of captured stones.
   */
  removeChain(x: number, y: number): number {
    const color = this.get(x, y);
    if (color === undefined) {
      throw new TypeError('Attempt to remove group outside of position.');
    }

    if (color) {
      this.set(x, y, Color.Empty);
      let capturedStones = 1;

      if (this.get(x + 1, y) === color) {
        capturedStones += this.removeChain(x + 1, y);
      }
      if (this.get(x - 1, y) === color) {
        capturedStones += this.removeChain(x - 1, y);
      }
      if (this.get(x, y + 1) === color) {
        capturedStones += this.removeChain(x, y + 1);
      }
      if (this.get(x, y - 1) === color) {
        capturedStones += this.removeChain(x, y - 1);
      }

      return capturedStones;
    }

    return 0;
  }

  /**
   * Sets stone on given coordinates and capture adjacent stones without liberties if there are any.
   * Stone is set even if field is not empty. Returns number of captured stones.
   */
  makeMove(x: number, y: number, color: Color): number {
    let captures = 0;
    this.set(x, y, color);

    if (this.get(x + 1, y) === -color && !this.hasLiberties(x + 1, y)) {
      captures += this.removeChain(x + 1, y);
    }

    if (this.get(x - 1, y) === -color && !this.hasLiberties(x - 1, y)) {
      captures += this.removeChain(x - 1, y);
    }

    if (this.get(x, y + 1) === -color && !this.hasLiberties(x, y + 1)) {
      captures += this.removeChain(x, y + 1);
    }

    if (this.get(x, y - 1) === -color && !this.hasLiberties(x, y - 1)) {
      captures += this.removeChain(x, y - 1);
    }

    // suicide
    if (!captures && !this.hasLiberties(x, y)) {
      captures -= this.removeChain(x, y);
    }

    return captures;
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

    for (let i = 0; i < this.cols; i++) {
      output += i < 9 ? `${i} ` : i;
    }

    output += '\n';

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const color = this.#grid[x][y];

        if (x === 0) {
          output += `${y < 10 ? ` ${y}` : y} `;
        }

        if (color !== Color.Empty) {
          output += color === Color.Black ? BS : WS;
        } else {
          let char;

          if (y === 0) {
            // top line
            if (x === 0) {
              char = TL;
            } else if (x < this.cols - 1) {
              char = TM;
            } else {
              char = TR;
            }
          } else if (y < this.rows - 1) {
            // middle line
            if (x === 0) {
              char = ML;
            } else if (x < this.cols - 1) {
              char = MM;
            } else {
              char = MR;
            }
          } else {
            // bottom line
            if (x === 0) {
              char = BL;
            } else if (x < this.cols - 1) {
              char = BM;
            } else {
              char = BR;
            }
          }

          output += char;
        }

        if (x === this.cols - 1) {
          if (y !== this.rows - 1) {
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
   * Checks if specified stone/group has zero liberties and if so it captures/removes stones from the position.
   */
  /*private _captureIfNoLiberties(x: number, y: number) {
    // if it has zero liberties capture it
    if (!this.hasLiberties(x, y)) {
      // capture stones from game
      this._capture(x, y);
      return true;
    }

    return false;
  }*/
}
