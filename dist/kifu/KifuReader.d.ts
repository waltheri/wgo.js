import EventEmitter from '../utils/EventEmitter';
import KifuNode, { Path } from './KifuNode';
import Game from '../Game/Game';
import { PropIdent } from '../SGFParser/sgfTypes';
/**
 * Contains functionality to create, edit and manipulate go game record. It is basically virtual player
 * with API without board and any UI.
 */
export default class KifuReader extends EventEmitter {
    rootNode: KifuNode;
    currentNode: KifuNode;
    game: Game;
    constructor(rootNode?: KifuNode);
    /**
     * This will execute root node (root properties) once and initialize Game object
     */
    protected executeRootNode(): void;
    /**
     * Executes node. It will go through its properties and make changes in game object.
     */
    protected executeNode(): void;
    /**
     * This will revert game changes of current node and re-execute it. Use this, after KifuNode properties are updated.
     */
    resetNode(): void;
    /**
     * Gets property of current node.
     *
     * @param propIdent
     */
    getProperty(propIdent: PropIdent): any;
    /**
     * Gets property of root node.
     *
     * @param propIdent
     */
    getRootProperty(propIdent: PropIdent): any;
    /**
     * Returns array of next nodes (children).
     */
    getNextNodes(): KifuNode[];
    /**
     * Go to a next node and executes it (updates game object).
     * @param node
     */
    next(node?: number | KifuNode): boolean;
    /**
     * Go to the previous node.
     */
    previous(): boolean;
    /**
     * Go to the first position - root node.
     */
    first(): void;
    /**
     * Go to the last position.
     */
    last(): void;
    /**
     * Go to specified path.
     */
    goTo(pathOrMoveNumber: Path | number): void;
    /**
       * Go to previous fork (a node with more than one child).
       */
    previousFork(): void;
}
