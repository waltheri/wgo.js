/* Test of WGo kifu classes and functionality */

import { strictEqual, deepEqual, throws, equal, ok as assert } from 'assert';
import { Color } from '../src/types';
import KifuNode from '../src/kifu/KifuNode';
import { SGFSyntaxError } from '../src/SGFParser';
import propertyValueTypes from '../src/kifu/propertyValueTypes';
import { PropIdent } from '../src/SGFParser/sgfTypes';

describe('SGF & KifuNode', () => {
  describe('Correct transformation of property values.', () => {
    it('No value properties (eg: KO)', () => {
      strictEqual(propertyValueTypes.KO.transformer.read(''), true);
      strictEqual(propertyValueTypes.KO.transformer.write(true), '');
    });

    it('Numeric properties (eg: MN)', () => {
      strictEqual(propertyValueTypes.MN.transformer.read('10'), 10);
      strictEqual(propertyValueTypes.MN.transformer.write(10), '10');
    });

    it('Text properties (C)', () => {
      strictEqual(propertyValueTypes.C.transformer.read('Hello\nworld'), 'Hello\nworld');
      strictEqual(propertyValueTypes.C.transformer.write('Hello\nworld'), 'Hello\nworld');
    });

    it('Color properties (PL)', () => {
      strictEqual(propertyValueTypes.PL.transformer.read('B'), Color.BLACK);
      strictEqual(propertyValueTypes.PL.transformer.read('W'), Color.WHITE);
      strictEqual(propertyValueTypes.PL.transformer.write(Color.BLACK), 'B');
      strictEqual(propertyValueTypes.PL.transformer.write(Color.WHITE), 'W');
    });

    it('Point properties (moves, setups)', () => {
      deepEqual(propertyValueTypes.B.transformer.read('hm'), { x: 7, y: 12 });
      deepEqual(propertyValueTypes.AW.transformer.read('fk'), { x: 5, y: 10 });
      deepEqual(propertyValueTypes.B.transformer.write({ x: 7, y: 12 }), 'hm');
      deepEqual(propertyValueTypes.AW.transformer.write({ x: 5, y: 10 }), 'fk');
    });

    it('Empty point properties', /*() => {
      deepEqual(propertyValueTypes.B.transformer.read(undefined), false);
      deepEqual(propertyValueTypes.W.transformer.read(''), false);
      deepEqual(propertyValueTypes.B.transformer.write(false), '');
      deepEqual(propertyValueTypes.W.transformer.write(false), '');
    }*/);

    it('Label property (LB)', () => {
      deepEqual(propertyValueTypes.LB.transformer.read('hm:Hello'), { x: 7, y: 12, text: 'Hello' });
      deepEqual(propertyValueTypes.LB.transformer.write({ x: 7, y: 12, text: 'Hello' }), 'hm:Hello');
    });

    it('Line properties (AR, LN)', /*() => {
      deepEqual(propertyValueTypes.AR.transformer.read('hm:fk'), { x1: 7, y1: 12, x2: 5, y2: 10 });
      deepEqual(propertyValueTypes.AR.transformer.write({ x1: 7, y1: 12, x2: 5, y2: 10 }), 'hm:fk');
    }*/);
  });

  describe('KifuNode#getPath()', () => {
    it('Returns correct depth', () => {
      const node1 = new KifuNode();
      const node2 = new KifuNode();
      const node3 = new KifuNode();
      node1.appendChild(node2);
      node2.appendChild(node3);

      deepEqual(node1.getPath(), { depth: 0, forks: [] });
      deepEqual(node2.getPath(), { depth: 1, forks: [] });
      deepEqual(node3.getPath(), { depth: 2, forks: [] });
    });

    it('Returns correct forks', () => {
      const node1 = new KifuNode();
      const node11 = new KifuNode();
      const node12 = new KifuNode();
      const node111 = new KifuNode();
      const node1111 = new KifuNode();
      const node1112 = new KifuNode();
      const node121 = new KifuNode();
      const node122 = new KifuNode();

      node1.appendChild(node11);
      node1.appendChild(node12);

      node11.appendChild(node111);
      node12.appendChild(node121);
      node12.appendChild(node122);

      node111.appendChild(node1111);
      node111.appendChild(node1112);

      deepEqual(node11.getPath(), { depth: 1, forks: [0] });
      deepEqual(node12.getPath(), { depth: 1, forks: [1] });
      deepEqual(node111.getPath(), { depth: 2, forks: [0] });
      deepEqual(node1111.getPath(), { depth: 3, forks: [0, 0] });
      deepEqual(node1112.getPath(), { depth: 3, forks: [0, 1] });
      deepEqual(node121.getPath(), { depth: 2, forks: [1, 0] });
      deepEqual(node122.getPath(), { depth: 2, forks: [1, 1] });
    });
  });

  describe("KifuNode's node manipulation methods.", () => {
    let rootNode: KifuNode;
    let node1: KifuNode;
    let node2: KifuNode;
    let node3: KifuNode;

    beforeEach(() => {
      rootNode = new KifuNode();
      // rootNode.gameInfo = {}; // provisional game info
      // rootNode.kifuInfo = {}; // provisional kifu info

      node1 = new KifuNode();
      node2 = new KifuNode();
      node3 = new KifuNode();
    });

    it('appendChild()', () => {
      rootNode.appendChild(node1);
      rootNode.appendChild(node2);

      strictEqual(rootNode.children.length, 2);
      strictEqual(rootNode.children[0], node1);
      strictEqual(rootNode.children[1], node2);
      strictEqual(node1.parent, rootNode);
      throws(() => { rootNode.appendChild(rootNode); }, Error);

      node2.appendChild(node1);

      strictEqual(rootNode.children.length, 1);
      assert(rootNode.children.indexOf(node1) === -1);
      strictEqual(node1.parent, node2);
    });

    it('contains()', () => {
      node1.appendChild(node2);
      rootNode.appendChild(node1);

      strictEqual(rootNode.contains(node1), true);
      strictEqual(rootNode.contains(node2), true);
      strictEqual(rootNode.contains(node3), false);
    });

    it('insertBefore()', () => {
      node3.appendChild(node2);

      rootNode.appendChild(node1);
      rootNode.insertBefore(node2, node1);

      strictEqual(rootNode.children.length, 2);
      strictEqual(rootNode.children[0], node2);
      strictEqual(rootNode.children[1], node1);
      strictEqual(node2.parent, rootNode);

      assert(node3.children.indexOf(node2) === -1);
    });

    it('removeChild()', () => {
      rootNode.appendChild(node1);
      rootNode.removeChild(node1);

      strictEqual(rootNode.children.length, 0);
      assert(rootNode.children.indexOf(node1) === -1);
      equal(node1.parent, null);
    });

    it('replaceChild()', () => {
      rootNode.appendChild(node1);
      node3.appendChild(node2);
      rootNode.replaceChild(node2, node1);

      strictEqual(rootNode.children.length, 1);
      strictEqual(rootNode.children[0], node2);

      strictEqual(node2.parent, rootNode);

      equal(node1.parent, null);
      assert(node3.children.indexOf(node2) === -1);
    });

    it('root property', () => {
      rootNode.appendChild(node1);
      node1.appendChild(node2);

      strictEqual(rootNode.root, rootNode);
      strictEqual(node1.root, rootNode);
      strictEqual(node2.root, rootNode);

      rootNode.removeChild(node1);
      strictEqual(node2.root, node1);
    });

    it('cloneNode()', /*() => {
      node1.SGFProperties.B = { x: 5, y: 10 };
      node2.SGFProperties.W = { x: 7, y: 12 };
      node1.appendChild(node2);

      node3 = node1.cloneNode();
      deepEqual(node1, node3);

      node2.SGFProperties.W.y = 13;
      notDeepEqual(node1, node3);

      node3 = node2.cloneNode();
      notDeepEqual(node2, node3);

      node3 = node2.cloneNode(true);
      deepEqual(node2, node3);
    }*/);
  });

  describe("KifuNode's setSGFProperty method", () => {
    let node: KifuNode;
    let move1: any;
    let move2: any;

    beforeEach(() => {
      node = new KifuNode();
      move1 = {
        s: 'fk',
        c: { x: 5, y: 10 },
      };
      move2 = {
        s: 'hm',
        c: { x: 7, y: 12 },
      };
    });

    it('Simple setProperty() method', () => {
      node.setProperty('B', move1.c);
      deepEqual(node.SGFProperties, { B: move1.c });

      node.setProperty('B');
      deepEqual(node.SGFProperties, {});
    });

    /*it('Set single value property', () => {
      node.setSGFProperty('B', '[' + move1.s + ']');
      deepEqual(node.SGFProperties, { B: move1.c });

      node.setSGFProperty('SZ', ['19']);
      deepEqual(node.SGFProperties, { B: move1.c, SZ: 19 });
    });

    it('Set single value empty property', () => {
      node.setSGFProperty('KO', '[]');
      deepEqual(node.SGFProperties, { KO: true });

      node.setSGFProperty('DO', ['']);
      deepEqual(node.SGFProperties, { KO: true, DO: true });

      node.setSGFProperty('GC', '[Hello]');
      node.setSGFProperty('CA', ['WGo']);

      deepEqual(node.SGFProperties, { KO: true, DO: true, GC: 'Hello', CA: 'WGo' });

      node.setSGFProperty('GC', '[]');
      node.setSGFProperty('CA', ['']);

      deepEqual(node.SGFProperties, { KO: true, DO: true });
      deepEqual(node.SGFProperties, { KO: true, DO: true });
    });

    it('Set multiple value property', () => {
      node.setSGFProperty('AB', '[' + move1.s + '][' + move2.s + ']');
      deepEqual(node.SGFProperties, { AB: [move1.c, move2.c] });

      node.setSGFProperty('VW', [move1.s, move2.s]);
      deepEqual(node.SGFProperties, { AB: [move1.c, move2.c], VW: [move1.c, move2.c] });
    });

    it('Set multiple value empty property', () => {
      node.setSGFProperty('AW', '[]');
      deepEqual(node.SGFProperties, {});

      node.setSGFProperty('LB', []);
      deepEqual(node.SGFProperties, {});

      node.setSGFProperty('VW', ['']);
      assert(node.SGFProperties.VW && !node.SGFProperties.VW[0]);

      node.setSGFProperty('DD', '[]');
      assert(node.SGFProperties.DD && !node.SGFProperties.DD[0]);
    });

    it('Passes working properly (W[], B[])', () => {
      node.setSGFProperty('B', '[]');
      deepEqual(node.SGFProperties, { B: false });

      node.setSGFProperty('W', ['']);
      deepEqual(node.SGFProperties, { B: false, W: false });
    });

    it('Comment property(C)', () => {
      node.setSGFProperty('C', ['simple']);
      deepEqual(node.SGFProperties, { C: 'simple' });

      node.setSGFProperty('C', '[Hello \\\nWorld! 碁\n][\\[\\]\\:\\\\]');
      deepEqual(node.SGFProperties, { C: 'Hello World! 碁\n[]:\\' });

      node.setSGFProperty('C', '[]');
      deepEqual(node.SGFProperties, {});
    });*/
  });

  /*describe("KifuNode's getSGFProperty() method and innerSGF property getter", () => {
    let node;

    beforeEach(() => {
      node = new KifuNode();
      node.setSGFProperties({
        AB: '[hm][fk]',
        IT: '[]',
        W: [''],
        C: '[AB[hm\\][fk\\]]',
      });
    });

    it('Simple getProperty() method', () => {
      deepEqual(node.getProperty('AB'), [{ x: 7, y: 12 }, { x: 5, y: 10 }]);
      strictEqual(node.getProperty('W'), false);
      strictEqual(node.getProperty('IT'), true);
      strictEqual(node.getProperty('C'), 'AB[hm][fk]');
    });

    it('Basic properties', () => {
      strictEqual(node.getSGFProperty('AB'), '[hm][fk]');
    });

    it('Properties with empty value', () => {
      strictEqual(node.getSGFProperty('IT'), '[]');
      strictEqual(node.getSGFProperty('W'), '[]');
    });

    it('Correct escaping of values', () => {
      strictEqual(node.getSGFProperty('C'), '[AB[hm\\][fk\\]]');
    });

    it('node.innerSGF with no children', () => {
      strictEqual(node.innerSGF, 'AB[hm][fk]IT[]W[]C[AB[hm\\][fk\\]]');
    });

    it('node.innerSGF with one child', () => {
      const child = new KifuNode();
      child.setSGFProperty('B', ['fk']);
      child.appendChild(node);
      strictEqual(child.innerSGF, 'B[fk];AB[hm][fk]IT[]W[]C[AB[hm\\][fk\\]]');
    });

    it('node.innerSGF with more children', () => {
      const child1 = new KifuNode();
      const child2 = new KifuNode();

      child1.setSGFProperty('B', ['fk']);
      node.appendChild(child1);

      child2.setSGFProperty('B', '[hm]');
      node.appendChild(child2);

      strictEqual(node.innerSGF, 'AB[hm][fk]IT[]W[]C[AB[hm\\][fk\\]](;B[fk])(;B[hm])');
    });
  });*/

  /*describe("(5) KifuNode's innerSGF property setter", () => {
    let node: KifuNode;
    let move1;
    let move2;

    beforeEach(() => {
      node = new KifuNode();
      move1 = {
        s: 'fk',
        c: { x: 5, y: 10 },
      };
      move2 = {
        s: 'hm',
        c: { x: 7, y: 12 },
      };
    });

    it('Set only properties', () => {
      node.innerSGF = 'AB[' + move1.s + '][' + move2.s + ']IT[]C[Hello]';
      deepEqual(node.SGFProperties, {
        AB: [move1.c, move2.c],
        IT: true,
        C: 'Hello',
      });
    });

    it('Set properties with special characters', () => {
      node.innerSGF = 'B[' + move1.s + ']C[碁\\\\\\];(\\\n\\n\\\\]';
      deepEqual(node.SGFProperties, {
        B: move1.c,
        C: '碁\\];(n\\',
      });
    });

    it('Remove all old properties', () => {
      node.setSGFProperty('SQ', ['hm']);
      node.appendChild(new KifuNode());

      node.innerSGF = 'CR[' + move1.s + ']';

      deepEqual(node.SGFProperties, {
        CR: [move1.c],
      });

      deepEqual(node.children, []);
    });

    it('Set just child nodes', () => {
      node.innerSGF = ';W[' + move1.s + '];B[' + move2.s + ']';

      deepEqual(node.SGFProperties, {});

      deepEqual(node.children[0].SGFProperties, { W: move1.c });
      deepEqual(node.children[0].children[0].SGFProperties, { B: move2.c });
    });

    it('Set multiple properties and children', () => {
      node.innerSGF = 'AW[' + move1.s + ']C[Cool!](;W[' + move2.s + ']C[)(])(;W[];)';

      deepEqual(node.SGFProperties, {
        AW: [move1.c],
        C: 'Cool!',
      });

      strictEqual(node.children.length, 2);

      deepEqual(node.children[0].SGFProperties, {
        W: move2.c,
        C: ')(',
      });

      deepEqual(node.children[1].SGFProperties, {
        W: false,
      });

      strictEqual(node.children[1].children.length, 1);

      deepEqual(node.children[1].children[0].SGFProperties, {});
    });

    it('Whitespaces in SGF', () => {
      node.innerSGF = 'AW\n [' + move1.s + '] \n  C[Co  \nol!] \n ( ; W\n[' + move2.s + ']C [)(] ) \n (\n;W[] ; )\n ';

      deepEqual(node.SGFProperties, {
        AW: [move1.c],
        C: 'Co  \nol!',
      });

      strictEqual(node.children.length, 2);

      deepEqual(node.children[0].SGFProperties, {
        W: move2.c,
        C: ')(',
      });

      deepEqual(node.children[1].SGFProperties, {
        W: false,
      });

      strictEqual(node.children[1].children.length, 1);

      deepEqual(node.children[1].children[0].SGFProperties, {});
    });

    it('Invalid SGF throws an error', () => {
      throws( () => {
        node.innerSGF = 'AW[fk]C[Cool!];W[hn]C';
      }, SGFSyntaxError);

      throws( () => {
        node.innerSGF = 'AW[fk]C[Cool!];W[hn]C[)(])(;W[hm];)';
      }, SGFSyntaxError);

      throws( () => {
        node.innerSGF = 'AW[fk]C[Cool!];W[hn]C[)(](;W[hm]';
      }, SGFSyntaxError);
    });
  });*/

  describe('Static methods KifuNode.fromSGF() and KifuNode.toSGF()', () => {
    it('KifuNode#fromSGF()', () => {
      const node = KifuNode.fromSGF('(;SZ[19];AB[dp]AW[pd];AE[dp][pd])');

      equal(node.getProperty(PropIdent.BOARD_SIZE), 19);
      equal(node.children.length, 1);
      deepEqual(node.children[0].getProperty(PropIdent.ADD_BLACK), [{ x: 3, y: 15 }]);
      deepEqual(node.children[0].getProperty(PropIdent.ADD_WHITE), [{ x: 15, y: 3 }]);
      equal(node.children[0].children.length, 1);
      deepEqual(node.children[0].children[0].getProperty(PropIdent.CLEAR_FIELD), [{ x: 3, y: 15 }, { x: 15, y: 3 }]);
      equal(node.children[0].children[0].children.length, 0);
    });

    it('KifuNode.fromSGF(sgf).toSGF() == sgf', /*() => {
      // tslint:disable-next-line:max-line-length
      strictEqual(KifuNode.fromSGF(
        '(;FF[4]SZ[19];AB[hm][fk]IT[]W[]C[AB[hm\\][fk\\]](;B[fk])(;B[hm]))').toSGF(),
        '(;FF[4]SZ[19];AB[hm][fk]IT[]W[]C[AB[hm\\][fk\\]](;B[fk])(;B[hm]))'),
      );
    }*/);
  });

  /*describe("(2) Kifu specific methods.", function() {
    var node;

    beforeEach(function() {
      node = new KifuNode();
    });

    it("addSetup()", function() {
      node.addSetup({x:5, y:10, c: WGo.B});
      strictEqual(node.setup["5:10"], WGo.B);
      deepEqual(node.SGFProperties, {AB: ["fk"]});

      node.addSetup([{x:7, y:12, c: WGo.W}, {x:5, y:10, c: WGo.E}]);
      strictEqual(node.setup["7:12"], WGo.W);
      strictEqual(node.setup["5:10"], WGo.E);

      deepEqual(node.SGFProperties, {AW: ["hm"], AE: ["fk"]});
    });

    it("removeSetup()", function() {
      node.addSetup([{x:5, y:10, c: WGo.B}, {x:7, y:12, c: WGo.B}]);
      node.removeSetup({x:5, y:10});

      equal(node.setup["5:10"], null);
      strictEqual(node.setup["7:12"], WGo.B);
      deepEqual(node.SGFProperties, {AB: ["hm"]});
    });

    it("addMarkup()", function() {
      var m1, m2, m3;
      node.addMarkup(m1 = {x:5, y:10, type: "CR"});
      strictEqual(node.markup["5:10"], m1);
      deepEqual(node.SGFProperties.CR, ["fk"]);

      node.addMarkup([m2 = {x:7, y:12, type: "MA"}, m3 = {x:5, y:10, type: "LB", text: ":-)"}]);
      strictEqual(node.markup["7:12"], m2);
      strictEqual(node.markup["5:10"], m3);

      deepEqual(node.SGFProperties, {MA: ["hm"], LB: ["fk::-)"]});
    });

    it("removeMarkup()", function() {
      node.addMarkup([{x:5, y:10, type: "CR"}, {x:7, y:12, type: "CR"}]);
      node.removeMarkup([{x:5, y:10}]);

      equal(node.markup["5:10"], null);
      deepEqual(node.markup["7:12"], {x:7, y:12, type: "CR"});
      deepEqual(node.SGFProperties, {CR: ["hm"]});
    });

    it("setMove(), setTurn(), getTurn()", function() {
      node.setMove({x:5, y:10, c:WGo.B});
      strictEqual(node.getTurn(), WGo.W);
      node.setTurn(WGo.B);
      strictEqual(node.getTurn(), WGo.B);
      deepEqual(node.SGFProperties, {B: ["fk"], PL: ["B"]});
    });

    it("setComment()", function() {
      node.setComment("Hello World!\n[]:\\");
      strictEqual(node.comment, "Hello World!\n[]:\\");
      deepEqual(node.SGFProperties, {C: ["Hello World!\n[]:\\"]});
    });
  });*/

  /*describe("(2) SGF -> Kifu, Kifu -> SGF", function() {
    it("KifuNode's innerSGF property.");
    it("Parse SGF.");
    it("SGF to Kifu object.");
  });
  describe("(3) Kifu -> JGo, JGo -> Kifu.", function() {

  });*/
});
