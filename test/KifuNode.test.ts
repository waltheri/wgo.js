import { strictEqual, deepEqual, ok } from 'assert';
import { KifuNode, MarkupType } from '../src/kifu';
import { PropIdent } from '../src/sgf';
import { kifuNodeSGFPropertyDescriptors } from '../src/kifu/kifuNodeSGFPropertyDescriptors';
import { Color } from '../src/types';

describe('KifuNode', () => {
  describe('Correct transformation from SGF property values.', () => {
    let tests = 0;

    it('Property B', () => {
      tests++;
      const node = KifuNode.fromSGF('B[cd]');
      deepEqual(node.move, { x: 2, y: 3, c: Color.B });

      // pass
      const node2 = KifuNode.fromSGF('B[]');
      deepEqual(node2.move, { c: Color.B });
    });

    it('Property W', () => {
      tests++;
      const node = KifuNode.fromSGF('W[cd]');
      deepEqual(node.move, { x: 2, y: 3, c: Color.W });

      // pass
      const node2 = KifuNode.fromSGF('W[]');
      deepEqual(node2.move, { c: Color.W });
    });

    it('Property AB', () => {
      tests++;
      const node = KifuNode.fromSGF('AB[cd][ef][gh]');
      deepEqual(node.setup, [
        { x: 2, y: 3, c: Color.B },
        { x: 4, y: 5, c: Color.B },
        { x: 6, y: 7, c: Color.B },
      ]);
    });

    it('Property AW', () => {
      tests++;
      const node = KifuNode.fromSGF('AW[cd][ef][gh]');
      deepEqual(node.setup, [
        { x: 2, y: 3, c: Color.W },
        { x: 4, y: 5, c: Color.W },
        { x: 6, y: 7, c: Color.W },
      ]);
    });

    it('Property AE', () => {
      tests++;
      const node = KifuNode.fromSGF('AE[cd][ef][gh]');
      deepEqual(node.setup, [
        { x: 2, y: 3, c: Color.E },
        { x: 4, y: 5, c: Color.E },
        { x: 6, y: 7, c: Color.E },
      ]);
    });

    it('Property PL', () => {
      tests++;

      const node = KifuNode.fromSGF('PL[W]');
      strictEqual(node.turn, Color.W);

      const node2 = KifuNode.fromSGF('PL[B]');
      strictEqual(node2.turn, Color.B);
    });

    it('Property VW', () => {
      tests++;
      const node = KifuNode.fromSGF('VW[cd:ef]');
      deepEqual(node.boardSection, { x1: 2, y1: 3, x2: 4, y2: 5 });
    });

    it('Property BL', () => {
      tests++;
      const node = KifuNode.fromSGF('BL[123]');
      strictEqual(node.blackTimeLeft, 123);
    });

    it('Property OB', () => {
      tests++;
      const node = KifuNode.fromSGF('OB[123]');
      strictEqual(node.blackStonesLeft, 123);
    });

    it('Property WL', () => {
      tests++;
      const node = KifuNode.fromSGF('WL[123]');
      strictEqual(node.whiteTimeLeft, 123);
    });

    it('Property OW', () => {
      tests++;
      const node = KifuNode.fromSGF('OW[123]');
      strictEqual(node.whiteStonesLeft, 123);
    });

    it('Property C', () => {
      tests++;
      const node = KifuNode.fromSGF('C[This is a comment.]');
      strictEqual(node.comment, 'This is a comment.');
    });

    it('Property CR', () => {
      tests++;
      const node = KifuNode.fromSGF('CR[cd][ef][gh]');
      deepEqual(node.markup, [
        { x: 2, y: 3, type: 'CR' },
        { x: 4, y: 5, type: 'CR' },
        { x: 6, y: 7, type: 'CR' },
      ]);
    });

    it('Property DD', () => {
      tests++;
      const node = KifuNode.fromSGF('DD[cd][ef][gh]');
      deepEqual(node.markup, [
        { x: 2, y: 3, type: 'DD' },
        { x: 4, y: 5, type: 'DD' },
        { x: 6, y: 7, type: 'DD' },
      ]);
    });

    it('Property MA', () => {
      tests++;
      const node = KifuNode.fromSGF('MA[cd][ef][gh]');
      deepEqual(node.markup, [
        { x: 2, y: 3, type: 'MA' },
        { x: 4, y: 5, type: 'MA' },
        { x: 6, y: 7, type: 'MA' },
      ]);
    });

    it('Property SL', () => {
      tests++;
      const node = KifuNode.fromSGF('SL[cd][ef][gh]');
      deepEqual(node.markup, [
        { x: 2, y: 3, type: 'SL' },
        { x: 4, y: 5, type: 'SL' },
        { x: 6, y: 7, type: 'SL' },
      ]);
    });

    it('Property SQ', () => {
      tests++;
      const node = KifuNode.fromSGF('SQ[cd][ef][gh]');
      deepEqual(node.markup, [
        { x: 2, y: 3, type: 'SQ' },
        { x: 4, y: 5, type: 'SQ' },
        { x: 6, y: 7, type: 'SQ' },
      ]);
    });

    it('Property TR', () => {
      tests++;
      const node = KifuNode.fromSGF('TR[cd][ef][gh]');
      deepEqual(node.markup, [
        { x: 2, y: 3, type: 'TR' },
        { x: 4, y: 5, type: 'TR' },
        { x: 6, y: 7, type: 'TR' },
      ]);
    });

    it('Property AR', () => {
      tests++;
      const node = KifuNode.fromSGF('AR[cd:ef][gh:ij]');
      deepEqual(node.markup, [
        { x1: 2, y1: 3, x2: 4, y2: 5, type: 'AR' },
        { x1: 6, y1: 7, x2: 8, y2: 9, type: 'AR' },
      ]);
    });

    it('Property LN', () => {
      tests++;
      const node = KifuNode.fromSGF('LN[cd:ef][gh:ij]');
      deepEqual(node.markup, [
        { x1: 2, y1: 3, x2: 4, y2: 5, type: 'LN' },
        { x1: 6, y1: 7, x2: 8, y2: 9, type: 'LN' },
      ]);
    });

    it('Property LB', () => {
      tests++;
      const node = KifuNode.fromSGF('LB[ab:A][cd:B]');
      deepEqual(node.markup, [
        { x: 0, y: 1, type: 'LB', text: 'A' },
        { x: 2, y: 3, type: 'LB', text: 'B' },
      ]);
    });

    it('Test of all property types', () => {
      strictEqual(tests, Object.keys(kifuNodeSGFPropertyDescriptors).length);
    });

    it('Unknown property', () => {
      const node = KifuNode.fromSGF('XX[test][test2]');
      deepEqual(node.properties.XX, ['test', 'test2']);
    });
  });

  describe('Correct clear of SGF property values.', () => {
    let tests = 0;

    it('Property B', () => {
      tests++;
      const node = KifuNode.fromSGF('B[cd]');
      node.setSGFProperty(PropIdent.BlackMove, []);
      strictEqual(node.move, undefined);
    });

    it('Property W', () => {
      tests++;
      const node = KifuNode.fromSGF('W[cd]');
      node.setSGFProperty(PropIdent.WhiteMove, []);
      strictEqual(node.move, undefined);
    });

    it('Property AB', () => {
      tests++;
      const node = KifuNode.fromSGF('AB[ab]AW[cd]AE[ef]');
      node.setSGFProperty(PropIdent.AddBlack, []);
      deepEqual(node.setup, [
        { x: 2, y: 3, c: Color.W },
        { x: 4, y: 5, c: Color.E },
      ]);
    });

    it('Property AW', () => {
      tests++;
      const node = KifuNode.fromSGF('AB[ab]AW[cd]AE[ef]');
      node.setSGFProperty(PropIdent.AddWhite, []);
      deepEqual(node.setup, [
        { x: 0, y: 1, c: Color.B },
        { x: 4, y: 5, c: Color.E },
      ]);
    });

    it('Property AE', () => {
      tests++;
      const node = KifuNode.fromSGF('AB[ab]AW[cd]AE[ef]');
      node.setSGFProperty(PropIdent.ClearField, []);
      deepEqual(node.setup, [
        { x: 0, y: 1, c: Color.B },
        { x: 2, y: 3, c: Color.W },
      ]);
    });

    it('Property PL', () => {
      tests++;
      const node = KifuNode.fromSGF('PL[W]');
      node.setSGFProperty(PropIdent.SetTurn, []);
      strictEqual(node.turn, undefined);
    });

    it('Property VW', () => {
      tests++;
      const node = KifuNode.fromSGF('VW[cd:ef]');
      node.setSGFProperty(PropIdent.BoardSection, []);
      strictEqual(node.turn, undefined);
    });

    it('Property BL', () => {
      tests++;
      const node = KifuNode.fromSGF('BL[123]');
      node.setSGFProperty(PropIdent.BlackTimeLeft, []);
      strictEqual(node.blackTimeLeft, undefined);
    });

    it('Property OB', () => {
      tests++;
      const node = KifuNode.fromSGF('OB[123]');
      node.setSGFProperty(PropIdent.BlackStonesLeft, []);
      strictEqual(node.blackStonesLeft, undefined);
    });

    it('Property WL', () => {
      tests++;
      const node = KifuNode.fromSGF('WL[123]');
      node.setSGFProperty(PropIdent.WhiteTimeLeft, []);
      strictEqual(node.whiteTimeLeft, undefined);
    });

    it('Property OW', () => {
      tests++;
      const node = KifuNode.fromSGF('OW[123]');
      node.setSGFProperty(PropIdent.WhiteStonesLeft, []);
      strictEqual(node.whiteStonesLeft, undefined);
    });

    it('Property C', () => {
      tests++;
      const node = KifuNode.fromSGF('C[This is a comment.]');
      node.setSGFProperty(PropIdent.Comment, []);
      strictEqual(node.comment, undefined);
    });

    it('Property CR', () => {
      tests++;
      const node = KifuNode.fromSGF('CR[ab][cd]TR[ef]');
      node.setSGFProperty(PropIdent.Circle, []);
      deepEqual(node.markup, [{ x: 4, y: 5, type: 'TR' }]);
    });

    it('Property DD', () => {
      tests++;
      const node = KifuNode.fromSGF('DD[ab][cd]TR[ef]');
      node.setSGFProperty(PropIdent.Dim, []);
      deepEqual(node.markup, [{ x: 4, y: 5, type: 'TR' }]);
    });

    it('Property MA', () => {
      tests++;
      const node = KifuNode.fromSGF('MA[ab][cd]TR[ef]');
      node.setSGFProperty(PropIdent.XMark, []);
      deepEqual(node.markup, [{ x: 4, y: 5, type: 'TR' }]);
    });

    it('Property SL', () => {
      tests++;
      const node = KifuNode.fromSGF('SL[ab][cd]TR[ef]');
      node.setSGFProperty(PropIdent.Selected, []);
      deepEqual(node.markup, [{ x: 4, y: 5, type: 'TR' }]);
    });

    it('Property SQ', () => {
      tests++;
      const node = KifuNode.fromSGF('SQ[ab][cd]TR[ef]');
      node.setSGFProperty(PropIdent.Square, []);
      deepEqual(node.markup, [{ x: 4, y: 5, type: 'TR' }]);
    });

    it('Property TR', () => {
      tests++;
      const node = KifuNode.fromSGF('TR[ab][cd]CR[ef]');
      node.setSGFProperty(PropIdent.Triangle, []);
      deepEqual(node.markup, [{ x: 4, y: 5, type: 'CR' }]);
    });

    it('Property AR', () => {
      tests++;
      const node = KifuNode.fromSGF('AR[cd:ef][gh:ij]CR[ef]');
      node.setSGFProperty(PropIdent.Arrow, []);
      deepEqual(node.markup, [{ x: 4, y: 5, type: 'CR' }]);
    });

    it('Property LN', () => {
      tests++;
      const node = KifuNode.fromSGF('LN[cd:ef][gh:ij]CR[ef]');
      node.setSGFProperty(PropIdent.Line, []);
      deepEqual(node.markup, [{ x: 4, y: 5, type: 'CR' }]);
    });

    it('Property LB', () => {
      tests++;
      const node = KifuNode.fromSGF('LB[ab:A][cd:B]CR[ef]');
      node.setSGFProperty(PropIdent.Label, []);
      deepEqual(node.markup, [{ x: 4, y: 5, type: 'CR' }]);
    });

    it('Test of all property types', () => {
      strictEqual(tests, Object.keys(kifuNodeSGFPropertyDescriptors).length);
    });
  });

  describe('Correct transformation to SGF property values.', () => {
    let tests = 0;

    it('Property B', () => {
      tests++;
      const node = KifuNode.fromJS({ move: { x: 2, y: 3, c: Color.B } });
      strictEqual(node.getSGFProperties(), 'B[cd]');

      // pass
      const node2 = KifuNode.fromJS({ move: { c: Color.B } });
      strictEqual(node2.getSGFProperties(), 'B[]');
    });

    it('Property W', () => {
      tests++;
      const node = KifuNode.fromJS({ move: { x: 2, y: 3, c: Color.W } });
      strictEqual(node.getSGFProperties(), 'W[cd]');

      // pass
      const node2 = KifuNode.fromJS({ move: { c: Color.W } });
      strictEqual(node2.getSGFProperties(), 'W[]');
    });

    it('Property AB', () => {
      tests++;
      const node = KifuNode.fromJS({
        setup: [
          { x: 2, y: 3, c: Color.B },
          { x: 4, y: 5, c: Color.B },
          { x: 6, y: 7, c: Color.B },
        ],
      });
      strictEqual(node.getSGFProperties(), 'AB[cd][ef][gh]');
    });

    it('Property AW', () => {
      tests++;
      const node = KifuNode.fromJS({
        setup: [
          { x: 2, y: 3, c: Color.W },
          { x: 4, y: 5, c: Color.W },
          { x: 6, y: 7, c: Color.W },
        ],
      });
      strictEqual(node.getSGFProperties(), 'AW[cd][ef][gh]');
    });

    it('Property AE', () => {
      tests++;
      const node = KifuNode.fromJS({
        setup: [
          { x: 2, y: 3, c: Color.E },
          { x: 4, y: 5, c: Color.E },
          { x: 6, y: 7, c: Color.E },
        ],
      });
      strictEqual(node.getSGFProperties(), 'AE[cd][ef][gh]');
    });

    it('Property PL', () => {
      tests++;

      const node = KifuNode.fromJS({ turn: Color.W });
      strictEqual(node.getSGFProperties(), 'PL[W]');

      const node2 = KifuNode.fromJS({ turn: Color.W });
      strictEqual(node2.getSGFProperties(), 'PL[W]');
    });

    it('Property VW', () => {
      tests++;
      const node = KifuNode.fromJS({ boardSection: { x1: 2, y1: 3, x2: 4, y2: 5 } });
      strictEqual(node.getSGFProperties(), 'VW[cd:ef]');
    });

    it('Property BL', () => {
      tests++;
      const node = KifuNode.fromJS({ blackTimeLeft: 123 });
      strictEqual(node.getSGFProperties(), 'BL[123]');
    });

    it('Property OB', () => {
      tests++;
      const node = KifuNode.fromJS({ blackStonesLeft: 123 });
      strictEqual(node.getSGFProperties(), 'OB[123]');
    });

    it('Property WL', () => {
      tests++;
      const node = KifuNode.fromJS({ whiteTimeLeft: 123 });
      strictEqual(node.getSGFProperties(), 'WL[123]');
    });

    it('Property OW', () => {
      tests++;
      const node = KifuNode.fromJS({ whiteStonesLeft: 123 });
      strictEqual(node.getSGFProperties(), 'OW[123]');
    });

    it('Property C', () => {
      tests++;
      const node = KifuNode.fromJS({ comment: 'This is a comment.' });
      strictEqual(node.getSGFProperties(), 'C[This is a comment.]');
    });

    it('Property CR', () => {
      tests++;
      const node = KifuNode.fromJS({
        markup: [
          { x: 2, y: 3, type: MarkupType.Circle },
          { x: 4, y: 5, type: MarkupType.Circle },
          { x: 6, y: 7, type: MarkupType.Circle },
        ],
      });

      strictEqual(node.getSGFProperties(), 'CR[cd][ef][gh]');
    });

    it('Property DD', () => {
      tests++;
      const node = KifuNode.fromJS({
        markup: [
          { x: 2, y: 3, type: MarkupType.Dim },
          { x: 4, y: 5, type: MarkupType.Dim },
          { x: 6, y: 7, type: MarkupType.Dim },
        ],
      });

      strictEqual(node.getSGFProperties(), 'DD[cd][ef][gh]');
    });

    it('Property MA', () => {
      tests++;
      const node = KifuNode.fromJS({
        markup: [
          { x: 2, y: 3, type: MarkupType.XMark },
          { x: 4, y: 5, type: MarkupType.XMark },
          { x: 6, y: 7, type: MarkupType.XMark },
        ],
      });

      strictEqual(node.getSGFProperties(), 'MA[cd][ef][gh]');
    });

    it('Property SL', () => {
      tests++;
      const node = KifuNode.fromJS({
        markup: [
          { x: 2, y: 3, type: MarkupType.Selected },
          { x: 4, y: 5, type: MarkupType.Selected },
          { x: 6, y: 7, type: MarkupType.Selected },
        ],
      });

      strictEqual(node.getSGFProperties(), 'SL[cd][ef][gh]');
    });

    it('Property SQ', () => {
      tests++;
      const node = KifuNode.fromJS({
        markup: [
          { x: 2, y: 3, type: MarkupType.Square },
          { x: 4, y: 5, type: MarkupType.Square },
          { x: 6, y: 7, type: MarkupType.Square },
        ],
      });

      strictEqual(node.getSGFProperties(), 'SQ[cd][ef][gh]');
    });

    it('Property TR', () => {
      tests++;
      const node = KifuNode.fromJS({
        markup: [
          { x: 2, y: 3, type: MarkupType.Triangle },
          { x: 4, y: 5, type: MarkupType.Triangle },
          { x: 6, y: 7, type: MarkupType.Triangle },
        ],
      });

      strictEqual(node.getSGFProperties(), 'TR[cd][ef][gh]');
    });

    it('Property AR', () => {
      tests++;
      const node = KifuNode.fromJS({
        markup: [
          { x1: 2, y1: 3, x2: 4, y2: 5, type: MarkupType.Arrow },
          { x1: 6, y1: 7, x2: 8, y2: 9, type: MarkupType.Arrow },
        ],
      });

      strictEqual(node.getSGFProperties(), 'AR[cd:ef][gh:ij]');
    });

    it('Property LN', () => {
      tests++;
      const node = KifuNode.fromJS({
        markup: [
          { x1: 2, y1: 3, x2: 4, y2: 5, type: MarkupType.Line },
          { x1: 6, y1: 7, x2: 8, y2: 9, type: MarkupType.Line },
        ],
      });

      strictEqual(node.getSGFProperties(), 'LN[cd:ef][gh:ij]');
    });

    it('Property LB', () => {
      tests++;
      const node = KifuNode.fromJS({
        markup: [
          { x: 0, y: 1, type: MarkupType.Label, text: 'A' },
          { x: 2, y: 3, type: MarkupType.Label, text: 'B' },
        ],
      });

      strictEqual(node.getSGFProperties(), 'LB[ab:A][cd:B]');
    });

    it('Test of all property types', () => {
      strictEqual(tests, Object.keys(kifuNodeSGFPropertyDescriptors).length);
    });
  });

  describe('Correct handling conflicting properties.', () => {
    it('Last color move is set', () => {
      const node = KifuNode.fromSGF('B[cd]W[ef]');
      deepEqual(node.move, { x: 4, y: 5, c: Color.W });
    });

    it('Last setup on the same field', () => {
      const node = KifuNode.fromSGF('AB[ab][cd]AW[ab][ef]AE[ab][gh][ab]');
      deepEqual(node.setup, [
        { x: 2, y: 3, c: Color.B },
        { x: 4, y: 5, c: Color.W },
        { x: 6, y: 7, c: Color.E },
        { x: 0, y: 1, c: Color.E },
      ]);
    });

    it('Only one same markup of type', () => {
      const node = KifuNode.fromSGF('CR[ab][cd][cd]TR[cd]');
      deepEqual(node.markup, [
        { x: 0, y: 1, type: 'CR' },
        { x: 2, y: 3, type: 'CR' },
        { x: 2, y: 3, type: 'TR' },
      ]);
    });
  });

  describe('Methods for setting SGF properties.', () => {
    it('setSGFProperty', () => {
      const node = new KifuNode();
      node.setSGFProperty(PropIdent.BlackMove, ['cd']);
      deepEqual(node.move, { x: 2, y: 3, c: Color.B });
    });

    it('setSGFProperties', () => {
      const node = new KifuNode();
      node.setSGFProperties({
        [PropIdent.AddBlack]: ['cd', 'ef'],
        [PropIdent.Circle]: ['cd', 'ef'],
      });
      deepEqual(node.setup, [
        { x: 2, y: 3, c: Color.B },
        { x: 4, y: 5, c: Color.B },
      ]);
      deepEqual(node.markup, [
        { x: 2, y: 3, type: MarkupType.Circle },
        { x: 4, y: 5, type: MarkupType.Circle },
      ]);
    });

    it('setSGFProperties string argument', () => {
      const node = new KifuNode();
      node.setSGFProperties('AB[cd]CR[cd]');
      deepEqual(node.setup, [{ x: 2, y: 3, c: Color.B }]);
      deepEqual(node.markup, [{ x: 2, y: 3, type: MarkupType.Circle }]);
    });

    it('Overriding of setSGFProperty setup', () => {
      const node = new KifuNode();
      node.setSGFProperty(PropIdent.AddBlack, ['cd', 'ef']);
      node.setSGFProperty(PropIdent.AddWhite, ['cd']);
      node.setSGFProperty(PropIdent.AddBlack, ['ab']);
      deepEqual(node.setup, [
        { x: 2, y: 3, c: Color.W },
        { x: 0, y: 1, c: Color.B },
      ]);
    });

    it('Overriding of setSGFProperty markup', () => {
      const node = new KifuNode();
      node.setSGFProperty(PropIdent.Circle, ['cd', 'ef']);
      node.setSGFProperty(PropIdent.Triangle, ['cd']);
      node.setSGFProperty(PropIdent.Circle, ['ab']);
      deepEqual(node.markup, [
        { x: 2, y: 3, type: MarkupType.Triangle },
        { x: 0, y: 1, type: MarkupType.Circle },
      ]);
    });
  });

  describe('KifuNode common methods.', () => {
    it('addSetup()', () => {
      const node = new KifuNode();

      node.addSetup({ x: 2, y: 3 }, Color.B);
      node.addSetup({ x: 3, y: 4 }, Color.W);

      node.addSetup({ x: 5, y: 6 }, Color.B);
      node.addSetup({ x: 5, y: 6 }, Color.W);
      node.addSetup({ x: 5, y: 6 }, Color.E);
      node.addSetup({ x: 5, y: 6 }, Color.E);

      deepEqual(node.setup, [
        { x: 2, y: 3, c: Color.B },
        { x: 3, y: 4, c: Color.W },
        { x: 5, y: 6, c: Color.E },
      ]);
    });

    it('removeSetupAt()', () => {
      const node = new KifuNode();
      node.setup = [
        { x: 2, y: 3, c: Color.B },
        { x: 4, y: 5, c: Color.W },
      ];
      node.removeSetupAt({ x: 2, y: 3 });
      deepEqual(node.setup, [{ x: 4, y: 5, c: Color.W }]);
    });

    it('addMarkup()', () => {
      const node = new KifuNode();

      node.addMarkup({ type: MarkupType.Circle, x: 2, y: 3 });
      node.addMarkup({ type: MarkupType.Label, text: 'X', x: 2, y: 3 });
      node.addMarkup({ type: MarkupType.Arrow, x1: 2, y1: 3, x2: 4, y2: 5 });
      node.addMarkup({ type: MarkupType.Arrow, x1: 2, y1: 3, x2: 4, y2: 5 });

      deepEqual(node.markup, [
        { type: MarkupType.Circle, x: 2, y: 3 },
        { type: MarkupType.Label, text: 'X', x: 2, y: 3 },
        { type: MarkupType.Arrow, x1: 2, y1: 3, x2: 4, y2: 5 },
      ]);
    });

    it('removeMarkupAt()', () => {
      const node = new KifuNode();

      node.addMarkup({ type: MarkupType.Circle, x: 2, y: 3 });
      node.addMarkup({ type: MarkupType.Label, text: 'X', x: 2, y: 3 });
      node.addMarkup({ type: MarkupType.Arrow, x1: 2, y1: 3, x2: 4, y2: 5 });
      node.addMarkup({ type: MarkupType.Dim, x: 4, y: 5 });

      node.removeMarkupAt({ x: 2, y: 3 });

      deepEqual(node.markup, [
        { type: MarkupType.Arrow, x1: 2, y1: 3, x2: 4, y2: 5 },
        { type: MarkupType.Dim, x: 4, y: 5 },
      ]);
    });

    it('removeMarkup()', () => {
      const node = new KifuNode();

      node.addMarkup({ type: MarkupType.Circle, x: 2, y: 3 });
      node.addMarkup({ type: MarkupType.Label, text: 'X', x: 2, y: 3 });
      node.addMarkup({ type: MarkupType.Arrow, x1: 2, y1: 3, x2: 4, y2: 5 });
      node.addMarkup({ type: MarkupType.Dim, x: 4, y: 5 });

      node.removeMarkup({ type: MarkupType.Circle, x: 2, y: 3 });
      node.removeMarkup({ type: MarkupType.Arrow, x1: 2, y1: 3, x2: 4, y2: 5 });
      node.removeMarkup({ type: MarkupType.Label, text: 'X', x: 2, y: 3 });

      deepEqual(node.markup, [{ type: MarkupType.Dim, x: 4, y: 5 }]);
    });
  });

  describe('Correct handling of special characters', () => {
    it('Escaping of characters', () => {
      const node = new KifuNode();
      node.setSGFProperties({
        C: ['AB[hm][fk]\\'],
      });
      strictEqual(node.comment, 'AB[hm][fk]\\');
      strictEqual(node.getSGFProperties(), 'C[AB[hm\\][fk\\]\\\\]');
    });
  });

  describe('Configuring of Kifu node', () => {
    it('Adding custom markup', () => {
      KifuNode.defineProperties({
        FOO: KifuNode.createPointMarkupDescriptor('FOO' as any),
        BAR: KifuNode.createLineMarkupDescriptor('BAR' as any),
      });
      const node = KifuNode.fromSGF('B[ab]FOO[ab]BAR[cd:ef]TR[ef]');

      deepEqual(node.move, { x: 0, y: 1, c: Color.B });
      deepEqual(node.markup, [
        { x: 0, y: 1, type: 'FOO' },
        { x1: 2, y1: 3, x2: 4, y2: 5, type: 'BAR' },
        { x: 4, y: 5, type: 'TR' },
      ]);

      ok(node.getSGFProperties().indexOf('B[ab]') !== -1);
      ok(node.getSGFProperties().indexOf('FOO[ab]') !== -1);
      ok(node.getSGFProperties().indexOf('BAR[cd:ef]') !== -1);
      ok(node.getSGFProperties().indexOf('TR[ef]') !== -1);
    });
  });
});
