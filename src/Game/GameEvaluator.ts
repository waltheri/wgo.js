import { Color } from '../types';
import { GameState } from './GameState';
import { Position } from './Position';
import { KoRule, Rules } from './rules';

export class GameEvaluator {
  constructor(public rules: Rules) {}

  isValidMove(
    position: Position,
    move: { x: number; y: number; c: Color.Black | Color.White },
    gameStateHistory: GameState[] = [],
  ): boolean {
    if (
      !position.has(move.x, move.y) ||
      (!this.rules.allowRewrite && position.get(move.x, move.y) !== Color.Empty)
    ) {
      return false;
    }

    const cloned = position.clone();
    const captures = cloned.makeMove(move.x, move.y, move.c);

    if (captures < 0 && !this.rules.allowSuicide) {
      return false;
    }

    if (this.rules.koRule === KoRule.Ko && gameStateHistory.length) {
      const lastPosition = gameStateHistory[gameStateHistory.length - 1].position;
      if (lastPosition.get(move.x, move.y) === move.c && lastPosition.equals(cloned)) {
        return false;
      }
    } else if (this.rules.koRule === KoRule.PositionalSuperKo) {
      if (
        gameStateHistory.some(
          ({ position }) => position.get(move.x, move.y) === move.c && position.equals(cloned),
        )
      ) {
        return false;
      }
    } else if (this.rules.koRule === KoRule.SituationalSuperKo) {
      if (
        gameStateHistory.some(
          ({ position, player }) =>
            player === -move.c &&
            position.get(move.x, move.y) === move.c &&
            position.equals(cloned),
        )
      ) {
        return false;
      }
    }

    return true;
  }
}
