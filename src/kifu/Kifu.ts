import { SGFGameTree, SGFParser } from '../sgf';
import KifuInfo from './KifuInfo';
import KifuNode from './KifuNode';

/**
 * Object describing position of kifu node in kifu tree. When kifu changes, kifu paths must be
 * updated too, if we want them to correspond to the same nodes.
 */
export interface KifuPath {
  /** Depth of node (for root node it is 0) */
  moveNumber: number;

  /**
   * Array of children array indexes of all predecessors which have siblings. These numbers
   * are used, when there is fork in kifu tree and we have to decide witch child to use.
   */
  variations: number[];
}

/**
 * Represents one go game record. It is inspired by SGF format, but its properties have better names and
 * their values have better types, so it is easier to use. For example in SGF you have property `B` for black
 * move and its value like `de`, in `Kifu` (respectively `KifuNode`) you have property `move` and value
 * like `{ x: 3, y: 4, c: Color.B }`. For that reason Kifu may not be fully compatible with SGF. For example,
 * if SGF contains B and W properties on the same node, Kifu only stores the later one.
 *
 * Kifu doesn't have any internal state - it consists only from game information and game tree.
 */
export default class Kifu {
  /**
   * @param info Information about the game recorded in this kifu. They are related to the whole game, not to a single node.
   * @param root Root node of the kifu. Must be set, even if it is empty.
   */
  constructor(
    public info = new KifuInfo(),
    public root = new KifuNode(),
  ) {}

  /**
   * Get KifuNode located on specified path in the kifu. You can also pass number, in that case
   * it will corresponds to move number.
   */
  getNode(path: KifuPath | number): KifuNode | null {
    const moveNumber = typeof path === 'number' ? path : path.moveNumber;
    const variations = typeof path === 'number' ? [] : path.variations;
    let node = this.root;
    let varCount = 0;

    for (let i = 0; i < moveNumber; i++) {
      if (!node.children.length) {
        return null;
      } else if (node.children.length > 1) {
        node = node.children[variations[varCount] || 0];
        varCount++;
      } else {
        node = node.children[0];
      }

      if (!node) {
        return null;
      }
    }

    return node;
  }

  /**
   * Finds path of specified node. If kifu doesn't contain the node, null is returned.
   */
  /*getPath(node: KifuNode): KifuPath | null {
    
  }*/

  /**
   * Generates full SGF string from this kifu.
   */
  toSGF(): string {
    return `(;${this.info.getSGFProperties()}${gameTreeToSgf(this.root)})`;
  }

  /**
   * Returns this kifu as plain JS object (JSON). This is useful for serialization.
   */
  toJS() {
    return {
      info: { ...this.info },
      root: { ...this.root },
    };
  }

  /**
   * Deeply clones this kifu.
   */
  clone(): Kifu {
    return Kifu.fromJS(JSON.parse(JSON.stringify(this.toJS())));
  }

  /**
   * Creates Kifu object from plain JS object (JSON).
   */
  static fromJS(kifu: Partial<Kifu>) {
    return new Kifu(KifuInfo.fromJS(kifu.info), KifuNode.fromJS(kifu.root));
  }

  /**
   * Create Kifu object from the SGF string.
   *
   * @param sgfStringOrGameTree
   * @param gameNo
   */
  static fromSGF(sgfStringOrGameTree: string | SGFGameTree, gameNo: number = 0): Kifu {
    if (typeof sgfStringOrGameTree === 'string') {
      const parser = new SGFParser();
      return Kifu.fromSGF(parser.parseCollection(sgfStringOrGameTree)[gameNo]);
    }

    const kifu = new Kifu();
    kifu.info.setSGFProperties(sgfStringOrGameTree.sequence[0]);
    processGameTree(kifu.root, sgfStringOrGameTree);

    return kifu;
  }
}

function processGameTree(node: KifuNode, gameTree: SGFGameTree) {
  node.setSGFProperties(gameTree.sequence[0]);

  let lastNode = node;
  for (let i = 1; i < gameTree.sequence.length; i++) {
    const node = new KifuNode();
    node.setSGFProperties(gameTree.sequence[i]);
    lastNode.children.push(node);
    lastNode = node;
  }

  for (let i = 0; i < gameTree.children.length; i++) {
    lastNode.children.push(processGameTree(new KifuNode(), gameTree.children[i]));
  }

  return node;
}

function gameTreeToSgf(node: KifuNode): string {
  const properties = node.getSGFProperties();

  if (node.children.length === 1) {
    return `${properties};${gameTreeToSgf(node.children[0])}`;
  } else if (node.children.length > 1) {
    return `${properties}${node.children.map((child) => `(;${gameTreeToSgf(child)})`).join('')}`;
  }

  return properties;
}
