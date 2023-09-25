import { strictEqual, deepEqual } from 'assert';
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
});
