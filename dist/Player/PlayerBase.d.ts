import KifuNode, { Path } from '../kifu/KifuNode';
import EventEmitter from '../utils/EventEmitter';
import { Game, GoRules } from '../Game';
import { PropIdent } from '../SGFParser/sgfTypes';
import PropertyHandler from './propertyHandlers/PropertyHandler';
interface PlayerParams {
    size: number;
    rules: GoRules;
    [key: string]: any;
}
export default class PlayerBase extends EventEmitter {
    rootNode: KifuNode;
    currentNode: KifuNode;
    game: Game;
    params: PlayerParams;
    propertiesData: Map<KifuNode, {
        [propIdent: string]: any;
    }>;
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
     * Register event listeners for SGF properties.
     */
    protected registerPropertyHandlers(propertyHandlers: PropertyHandler<any, any>[]): void;
    /**
     * Executes root properties during initialization. If some properties change, call this to re-init player.
     */
    protected executeRoot(): void;
    /**
     * Change current node to specified next node and executes its properties.
     */
    protected executeNext(i: number): void;
    /**
     * Change current node to previous/parent next node and executes its properties.
     */
    protected executePrevious(): void;
    /**
     * Executes a move (black or white) - changes game position and sets turn.
     */
    protected executeMove(): void;
    /**
     * Emits node life cycle method (for every property)
     */
    protected emitNodeLifeCycleEvent(name: string): void;
    /**
     * Gets property data of current node - data are temporary not related to SGF.
     */
    getPropertyData(propIdent: string): any;
    /**
     * Sets property data of current node - data are temporary not related to SGF.
     */
    setPropertyData(propIdent: string, data: any): void;
    /**
     * Gets property of current node.
     */
    getProperty(propIdent: PropIdent): any;
    /**
     * Sets property of current node.
     */
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
     * Go to specified path.
     */
    goTo(pathOrMoveNumber: Path | number): void;
    /**
       * Go to previous fork (a node with more than one child).
       */
    previousFork(): void;
}
export {};
