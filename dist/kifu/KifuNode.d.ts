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
    readonly root: KifuNode;
    readonly innerSGF: string;
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
     * Hard clones a KNode and all of its contents.
     *
     * @param {boolean}  appendToParent if set true, cloned node will be appended to this parent.
     * @returns {KifuNode}  cloned node
     */
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
     * Iterates through all properties.
     */
    forEachProperty(callback: (propIdent: string, value: any) => void): void;
    /**
     * Sets multiple SGF properties.
     *
     * @param   {Object}   properties - map with signature propIdent -> propValues.
     * @returns {KifuNode}    this KNode for chaining
     */
    setSGFProperties(properties: SGFProperties): KifuNode;
    /**
     * Sets properties of Kifu node based on the sgf string. Usually you won't use this method directly,
     * but use innerSGF property instead.
     *
     * Basically it parsers the sgf, takes properties from it and adds them to the node.
     * Then if there are other nodes in the string, they will be appended to the node as well.
     *
     * @param {string} sgf SGF text for current node. It must be without trailing `;`,
     *                     however it can contain following nodes.
     * @throws {SGFSyntaxError} throws exception, if sgf string contains invalid SGF.
     */
    /**
     * Transforms KNode object to standard SGF string.
     */
    toSGF(): string;
    /**
     * Deeply clones the node. If node isn't root, its predecessors won't be cloned, and the node becomes root.
     */
    clone(): KifuNode;
    /**
     * Creates KNode object from SGF transformed to JavaScript object.
     * @param gameTree
     */
    static fromJS(gameTree: SGFGameTree): KifuNode;
    /**
     * Creates KNode object from SGF string.
     *
     * @param sgf
     * @param gameNo
     */
    static fromSGF(sgf: string, gameNo?: number): KifuNode;
}
