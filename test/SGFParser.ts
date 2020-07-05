import { deepEqual, throws } from 'assert';
import SGFParser, { SGFSyntaxError } from '../src/SGFParser';

describe('SGFParser', () => {
  describe('Parsing properties - parseProperties()', () => {

  });

  describe('Parsing nodes - parseNode()', () => {
    it('Parsing empty value', () => {
      const parser = new SGFParser(';DM[]');
      deepEqual(parser.parseNode(), { DM: [] });
    });

    it('Parsing single value', () => {
      const parser = new SGFParser(';B[aa]');
      deepEqual(parser.parseNode(), { B: ['aa'] });
    });

    it('Parsing multiple values', () => {
      const parser = new SGFParser(';AB[aa][bb][cc]');
      deepEqual(parser.parseNode(), { AB: ['aa', 'bb', 'cc'] });
    });

    it('Parsing special characters', () => {
      const parser = new SGFParser(';C[SGF property:\nC\\[\\\\\\]]');
      deepEqual(parser.parseNode(), { C: ['SGF property:\nC[\\]'] });
    });

    it('Parsing multiple properties', () => {
      const parser = new SGFParser(';W[aa]C[foo bar]SQ[ab][ba]');
      deepEqual(parser.parseNode(), { W: ['aa'], C: ['foo bar'], SQ: ['ab', 'ba'] });
    });

    it('Correctly ignoring whitespace characters', () => {
      const parser = new SGFParser(' ; \nB [aa] TR\n[ab]\n[ba]');
      deepEqual(parser.parseNode(), { B: ['aa'], TR: ['ab', 'ba'] });
    });

    // TODO: not sure how to do it
    /*it('Throws error when prop ident is invalid', () => {
      const parser = new SGFParser(';w[aa]');
      // TODO: throws exact error object
      throws(() => parser.parseNode(), SGFSyntaxError);
    });*/

    it('Throws error when value is missing', () => {
      const parser = new SGFParser(';W');
      // TODO: throws exact error object
      throws(() => parser.parseNode(), SGFSyntaxError);
    });

    it('Throws error when closing bracket is missing', () => {
      const parser = new SGFParser(';B[aa');
      // TODO: throws exact error object
      throws(() => parser.parseNode(), SGFSyntaxError);
    });

    it('Correctly parses a node', () => {
      const parser = new SGFParser(';AB[aa]AW[bb][cc]');
      deepEqual(parser.parseNode(), { AB: ['aa'], AW: ['bb', 'cc'] });
    });

    it('Correctly parses an empty node', () => {
      const parser = new SGFParser(';');
      deepEqual(parser.parseNode(), { });
    });

    it('Throws error when node isn\'t starting with `;`.', () => {
      const parser = new SGFParser('B[aa]');
      // TODO: throws exact error object
      throws(() => parser.parseNode(), SGFSyntaxError);
    });
  });

  describe('Parsing node sequence - parseSequence()', () => {
    it('Correctly parses a node sequence', () => {
      const parser = new SGFParser(';DT[2100-12-01]KM[7.5];B[aa];W[bb]');
      deepEqual(parser.parseSequence(), [{ DT: ['2100-12-01'], KM: ['7.5'] }, { B: ['aa'] }, { W: ['bb'] }]);
    });

    it('Correctly ignoring whitespace characters', () => {
      const parser = new SGFParser('; B[aa] ; ;\nW[bb]');
      deepEqual(parser.parseSequence(), [{ B: ['aa'] }, {}, { W: ['bb'] }]);
    });
  });

  describe('Parsing a game tree - parseGameTree()', () => {
    it('Correctly parses simple game tree without children', () => {
      const parser = new SGFParser('(;DT[2100-12-01]KM[7.5];B[aa];W[bb])');
      deepEqual(parser.parseGameTree(), {
        sequence: [{ DT: ['2100-12-01'], KM: ['7.5'] }, { B: ['aa'] }, { W: ['bb'] }],
        children: [],
      });
    });

    it('Correctly parses game tree with children', () => {
      const parser = new SGFParser('(;DT[2100-12-01]KM[7.5](;B[aa];W[bb](;B[ee])(;B[ff]))(;B[cc];W[dd]))');
      deepEqual(parser.parseGameTree(), {
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
      });
    });

    it('Throws error when game tree isn\' closed.', () => {
      const parser = new SGFParser('(;B[aa](;W[ee](;W[ff]))');
      // TODO: throws exact error object
      throws(() => parser.parseGameTree());
    });
  });

  describe('Parsing a SGF - parseCollection()', () => {
    it('Correctly parses SGF.', () => {
      const parser = new SGFParser('(;DT[2100-12-01](;B[aa])(;B[bb]))(;KM[7.5])');
      deepEqual(parser.parseCollection(), [{
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
      }, {
        sequence: [{ KM: ['7.5'] }],
        children: [],
      }]);
    });

    it('Throws error when there is no game tree.', () => {
      const parser = new SGFParser(';B[aa]');
      // TODO: throws exact error object
      throws(() => parser.parseCollection(), SGFSyntaxError);
    });
  });
});
