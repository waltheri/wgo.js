/* Test of WGo.Game class and (handling of go game) */
import {
  CHINESE_RULES,
  Game,
  ING_RULES,
  JAPANESE_RULES,
  NO_RULES,
  Position,
  sgfRulesMap,
} from '../src/game';
import { Color } from '../src/types';
import assert, { strictEqual, deepEqual } from 'assert';

describe('Game object', () => {
  describe('Constructor', () => {
    it('Default game is correctly created.', () => {
      const game = new Game();
      strictEqual(game.position.cols, 19);
      strictEqual(game.position.rows, 19);
      deepEqual(game.rules, sgfRulesMap.Japanese);
      strictEqual(game.player, Color.Black);
      strictEqual(game.rules.komi, 6.5);
      strictEqual(game.blackCaptures, 0);
      strictEqual(game.whiteCaptures, 0);
      deepEqual(game.position, new Position());
    });

    it('Custom board size and rules', () => {
      const game = new Game(9, sgfRulesMap.Chinese);
      strictEqual(game.position.cols, 9);
      strictEqual(game.position.rows, 9);
      deepEqual(game.rules, sgfRulesMap.Chinese);
      strictEqual(game.player, Color.Black);
      strictEqual(game.rules.komi, 7.5);
      strictEqual(game.blackCaptures, 0);
      strictEqual(game.whiteCaptures, 0);
      deepEqual(game.position, new Position(9));
    });

    it('Rectangular board size', () => {
      const game = new Game({ cols: 13, rows: 17 });
      strictEqual(game.position.cols, 13);
      strictEqual(game.position.rows, 17);
      deepEqual(game.position, new Position(13, 17));
    });
  });

  describe('Play and pass', () => {
    it('Basic Game#play() functionality.', () => {
      const game = new Game(9);
      const initialPosition = game.position;

      game.play(4, 4);

      strictEqual(game.position.get(4, 4), Color.Black);
      strictEqual(initialPosition.get(4, 4), Color.Empty);
      strictEqual(game.player, Color.White);
      strictEqual(game.blackCaptures, 0);
      strictEqual(game.whiteCaptures, 0);
    });

    it('Play custom color', () => {
      const game = new Game(9);

      game.play(4, 4, Color.White);

      strictEqual(game.position.get(4, 4), Color.White);
      strictEqual(game.player, Color.Black);

      game.play(4, 5);

      strictEqual(game.position.get(4, 5), Color.Black);
      strictEqual(game.player, Color.White);

      game.player = Color.Black;
      game.play(5, 4);

      strictEqual(game.position.get(5, 4), Color.Black);
      strictEqual(game.player, Color.White);
    });

    it('Capturing stones', () => {
      const game = new Game(9);

      game.position.set(0, 0, Color.Black);
      game.position.set(0, 1, Color.Black);
      game.position.set(1, 0, Color.Black);
      game.position.set(1, 1, Color.Black);
      game.position.set(0, 2, Color.White);
      game.position.set(1, 2, Color.White);
      game.position.set(2, 0, Color.White);

      game.play(2, 1, Color.White);

      strictEqual(game.position.get(0, 0), Color.Empty);
      strictEqual(game.position.get(0, 1), Color.Empty);
      strictEqual(game.position.get(1, 0), Color.Empty);
      strictEqual(game.position.get(1, 1), Color.Empty);
      strictEqual(game.position.get(2, 1), Color.White);
      strictEqual(game.blackCaptures, 0);
      strictEqual(game.whiteCaptures, 4);
    });

    it('Illegal moves can be played', () => {
      const game = new Game(9, NO_RULES);

      game.position.set(0, 0, Color.Black);
      game.position.set(1, 0, Color.Black);
      game.position.set(0, 1, Color.White);

      game.play(1, 0, Color.White);
      strictEqual(game.blackCaptures, 0);
      strictEqual(game.whiteCaptures, 1);
      strictEqual(game.position.get(1, 0), Color.White);

      game.play(0, 1);
      strictEqual(game.blackCaptures, 0);
      strictEqual(game.whiteCaptures, 1);
      strictEqual(game.position.get(0, 1), Color.Black);
    });

    it('Game#pass()', () => {
      const game = new Game(9);

      game.pass();
      strictEqual(game.player, Color.White);

      game.pass();
      strictEqual(game.player, Color.Black);
    });
  });

  describe('Check validity', () => {
    it('Invalid moves', () => {
      const game = new Game(9);

      game.position.set(0, 1, Color.Black);
      game.position.set(1, 0, Color.White);

      const clonedPos = game.position.clone();

      assert(!game.isValidMove(0, 1));
      assert(!game.isValidMove(1, 0));
      assert(!game.isValidMove(0, -1));
      assert(!game.isValidMove(-1, 0));
      assert(!game.isValidMove(0, 9));
      assert(!game.isValidMove(9, 0));

      deepEqual(game.position, clonedPos);
    });

    it('Disallow suicide', () => {
      const game = new Game(9);

      game.position.set(0, 1, Color.White);
      game.position.set(0, 2, Color.Black);
      game.position.set(1, 0, Color.Black);
      game.position.set(1, 1, Color.Black);

      assert(!game.isValidMove(0, 0, Color.White));
    });

    it('Allow suicide in ING rules', () => {
      const game = new Game(9, ING_RULES);

      game.position.set(0, 1, Color.White);
      game.position.set(0, 2, Color.Black);
      game.position.set(1, 0, Color.Black);
      game.position.set(1, 1, Color.Black);

      assert(game.isValidMove(0, 0, Color.White));

      game.play(0, 0, Color.White);

      strictEqual(game.blackCaptures, 2);
      strictEqual(game.whiteCaptures, 0);
      strictEqual(game.position.get(0, 0), Color.Empty);
      strictEqual(game.position.get(0, 1), Color.Empty);
    });

    it('Disallow Ko (repeating of previous position)', () => {
      const game = new Game(9);

      game.position.set(0, 1, Color.Black);
      game.position.set(1, 0, Color.Black);
      game.position.set(2, 1, Color.Black);
      game.position.set(0, 2, Color.White);
      game.position.set(1, 3, Color.White);
      game.position.set(2, 2, Color.White);

      game.play(1, 2); // creates KO
      game.play(1, 1); // white captures

      strictEqual(game.whiteCaptures, 1);
      strictEqual(game.blackCaptures, 0);
      strictEqual(game.position.get(1, 2), Color.Empty);
      strictEqual(game.position.get(1, 1), Color.White);

      assert(!game.isValidMove(1, 2)); // invalid capture

      game.play(5, 5); // ko threat
      game.play(6, 6); // answer

      assert(game.isValidMove(1, 2)); // black captures
    });

    it('Allow Ko in no rules', () => {
      const game = new Game(9, NO_RULES);

      game.position.set(0, 1, Color.Black);
      game.position.set(1, 0, Color.Black);
      game.position.set(2, 1, Color.Black);
      game.position.set(0, 2, Color.White);
      game.position.set(1, 3, Color.White);
      game.position.set(2, 2, Color.White);

      game.play(1, 2); // creates KO
      game.play(1, 1); // white captures

      strictEqual(game.whiteCaptures, 1);
      strictEqual(game.blackCaptures, 0);
      strictEqual(game.position.get(1, 2), Color.Empty);
      strictEqual(game.position.get(1, 1), Color.White);

      assert(game.isValidMove(1, 2));
    });

    it('Disallow Triple Ko (repeating of any position) in Chinese rules', () => {
      const game = new Game(9, CHINESE_RULES);

      game.position.set(0, 1, Color.Black);
      game.position.set(1, 0, Color.Black);
      game.position.set(2, 1, Color.Black);
      game.position.set(0, 2, Color.White);
      game.position.set(1, 3, Color.White);
      game.position.set(2, 2, Color.White);
      game.position.set(1, 2, Color.Black);

      game.position.set(3, 1, Color.Black);
      game.position.set(4, 0, Color.Black);
      game.position.set(5, 1, Color.Black);
      game.position.set(3, 2, Color.White);
      game.position.set(4, 3, Color.White);
      game.position.set(5, 2, Color.White);
      game.position.set(4, 1, Color.White);

      game.position.set(6, 1, Color.Black);
      game.position.set(7, 0, Color.Black);
      game.position.set(8, 1, Color.Black);
      game.position.set(6, 2, Color.White);
      game.position.set(7, 3, Color.White);
      game.position.set(8, 2, Color.White);
      game.position.set(7, 1, Color.White);

      game.play(4, 2); // black captures 2nd ko
      game.play(1, 1); // white captures 1st ko
      game.play(7, 2); // black captures 3rd ko
      game.play(4, 1); // white captures 2nd ko
      game.play(1, 2); // black captures 1st ko
      assert(!game.isValidMove(7, 1)); // white captures 3rd ko - invalid

      game.play(5, 5); // ko threat
      game.play(6, 6); // answer
      assert(game.isValidMove(7, 1)); // correct
    });

    it('Allow Triple Ko (repeating of any position) in Japanese rules', () => {
      const game = new Game(9, JAPANESE_RULES);

      game.position.set(0, 1, Color.Black);
      game.position.set(1, 0, Color.Black);
      game.position.set(2, 1, Color.Black);
      game.position.set(0, 2, Color.White);
      game.position.set(1, 3, Color.White);
      game.position.set(2, 2, Color.White);
      game.position.set(1, 2, Color.Black);

      game.position.set(3, 1, Color.Black);
      game.position.set(4, 0, Color.Black);
      game.position.set(5, 1, Color.Black);
      game.position.set(3, 2, Color.White);
      game.position.set(4, 3, Color.White);
      game.position.set(5, 2, Color.White);
      game.position.set(4, 1, Color.White);

      game.position.set(6, 1, Color.Black);
      game.position.set(7, 0, Color.Black);
      game.position.set(8, 1, Color.Black);
      game.position.set(6, 2, Color.White);
      game.position.set(7, 3, Color.White);
      game.position.set(8, 2, Color.White);
      game.position.set(7, 1, Color.White);

      game.play(4, 2); // black captures 2nd ko
      game.play(1, 1); // white captures 1st ko
      game.play(7, 2); // black captures 3rd ko
      game.play(4, 1); // white captures 2nd ko
      game.play(1, 2); // black captures 1st ko
      assert(game.isValidMove(7, 1)); // white captures 3rd ko - valid
    });
  });
});
