import { deepEqual, strict as assert, notEqual, equal, throws } from 'assert';
import Position from '../src/Game/Position';
import { Color } from '../src/types';

describe('Position object', () => {
  describe('Constructor', () => {
    it('Creates empty position', () => {
      const position = new Position(9);

      assert(position.size === 9);
      assert(position.capCount.black === 0);
      assert(position.capCount.white === 0);
      assert(position.turn === Color.BLACK);
    });
  });

  describe('Position#isOnPosition()', () => {
    it('Checking works', () => {
      const position = new Position(9);
      assert(position.isOnPosition(0, 0));
      assert(position.isOnPosition(0, 8));
      assert(position.isOnPosition(8, 0));
      assert(position.isOnPosition(8, 8));
      assert(!position.isOnPosition(0, -1));
      assert(!position.isOnPosition(-1, 0));
      assert(!position.isOnPosition(0, 9));
      assert(!position.isOnPosition(9, 0));
    });
  });

  describe('Position#get() & Position#set()', () => {
    it('Basic getting and setting fields/stones', () => {
      const position = new Position(9);

      equal(position.get(0, 0), Color.EMPTY);
      equal(position.get(0, 1), Color.EMPTY);
      equal(position.get(1, 0), Color.EMPTY);
      equal(position.get(1, 1), Color.EMPTY);

      position.set(0, 0, Color.BLACK);
      position.set(0, 1, Color.BLACK);
      position.set(1, 0, Color.WHITE);
      position.set(1, 1, Color.WHITE);

      equal(position.get(0, 0), Color.BLACK);
      equal(position.get(0, 1), Color.BLACK);
      equal(position.get(1, 0), Color.WHITE);
      equal(position.get(1, 1), Color.WHITE);

      position.set(0, 0, Color.EMPTY);
      position.set(0, 1, Color.WHITE);
      position.set(1, 0, Color.BLACK);
      position.set(1, 1, Color.EMPTY);

      equal(position.get(0, 0), Color.EMPTY);
      equal(position.get(0, 1), Color.WHITE);
      equal(position.get(1, 0), Color.BLACK);
      equal(position.get(1, 1), Color.EMPTY);
    });

    it('Convert to two dimensional array', () => {
      const position = new Position(9);

      position.set(0, 1, Color.BLACK);
      position.set(1, 0, Color.WHITE);

      deepEqual(position.toTwoDimensionalArray(), [
        [Color.E, Color.B, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.W, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
      ]);
    });

    it('Returns undefined/null when accessing field outside of the position.', () => {
      const position = new Position(9);

      assert(position.get(0, -1) == null);
      assert(position.get(-1, 0) == null);
      assert(position.get(0, 9) == null);
      assert(position.get(9, 0) == null);
    });

    it('Throws error, when setting field outside of the position.', () => {
      const position = new Position(9);

      throws(() => {
        position.set(0, -1, Color.WHITE);
      });
      throws(() => {
        position.set(-1, 0, Color.BLACK);
      });
      throws(() => {
        position.set(0, 9, Color.EMPTY);
      });
      throws(() => {
        position.set(9, 0, Color.WHITE);
      });
    });
  });

  describe('Position#clone()', () => {
    it('Clones empty position', () => {
      const position = new Position(9);
      const cloned = position.clone();
      notEqual(position, cloned);
      deepEqual(position, cloned);
    });
    it('Clones position with all moves', () => {
      const position = new Position(3);

      position.set(0, 0, Color.BLACK);
      position.set(0, 1, Color.WHITE);
      position.set(1, 1, Color.BLACK);
      position.set(1, 2, Color.WHITE);
      position.set(2, 0, Color.WHITE);
      position.set(2, 2, Color.BLACK);
      position.capCount.black = 1;
      position.capCount.white = 2;
      position.turn = Color.WHITE;

      const cloned = position.clone();

      deepEqual(position, cloned);
    });
  });

  describe('Position#compare()', () => {
    it('Cloned positions are the same', () => {
      const position = new Position(19);
      position.set(10, 10, Color.BLACK);
      const changes = position.compare(position.clone());
      assert(Array.isArray(changes));
      deepEqual(changes, []);
    });
    it('Returns correct array of changes', () => {
      const position = new Position(3);
      position.set(0, 0, Color.BLACK);
      position.set(0, 1, Color.WHITE);
      position.set(1, 1, Color.BLACK);
      position.set(1, 2, Color.WHITE);
      position.set(2, 0, Color.WHITE);
      position.set(2, 2, Color.BLACK);

      const cloned = position.clone();
      cloned.set(1, 0, Color.BLACK);
      cloned.set(1, 1, Color.EMPTY);
      cloned.set(1, 2, Color.EMPTY);
      cloned.set(2, 0, Color.BLACK);
      cloned.set(2, 1, Color.WHITE);
      cloned.set(2, 2, Color.WHITE);

      deepEqual(position.compare(cloned), [
        { x: 1, y: 0, c: Color.B },
        { x: 1, y: 1, c: Color.E },
        { x: 1, y: 2, c: Color.E },
        { x: 2, y: 0, c: Color.B },
        { x: 2, y: 1, c: Color.W },
        { x: 2, y: 2, c: Color.W },
      ]);

      deepEqual(cloned.compare(position), [
        { x: 1, y: 0, c: Color.E },
        { x: 1, y: 1, c: Color.B },
        { x: 1, y: 2, c: Color.W },
        { x: 2, y: 0, c: Color.W },
        { x: 2, y: 1, c: Color.E },
        { x: 2, y: 2, c: Color.B },
      ]);
    });
    it('Throws error, when comparing positions of different sizes.', () => {
      const position = new Position(9);
      const position2 = new Position(13);

      throws(() => {
        position.compare(position2);
      });
      throws(() => {
        position2.compare(position);
      });
    });
  });

  describe('Position#play()', () => {
    it('Moves are correctly added, if they are valid', () => {
      const position = new Position(9);

      assert(position.applyMove(0, 0));
      equal(position.get(0, 0), Color.BLACK);
      equal(position.turn, Color.WHITE);

      assert(position.applyMove(0, 1));
      equal(position.get(0, 1), Color.WHITE);
      equal(position.turn, Color.BLACK);
    });

    it('False is returned when moves are invalid', () => {
      const position = new Position(9);
      position.set(0, 0, Color.BLACK);
      position.set(0, 1, Color.WHITE);

      assert(!position.applyMove(0, 0, Color.WHITE));
      assert(!position.applyMove(0, 0, Color.BLACK));
      assert(!position.applyMove(0, 1, Color.WHITE));
      assert(!position.applyMove(0, 1, Color.BLACK));
      assert(!position.applyMove(-1, 0, Color.WHITE));
      assert(!position.applyMove(0, -1, Color.BLACK));
      assert(!position.applyMove(9, 0, Color.WHITE));
      assert(!position.applyMove(0, 9, Color.BLACK));
      equal(position.turn, Color.BLACK);
    });

    it('Stone in the middle is correctly captured', () => {
      const position = new Position(9);
      position.set(4, 4, Color.BLACK);
      position.set(4, 3, Color.WHITE);
      position.set(4, 5, Color.WHITE);
      position.set(3, 4, Color.WHITE);

      assert(position.applyMove(5, 4, Color.WHITE));
      equal(position.get(5, 4), Color.WHITE);
      equal(position.get(4, 4), Color.EMPTY);
      equal(position.turn, Color.BLACK);
      equal(position.capCount.white, 1);
      equal(position.capCount.black, 0);
    });

    it('Stone on the sides/corners is correctly captured', () => {
      const position = new Position(9);
      position.set(0, 0, Color.BLACK);
      position.set(0, 1, Color.WHITE);
      position.set(8, 8, Color.WHITE);
      position.set(8, 7, Color.BLACK);

      assert(position.applyMove(1, 0, Color.WHITE));
      equal(position.get(0, 0), Color.EMPTY);
      equal(position.capCount.white, 1);

      assert(position.applyMove(7, 8, Color.BLACK));
      equal(position.get(8, 8), Color.EMPTY);
      equal(position.capCount.black, 1);
    });

    it('Group of stones is correctly captured', () => {
      const position = new Position(5);
      position.set(0, 0, Color.WHITE);
      position.set(0, 1, Color.WHITE);
      position.set(1, 0, Color.WHITE);
      position.set(1, 1, Color.WHITE);
      position.set(1, 2, Color.WHITE);
      position.set(2, 1, Color.WHITE);
      position.set(2, 2, Color.WHITE);
      position.set(0, 2, Color.BLACK);
      position.set(2, 0, Color.BLACK);
      position.set(3, 1, Color.BLACK);
      position.set(1, 3, Color.BLACK);
      position.set(3, 2, Color.BLACK);

      assert(position.applyMove(2, 3, Color.BLACK));
      equal(position.capCount.black, 7);
      deepEqual(position.toTwoDimensionalArray(), [
        [Color.E, Color.E, Color.B, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.B, Color.E],
        [Color.B, Color.E, Color.E, Color.B, Color.E],
        [Color.E, Color.B, Color.B, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E],
      ]);
    });

    it('Suicide of one stone is invalid.', () => {
      const position = new Position(3);
      position.set(0, 1, Color.WHITE);
      position.set(1, 0, Color.WHITE);
      position.set(1, 2, Color.WHITE);
      position.set(2, 1, Color.WHITE);

      assert(!position.applyMove(0, 0, Color.BLACK));
      assert(!position.applyMove(1, 1, Color.BLACK));
      assert(!position.applyMove(2, 2, Color.BLACK));
      assert(!position.applyMove(0, 2, Color.BLACK));
      assert(!position.applyMove(2, 0, Color.BLACK));
    });

    it('Suicide of multiple stones is invalid.', () => {
      const position = new Position(5);
      position.set(0, 0, Color.WHITE);
      position.set(0, 1, Color.WHITE);
      position.set(1, 0, Color.WHITE);
      position.set(1, 1, Color.WHITE);
      position.set(1, 2, Color.WHITE);
      position.set(2, 1, Color.WHITE);
      position.set(0, 2, Color.BLACK);
      position.set(2, 0, Color.BLACK);
      position.set(3, 1, Color.BLACK);
      position.set(1, 3, Color.BLACK);
      position.set(3, 2, Color.BLACK);
      position.set(2, 3, Color.BLACK);

      assert(!position.applyMove(2, 2, Color.WHITE));
    });

    it('Ko is allowed.', () => {
      const position = new Position(9);
      position.set(2, 2, Color.WHITE);
      position.set(1, 3, Color.WHITE);
      position.set(3, 3, Color.WHITE);
      position.set(2, 4, Color.WHITE);
      position.set(2, 5, Color.BLACK);
      position.set(1, 4, Color.BLACK);
      position.set(3, 4, Color.BLACK);

      assert(position.applyMove(2, 3, Color.BLACK));
      equal(position.get(2, 3), Color.BLACK);
      equal(position.get(2, 4), Color.EMPTY);
      equal(position.capCount.black, 1);
      equal(position.capCount.white, 0);

      assert(position.applyMove(2, 4, Color.WHITE));
      equal(position.get(2, 3), Color.EMPTY);
      equal(position.get(2, 4), Color.WHITE);
      equal(position.capCount.black, 1);
      equal(position.capCount.white, 1);
    });

    it('When suicide is allowed capture the stones.', () => {
      const position = new Position(5);
      position.set(0, 0, Color.WHITE);
      position.set(0, 1, Color.WHITE);
      position.set(1, 0, Color.WHITE);
      position.set(1, 1, Color.WHITE);
      position.set(1, 2, Color.WHITE);
      position.set(2, 1, Color.WHITE);
      position.set(0, 2, Color.BLACK);
      position.set(2, 0, Color.BLACK);
      position.set(3, 1, Color.BLACK);
      position.set(1, 3, Color.BLACK);
      position.set(3, 2, Color.BLACK);
      position.set(2, 3, Color.BLACK);

      assert(position.applyMove(2, 2, Color.WHITE, true));
      equal(position.capCount.black, 7);
      equal(position.turn, Color.BLACK);
      deepEqual(position.toTwoDimensionalArray(), [
        [Color.E, Color.E, Color.B, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.B, Color.E],
        [Color.B, Color.E, Color.E, Color.B, Color.E],
        [Color.E, Color.B, Color.B, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E],
      ]);
    });
  });

  describe('getValidatedPosition()', () => {
    it('Stones without liberties will be captured.', () => {
      const position = new Position(5);
      position.set(0, 0, Color.WHITE);
      position.set(0, 1, Color.WHITE);
      position.set(1, 0, Color.WHITE);
      position.set(1, 1, Color.WHITE);
      position.set(1, 2, Color.WHITE);
      position.set(2, 1, Color.WHITE);
      position.set(2, 2, Color.WHITE);
      position.set(0, 2, Color.BLACK);
      position.set(2, 0, Color.BLACK);
      position.set(3, 1, Color.BLACK);
      position.set(1, 3, Color.BLACK);
      position.set(3, 2, Color.BLACK);
      position.set(2, 3, Color.BLACK);

      position.validatePosition();

      equal(position.capCount.black, 7);
      deepEqual(position.toTwoDimensionalArray(), [
        [Color.E, Color.E, Color.B, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.B, Color.E],
        [Color.B, Color.E, Color.E, Color.B, Color.E],
        [Color.E, Color.B, Color.B, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E],
      ]);
    });

    it('Only first stones without liberties will be captured.', () => {
      const position = new Position(5);
      position.set(0, 0, Color.WHITE);
      position.set(0, 1, Color.BLACK);
      position.set(0, 2, Color.WHITE);
      position.set(1, 0, Color.BLACK);
      position.set(1, 1, Color.WHITE);
      position.set(1, 2, Color.BLACK);

      position.validatePosition();

      equal(position.capCount.black, 1);
      deepEqual(position.toTwoDimensionalArray(), [
        [Color.E, Color.B, Color.W, Color.E, Color.E],
        [Color.B, Color.W, Color.B, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E],
      ]);
    });
  });
});

/*import { deepEqual, strict as assert, notEqual, equal } from 'assert';
import {
  createPosition,
  clonePosition,
  comparePositions,
  applyMove,
  getValidatedPosition,
} from '../src/Game/position';
import { Color } from '../src/types';

describe('Position manipulation and utility functions', () => {
  describe('createPosition()', () => {
    it('Creates empty position', () => {
      const position = createPosition(9);
      deepEqual(position, [
        [Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E, Color.E],
      ]);
    });
  });

  describe('clonePosition()', () => {
    it('Clones empty position', () => {
      const position = createPosition(19);
      deepEqual(clonePosition(position), createPosition(19));
    });
    it('Clones position with all moves', () => {
      const position = createPosition(3);
      position[0][0] = Color.BLACK;
      position[0][1] = Color.WHITE;
      position[1][1] = Color.BLACK;
      position[1][2] = Color.WHITE;
      position[2][0] = Color.WHITE;
      position[2][2] = Color.BLACK;
      const cloned = clonePosition(position);
      notEqual(position, cloned);
      deepEqual(position, cloned);
      deepEqual(cloned, [
        [Color.B, Color.W, Color.E],
        [Color.E, Color.B, Color.W],
        [Color.W, Color.E, Color.B],
      ]);
    });
  });

  describe('comparePositions()', () => {
    it('Cloned positions are the same', () => {
      const position = createPosition(19);
      position[10][10] = Color.BLACK;
      const changes = comparePositions(clonePosition(position), position);
      assert(Array.isArray(changes));
      deepEqual(changes, []);
    });
    it('Cloned positions are the same', () => {
      const position = createPosition(19);
      position[10][10] = Color.BLACK;
      const changes = comparePositions(clonePosition(position), position);
      assert(Array.isArray(changes));
      deepEqual(changes, []);
    });
    it('Returns correct array of changes', () => {
      const position = createPosition(3);
      position[0][0] = Color.BLACK;
      position[0][1] = Color.WHITE;

      position[1][1] = Color.BLACK;
      position[1][2] = Color.WHITE;
      position[2][0] = Color.WHITE;
      position[2][2] = Color.BLACK;

      const cloned = clonePosition(position);
      cloned[1][0] = Color.BLACK;
      cloned[1][1] = Color.EMPTY;
      cloned[1][2] = Color.EMPTY;
      cloned[2][0] = Color.BLACK;
      cloned[2][1] = Color.WHITE;
      cloned[2][2] = Color.WHITE;

      deepEqual(comparePositions(position, cloned), [
        { x: 1, y: 0, c: Color.B },
        { x: 1, y: 1, c: Color.E },
        { x: 1, y: 2, c: Color.E },
        { x: 2, y: 0, c: Color.B },
        { x: 2, y: 1, c: Color.W },
        { x: 2, y: 2, c: Color.W },
      ]);

      deepEqual(comparePositions(cloned, position), [
        { x: 1, y: 0, c: Color.E },
        { x: 1, y: 1, c: Color.B },
        { x: 1, y: 2, c: Color.W },
        { x: 2, y: 0, c: Color.W },
        { x: 2, y: 1, c: Color.E },
        { x: 2, y: 2, c: Color.B },
      ]);
    });
  });

  describe('applyMove()', () => {
    it('Moves are correctly added, if they are valid', () => {
      const position = createPosition(9);
      const position2 = applyMove(position, 0, 0, Color.BLACK);
      const position3 = applyMove(position2, 0, 1, Color.WHITE);
      position[0][0] = Color.BLACK;
      position[0][1] = Color.WHITE;

      deepEqual(position, position3);
      notEqual(position, position3);
    });

    it('Null is returned when moves are invalid', () => {
      const position = createPosition(9);
      position[0][0] = Color.BLACK;
      position[0][1] = Color.WHITE;

      assert(applyMove(position, 0, 0, Color.WHITE) == null);
      assert(applyMove(position, 0, 0, Color.BLACK) == null);
      assert(applyMove(position, 0, 1, Color.WHITE) == null);
      assert(applyMove(position, 0, 1, Color.BLACK) == null);
      assert(applyMove(position, -1, 0, Color.WHITE) == null);
      assert(applyMove(position, 0, -1, Color.BLACK) == null);
      assert(applyMove(position, 9, 0, Color.WHITE) == null);
      assert(applyMove(position, 0, 9, Color.BLACK) == null);
    });

    it('Stone in the middle is correctly captured', () => {
      const position = createPosition(9);
      position[4][4] = Color.BLACK;
      position[4][3] = Color.WHITE;
      position[4][5] = Color.WHITE;
      position[3][4] = Color.WHITE;

      const newPosition = applyMove(position, 5, 4, Color.WHITE);
      assert(newPosition[5][4] === Color.WHITE);
      assert(newPosition[4][4] === Color.EMPTY);
    });

    it('Stone on the sides/corners is correctly captured', () => {
      const position = createPosition(9);
      position[0][0] = Color.BLACK;
      position[0][1] = Color.WHITE;
      position[8][8] = Color.WHITE;
      position[8][7] = Color.BLACK;

      const newPosition = applyMove(position, 1, 0, Color.WHITE);
      assert(newPosition[0][0] === Color.EMPTY);

      const newPosition2 = applyMove(position, 7, 8, Color.BLACK);
      assert(newPosition2[8][8] === Color.EMPTY);
    });

    it('Group of stones is correctly captured', () => {
      const position = createPosition(5);
      position[0][0] = Color.WHITE;
      position[0][1] = Color.WHITE;
      position[1][0] = Color.WHITE;
      position[1][1] = Color.WHITE;
      position[1][2] = Color.WHITE;
      position[2][1] = Color.WHITE;
      position[2][2] = Color.WHITE;

      position[0][2] = Color.BLACK;
      position[2][0] = Color.BLACK;
      position[3][1] = Color.BLACK;
      position[1][3] = Color.BLACK;
      position[3][2] = Color.BLACK;

      const newPosition = applyMove(position, 2, 3, Color.BLACK);

      deepEqual(newPosition, [
        [Color.E, Color.E, Color.B, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.B, Color.E],
        [Color.B, Color.E, Color.E, Color.B, Color.E],
        [Color.E, Color.B, Color.B, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E],
      ]);
    });

    it('Suicide of one stone is invalid.', () => {
      const position = createPosition(3);
      position[0][1] = Color.WHITE;
      position[1][0] = Color.WHITE;
      position[1][2] = Color.WHITE;
      position[2][1] = Color.WHITE;

      equal(applyMove(position, 0, 0, Color.BLACK), null);
      equal(applyMove(position, 1, 1, Color.BLACK), null);
      equal(applyMove(position, 2, 2, Color.BLACK), null);
      equal(applyMove(position, 0, 2, Color.BLACK), null);
      equal(applyMove(position, 2, 0, Color.BLACK), null);
    });

    it('Suicide of multiple stones is invalid.', () => {
      const position = createPosition(5);
      position[0][0] = Color.WHITE;
      position[0][1] = Color.WHITE;
      position[1][0] = Color.WHITE;
      position[1][1] = Color.WHITE;
      position[1][2] = Color.WHITE;
      position[2][1] = Color.WHITE;

      position[0][2] = Color.BLACK;
      position[2][0] = Color.BLACK;
      position[3][1] = Color.BLACK;
      position[1][3] = Color.BLACK;
      position[3][2] = Color.BLACK;
      position[2][3] = Color.BLACK;

      equal(applyMove(position, 2, 2, Color.WHITE), null);
    });

    it('Ko is allowed.', () => {
      const position = createPosition(9);
      position[2][2] = Color.WHITE;
      position[1][3] = Color.WHITE;
      position[3][3] = Color.WHITE;
      position[2][4] = Color.WHITE;

      position[2][5] = Color.BLACK;
      position[1][4] = Color.BLACK;
      position[3][4] = Color.BLACK;

      const newPosition = applyMove(position, 2, 3, Color.BLACK);

      equal(newPosition[2][3], Color.BLACK);
      equal(newPosition[2][4], Color.EMPTY);

      const newPosition2 = applyMove(newPosition, 2, 4, Color.WHITE);

      deepEqual(position, newPosition2);
    });

    it('When suicide is allowed capture the stones.', () => {
      const position = createPosition(5);
      position[0][0] = Color.WHITE;
      position[0][1] = Color.WHITE;
      position[1][0] = Color.WHITE;
      position[1][1] = Color.WHITE;
      position[1][2] = Color.WHITE;
      position[2][1] = Color.WHITE;

      position[0][2] = Color.BLACK;
      position[2][0] = Color.BLACK;
      position[3][1] = Color.BLACK;
      position[1][3] = Color.BLACK;
      position[3][2] = Color.BLACK;
      position[2][3] = Color.BLACK;

      const newPosition = applyMove(position, 2, 2, Color.WHITE, true);
      deepEqual(newPosition, [
        [Color.E, Color.E, Color.B, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.B, Color.E],
        [Color.B, Color.E, Color.E, Color.B, Color.E],
        [Color.E, Color.B, Color.B, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E],
      ]);
    });
  });

  describe('getValidatedPosition()', () => {
    it('Stones without liberties will be captured.', () => {
      const position = createPosition(5);
      position[0][0] = Color.WHITE;
      position[0][1] = Color.WHITE;
      position[1][0] = Color.WHITE;
      position[1][1] = Color.WHITE;
      position[1][2] = Color.WHITE;
      position[2][1] = Color.WHITE;
      position[2][2] = Color.WHITE;

      position[0][2] = Color.BLACK;
      position[2][0] = Color.BLACK;
      position[3][1] = Color.BLACK;
      position[1][3] = Color.BLACK;
      position[3][2] = Color.BLACK;
      position[2][3] = Color.BLACK;

      const newPosition = getValidatedPosition(position);
      deepEqual(newPosition, [
        [Color.E, Color.E, Color.B, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.B, Color.E],
        [Color.B, Color.E, Color.E, Color.B, Color.E],
        [Color.E, Color.B, Color.B, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E],
      ]);
    });

    it('Only first stones without liberties will be captured.', () => {
      const position = createPosition(5);
      position[0][0] = Color.WHITE;
      position[0][1] = Color.BLACK;
      position[0][2] = Color.WHITE;
      position[1][0] = Color.BLACK;
      position[1][1] = Color.WHITE;
      position[1][2] = Color.BLACK;

      const newPosition = getValidatedPosition(position);

      deepEqual(newPosition, [
        [Color.E, Color.B, Color.W, Color.E, Color.E],
        [Color.B, Color.W, Color.B, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E],
        [Color.E, Color.E, Color.E, Color.E, Color.E],
      ]);
    });
  });
});*/
