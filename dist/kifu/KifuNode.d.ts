import { SGFGameTree, SGFProperties } from '../SGFParser/sgfTypes';
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
    properties: {
        [key: string]: any;
    };
    constructor();
    get root(): KifuNode;
    set innerSGF(sgf: string);
    /**
     * Kifu node representation as sgf-like string - will contain `;`, all properties and all children.
     */
    get innerSGF(): string;
    getPath(): Path;
    /**
     * Insert a KNode as the last child node of this node.
     *
     * @throws  {Error} when argument is invalid.
     * @param   {KifuNode} node to append.
     * @returns {number} position(index) of appended node.
     */
    appendChild(node: KifuNode): number;
    /**
     * Returns a Boolean value indicating whether a node is a descendant of a given node or not.
     *
     * @param   {KifuNode}   node to be tested
     * @returns {boolean} true, if this node contains given node.
     */
    contains(node: KifuNode): boolean;
    /**
     * Inserts the first KNode given in a parameter immediately before the second, child of this KNode.
     *
     * @throws  {Error}   when argument is invalid.
     * @param   {KifuNode}   newNode       node to be inserted
     * @param   {(KifuNode)} referenceNode reference node, if omitted, new node will be inserted at the end.
     * @returns {KifuNode}   this node
     */
    insertBefore(newNode: KifuNode, referenceNode?: KifuNode): KifuNode;
    /**
     * Removes a child node from the current element, which must be a child of the current node.
     *
     * @param   {KifuNode} child node to be removed
     * @returns {KifuNode}  this node
     */
    removeChild(child: KifuNode): KifuNode;
    /**
     * Replaces one child Node of the current one with the second one given in parameter.
     *
     * @throws  {Error} when argument is invalid
     * @param   {KifuNode} newChild node to be inserted
     * @param   {KifuNode} oldChild node to be replaced
     * @returns {KifuNode} this node
     */
    replaceChild(newChild: KifuNode, oldChild: KifuNode): KifuNode;
    /**
     * Remove all properties and children. Parent will remain.
     */
    clean(): void;
    /**
     * Gets property by SGF property identificator. Returns property value (type depends on property type)
     *
     * @param   {string}   propIdent - SGF property idetificator
     * @returns {any}    property value or values or undefined, if property is missing.
     */
    getProperty(propIdent: string): any;
    /**
     * Sets property by SGF property identificator.
     *
     * @param   {string}  propIdent - SGF property idetificator
     * @param   {any}     value - property value or values
     */
    setProperty(propIdent: string, value?: any): this;
    /**
     * Alias for `setProperty` without second parameter.
     * @param propIdent
     */
    removeProperty(propIdent: string): void;
    /**
     * Iterates through all properties.
     */
    forEachProperty(callback: (propIdent: string, value: any) => void): void;
    /**
     * Gets one SGF property value as string (with brackets `[` and `]`).
     *
     * @param   {string} propIdent SGF property identificator.
     * @returns {string[]} Array of SGF property values or null if there is not such property.
     */
    getSGFProperty(propIdent: string): string[];
    /**
     * Sets one SGF property.
     *
     * @param   {string}   propIdent SGF property identificator
     * @param   {string[]} propValues SGF property values
     * @returns {KifuNode}    this KNode for chaining
     */
    setSGFProperty(propIdent: string, propValues?: string[]): KifuNode;
    /**
     * Sets multiple SGF properties.
     *
     * @param   {Object}   properties - map with signature propIdent -> propValues.
     * @returns {KifuNode}    this KNode for chaining
     */
    setSGFProperties(properties: SGFProperties): KifuNode;
    /**
     * Transforms KNode object to standard SGF string.
     */
    toSGF(): string;
    /**
     * Deeply clones the node. If node isn't root, its predecessors won't be cloned, and the node becomes root.
     */
    cloneNode(appendToParent?: boolean): KifuNode;
    /**
     * Creates KNode object from SGF transformed to JavaScript object.
     *
     * @param gameTree
     */
    static fromJS(gameTree: SGFGameTree, kifuNode?: KifuNode): KifuNode;
    /**
     * Creates KNode object from SGF string.
     *
     * @param sgf
     * @param gameNo
     */
    static fromSGF(sgf: string, gameNo?: number, kifuNode?: KifuNode): KifuNode;
}
