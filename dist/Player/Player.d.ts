import { PartialRecursive } from '../utils/makeConfig';
import { PlayerConfig } from './types';
import CanvasBoard, { BoardObject } from '../CanvasBoard';
import KifuReader from '../kifu/KifuReader';
import EventEmitter from '../utils/EventEmitter';
export default class Player extends EventEmitter {
    element: HTMLElement;
    config: PlayerConfig;
    board: CanvasBoard;
    kifuReader: KifuReader;
    stoneBoardsObjects: BoardObject[];
    markupBoardObjects: BoardObject[];
    constructor(element: HTMLElement, config?: PartialRecursive<PlayerConfig>);
    init(): void;
    updateBoard(): void;
    next(): void;
    previous(): void;
    /**
     * Adds temporary board object, which will be removed during next position/node update.
     * @param boardObject
     */
    addTemporaryBoardObject(boardObject: BoardObject): void;
}
