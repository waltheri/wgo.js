/* global describe, it, beforeEach */
/* Test of WGo.Game class and (handling of go game) */

import { strict as assert, equal, deepEqual } from 'assert';
import { Color } from '../src/types';
import Game from '../src/Game/Game';
import Position from '../src/Game/Position';
import rules, { NO_RULES, CHINESE_RULES, ING_RULES } from '../src/Game/rules';

describe('Game object', () => {
  describe('Constructor', () => {
    it('Default game is correctly created.', () => {
      const game = new Game();
      equal(game.sizeX, 19);
      equal(game.sizeY, 19);
      deepEqual(game.rules, rules.Japanese);
      equal(game.position.turn, Color.Black);
      equal(game.komi, 6.5);
      deepEqual(game.position.capCount, { black: 0, white: 0 });
      deepEqual(game.position, new Position());
    });

    it('Custom board size and rules', () => {
      const game = new Game(9, rules.Chinese);
      equal(game.sizeX, 9);
      equal(game.sizeY, 9);
      deepEqual(game.rules, rules.Chinese);
      equal(game.position.turn, Color.Black);
      equal(game.komi, 7.5);
      deepEqual(game.position.capCount, { black: 0, white: 0 });
      deepEqual(game.position, new Position(9));
    });

    it('Rectangular board size', () => {
      const game = new Game({ x: 13, y: 17 });
      equal(game.sizeX, 13);
      equal(game.sizeY, 17);
      deepEqual(game.position, new Position(13, 17));
    });
  });

  describe('Add, remove, set and stones', () => {
    it('Game#addStone() - stones are added if there is empty field', () => {
      const game = new Game(3);

      assert(game.addStone(0, 1, Color.Black));
      assert(game.addStone(1, 0, Color.White));

      equal(game.getStone(0, 1), Color.Black);
      equal(game.getStone(1, 0), Color.White);
      deepEqual(game.position.toTwoDimensionalArray(), [
        [Color.E, Color.B, Color.E],
        [Color.W, Color.E, Color.E],
        [Color.E, Color.E, Color.E],
      ]);
    });

    it("Game#addStone() - stones are not added if there isn't empty field or coordinates are not valid", () => {
      const game = new Game(3);

      game.addStone(0, 1, Color.Black);
      game.addStone(1, 0, Color.White);

      assert(!game.addStone(0, 1, Color.Black));
      assert(!game.addStone(0, 1, Color.White));
      assert(!game.addStone(1, 0, Color.White));
      assert(!game.addStone(1, 0, Color.Black));
      assert(!game.addStone(-1, 0, Color.Black));
      assert(!game.addStone(0, -1, Color.White));
      assert(!game.addStone(0, 3, Color.White));
      assert(!game.addStone(3, 0, Color.Black));

      deepEqual(game.position.toTwoDimensionalArray(), [
        [Color.E, Color.B, Color.E],
        [Color.W, Color.E, Color.E],
        [Color.E, Color.E, Color.E],
      ]);
    });

    it('Game#removeStone() - stones are removed if there are stones', () => {
      const game = new Game(3);
      game.addStone(0, 1, Color.Black);
      game.addStone(1, 0, Color.White);

      assert(game.removeStone(0, 1));
      assert(game.removeStone(1, 0));
      deepEqual(game.position.toTwoDimensionalArray(), [
        [Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E],
      ]);
    });

    it('Game#removeStone() - stones are not removed if there are no stones', () => {
      const game = new Game(3);
      assert(!game.removeStone(0, 1));
      assert(!game.removeStone(1, 0));
      assert(!game.removeStone(-1, 0));
      assert(!game.removeStone(0, -1));
      assert(!game.removeStone(0, 3));
      assert(!game.removeStone(3, 0));
    });

    it('Game#setStone() - stones are correctly set', () => {
      const game = new Game(3);

      assert(game.setStone(0, 1, Color.Black));
      assert(game.setStone(1, 0, Color.White));
      assert(game.setStone(0, 1, Color.White));
      assert(game.setStone(1, 0, Color.Black));

      deepEqual(game.position.toTwoDimensionalArray(), [
        [Color.E, Color.W, Color.E],
        [Color.B, Color.E, Color.E],
        [Color.E, Color.E, Color.E],
      ]);
    });

    it('Game#addStone() - stones are not set if coordinates are not valid', () => {
      const game = new Game(3);

      assert(!game.setStone(-1, 0, Color.Black));
      assert(!game.setStone(0, -1, Color.White));
      assert(!game.setStone(0, 3, Color.White));
      assert(!game.setStone(3, 0, Color.Black));

      deepEqual(game.position.toTwoDimensionalArray(), [
        [Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E],
      ]);
    });
  });

  describe('Game position stack manipulation', () => {
    it('Game#pushPosition()', () => {
      const game = new Game();
      const position = new Position();

      game.pushPosition(position);
      equal(game.position, position);
    });

    it('Game#popPosition()', () => {
      const game = new Game();
      const initialPosition = game.position;
      const newPosition = new Position();

      game.pushPosition(newPosition);
      equal(game.popPosition(), newPosition);
      equal(game.position, initialPosition);
    });

    it('Game#clear()', () => {
      const game = new Game();
      const initialPosition = game.position;

      game.pushPosition(new Position());
      game.pushPosition(new Position());
      game.clear();

      equal(game.position, initialPosition);
    });
  });

  describe('Utility functions', () => {
    it('Game#isOnBoard()', () => {
      const game = new Game(2);

      assert(game.isOnBoard(0, 0));
      assert(game.isOnBoard(0, 1));
      assert(game.isOnBoard(1, 0));
      assert(game.isOnBoard(1, 1));
      assert(!game.isOnBoard(0, -1));
      assert(!game.isOnBoard(-1, 0));
      assert(!game.isOnBoard(0, 2));
      assert(!game.isOnBoard(2, 0));
    });

    it('Game#hasPositionRepeated() - allow any repeat', () => {
      const game = new Game(9, NO_RULES);

      const position = new Position(9);
      position.set(0, 1, Color.B);

      game.pushPosition(position);

      assert(!game.hasPositionRepeated(position.clone()));
    });

    it('Game#hasPositionRepeated() - disallow repeat of previous position (ko)', () => {
      const game = new Game(9);

      const position = new Position(9);
      position.set(0, 1, Color.B);

      game.pushPosition(position);

      assert(game.hasPositionRepeated(position.clone()));

      const position2 = new Position(9);
      position2.set(1, 0, Color.W);

      game.pushPosition(position2);
      assert(game.hasPositionRepeated(position.clone()));

      const position3 = new Position(9);
      position3.set(1, 1, Color.B);

      game.pushPosition(position3);
      assert(!game.hasPositionRepeated(position.clone()));
    });

    it('Game#hasPositionRepeated() - disallow repeat of any position', () => {
      const game = new Game(9, CHINESE_RULES);

      const position = new Position(9);
      position.set(0, 1, Color.B);

      game.pushPosition(position);

      assert(game.hasPositionRepeated(position.clone()));

      const position2 = new Position(9);
      position2.set(1, 0, Color.W);

      game.pushPosition(position2);
      assert(game.hasPositionRepeated(position.clone()));

      const position3 = new Position(9);
      position3.set(1, 1, Color.B);

      game.pushPosition(position3);
      assert(game.hasPositionRepeated(position.clone()));
    });
  });

  describe('Play and pass', () => {
    it('Basic Game#play() functionality.', () => {
      const game = new Game(9);
      const initialPosition = game.position;

      game.play(4, 4);

      equal(game.getStone(4, 4), Color.Black);
      equal(game.position.get(4, 4), Color.Black);
      equal(initialPosition.get(4, 4), Color.Empty);
      equal(game.turn, Color.White);
      equal(game.position.capCount.black, 0);
      equal(game.position.capCount.white, 0);
    });

    it('Play custom color', () => {
      const game = new Game(9);

      game.turn = Color.White;
      game.play(4, 4);

      equal(game.getStone(4, 4), Color.White);
      equal(game.position.get(4, 4), Color.White);
      equal(game.turn, Color.Black);

      game.play(4, 5);

      equal(game.getStone(4, 5), Color.Black);
      equal(game.position.get(4, 5), Color.Black);
      equal(game.turn, Color.White);

      game.turn = Color.Black;
      game.play(5, 4);

      equal(game.getStone(5, 4), Color.Black);
      equal(game.position.get(5, 4), Color.Black);
      equal(game.turn, Color.White);
    });

    it('Capturing stones', () => {
      const game = new Game(9);

      game.setStone(0, 0, Color.Black);
      game.setStone(0, 1, Color.Black);
      game.setStone(1, 0, Color.Black);
      game.setStone(1, 1, Color.Black);
      game.setStone(0, 2, Color.White);
      game.setStone(1, 2, Color.White);
      game.setStone(2, 0, Color.White);

      game.turn = Color.White;
      game.play(2, 1);

      equal(game.getStone(0, 0), Color.Empty);
      equal(game.getStone(0, 1), Color.Empty);
      equal(game.getStone(1, 0), Color.Empty);
      equal(game.getStone(1, 1), Color.Empty);
      equal(game.getStone(2, 1), Color.White);
      equal(game.position.capCount.black, 0);
      equal(game.position.capCount.white, 4);
    });

    it('Invalid moves', () => {
      const game = new Game(9);
      const position = game.position;

      game.setStone(0, 1, Color.Black);
      game.setStone(1, 0, Color.White);

      assert(!game.play(0, 1));
      assert(!game.play(1, 0));
      assert(!game.play(0, 1));
      assert(!game.play(1, 0));
      assert(!game.play(0, -1));
      assert(!game.play(-1, 0));
      assert(!game.play(0, 9));
      assert(!game.play(9, 0));

      equal(position, game.position);
    });

    it('Disallow suicide', () => {
      const game = new Game(9);
      const position = game.position;

      game.setStone(0, 1, Color.White);
      game.setStone(0, 2, Color.Black);
      game.setStone(1, 0, Color.Black);
      game.setStone(1, 1, Color.Black);

      game.turn = Color.White;
      assert(!game.play(0, 0));
      equal(position, game.position);
    });

    it('Allow suicide in ING rules', () => {
      const game = new Game(9, ING_RULES);

      game.setStone(0, 1, Color.White);
      game.setStone(0, 2, Color.Black);
      game.setStone(1, 0, Color.Black);
      game.setStone(1, 1, Color.Black);

      game.turn = Color.White;
      assert(game.play(0, 0));
      equal(game.capCount.black, 2);
      equal(game.capCount.white, 0);
      equal(game.getStone(0, 0), Color.Empty);
      equal(game.getStone(0, 1), Color.Empty);
    });

    it('Allow rewrite in no rules', () => {
      const game = new Game(9, NO_RULES);

      game.setStone(0, 0, Color.Black);
      game.setStone(1, 0, Color.Black);
      game.setStone(0, 1, Color.White);

      game.turn = Color.White;
      assert(game.play(1, 0));
      equal(game.capCount.black, 0);
      equal(game.capCount.white, 1);
      equal(game.getStone(1, 0), Color.White);

      game.turn = Color.Black;
      assert(game.play(0, 1));
      equal(game.capCount.black, 0);
      equal(game.capCount.white, 1);
      equal(game.getStone(0, 1), Color.Black);
    });

    it('Disallow Ko (repeating of previous position)', () => {
      const game = new Game(9);

      game.setStone(0, 1, Color.Black);
      game.setStone(1, 0, Color.Black);
      game.setStone(2, 1, Color.Black);
      game.setStone(0, 2, Color.White);
      game.setStone(1, 3, Color.White);
      game.setStone(2, 2, Color.White);

      assert(game.play(1, 2)); // creates KO
      assert(game.play(1, 1)); // white captures
      equal(game.capCount.white, 1);
      equal(game.capCount.black, 0);
      equal(game.getStone(1, 2), Color.Empty);
      equal(game.getStone(1, 1), Color.White);

      assert(!game.play(1, 2)); // invalid capture
      assert(game.play(5, 5)); // ko threat
      assert(game.play(6, 6)); // answer
      assert(game.play(1, 2)); // black captures

      equal(game.capCount.white, 1);
      equal(game.capCount.black, 1);
      equal(game.getStone(1, 2), Color.Black);
      equal(game.getStone(1, 1), Color.Empty);
    });

    it('Allow Ko in no rules', () => {
      const game = new Game(9, NO_RULES);

      game.setStone(0, 1, Color.Black);
      game.setStone(1, 0, Color.Black);
      game.setStone(2, 1, Color.Black);
      game.setStone(0, 2, Color.White);
      game.setStone(1, 3, Color.White);
      game.setStone(2, 2, Color.White);

      assert(game.play(1, 2)); // creates KO
      assert(game.play(1, 1)); // white captures
      equal(game.capCount.white, 1);
      equal(game.capCount.black, 0);
      equal(game.getStone(1, 2), Color.Empty);
      equal(game.getStone(1, 1), Color.White);

      assert(game.play(1, 2)); // capture allowed

      equal(game.capCount.white, 1);
      equal(game.capCount.black, 1);
      equal(game.getStone(1, 2), Color.Black);
      equal(game.getStone(1, 1), Color.Empty);
    });

    it('Disallow Triple Ko (repeating of any position) in Chinese rules', () => {
      const game = new Game(9, CHINESE_RULES);

      game.setStone(0, 1, Color.Black);
      game.setStone(1, 0, Color.Black);
      game.setStone(2, 1, Color.Black);
      game.setStone(0, 2, Color.White);
      game.setStone(1, 3, Color.White);
      game.setStone(2, 2, Color.White);
      game.setStone(1, 2, Color.Black);

      game.setStone(3, 1, Color.Black);
      game.setStone(4, 0, Color.Black);
      game.setStone(5, 1, Color.Black);
      game.setStone(3, 2, Color.White);
      game.setStone(4, 3, Color.White);
      game.setStone(5, 2, Color.White);
      game.setStone(4, 1, Color.White);

      game.setStone(6, 1, Color.Black);
      game.setStone(7, 0, Color.Black);
      game.setStone(8, 1, Color.Black);
      game.setStone(6, 2, Color.White);
      game.setStone(7, 3, Color.White);
      game.setStone(8, 2, Color.White);
      game.setStone(7, 1, Color.White);

      assert(game.play(4, 2)); // black captures 2nd ko
      assert(game.play(1, 1)); // white captures 1st ko
      assert(game.play(7, 2)); // black captures 3rd ko
      assert(game.play(4, 1)); // white captures 2nd ko
      assert(game.play(1, 2)); // black captures 1st ko
      assert(!game.play(7, 1)); // white captures 3rd ko - invalid

      assert(game.play(5, 5)); // ko threat
      assert(game.play(6, 6)); // answer
      assert(game.play(7, 1)); // correct
    });

    it('Allow Triple Ko (repeating of any position) in Japanese rules', () => {
      const game = new Game(9);

      game.setStone(0, 1, Color.Black);
      game.setStone(1, 0, Color.Black);
      game.setStone(2, 1, Color.Black);
      game.setStone(0, 2, Color.White);
      game.setStone(1, 3, Color.White);
      game.setStone(2, 2, Color.White);
      game.setStone(1, 2, Color.Black);

      game.setStone(3, 1, Color.Black);
      game.setStone(4, 0, Color.Black);
      game.setStone(5, 1, Color.Black);
      game.setStone(3, 2, Color.White);
      game.setStone(4, 3, Color.White);
      game.setStone(5, 2, Color.White);
      game.setStone(4, 1, Color.White);

      game.setStone(6, 1, Color.Black);
      game.setStone(7, 0, Color.Black);
      game.setStone(8, 1, Color.Black);
      game.setStone(6, 2, Color.White);
      game.setStone(7, 3, Color.White);
      game.setStone(8, 2, Color.White);
      game.setStone(7, 1, Color.White);

      assert(game.play(4, 2)); // black captures 2nd ko
      assert(game.play(1, 1)); // white captures 1st ko
      assert(game.play(7, 2)); // black captures 3rd ko
      assert(game.play(4, 1)); // white captures 2nd ko
      assert(game.play(1, 2)); // black captures 1st ko
      assert(game.play(7, 1)); // white captures 3rd ko - valid
    });

    it('Game#pass()', () => {
      const game = new Game(9);
      const initialPosition = game.position;

      game.pass();

      deepEqual(initialPosition.toTwoDimensionalArray(), game.position.toTwoDimensionalArray());
      equal(game.turn, Color.White);
      equal(game.position.capCount.black, 0);
      equal(game.position.capCount.white, 0);

      game.pass(Color.Black);
      equal(game.turn, Color.White);

      game.pass();
      equal(game.turn, Color.Black);

      game.pass(Color.White);
      equal(game.turn, Color.Black);

      deepEqual(initialPosition.toTwoDimensionalArray(), game.position.toTwoDimensionalArray());
    });
  });
});
