import { strictEqual, deepEqual, notDeepEqual } from 'assert';
import { Kifu, KifuInfo, KifuNode } from '../src/kifu';
import { Color } from '../src/types';

describe('Kifu object', () => {
  it('Create empty Kifu', () => {
    const kifu = new Kifu();
    deepEqual(kifu.root, new KifuNode());
    deepEqual(kifu.info, new KifuInfo());
  });

  it('Create kifu from SGF', () => {
    const kifu = Kifu.fromSGF('(;FF[4]SZ[19]AB[ab];B[cd];W[ef])');
    strictEqual(kifu.info.boardSize, 19);
    deepEqual(kifu.info.properties, { FF: ['4'] });
    deepEqual(kifu.root.setup, [{ x: 0, y: 1, c: Color.B }]);
    deepEqual(kifu.info.properties, { FF: ['4'] });
    deepEqual(kifu.root.children[0].move, { x: 2, y: 3, c: Color.B });
    deepEqual(
      kifu.root.children[0].children[0],
      KifuNode.fromJS({ move: { x: 4, y: 5, c: Color.W } }),
    );
  });

  it('Convert kifu into JSON and back', () => {
    const kifu = Kifu.fromSGF('(;FF[4]SZ[19]AB[ab];B[cd];W[ef])');
    const json = JSON.stringify(kifu.toJS());
    const kifu2 = Kifu.fromJS(JSON.parse(json));
    deepEqual(kifu, kifu2);
  });

  it('Cloning of kifu', () => {
    const kifu = Kifu.fromSGF('(;FF[4]SZ[19]AB[ab];B[cd];W[ef])');
    const kifu2 = kifu.clone();
    deepEqual(kifu, kifu2);
    kifu2.root.children[0].move!.c = Color.W;
    notDeepEqual(kifu, kifu2);
  });

  it('Convert to SGF', () => {
    const kifu = Kifu.fromSGF('(;SZ[19]AB[ab];B[cd];W[ef])');
    strictEqual(kifu.toSGF(), '(;SZ[19]AB[ab];B[cd];W[ef])');
  });

  it('Convert to SGF with variations', () => {
    const kifu = new Kifu();
    kifu.info.gameComment = 'Game comment';
    kifu.root.setSGFProperty('AB', ['ab']);
    kifu.root.children.push(KifuNode.fromJS({ move: { x: 2, y: 3, c: Color.B } }));
    kifu.root.children.push(KifuNode.fromJS({ move: { x: 4, y: 5, c: Color.B } }));
    kifu.root.children[1].children.push(KifuNode.fromJS({ move: { x: 6, y: 7, c: Color.W } }));
    strictEqual(kifu.toSGF(), '(;GC[Game comment]AB[ab](;B[cd])(;B[ef];W[gh]))');
  });

  it('Method getNode with number argument', () => {
    const kifu = Kifu.fromSGF('(;C[1](;C[2a];C[3a](;C[4aa])(;C[4ab]))(;C[2b];C[3b]))');
    strictEqual(kifu.getNode(0)?.comment, '1');
    strictEqual(kifu.getNode(3)?.comment, '4aa');
    strictEqual(kifu.getNode(4), null);
  });

  it('Method getNode with path object argument', () => {
    const kifu = Kifu.fromSGF('(;C[1](;C[2a];C[3a](;C[4aa])(;C[4ab]))(;C[2b];C[3b]))');
    strictEqual(kifu.getNode({ moveNumber: 3, variations: [0, 1] })?.comment, '4ab');
    strictEqual(kifu.getNode({ moveNumber: 2, variations: [1] })?.comment, '3b');
    strictEqual(kifu.getNode({ moveNumber: 2, variations: [2] }), null);
  });
});
