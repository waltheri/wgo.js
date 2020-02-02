import { PartialRecursive } from '../utils/makeConfig';
import { PlayerConfig } from './types';
import CanvasBoard from '../CanvasBoard';
import KifuReader from '../kifu/KifuReader';
import { BoardFieldObject } from '../CanvasBoard/types';
import EventEmitter from '../utils/EventEmitter';
export default class Player extends EventEmitter {
    element: HTMLElement;
    config: PlayerConfig;
    board: CanvasBoard;
    kifuReader: KifuReader;
    stoneBoardsObjects: BoardFieldObject[];
    constructor(element: HTMLElement, config?: PartialRecursive<PlayerConfig>);
    init(): void;
    updateBoard(): void;
    next(): void;
    previous(): void;
}
