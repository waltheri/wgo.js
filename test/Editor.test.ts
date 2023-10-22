import assert, { deepStrictEqual, notStrictEqual, strict, strictEqual, throws } from 'assert';
import { Editor } from '../src/editor';
import { ING_RULES, KoRule, Position } from '../src/game';
import { Kifu, KifuNode } from '../src/kifu';
import { Color } from '../src/types';

describe('Editor object', () => {
  describe('Methods for loading Kifu', () => {
    it('New game without any options', () => {
      const editor = new Editor();
      editor.newGame();

      strictEqual(editor.gameState.position.cols, 19);
      strictEqual(editor.gameState.position.rows, 19);
      strictEqual(editor.gameRules.allowRewrite, false);
      strictEqual(editor.gameRules.allowSuicide, false);
      strictEqual(editor.gameRules.koRule, KoRule.Ko);
      strictEqual(editor.gameRules.komi, 6.5);
      strictEqual(editor.gameState.player, Color.Black);

      strictEqual(editor.kifu.info.boardSize, 19);
      strictEqual(editor.kifu.info.komi, 6.5);
      strictEqual(editor.kifu.info.rules, 'Japanese');

      strictEqual(editor.kifu.root, editor.currentNode);
    });

    it('New game with custom size and rules', () => {
      const editor = new Editor();
      editor.newGame({ cols: 9, rows: 13 }, ING_RULES);

      strictEqual(editor.gameState.position.cols, 9);
      strictEqual(editor.gameState.position.rows, 13);
      strictEqual(editor.gameRules.allowRewrite, false);
      strictEqual(editor.gameRules.allowSuicide, true);
      strictEqual(editor.gameRules.koRule, KoRule.SituationalSuperKo);

      deepStrictEqual(editor.kifu.info.boardSize, { cols: 9, rows: 13 });
      strictEqual(editor.kifu.info.rules, 'GOE');
      strictEqual(editor.kifu.info.komi, 7.5);

      strictEqual(editor.kifu.root, editor.currentNode);
    });

    it('Load game from kifu', () => {
      const editor = new Editor();
      const kifu = Kifu.fromSGF('(;SZ[9]RU[GOE])');
      editor.loadKifu(kifu);

      strictEqual(editor.gameState.position.cols, 9);
      strictEqual(editor.gameState.position.rows, 9);
      strictEqual(editor.gameRules.allowRewrite, false);
      strictEqual(editor.gameRules.allowSuicide, true);
      strictEqual(editor.gameRules.koRule, KoRule.SituationalSuperKo);
      strictEqual(editor.gameRules.komi, 7.5);
      strictEqual(editor.gameState.player, Color.Black);

      assert(editor.kifu.info.komi == null);
      strictEqual(editor.kifu.info.rules, 'GOE');
      strictEqual(editor.kifu.info.boardSize, 9);

      strictEqual(kifu, editor.kifu);
      strictEqual(editor.kifu.root, editor.currentNode);
    });

    it('Load game with setup', () => {
      const editor = new Editor();
      const kifu = Kifu.fromSGF('(;SZ[19]RU[Japanese]HA[3]KM[0]AB[ab][ba][bb])');
      editor.loadKifu(kifu);

      strictEqual(editor.gameRules.komi, 0);
      deepStrictEqual(editor.gameState.position.get(0, 1), Color.Black);
      deepStrictEqual(editor.gameState.position.get(1, 0), Color.Black);
      deepStrictEqual(editor.gameState.position.get(1, 1), Color.Black);
      strictEqual(editor.gameState.player, Color.White);

      strictEqual(editor.kifu.info.handicap, 3);
    });

    it('Player is correctly set, when HA property is present', () => {
      const editor1 = new Editor();
      editor1.loadKifu(Kifu.fromSGF('(;HA[0])'));
      strictEqual(editor1.gameState.player, Color.Black);

      const editor2 = new Editor();
      editor2.loadKifu(Kifu.fromSGF('(;HA[1]PL[W])'));
      strictEqual(editor2.gameState.player, Color.White);

      const editor3 = new Editor();
      editor3.loadKifu(Kifu.fromSGF('(;HA[2])'));
      strictEqual(editor3.gameState.player, Color.White);

      const editor4 = new Editor();
      editor4.loadKifu(Kifu.fromSGF('(;HA[3]PL[B])'));
      strictEqual(editor4.gameState.player, Color.Black);
    });
  });

  describe('Methods for kifu traversal', () => {
    it('Simple next without params', () => {
      const editor = new Editor();
      editor.loadKifu(Kifu.fromSGF('(;SZ[9];B[aa];W[bb](;AB[ab][ac]PL[W])(;AW[ab][ac]))'));

      assert(editor.next());
      deepStrictEqual(editor.currentNode.move, { x: 0, y: 0, c: Color.Black });
      strictEqual(editor.gameState.position.get(0, 0), Color.Black);
      strictEqual(editor.gameState.player, Color.White);
      deepStrictEqual(editor.currentPath, { moveNumber: 1, variations: [] });

      assert(editor.next());
      deepStrictEqual(editor.currentNode.move, { x: 1, y: 1, c: Color.White });
      strictEqual(editor.gameState.position.get(0, 0), Color.Black);
      strictEqual(editor.gameState.position.get(1, 1), Color.White);
      strictEqual(editor.gameState.player, Color.Black);
      deepStrictEqual(editor.currentPath, { moveNumber: 2, variations: [] });

      assert(editor.next());
      deepStrictEqual(editor.currentNode.player, Color.White);
      strictEqual(editor.gameState.position.get(0, 0), Color.Black);
      strictEqual(editor.gameState.position.get(0, 1), Color.Black);
      strictEqual(editor.gameState.position.get(0, 2), Color.Black);
      strictEqual(editor.gameState.position.get(1, 1), Color.White);
      strictEqual(editor.gameState.player, Color.White);
      deepStrictEqual(editor.currentPath, { moveNumber: 3, variations: [0] });

      assert(!editor.next());
    });

    it('Next with argument', () => {
      const editor = new Editor();
      const kifu = Kifu.fromSGF('(;SZ[9];B[aa];W[bb](;AB[ab][ac]PL[W])(;AW[ab][ac]))');
      editor.loadKifu(kifu);

      assert(!editor.next(1));
      assert(editor.next(0));
      assert(!editor.next(new KifuNode()));
      assert(editor.next(kifu.root.children[0].children[0]));
      assert(editor.next(1));
      strictEqual(editor.currentNode, kifu.root.children[0].children[0].children[1]);
      strictEqual(editor.gameState.position.get(0, 0), Color.Black);
      strictEqual(editor.gameState.position.get(0, 1), Color.White);
      strictEqual(editor.gameState.position.get(0, 2), Color.White);
      strictEqual(editor.gameState.position.get(1, 1), Color.White);
      strictEqual(editor.gameState.player, Color.Black);
      deepStrictEqual(editor.currentPath, { moveNumber: 3, variations: [1] });

      assert(!editor.next());
    });

    it('Stones are correctly captured after next', () => {
      const editor = new Editor();
      const kifu = Kifu.fromSGF('(;AB[aa][ab][ba][bb]AW[ac][bc][ca];W[cb])');
      editor.loadKifu(kifu);

      editor.next();

      strictEqual(editor.gameState.position.get(0, 0), Color.Empty);
      strictEqual(editor.gameState.position.get(0, 1), Color.Empty);
      strictEqual(editor.gameState.position.get(1, 0), Color.Empty);
      strictEqual(editor.gameState.position.get(1, 1), Color.Empty);
      strictEqual(editor.gameState.position.get(0, 2), Color.White);
      strictEqual(editor.gameState.position.get(1, 2), Color.White);
      strictEqual(editor.gameState.position.get(2, 0), Color.White);
      strictEqual(editor.gameState.position.get(2, 1), Color.White);
      strictEqual(editor.gameState.blackCaptures, 0);
      strictEqual(editor.gameState.whiteCaptures, 4);
    });

    it('Suicide works', () => {
      const editor = new Editor();
      const kifu = Kifu.fromSGF('(;AB[aa][ab][ba]AW[ac][bc][ca][cb];B[bb])');
      editor.loadKifu(kifu);

      editor.next();

      strictEqual(editor.gameState.position.get(0, 0), Color.Empty);
      strictEqual(editor.gameState.position.get(0, 1), Color.Empty);
      strictEqual(editor.gameState.position.get(1, 0), Color.Empty);
      strictEqual(editor.gameState.position.get(1, 1), Color.Empty);
      strictEqual(editor.gameState.position.get(0, 2), Color.White);
      strictEqual(editor.gameState.position.get(1, 2), Color.White);
      strictEqual(editor.gameState.position.get(2, 0), Color.White);
      strictEqual(editor.gameState.position.get(2, 1), Color.White);
      strictEqual(editor.gameState.blackCaptures, 0);
      strictEqual(editor.gameState.whiteCaptures, 4);
    });

    it('Simple previous works', () => {
      const editor = new Editor();
      const kifu = Kifu.fromSGF('(;SZ[9];B[aa];W[bb](;AB[ab][ac]PL[W])(;AW[ab][ac]))');

      editor.loadKifu(kifu);
      editor.next();
      editor.next();
      editor.next();

      assert(editor.previous());
      deepStrictEqual(editor.currentNode.move, { x: 1, y: 1, c: Color.White });
      strictEqual(editor.gameState.position.get(0, 0), Color.Black);
      strictEqual(editor.gameState.position.get(1, 1), Color.White);
      strictEqual(editor.gameState.player, Color.Black);
      deepStrictEqual(editor.currentPath, { moveNumber: 2, variations: [] });
      strictEqual(editor.gameState.position.get(0, 1), Color.Empty);
      strictEqual(editor.gameState.position.get(0, 2), Color.Empty);

      assert(editor.previous());
      deepStrictEqual(editor.currentNode.move, { x: 0, y: 0, c: Color.Black });
      strictEqual(editor.gameState.position.get(0, 0), Color.Black);
      strictEqual(editor.gameState.player, Color.White);
      deepStrictEqual(editor.currentPath, { moveNumber: 1, variations: [] });
      strictEqual(editor.gameState.position.get(1, 1), Color.Empty);

      assert(editor.previous());
      strictEqual(editor.currentNode, kifu.root);
      strictEqual(editor.gameState.player, Color.Black);
      strictEqual(editor.gameState.position.get(0, 0), Color.Empty);
      deepStrictEqual(editor.currentPath, { moveNumber: 0, variations: [] });

      assert(!editor.previous());
    });

    it('Capturing works with previous', () => {
      const editor = new Editor();
      const kifu = Kifu.fromSGF('(;AB[aa][ab][ba][bb]AW[ac][bc][ca];W[cb])');
      editor.loadKifu(kifu);

      editor.next();
      editor.previous();

      strictEqual(editor.gameState.position.get(0, 0), Color.Black);
      strictEqual(editor.gameState.position.get(0, 1), Color.Black);
      strictEqual(editor.gameState.position.get(1, 0), Color.Black);
      strictEqual(editor.gameState.position.get(1, 1), Color.Black);
      strictEqual(editor.gameState.position.get(0, 2), Color.White);
      strictEqual(editor.gameState.position.get(1, 2), Color.White);
      strictEqual(editor.gameState.position.get(2, 0), Color.White);
      strictEqual(editor.gameState.position.get(2, 1), Color.Empty);
      strictEqual(editor.gameState.blackCaptures, 0);
      strictEqual(editor.gameState.whiteCaptures, 0);
    });

    it('Go to last node', () => {
      const editor = new Editor();
      const kifu = Kifu.fromSGF('(;SZ[9](;B[aa];W[bb](;B[ab])(;B[ba]))(;B[bb];W[aa]))');
      editor.loadKifu(kifu);

      assert(editor.last());
      deepStrictEqual(editor.currentNode.move, { c: Color.Black, x: 0, y: 1 });
      deepStrictEqual(editor.currentPath, { moveNumber: 3, variations: [0, 0] });
      strictEqual(editor.gameState.position.get(0, 0), Color.Black);
      strictEqual(editor.gameState.position.get(1, 1), Color.White);
      strictEqual(editor.gameState.position.get(0, 1), Color.Black);
      strictEqual(editor.gameState.position.get(1, 0), Color.Empty);
      strictEqual(editor.gameState.player, Color.White);
      assert(!editor.last());
    });

    it('Go to last node, remembering previous variations', () => {
      const editor = new Editor();
      const kifu = Kifu.fromSGF('(;SZ[9](;B[aa];W[bb](;B[ab])(;B[ba]))(;B[bb];W[aa]))');
      editor.loadKifu(kifu);

      editor.next();
      editor.next();
      editor.next(1);
      editor.previous();
      editor.previous();
      editor.previous();

      assert(editor.last());
      deepStrictEqual(editor.currentNode.move, { c: Color.Black, x: 1, y: 0 });
      deepStrictEqual(editor.currentPath, { moveNumber: 3, variations: [0, 1] });
      strictEqual(editor.gameState.position.get(0, 0), Color.Black);
      strictEqual(editor.gameState.position.get(1, 1), Color.White);
      strictEqual(editor.gameState.position.get(1, 0), Color.Black);
      strictEqual(editor.gameState.position.get(0, 1), Color.Empty);
      strictEqual(editor.gameState.player, Color.White);
      assert(!editor.last());
    });

    it('Go to first node', () => {
      const editor = new Editor();
      const kifu = Kifu.fromSGF('(;SZ[9](;B[aa];W[bb](;B[ab])(;B[ba]))(;B[bb];W[aa]))');
      editor.loadKifu(kifu);

      editor.last();

      assert(editor.first());
      strictEqual(editor.currentNode, editor.kifu.root);
      deepStrictEqual(editor.currentPath, { moveNumber: 0, variations: [] });
      strictEqual(editor.gameState.position.get(0, 0), Color.Empty);
      strictEqual(editor.gameState.position.get(1, 1), Color.Empty);
      strictEqual(editor.gameState.position.get(1, 0), Color.Empty);
      strictEqual(editor.gameState.position.get(0, 1), Color.Empty);
      strictEqual(editor.gameState.player, Color.Black);
      assert(!editor.first());
    });

    it('Go to specified move number', () => {
      const editor = new Editor();
      const kifu = Kifu.fromSGF('(;SZ[9](;B[aa];W[bb](;B[ab])(;B[ba]))(;B[bb];W[aa]))');
      editor.loadKifu(kifu);

      assert(editor.goTo(2));
      deepStrictEqual(editor.currentNode.move, { c: Color.White, x: 1, y: 1 });
      deepStrictEqual(editor.currentPath, { moveNumber: 2, variations: [0] });
      strictEqual(editor.gameState.position.get(0, 0), Color.Black);
      strictEqual(editor.gameState.position.get(1, 1), Color.White);
      strictEqual(editor.gameState.player, Color.Black);
      assert(editor.goTo(1));
      deepStrictEqual(editor.currentNode.move, { c: Color.Black, x: 0, y: 0 });
      deepStrictEqual(editor.currentPath, { moveNumber: 1, variations: [0] });
      strictEqual(editor.gameState.position.get(0, 0), Color.Black);
      strictEqual(editor.gameState.position.get(1, 1), Color.Empty);
      strictEqual(editor.gameState.player, Color.White);
      assert(!editor.goTo(4));
    });

    it('Go to specified path', () => {
      const editor = new Editor();
      const kifu = Kifu.fromSGF('(;SZ[9](;B[aa];W[bb](;B[ab])(;B[ba]))(;B[bb];W[aa]))');
      editor.loadKifu(kifu);

      assert(editor.goTo({ moveNumber: 2, variations: [1] }));
      deepStrictEqual(editor.currentNode.move, { c: Color.White, x: 0, y: 0 });
      deepStrictEqual(editor.currentPath, { moveNumber: 2, variations: [1] });
      strictEqual(editor.gameState.position.get(1, 1), Color.Black);
      strictEqual(editor.gameState.position.get(0, 0), Color.White);
      strictEqual(editor.gameState.player, Color.Black);
      assert(!editor.goTo({ moveNumber: 3, variations: [1] }));
    });

    it('Go to specified kifu node', () => {
      const editor = new Editor();
      const kifu = Kifu.fromSGF('(;SZ[9](;B[aa];W[bb](;B[ab])(;B[ba]))(;B[bb];W[aa]))');
      editor.loadKifu(kifu);

      assert(editor.goTo(kifu.root.children[0].children[0].children[1]));
      deepStrictEqual(editor.currentNode.move, { c: Color.Black, x: 1, y: 0 });
      deepStrictEqual(editor.currentPath, { moveNumber: 3, variations: [0, 1] });
      strictEqual(editor.gameState.position.get(0, 0), Color.Black);
      strictEqual(editor.gameState.position.get(1, 1), Color.White);
      strictEqual(editor.gameState.position.get(1, 0), Color.Black);
      assert(!editor.goTo(new KifuNode()));
    });

    it('Go to method, remembering previous variations', () => {
      const editor = new Editor();
      const kifu = Kifu.fromSGF('(;SZ[9](;B[aa];W[bb](;B[ab])(;B[ba]))(;B[bb];W[aa]))');
      editor.loadKifu(kifu);

      editor.goTo({ moveNumber: 1, variations: [1] });
      editor.goTo(0);

      assert(!editor.goTo(3));
      deepStrictEqual(editor.currentNode.move, { c: Color.White, x: 0, y: 0 });
      deepStrictEqual(editor.currentPath, { moveNumber: 2, variations: [1] });
      strictEqual(editor.gameState.position.get(1, 1), Color.Black);
      strictEqual(editor.gameState.position.get(0, 0), Color.White);
      strictEqual(editor.gameState.player, Color.Black);
      assert(!editor.last());
    });

    it('Next match method', () => {
      const editor = new Editor();
      const kifu = Kifu.fromSGF('(;SZ[9](;B[aa];W[bb]C[bar](;B[ab]C[foo])(;B[ba]))(;B[bb];W[aa]))');
      editor.loadKifu(kifu);

      assert(editor.nextMatch((node) => !!node.comment));
      strictEqual(editor.currentNode.comment, 'bar');
      assert(editor.nextMatch((node) => !!node.comment));
      strictEqual(editor.currentNode.comment, 'foo');
      deepStrictEqual(editor.currentNode.move, { c: Color.Black, x: 0, y: 1 });
      deepStrictEqual(editor.currentPath, { moveNumber: 3, variations: [0, 0] });
      strictEqual(editor.gameState.position.get(0, 0), Color.Black);
      strictEqual(editor.gameState.position.get(1, 1), Color.White);
      strictEqual(editor.gameState.position.get(0, 1), Color.Black);
      strictEqual(editor.gameState.position.get(1, 0), Color.Empty);
      strictEqual(editor.gameState.player, Color.White);

      const node = editor.currentNode;
      assert(!editor.nextMatch((node) => !!node.comment));
      strictEqual(node, editor.currentNode);
    });

    it('Next match method remembering last visited nodes', () => {
      const editor = new Editor();
      const kifu = Kifu.fromSGF('(;SZ[9](;B[aa];W[bb](;B[ab]C[foo])(;B[ba]))(;B[bb];W[aa]))');
      editor.loadKifu(kifu);

      editor.next();
      editor.next();
      editor.next(1);
      editor.previous();
      editor.previous();
      editor.previous();

      const node = editor.currentNode;
      assert(!editor.nextMatch((node) => !!node.comment));
      strictEqual(node, editor.currentNode);

      assert(
        editor.nextMatch((node) =>
          node.move && 'x' in node.move ? node.move.x === 1 && node.move.y === 0 : false,
        ),
      );
      deepStrictEqual(editor.currentNode.move, { c: Color.Black, x: 1, y: 0 });
    });

    it('Previous match method', () => {
      const editor = new Editor();
      const kifu = Kifu.fromSGF(
        '(;SZ[9]C[bar](;B[aa]C[baz];W[bb](;B[ab]C[foo])(;B[ba]))(;B[bb];W[aa]))',
      );
      editor.loadKifu(kifu);
      editor.last();

      assert(editor.previousMatch((node) => !!node.comment));
      strictEqual(editor.currentNode.comment, 'baz');
      deepStrictEqual(editor.currentNode.move, { c: Color.Black, x: 0, y: 0 });
      deepStrictEqual(editor.currentPath, { moveNumber: 1, variations: [0] });
      strictEqual(editor.gameState.position.get(0, 0), Color.Black);
      strictEqual(editor.gameState.position.get(1, 1), Color.Empty);
      strictEqual(editor.gameState.position.get(0, 1), Color.Empty);
      strictEqual(editor.gameState.player, Color.White);
      assert(editor.previousMatch((node) => !!node.comment));
      strictEqual(editor.currentNode, editor.kifu.root);
      strictEqual(editor.currentNode.comment, 'bar');
      assert(!editor.previousMatch((node) => !!node.comment));
      strictEqual(editor.currentNode, editor.kifu.root);
    });
  });
});
