import SGFParser, { SGFSyntaxError } from '../SGFParser';
import propertyValueTypes from './propertyValueTypes';
import { SGFGameTree, SGFProperties } from '../SGFParser/sgfTypes';

const processJSGF = function (gameTree: SGFGameTree, rootNode: KifuNode) {
  rootNode.setSGFProperties(gameTree.sequence[0] || {});

  let lastNode = rootNode;

  for (let i = 1; i < gameTree.sequence.length; i++) {
    const node = new KifuNode();
    node.setSGFProperties(gameTree.sequence[i]);
    lastNode.appendChild(node);
    lastNode = node;
  }

  for (let i = 0; i < gameTree.children.length; i++) {
    lastNode.appendChild(processJSGF(gameTree.children[i], new KifuNode()));
  }

  return rootNode;
};

// Characters, which has to be escaped when transforming to SGF
const escapeCharacters = ['\\\\', '\\]'];

const escapeSGFValue = function (value: string) {
  return escapeCharacters.reduce((prev, current) => prev.replace(new RegExp(current, 'g'), current), value);
};

/**
 * Contains path to certain node in game tree.
 */
export interface Path {
  /** Depth of node (for root node it is 0) */
  depth: number;
  /** Array of children array indexes of all predecessors which have siblings. */
  forks: number[];
}

/**
 * Class representing one kifu node.
 */
export default class KifuNode {
  parent: KifuNode | null;
  children: KifuNode[];
  properties: {[key: string]: any};

  constructor() {
    this.parent = null;
    this.children = [];
    this.properties = {};
  }

  get root() {
    // tslint:disable-next-line:no-this-assignment
    let node: KifuNode = this;

    while (node.parent != null) {
      node = node.parent;
    }

    return node;
  }

  set innerSGF(sgf: string) {
    // clean up
    this.clean();

    let transformedSgf = sgf;

    // create regular SGF from sgf-like string
    if (transformedSgf[0] !== '(') {
      if (transformedSgf[0] !== ';') {
        transformedSgf = `;${transformedSgf}`;
      }
      transformedSgf = `(${transformedSgf})`;
    }

    KifuNode.fromSGF(transformedSgf, 0, this);
  }

  /**
   * Kifu node representation as sgf-like string - will contain `;`, all properties and all children.
   */
  get innerSGF(): string {
    let output = ';';

    for (const propIdent in this.properties) {
      if (this.properties.hasOwnProperty(propIdent)) {
        output += `${propIdent}[${this.getSGFProperty(propIdent).map(escapeSGFValue).join('][')}]`;
      }
    }

    if (this.children.length === 1) {
      return `${output}${this.children[0].innerSGF}`;
    }
    if (this.children.length > 1) {
      return this.children.reduce((prev, current) => `${prev}(${current.innerSGF})`, output);
    }

    return output;
  }

  getPath() {
    const path: Path = { depth: 0, forks: [] };
    // tslint:disable-next-line:no-this-assignment
    let node: KifuNode = this;

    while (node.parent) {
      path.depth++;
      if (node.parent.children.length > 1) {
        path.forks.unshift(node.parent.children.indexOf(node));
      }
      node = node.parent;
    }

    return path;
  }

  /// GENERAL TREE NODE MANIPULATION METHODS (subset of DOM API's Node)

  /**
   * Insert a KNode as the last child node of this node.
   *
   * @throws  {Error} when argument is invalid.
   * @param   {KifuNode} node to append.
   * @returns {number} position(index) of appended node.
   */

  appendChild(node: KifuNode): number {
    if (node == null || !(node instanceof KifuNode) || node === this) {
      throw new Error('Invalid argument passed to `appendChild` method, KNode was expected.');
    }

    if (node.parent) {
      node.parent.removeChild(node);
    }

    node.parent = this;

    return this.children.push(node) - 1;
  }

  /**
   * Returns a Boolean value indicating whether a node is a descendant of a given node or not.
   *
   * @param   {KifuNode}   node to be tested
   * @returns {boolean} true, if this node contains given node.
   */

  contains(node: KifuNode): boolean {
    if (this.children.indexOf(node) >= 0) {
      return true;
    }

    return this.children.some(child => child.contains(node));
  }

  /**
   * Inserts the first KNode given in a parameter immediately before the second, child of this KNode.
   *
   * @throws  {Error}   when argument is invalid.
   * @param   {KifuNode}   newNode       node to be inserted
   * @param   {(KifuNode)} referenceNode reference node, if omitted, new node will be inserted at the end.
   * @returns {KifuNode}   this node
   */

  insertBefore(newNode: KifuNode, referenceNode?: KifuNode): KifuNode {
    if (newNode == null || !(newNode instanceof KifuNode) || newNode === this) {
      throw new Error('Invalid argument passed to `insertBefore` method, KNode was expected.');
    }
    if (referenceNode == null) {
      this.appendChild(newNode);
      return this;
    }

    if (newNode.parent) {
      newNode.parent.removeChild(newNode);
    }

    newNode.parent = this;

    this.children.splice(this.children.indexOf(referenceNode), 0, newNode);
    return this;
  }

  /**
   * Removes a child node from the current element, which must be a child of the current node.
   *
   * @param   {KifuNode} child node to be removed
   * @returns {KifuNode}  this node
   */

  removeChild(child: KifuNode): KifuNode {
    this.children.splice(this.children.indexOf(child), 1);

    child.parent = null;

    return this;
  }

  /**
   * Replaces one child Node of the current one with the second one given in parameter.
   *
   * @throws  {Error} when argument is invalid
   * @param   {KifuNode} newChild node to be inserted
   * @param   {KifuNode} oldChild node to be replaced
   * @returns {KifuNode} this node
   */

  replaceChild(newChild: KifuNode, oldChild: KifuNode): KifuNode {
    if (newChild == null || !(newChild instanceof KifuNode) || newChild === this) {
      throw new Error('Invalid argument passed to `replaceChild` method, KNode was expected.');
    }

    this.insertBefore(newChild, oldChild);
    this.removeChild(oldChild);

    return this;
  }

  /**
   * Remove all properties and children. Parent will remain.
   */
  clean() {
    for (let i = this.children.length - 1; i >= 0; i--) {
      this.removeChild(this.children[i]);
    }
    this.properties = {};
  }

  /// BASIC PROPERTY GETTER and SETTER

  /**
   * Gets property by SGF property identificator. Returns property value (type depends on property type)
   *
   * @param   {string}   propIdent - SGF property idetificator
   * @returns {any}    property value or values or undefined, if property is missing.
   */

  getProperty(propIdent: string): any {
    return this.properties[propIdent];
  }

  /**
   * Sets property by SGF property identificator.
   *
   * @param   {string}  propIdent - SGF property idetificator
   * @param   {any}     value - property value or values
   */

  setProperty(propIdent: string, value?: any) {
    if (value === undefined) {
      delete this.properties[propIdent];
    } else {
      this.properties[propIdent] = value;
    }

    return this;
  }

  /**
   * Alias for `setProperty` without second parameter.
   * @param propIdent
   */
  removeProperty(propIdent: string) {
    this.setProperty(propIdent);
  }

  /**
   * Iterates through all properties.
   */
  forEachProperty(callback: (propIdent: string, value: any) => void) {
    Object.keys(this.properties).forEach((propIdent: string) => callback(propIdent, this.properties[propIdent]));
  }

  /// SGF RAW METHODS

  /**
   * Gets one SGF property value as string (with brackets `[` and `]`).
   *
   * @param   {string} propIdent SGF property identificator.
   * @returns {string[]} Array of SGF property values or null if there is not such property.
   */

  getSGFProperty(propIdent: string): string[] {
    if (this.properties[propIdent] !== undefined) {
      const propertyValueType = propertyValueTypes[propIdent] || propertyValueTypes._default;

      if (propertyValueType.multiple) {
        return this.properties[propIdent].map(
          (propValue: any) => propertyValueType.transformer.write(propValue),
        );
      }

      return [propertyValueType.transformer.write(this.properties[propIdent])];
    }

    return null;
  }

  /**
   * Sets one SGF property.
   *
   * @param   {string}   propIdent SGF property identificator
   * @param   {string[]} propValues SGF property values
   * @returns {KifuNode}    this KNode for chaining
   */

  setSGFProperty(propIdent: string, propValues?: string[]): KifuNode {
    const propertyValueType = propertyValueTypes[propIdent] || propertyValueTypes._default;

    if (propValues === undefined) {
      delete this.properties[propIdent];
      return this;
    }

    if (propertyValueType.multiple) {
      this.properties[propIdent] = propValues.map(val => propertyValueType.transformer.read(val));
    } else {
      this.properties[propIdent] = propertyValueType.transformer.read(propValues[0]);
    }

    return this;
  }

  /**
   * Sets multiple SGF properties.
   *
   * @param   {Object}   properties - map with signature propIdent -> propValues.
   * @returns {KifuNode}    this KNode for chaining
   */

  setSGFProperties(properties: SGFProperties): KifuNode {
    for (const ident in properties) {
      if (properties.hasOwnProperty(ident)) {
        this.setSGFProperty(ident, properties[ident as keyof SGFProperties]);
      }
    }

    return this;
  }

  /**
   * Transforms KNode object to standard SGF string.
   */
  toSGF() {
    return `(${this.innerSGF})`;
  }

  /**
   * Deeply clones the node. If node isn't root, its predecessors won't be cloned, and the node becomes root.
   */
  cloneNode(appendToParent?: boolean) {
    const node = new KifuNode();
    const properties = JSON.parse(JSON.stringify(this.properties));
    node.properties = properties;

    this.children.forEach((child) => {
      node.appendChild(child.cloneNode());
    });

    if (appendToParent && this.parent) {
      this.parent.appendChild(node);
    }

    return node;
  }

  /**
   * Creates KNode object from SGF transformed to JavaScript object.
   *
   * @param gameTree
   */
  static fromJS(gameTree: SGFGameTree, kifuNode = new KifuNode()) {
    return processJSGF(gameTree, kifuNode);
  }

  /**
   * Creates KNode object from SGF string.
   *
   * @param sgf
   * @param gameNo
   */
  static fromSGF(sgf: string, gameNo: number = 0, kifuNode = new KifuNode()) {
    const parser = new SGFParser(sgf);
    return KifuNode.fromJS(parser.parseCollection()[gameNo], kifuNode);
  }
}
