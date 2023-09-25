import { deepEqual, throws } from 'assert';
import { SGFSyntaxError, SGFParser } from '../src/SGFParser';

describe('SGFParser', () => {
  const parser = new SGFParser();

  describe('Parsing properties - parseProperties()', () => {});

  describe('Parsing nodes - parseNode()', () => {
    it('Parsing empty value', () => {
      deepEqual(parser.parseNode(';DM[]'), { DM: [''] });
    });

    it('Parsing single value', () => {
      deepEqual(parser.parseNode(';B[aa]'), { B: ['aa'] });
    });

    it('Parsing multiple values', () => {
      deepEqual(parser.parseNode(';AB[aa][bb][cc]'), { AB: ['aa', 'bb', 'cc'] });
    });

    it('Parsing special characters', () => {
      deepEqual(parser.parseNode(';C[SGF property:\nC\\[\\\\\\]]'), {
        C: ['SGF property:\nC[\\]'],
      });
    });

    it('Parsing multiple properties', () => {
      deepEqual(parser.parseNode(';W[aa]C[foo bar]SQ[ab][ba]'), {
        W: ['aa'],
        C: ['foo bar'],
        SQ: ['ab', 'ba'],
      });
    });

    it('Correctly ignoring whitespace characters', () => {
      deepEqual(parser.parseNode(' ; \nB [aa] TR\n[ab]\n[ba]'), { B: ['aa'], TR: ['ab', 'ba'] });
    });

    // TODO: not sure how to do it
    /*it('Throws error when prop ident is invalid', () => {
      const parser = new SGFParser(';w[aa]');
      // TODO: throws exact error object
      throws(() => parser.parseNode(), SGFSyntaxError);
    });*/

    it('Throws error when value is missing', () => {
      // TODO: throws exact error object
      throws(() => parser.parseNode(';W'), SGFSyntaxError);
    });

    it('Throws error when closing bracket is missing', () => {
      // TODO: throws exact error object
      throws(() => parser.parseNode(';B[aa'), SGFSyntaxError);
    });

    it('Correctly parses a node', () => {
      deepEqual(parser.parseNode(';AB[aa]AW[bb][cc]'), { AB: ['aa'], AW: ['bb', 'cc'] });
    });

    it('Correctly parses an empty node', () => {
      deepEqual(parser.parseNode(';'), {});
    });

    it("Throws error when node isn't starting with `;`.", () => {
      // TODO: throws exact error object
      throws(() => parser.parseNode('B[aa]'), SGFSyntaxError);
    });
  });

  describe('Parsing node sequence - parseSequence()', () => {
    it('Correctly parses a node sequence', () => {
      deepEqual(parser.parseSequence(';DT[2100-12-01]KM[7.5];B[aa];W[bb]'), [
        { DT: ['2100-12-01'], KM: ['7.5'] },
        { B: ['aa'] },
        { W: ['bb'] },
      ]);
    });

    it('Correctly ignoring whitespace characters', () => {
      deepEqual(parser.parseSequence('; B[aa] ; ;\nW[bb]'), [{ B: ['aa'] }, {}, { W: ['bb'] }]);
    });
  });

  describe('Parsing a game tree - parseGameTree()', () => {
    it('Correctly parses simple game tree without children', () => {
      deepEqual(parser.parseGameTree('(;DT[2100-12-01]KM[7.5];B[aa];W[bb])'), {
        sequence: [{ DT: ['2100-12-01'], KM: ['7.5'] }, { B: ['aa'] }, { W: ['bb'] }],
        children: [],
      });
    });

    it('Correctly parses game tree with children', () => {
      deepEqual(
        parser.parseGameTree(
          '(;DT[2100-12-01]KM[7.5](;B[aa];W[bb](;B[ee])(;B[ff]))(;B[cc];W[dd]))',
        ),
        {
          sequence: [{ DT: ['2100-12-01'], KM: ['7.5'] }],
          children: [
            {
              sequence: [{ B: ['aa'] }, { W: ['bb'] }],
              children: [
                {
                  sequence: [{ B: ['ee'] }],
                  children: [],
                },
                {
                  sequence: [{ B: ['ff'] }],
                  children: [],
                },
              ],
            },
            {
              sequence: [{ B: ['cc'] }, { W: ['dd'] }],
              children: [],
            },
          ],
        },
      );
    });

    it("Throws error when game tree isn' closed.", () => {
      // TODO: throws exact error object
      throws(() => parser.parseGameTree('(;B[aa](;W[ee](;W[ff]))'));
    });
  });

  describe('Parsing a SGF - parseCollection()', () => {
    it('Correctly parses SGF.', () => {
      deepEqual(parser.parseCollection('(;DT[2100-12-01](;B[aa])(;B[bb]))(;KM[7.5])'), [
        {
          sequence: [{ DT: ['2100-12-01'] }],
          children: [
            {
              sequence: [{ B: ['aa'] }],
              children: [],
            },
            {
              sequence: [{ B: ['bb'] }],
              children: [],
            },
          ],
        },
        {
          sequence: [{ KM: ['7.5'] }],
          children: [],
        },
      ]);
    });

    it('Throws error when there is no game tree.', () => {
      // TODO: throws exact error object
      throws(() => parser.parseCollection(';B[aa]'), SGFSyntaxError);
    });
  });
});
