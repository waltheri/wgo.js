export {};

/*import { deepEqual, equal, ok as assert } from 'assert';
import { Color } from '../src/types';
import KifuNode from '../src/kifu/KifuNode';
import { PlayerBase } from '../src/PlayerBase';
import { JAPANESE_RULES, CHINESE_RULES } from '../src/Game-o/rules';
import { PropIdent } from '../src/SGFParser/sgfTypes';

describe('PlayerBase object', () => {
  describe('PlayerBase#constructor()', () => {
    it('Create reader with empty kifu', () => {
      const playerBase = new PlayerBase();
      playerBase.newGame();

      equal(playerBase.game.sizeX, 19);
      equal(playerBase.game.sizeY, 19);
      equal(playerBase.game.rules, JAPANESE_RULES);
      equal(playerBase.game.turn, Color.Black);
      equal(playerBase.currentNode, playerBase.rootNode);
      equal(playerBase.currentNode.children.length, 0);
    });

    it('Create reader with specified kifu (node)', () => {
      const node = KifuNode.fromSGF('(;RU[Chinese]SZ[9:13];B[aa])');
      const playerBase = new PlayerBase();
      playerBase.loadKifu(node);

      equal(playerBase.game.sizeX, 9);
      equal(playerBase.game.sizeY, 13);
      equal(playerBase.game.rules, CHINESE_RULES);
      equal(playerBase.game.turn, Color.Black);
      equal(playerBase.rootNode, node);
    });

    it('Create reader with kifu containing handicap', () => {
      const playerBase = new PlayerBase();
      playerBase.loadKifu(KifuNode.fromSGF('(;HA[2]AB[dp][pd])'));

      equal(playerBase.game.turn, Color.White);
      equal(playerBase.game.getStone(3, 15), Color.Black);
      equal(playerBase.game.getStone(15, 3), Color.Black);
    });
  });

  describe('Utility functions', () => {
    it('PlayerBase#getRootProperty()', () => {
      const playerBase = new PlayerBase();
      playerBase.loadKifu(KifuNode.fromSGF('(;RU[Chinese]SZ[9];B[aa])'));

      equal(playerBase.getRootProperty(PropIdent.Rules), 'Chinese');
      deepEqual(playerBase.getRootProperty(PropIdent.BoardSize), [9]);
    });

    it('PlayerBase#getProperty()', () => {
      const playerBase = new PlayerBase();
      playerBase.loadKifu(KifuNode.fromSGF('(;RU[Chinese]SZ[9:13];B[aa])'));

      equal(playerBase.getProperty(PropIdent.Rules), 'Chinese');
      deepEqual(playerBase.getProperty(PropIdent.BoardSize), [9, 13]);
    });

    it('PlayerBase#getNextNodes()', () => {
      const node = KifuNode.fromSGF('(;RU[Chinese]SZ[9];B[aa])');
      const playerBase = new PlayerBase();
      playerBase.loadKifu(node);

      deepEqual(playerBase.getNextNodes(), node.children);
    });
  });

  describe('PlayerBase#next()', () => {
    it('Moves are correctly added and turn changed', () => {
      const node = KifuNode.fromSGF('(;SZ[19];B[dp];W[pd])');
      const playerBase = new PlayerBase();
      playerBase.loadKifu(node);

      equal(playerBase.game.getStone(3, 15), Color.Empty);
      equal(playerBase.game.getStone(15, 3), Color.Empty);

      assert(playerBase.next());
      equal(playerBase.game.getStone(3, 15), Color.Black);
      equal(playerBase.game.getStone(15, 3), Color.Empty);
      equal(playerBase.game.turn, Color.White);
      equal(playerBase.currentNode, node.children[0]);

      assert(playerBase.next());
      equal(playerBase.game.getStone(3, 15), Color.Black);
      equal(playerBase.game.getStone(15, 3), Color.White);
      equal(playerBase.game.turn, Color.Black);
      equal(playerBase.currentNode, node.children[0].children[0]);

      assert(!playerBase.next());
    });

    it('Stones are correctly added and removed', () => {
      const node = KifuNode.fromSGF('(;SZ[19];AB[dp]AW[pd];AE[dp][pd])');
      const playerBase = new PlayerBase();
      playerBase.loadKifu(node);

      assert(playerBase.next());
      equal(playerBase.game.getStone(3, 15), Color.Black);
      equal(playerBase.game.getStone(15, 3), Color.White);
      equal(playerBase.game.turn, Color.Black);

      assert(playerBase.next());
      equal(playerBase.game.getStone(3, 15), Color.Empty);
      equal(playerBase.game.getStone(15, 3), Color.Empty);
      equal(playerBase.game.turn, Color.Black);
    });

    it('Turn is correctly set', () => {
      const node = KifuNode.fromSGF('(;SZ[19];W[dp];W[pd]PL[w])');
      const playerBase = new PlayerBase();
      playerBase.loadKifu(node);

      equal(playerBase.game.turn, Color.Black);
      assert(playerBase.next());
      equal(playerBase.game.getStone(3, 15), Color.White);
      equal(playerBase.game.turn, Color.Black);

      assert(playerBase.next());
      equal(playerBase.game.getStone(3, 15), Color.White);
      equal(playerBase.game.getStone(15, 3), Color.White);
      equal(playerBase.game.turn, Color.White);
    });

    it('Pass is correctly handled', () => {
      const node = KifuNode.fromSGF('(;SZ[19];B[dp];W[])');
      const playerBase = new PlayerBase();
      playerBase.loadKifu(node);

      assert(playerBase.next());
      equal(playerBase.game.getStone(3, 15), Color.Black);
      equal(playerBase.game.turn, Color.White);

      const pos = playerBase.game.position.toTwoDimensionalArray();
      assert(playerBase.next());
      deepEqual(playerBase.game.position.toTwoDimensionalArray(), pos);
      equal(playerBase.game.turn, Color.Black);

      assert(!playerBase.next());
    });

    it('Multiple variation', () => {
      const node = KifuNode.fromSGF('(;SZ[19](;B[dp])(;B[pd]))');
      const playerBase = new PlayerBase();
      playerBase.loadKifu(node);
      const playerBase2 = new PlayerBase();
      playerBase2.loadKifu(node);

      assert(playerBase.next());
      equal(playerBase.game.getStone(3, 15), Color.Black);
      equal(playerBase.game.getStone(15, 3), Color.Empty);

      assert(playerBase2.next(1));
      equal(playerBase2.game.getStone(3, 15), Color.Empty);
      equal(playerBase2.game.getStone(15, 3), Color.Black);
    });
  });

  describe('PlayerBase#last()', () => {
    it('Stones are correctly added, removed and played', () => {
      const node = KifuNode.fromSGF('(;SZ[19];AB[dp]AW[pd];AE[dp];B[dd])');
      const playerBase = new PlayerBase();
      playerBase.loadKifu(node);

      playerBase.last();
      equal(playerBase.game.getStone(3, 15), Color.Empty);
      equal(playerBase.game.getStone(15, 3), Color.White);
      equal(playerBase.game.getStone(3, 3), Color.Black);
      equal(playerBase.game.turn, Color.White);

      assert(!playerBase.next());
    });

    it('Multiple variation', () => {
      const node = KifuNode.fromSGF('(;SZ[19](;B[dp];W[dd])(;B[pd]))');
      const playerBase = new PlayerBase();
      playerBase.loadKifu(node);

      playerBase.last();
      equal(playerBase.game.getStone(3, 15), Color.Black);
      equal(playerBase.game.getStone(3, 3), Color.White);
    });
  });

  describe('PlayerBase#previous()', () => {
    it('Game and position state is reverted', () => {
      const node = KifuNode.fromSGF('(;SZ[19];AB[dp]AW[pd];AE[dp]PL[w])');
      const playerBase = new PlayerBase();
      playerBase.loadKifu(node);
      const pos1 = playerBase.game.position.toTwoDimensionalArray();

      playerBase.next();
      const pos2 = playerBase.game.position.toTwoDimensionalArray();
      equal(playerBase.game.turn, Color.Black);

      playerBase.next();
      equal(playerBase.game.turn, Color.White);
      assert(playerBase.previous());
      equal(playerBase.game.turn, Color.Black);
      deepEqual(playerBase.game.position.toTwoDimensionalArray(), pos2);

      assert(playerBase.previous());
      deepEqual(playerBase.game.position.toTwoDimensionalArray(), pos1);

      assert(!playerBase.previous());
    });
  });

  describe('PlayerBase#first()', () => {
    it('Game and position state is set to initial', () => {
      const node = KifuNode.fromSGF('(;HA[2]AB[dp][pd];W[dd];AE[dp])');
      const playerBase = new PlayerBase();
      playerBase.loadKifu(node);
      const pos1 = playerBase.game.position.toTwoDimensionalArray();

      playerBase.last();
      playerBase.first();
      deepEqual(playerBase.game.position.toTwoDimensionalArray(), pos1);
      equal(playerBase.game.turn, Color.White);
    });
  });

  describe('PlayerBase#previousFork()', () => {
    it('Go to previous fork', () => {
      const node = KifuNode.fromSGF('(;HA[2]AB[dp][pd](;W[dd](;B[aa])(;B[bb]))(;AE[dp]))');
      const playerBase = new PlayerBase();
      playerBase.loadKifu(node);

      playerBase.last();
      deepEqual(playerBase.currentNode.getProperty(PropIdent.BlackMove), { x: 0, y: 0 });
      equal(playerBase.game.getStone(0, 0), Color.Black);
      equal(playerBase.game.getStone(3, 3), Color.White);
      playerBase.previousFork();
      deepEqual(playerBase.currentNode.getProperty(PropIdent.WhiteMove), { x: 3, y: 3 });
      equal(playerBase.game.getStone(0, 0), Color.Empty);
      equal(playerBase.game.getStone(3, 3), Color.White);
      playerBase.previousFork();
      equal(playerBase.game.getStone(0, 0), Color.Empty);
      equal(playerBase.game.getStone(3, 3), Color.Empty);
      equal(playerBase.getNextNodes().length, 2);
    });
  });

  describe('PlayerBase#goTo()', () => {
    it('Go to specific move/node number', () => {
      const node = KifuNode.fromSGF('(;HA[2]AB[dp][pd](;W[dd](;B[aa])(;B[bb]))(;AE[dp](;W[aa])(;W[bb])))');
      const playerBase = new PlayerBase();
      playerBase.loadKifu(node);

      playerBase.goTo(2);
      deepEqual(playerBase.currentNode.getProperty(PropIdent.BlackMove), { x: 0, y: 0 });
      equal(playerBase.game.getStone(0, 0), Color.Black);
      equal(playerBase.game.getStone(3, 3), Color.White);
      equal(playerBase.game.turn, Color.White);

      playerBase.goTo(1);
      deepEqual(playerBase.currentNode.getProperty(PropIdent.WhiteMove), { x: 3, y: 3 });
      equal(playerBase.game.getStone(0, 0), Color.Empty);
      equal(playerBase.game.getStone(3, 3), Color.White);
      equal(playerBase.game.turn, Color.Black);
    });

    it('Go to specific path', () => {
      const node = KifuNode.fromSGF('(;HA[2]AB[dp][pd](;W[dd](;B[aa])(;B[bb]))(;AE[dp](;W[aa])(;W[bb])))');
      const playerBase = new PlayerBase();
      playerBase.loadKifu(node);

      playerBase.goTo({ depth: 2, forks: [0, 1] });
      deepEqual(playerBase.currentNode.getProperty(PropIdent.BlackMove), { x: 1, y: 1 });
      deepEqual(playerBase.currentNode.getPath(), { depth: 2, forks: [0, 1] });

      playerBase.goTo({ depth: 2, forks: [1, 0] });
      deepEqual(playerBase.currentNode.getProperty(PropIdent.WhiteMove), { x: 0, y: 0 });
      deepEqual(playerBase.currentNode.getPath(), { depth: 2, forks: [1, 0] });
    });
  });
});*/
