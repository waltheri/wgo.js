import KifuNode, { Path } from '../kifu/KifuNode';
import EventEmitter from '../utils/EventEmitter';
import { Game, GoRules } from '../Game';
import { PropIdent } from '../SGFParser/sgfTypes';
import PropertyHandler from './PropertyHandler';
import BoardSizeHandler from './basePropertyHandlers/BoardSizeHandler';
import RulesHandler from './basePropertyHandlers/RulesHandler';
import HandicapHandler from './basePropertyHandlers/HandicapHandler';
import SetupHandler from './basePropertyHandlers/SetupHandler';
import SetTurnHandler from './basePropertyHandlers/SetTurnHandler';
import MoveHandler from './basePropertyHandlers/MoveHandler';
export interface PlayerInitParams {
    size: number;
    rules: GoRules;
}
export default class PlayerBase extends EventEmitter {
    static propertyHandlers: {
        SZ: BoardSizeHandler;
        RU: RulesHandler;
        HA: HandicapHandler;
        AW: SetupHandler;
        AB: SetupHandler;
        AE: SetupHandler;
        PL: SetTurnHandler;
        B: MoveHandler;
        W: MoveHandler;
    };
    rootNode: KifuNode;
    currentNode: KifuNode;
    game: Game;
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
