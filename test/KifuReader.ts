import { strictEqual, deepEqual, throws, equal, ok as assert } from 'assert';
import { Color } from '../src/types';
import KifuNode from '../src/kifu/KifuNode';
import KifuReader from '../src/kifu/KifuReader';
import { SGFSyntaxError } from '../src/SGFParser';
import propertyValueTypes from '../src/kifu/propertyValueTypes';
import { JAPANESE_RULES, CHINESE_RULES } from '../src/Game/rules';
import { PropIdent } from '../src/SGFParser/sgfTypes';

describe('KifuReader object', () => {
  describe('KifuReader#constructor()', () => {
    it('Create reader with empty kifu', () => {
      const kifuReader = new KifuReader();

      equal(kifuReader.game.size, 19);
      equal(kifuReader.game.rules, JAPANESE_RULES);
      equal(kifuReader.game.turn, Color.BLACK);
      equal(kifuReader.currentNode, kifuReader.rootNode);
      equal(kifuReader.currentNode.children.length, 0);
    });

    it('Create reader with specified kifu (node)', () => {
      const node = KifuNode.fromSGF('(;RU[Chinese]SZ[9];B[aa])');
      const kifuReader = new KifuReader(node);

      equal(kifuReader.game.size, 9);
      equal(kifuReader.game.rules, CHINESE_RULES);
      equal(kifuReader.game.turn, Color.BLACK);
      equal(kifuReader.rootNode, node);
    });

    it('Create reader with kifu containing handicap', () => {
      const kifuReader = new KifuReader(KifuNode.fromSGF('(;HA[2]AB[dp][pd])'));

      equal(kifuReader.game.turn, Color.WHITE);
      equal(kifuReader.game.getStone(3, 15), Color.BLACK);
      equal(kifuReader.game.getStone(15, 3), Color.BLACK);
    });
  });

  describe('Utility functions', () => {
    it('KifuReader#getRootProperty()', () => {
      const kifuReader = new KifuReader(KifuNode.fromSGF('(;RU[Chinese]SZ[9];B[aa])'));

      equal(kifuReader.getRootProperty(PropIdent.RULES), 'Chinese');
      equal(kifuReader.getRootProperty(PropIdent.BOARD_SIZE), 9);
    });

    it('KifuReader#getProperty()', () => {
      const kifuReader = new KifuReader(KifuNode.fromSGF('(;RU[Chinese]SZ[9];B[aa])'));

      equal(kifuReader.getProperty(PropIdent.RULES), 'Chinese');
      equal(kifuReader.getProperty(PropIdent.BOARD_SIZE), 9);
    });

    it('KifuReader#getNextNodes()', () => {
      const node = KifuNode.fromSGF('(;RU[Chinese]SZ[9];B[aa])');
      const kifuReader = new KifuReader(node);

      deepEqual(kifuReader.getNextNodes(), node.children);
    });
  });

  describe('KifuReader#next()', () => {
    it('Moves are correctly added and turn changed', () => {
      const node = KifuNode.fromSGF('(;SZ[19];B[dp];W[pd])');
      const kifuReader = new KifuReader(node);

      equal(kifuReader.game.getStone(3, 15), Color.EMPTY);
      equal(kifuReader.game.getStone(15, 3), Color.EMPTY);

      assert(kifuReader.next());
      equal(kifuReader.game.getStone(3, 15), Color.BLACK);
      equal(kifuReader.game.getStone(15, 3), Color.EMPTY);
      equal(kifuReader.game.turn, Color.WHITE);
      equal(kifuReader.currentNode, node.children[0]);

      assert(kifuReader.next());
      equal(kifuReader.game.getStone(3, 15), Color.BLACK);
      equal(kifuReader.game.getStone(15, 3), Color.WHITE);
      equal(kifuReader.game.turn, Color.BLACK);
      equal(kifuReader.currentNode, node.children[0].children[0]);

      assert(!kifuReader.next());
    });

    it('Stones are correctly added and removed', () => {
      const node = KifuNode.fromSGF('(;SZ[19];AB[dp]AW[pd];AE[dp][pd])');
      const kifuReader = new KifuReader(node);

      assert(kifuReader.next());
      equal(kifuReader.game.getStone(3, 15), Color.BLACK);
      equal(kifuReader.game.getStone(15, 3), Color.WHITE);
      equal(kifuReader.game.turn, Color.BLACK);

      assert(kifuReader.next());
      equal(kifuReader.game.getStone(3, 15), Color.EMPTY);
      equal(kifuReader.game.getStone(15, 3), Color.EMPTY);
      equal(kifuReader.game.turn, Color.BLACK);
    });

    it('Turn is correctly set', () => {
      const node = KifuNode.fromSGF('(;SZ[19];W[dp];W[pd]PL[w])');
      const kifuReader = new KifuReader(node);

      equal(kifuReader.game.turn, Color.BLACK);
      assert(kifuReader.next());
      equal(kifuReader.game.getStone(3, 15), Color.WHITE);
      equal(kifuReader.game.turn, Color.BLACK);

      assert(kifuReader.next());
      equal(kifuReader.game.getStone(3, 15), Color.WHITE);
      equal(kifuReader.game.getStone(15, 3), Color.WHITE);
      equal(kifuReader.game.turn, Color.WHITE);
    });

    it('Pass is correctly handled', () => {
      const node = KifuNode.fromSGF('(;SZ[19];B[dp];W[])');
      const kifuReader = new KifuReader(node);

      assert(kifuReader.next());
      equal(kifuReader.game.getStone(3, 15), Color.BLACK);
      equal(kifuReader.game.turn, Color.WHITE);

      const pos = kifuReader.game.position.toTwoDimensionalArray();
      assert(kifuReader.next());
      deepEqual(kifuReader.game.position.toTwoDimensionalArray(), pos);
      equal(kifuReader.game.turn, Color.BLACK);

      assert(!kifuReader.next());
    });

    it('Multiple variation', () => {
      const node = KifuNode.fromSGF('(;SZ[19](;B[dp])(;B[pd]))');
      const kifuReader = new KifuReader(node);
      const kifuReader2 = new KifuReader(node);

      assert(kifuReader.next());
      equal(kifuReader.game.getStone(3, 15), Color.BLACK);
      equal(kifuReader.game.getStone(15, 3), Color.EMPTY);

      assert(kifuReader2.next(1));
      equal(kifuReader2.game.getStone(3, 15), Color.EMPTY);
      equal(kifuReader2.game.getStone(15, 3), Color.BLACK);
    });
  });

  describe('KifuReader#last()', () => {
    it('Stones are correctly added, removed and played', () => {
      const node = KifuNode.fromSGF('(;SZ[19];AB[dp]AW[pd];AE[dp];B[dd])');
      const kifuReader = new KifuReader(node);

      kifuReader.last();
      equal(kifuReader.game.getStone(3, 15), Color.EMPTY);
      equal(kifuReader.game.getStone(15, 3), Color.WHITE);
      equal(kifuReader.game.getStone(3, 3), Color.BLACK);
      equal(kifuReader.game.turn, Color.WHITE);

      assert(!kifuReader.next());
    });

    it('Multiple variation', () => {
      const node = KifuNode.fromSGF('(;SZ[19](;B[dp];W[dd])(;B[pd]))');
      const kifuReader = new KifuReader(node);

      kifuReader.last();
      equal(kifuReader.game.getStone(3, 15), Color.BLACK);
      equal(kifuReader.game.getStone(3, 3), Color.WHITE);
    });
  });

  describe('KifuReader#previous()', () => {
    it('Game and position state is reverted', () => {
      const node = KifuNode.fromSGF('(;SZ[19];AB[dp]AW[pd];AE[dp]PL[w])');
      const kifuReader = new KifuReader(node);
      const pos1 = kifuReader.game.position.toTwoDimensionalArray();

      kifuReader.next();
      const pos2 = kifuReader.game.position.toTwoDimensionalArray();
      equal(kifuReader.game.turn, Color.BLACK);

      kifuReader.next();
      equal(kifuReader.game.turn, Color.WHITE);
      assert(kifuReader.previous());
      equal(kifuReader.game.turn, Color.BLACK);
      deepEqual(kifuReader.game.position.toTwoDimensionalArray(), pos2);

      assert(kifuReader.previous());
      deepEqual(kifuReader.game.position.toTwoDimensionalArray(), pos1);

      assert(!kifuReader.previous());
    });
  });

  describe('KifuReader#first()', () => {
    it('Game and position state is set to initial', () => {
      const node = KifuNode.fromSGF('(;HA[2]AB[dp][pd];W[dd];AE[dp])');
      const kifuReader = new KifuReader(node);
      const pos1 = kifuReader.game.position.toTwoDimensionalArray();

      kifuReader.last();
      kifuReader.first();
      deepEqual(kifuReader.game.position.toTwoDimensionalArray(), pos1);
      equal(kifuReader.game.turn, Color.WHITE);
    });
  });

  describe('KifuReader#previousFork()', () => {
    it('Go to previous fork', () => {
      const node = KifuNode.fromSGF('(;HA[2]AB[dp][pd](;W[dd](;B[aa])(;B[bb]))(;AE[dp]))');
      const kifuReader = new KifuReader(node);

      kifuReader.last();
      deepEqual(kifuReader.currentNode.getProperty(PropIdent.BLACK_MOVE), { x: 0, y: 0 });
      equal(kifuReader.game.getStone(0, 0), Color.BLACK);
      equal(kifuReader.game.getStone(3, 3), Color.WHITE);
      kifuReader.previousFork();
      deepEqual(kifuReader.currentNode.getProperty(PropIdent.WHITE_MOVE), { x: 3, y: 3 });
      equal(kifuReader.game.getStone(0, 0), Color.EMPTY);
      equal(kifuReader.game.getStone(3, 3), Color.WHITE);
      kifuReader.previousFork();
      equal(kifuReader.game.getStone(0, 0), Color.EMPTY);
      equal(kifuReader.game.getStone(3, 3), Color.EMPTY);
      equal(kifuReader.getNextNodes().length, 2);
    });
  });

  describe('KifuReader#goTo()', () => {
    it('Go to specific move/node number', () => {
      const node = KifuNode.fromSGF('(;HA[2]AB[dp][pd](;W[dd](;B[aa])(;B[bb]))(;AE[dp](;W[aa])(;W[bb])))');
      const kifuReader = new KifuReader(node);

      kifuReader.goTo(2);
      deepEqual(kifuReader.currentNode.getProperty(PropIdent.BLACK_MOVE), { x: 0, y: 0 });
      equal(kifuReader.game.getStone(0, 0), Color.BLACK);
      equal(kifuReader.game.getStone(3, 3), Color.WHITE);
      equal(kifuReader.game.turn, Color.WHITE);

      kifuReader.goTo(1);
      deepEqual(kifuReader.currentNode.getProperty(PropIdent.WHITE_MOVE), { x: 3, y: 3 });
      equal(kifuReader.game.getStone(0, 0), Color.EMPTY);
      equal(kifuReader.game.getStone(3, 3), Color.WHITE);
      equal(kifuReader.game.turn, Color.BLACK);
    });

    it('Go to specific path', () => {
      const node = KifuNode.fromSGF('(;HA[2]AB[dp][pd](;W[dd](;B[aa])(;B[bb]))(;AE[dp](;W[aa])(;W[bb])))');
      const kifuReader = new KifuReader(node);

      kifuReader.goTo({ depth: 2, forks: [0, 1] });
      deepEqual(kifuReader.currentNode.getProperty(PropIdent.BLACK_MOVE), { x: 1, y: 1 });
      deepEqual(kifuReader.currentNode.getPath(), { depth: 2, forks: [0, 1] });

      kifuReader.goTo({ depth: 2, forks: [1, 0] });
      deepEqual(kifuReader.currentNode.getProperty(PropIdent.WHITE_MOVE), { x: 0, y: 0 });
      deepEqual(kifuReader.currentNode.getPath(), { depth: 2, forks: [1, 0] });
    });
  });
});
