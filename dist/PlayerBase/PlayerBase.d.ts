import KifuNode, { Path } from '../kifu/KifuNode';
import EventEmitter from '../utils/EventEmitter';
import { Game, GoRules } from '../Game';
import { PropIdent } from '../SGFParser/sgfTypes';
import PropertyHandler from './PropertyHandler';
import { PlayerInitParams } from './types';
import PlayerPlugin from './PlayerPlugin';
export default class PlayerBase extends EventEmitter {
    rootNode: KifuNode;
    currentNode: KifuNode;
    game: Game;
    params: PlayerInitParams;
    plugins: PlayerPlugin[];
    constructor();
    /**
     * Load game (kifu) from KifuNode.
     */
    loadKifu(rootNode: KifuNode): void;
    /**
     * Create new game (kifu) and init player with it.
     */
    newGame(size?: number, rules?: GoRules): void;
    /**
     * Executes root properties during initialization. If some properties change, call this to re-init player.
     */
    protected executeRoot(): void;
    protected executeNode(): void;
    /**
     * Change current node to specified next node and executes its properties.
     */
    protected executeNext(i: number): void;
    /**
     * Change current node to previous/parent next node and executes its properties.
     */
    protected executePrevious(): void;
    /**
     * Emits node life cycle method (for every property)
     */
    protected emitNodeLifeCycleEvent(name: keyof PropertyHandler<any, any>): void;
    protected getPropertyHandler(propIdent: string): PropertyHandler<any, any>;
    /**
     * Gets property of current node.
     */
    getProperty(propIdent: PropIdent): any;
    /**
     * Sets property of current node and execute changes.
     */
    setProperty(propIdent: PropIdent, value?: any): void;
    /**
     * Gets property of root node.
     */
    getRootProperty(propIdent: PropIdent): any;
    /**
     * Returns array of next nodes (children).
     */
    getNextNodes(): KifuNode[];
    /**
     * Go to (specified) next node and execute it.
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
     * Go to a node specified by path or move number.
     */
    goTo(pathOrMoveNumber: Path | number): void;
    /**
     * Get path to current node
     */
    getCurrentPath(): Path;
    /**
       * Go to previous fork (a node with more than one child).
       */
    previousFork(): void;
    /**
     * Play a move. New kifu node will be created and move to it
     */
    play(x: number, y: number): void;
    /**
     * Register player's plugin.
     *
     * @param plugin
     */
    use(plugin: PlayerPlugin): void;
}
