import { Color } from '../types';
import { Position } from './Position';
import { JAPANESE_RULES, KoRule, Rules } from './rules';

/**
 * Go game evaluator. It contains methods to play moves and check validity of moves. Currently
 * this is quite simple implementation, not designed for playing a real game and not very abstract. It
 * doesn't contain mechanisms for scoring, or telling game has ended.
 *
 * Probably will be reimplemented in the future to make it more general and suitable for any application.
 */
export class Game {
  position: Position;
  rules: Rules;
  #history: Array<{ position: Position; player: Color.Black | Color.White }> = [];
  blackCaptures = 0;
  whiteCaptures = 0;
  player: Color.Black | Color.White = Color.Black;

  constructor(size?: number | { cols: number; rows: number }, rules: Rules = JAPANESE_RULES) {
    this.rules = rules;
    this.player = Color.Black;
    this.position =
      typeof size === 'object' ? new Position(size.cols, size.rows) : new Position(size);
  }

  /**
   * Make move on the specified field. This will ignore any rules. If there is already stone on
   * that field it will be overridden. If you want to make valid move, check the field with
   * isValidMove() method before.
   */
  play(x: number, y: number, player = this.player) {
    if (!this.position.has(x, y)) {
      throw new TypeError('Invalid move: out of board');
    }

    this.#history.push({
      position: this.position,
      player,
    });
    this.position = this.position.clone();

    const captures = this.position.makeMove(x, y, player);
    const capturedColor = captures < 0 ? -player : player;

    if (capturedColor === Color.Black) {
      this.blackCaptures += Math.abs(captures);
    } else {
      this.whiteCaptures += Math.abs(captures);
    }

    this.player = -player;
  }

  /**
   * Pass the turn. This will only change the turn, it will not change the position nor affect position history.
   */
  pass(color = this.player) {
    this.player = -color;
  }

  /**
   * Check, if move can be played on specified field respecting provided rules.
   */
  isValidMove(x: number, y: number, color = this.player): boolean {
    if (
      !this.position.has(x, y) ||
      (!this.rules.allowRewrite && this.position.get(x, y) !== Color.Empty)
    ) {
      return false;
    }

    const cloned = this.position.clone();
    const captures = cloned.makeMove(x, y, color);

    if (captures < 0 && !this.rules.allowSuicide) {
      return false;
    }

    if (this.rules.koRule === KoRule.Ko && this.#history.length) {
      const lastPosition = this.#history[this.#history.length - 1].position;
      if (lastPosition.get(x, y) === color && lastPosition.equals(cloned)) {
        return false;
      }
    } else if (this.rules.koRule === KoRule.PositionalSuperKo) {
      if (
        this.#history.some(
          ({ position }) => position.get(x, y) === color && position.equals(cloned),
        )
      ) {
        return false;
      }
    } else if (this.rules.koRule === KoRule.SituationalSuperKo) {
      if (
        this.#history.some(
          ({ position, player }) =>
            player === -color && position.get(x, y) === color && position.equals(cloned),
        )
      ) {
        return false;
      }
    }

    return true;
  }
}
