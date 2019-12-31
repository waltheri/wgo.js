import EventEmitter from '../utils/EventEmitter';
import KifuNode from './KifuNode';
import Game from '../Game/Game';
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
}
