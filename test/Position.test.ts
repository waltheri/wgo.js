import { strict as assert, deepStrictEqual, notStrictEqual, strictEqual, throws } from 'assert';
import { Position } from '../src/game';
import { Color } from '../src/types';

describe('Position object', () => {
  describe('New position', () => {
    it('Creates default empty position (19x19)', () => {
      const position = new Position();

      strictEqual(position.cols, 19);
      strictEqual(position.rows, 19);

      assert(position.has(18, 18));
      assert(!position.has(18, 19));
      assert(!position.has(19, 18));

      assert(position.has(0, 0));
      assert(!position.has(0, -1));
      assert(!position.has(-1, 0));
    });

    it('Creates custom square position', () => {
      const position = new Position(9);

      strictEqual(position.cols, 9);
      strictEqual(position.rows, 9);

      assert(position.has(8, 8));
      assert(!position.has(8, 9));
      assert(!position.has(9, 8));
    });

    it('Creates custom rectangular position', () => {
      const position = new Position(9, 19);

      strictEqual(position.cols, 9);
      strictEqual(position.rows, 19);

      assert(position.has(8, 18));
      assert(!position.has(8, 19));
      assert(!position.has(9, 18));
    });
  });

  describe('Position#get() & Position#set()', () => {
    it('Basic getting and setting fields/stones', () => {
      const position = new Position(9);

      strictEqual(position.get(0, 0), Color.Empty);
      strictEqual(position.get(0, 1), Color.Empty);
      strictEqual(position.get(1, 0), Color.Empty);
      strictEqual(position.get(1, 1), Color.Empty);

      position.set(0, 0, Color.Black);
      position.set(0, 1, Color.Black);
      position.set(1, 0, Color.White);
      position.set(1, 1, Color.White);

      strictEqual(position.get(0, 0), Color.Black);
      strictEqual(position.get(0, 1), Color.Black);
      strictEqual(position.get(1, 0), Color.White);
      strictEqual(position.get(1, 1), Color.White);

      position.set(0, 0, Color.Empty);
      position.set(0, 1, Color.White);
      position.set(1, 0, Color.Black);
      position.set(1, 1, Color.Empty);

      strictEqual(position.get(0, 0), Color.Empty);
      strictEqual(position.get(0, 1), Color.White);
      strictEqual(position.get(1, 0), Color.Black);
      strictEqual(position.get(1, 1), Color.Empty);
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
        position.set(0, -1, Color.White);
      });
      throws(() => {
        position.set(-1, 0, Color.Black);
      });
      throws(() => {
        position.set(0, 9, Color.Empty);
      });
      throws(() => {
        position.set(9, 0, Color.White);
      });
    });
  });

  describe('Position#clone()', () => {
    it('Clones empty position', () => {
      const position = new Position(9);
      const cloned = position.clone();
      notStrictEqual(position, cloned);
      deepStrictEqual(position, cloned);
    });

    it('Clones position with all moves', () => {
      const position = new Position(3);

      position.set(0, 0, Color.Black);
      position.set(0, 1, Color.White);
      position.set(1, 1, Color.Black);
      position.set(1, 2, Color.White);
      position.set(2, 0, Color.White);
      position.set(2, 2, Color.Black);

      const cloned = position.clone();

      deepStrictEqual(position, cloned);

      cloned.set(0, 0, Color.White);
      strictEqual(cloned.get(0, 0), Color.White);
      strictEqual(position.get(0, 0), Color.Black);
    });
  });

  describe('Position#compare()', () => {
    it('Cloned positions are the same', () => {
      const position = new Position(19);
      position.set(10, 10, Color.Black);
      assert(position.equals(position.clone()));
    });

    it('Different positions are not the same', () => {
      const position = new Position(3);
      position.set(0, 0, Color.Black);

      const cloned = position.clone();
      cloned.set(1, 0, Color.Black);

      assert(!position.equals(cloned));
    });

    it('Different sizes are not the same', () => {
      const position = new Position(19);
      const position2 = new Position(13);

      assert(!position.equals(position2));
    });
  });

  describe('Position#hasLiberties()', () => {
    it('One lonely stone has liberties', () => {
      const position = new Position(9);
      position.set(0, 0, Color.Black);
      position.set(0, 8, Color.White);
      position.set(8, 0, Color.Black);
      position.set(8, 8, Color.White);
      position.set(4, 4, Color.Black);

      assert(position.hasLiberties(0, 0));
      assert(position.hasLiberties(0, 8));
      assert(position.hasLiberties(8, 0));
      assert(position.hasLiberties(8, 8));
      assert(position.hasLiberties(4, 4));
    });

    it("Surrounded stone doesn't have liberties", () => {
      const position = new Position(9);
      position.set(0, 0, Color.Black);
      position.set(1, 0, Color.White);
      position.set(0, 1, Color.White);

      position.set(0, 8, Color.White);
      position.set(1, 8, Color.Black);
      position.set(0, 7, Color.Black);

      position.set(8, 0, Color.Black);
      position.set(8, 1, Color.White);
      position.set(7, 0, Color.White);

      position.set(8, 8, Color.White);
      position.set(7, 8, Color.Black);
      position.set(8, 7, Color.Black);

      position.set(4, 4, Color.Black);
      position.set(3, 4, Color.White);
      position.set(5, 4, Color.White);
      position.set(4, 3, Color.White);
      position.set(4, 5, Color.White);

      assert(!position.hasLiberties(0, 0));
      assert(!position.hasLiberties(0, 8));
      assert(!position.hasLiberties(8, 0));
      assert(!position.hasLiberties(8, 8));
      assert(!position.hasLiberties(4, 4));
    });

    it('Group of stones with liberty', () => {
      const position = new Position(9, 13);
      position.set(0, 0, Color.Black);
      position.set(0, 1, Color.Black);
      position.set(0, 2, Color.Black);
      position.set(1, 2, Color.Black);
      position.set(2, 2, Color.Black);

      position.set(1, 1, Color.White);
      position.set(2, 1, Color.White);
      position.set(3, 2, Color.White);
      position.set(2, 3, Color.White);
      position.set(1, 3, Color.White);
      position.set(0, 3, Color.White);

      assert(position.hasLiberties(2, 2));
    });

    it('Group of stones without liberty', () => {
      const position = new Position(9);
      position.set(0, 0, Color.Black);
      position.set(0, 1, Color.Black);
      position.set(0, 2, Color.Black);
      position.set(1, 2, Color.Black);
      position.set(2, 2, Color.Black);

      position.set(1, 0, Color.White);
      position.set(1, 1, Color.White);
      position.set(2, 1, Color.White);
      position.set(3, 2, Color.White);
      position.set(2, 3, Color.White);
      position.set(1, 3, Color.White);
      position.set(0, 3, Color.White);

      assert(!position.hasLiberties(2, 2));
    });
  });

  describe('Position#removeChain()', () => {
    it('Test removing of all stones', () => {
      const position = new Position(3);

      position.set(0, 0, Color.Black);
      position.set(0, 1, Color.Black);
      position.set(0, 2, Color.Black);
      position.set(1, 0, Color.Black);
      position.set(1, 1, Color.Black);
      position.set(1, 2, Color.Black);
      position.set(2, 0, Color.Black);
      position.set(2, 1, Color.Black);
      position.set(2, 2, Color.Black);

      strictEqual(position.removeChain(1, 1), 9);

      strictEqual(position.get(0, 0), Color.Empty);
      strictEqual(position.get(0, 1), Color.Empty);
      strictEqual(position.get(0, 2), Color.Empty);
      strictEqual(position.get(1, 0), Color.Empty);
      strictEqual(position.get(1, 1), Color.Empty);
      strictEqual(position.get(1, 2), Color.Empty);
      strictEqual(position.get(2, 0), Color.Empty);
      strictEqual(position.get(2, 1), Color.Empty);
      strictEqual(position.get(2, 2), Color.Empty);
    });

    it('Group of stones is correctly captured', () => {
      const position = new Position(9);
      position.set(0, 0, Color.Black);
      position.set(0, 1, Color.Black);
      position.set(0, 2, Color.Black);
      position.set(1, 2, Color.Black);
      position.set(2, 2, Color.Black);

      position.set(2, 0, Color.Black);
      position.set(3, 1, Color.Black);
      position.set(3, 3, Color.Black);

      position.set(1, 1, Color.White);
      position.set(2, 1, Color.White);
      position.set(3, 2, Color.White);
      position.set(2, 3, Color.White);
      position.set(1, 3, Color.White);
      position.set(0, 3, Color.White);

      strictEqual(position.removeChain(2, 2), 5);

      strictEqual(position.get(0, 0), Color.Empty);
      strictEqual(position.get(0, 1), Color.Empty);
      strictEqual(position.get(0, 2), Color.Empty);
      strictEqual(position.get(1, 2), Color.Empty);
      strictEqual(position.get(2, 2), Color.Empty);

      strictEqual(position.get(2, 0), Color.Black);
      strictEqual(position.get(3, 1), Color.Black);
      strictEqual(position.get(3, 3), Color.Black);

      strictEqual(position.get(1, 1), Color.White);
      strictEqual(position.get(2, 1), Color.White);
      strictEqual(position.get(3, 2), Color.White);
      strictEqual(position.get(2, 3), Color.White);
      strictEqual(position.get(1, 3), Color.White);
      strictEqual(position.get(0, 3), Color.White);
    });
  });
});
