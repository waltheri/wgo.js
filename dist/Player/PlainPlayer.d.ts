import { PartialRecursive } from '../utils/makeConfig';
import CanvasBoard, { FieldObject } from '../CanvasBoard';
import PlayerBase from './PlayerBase';
import { CanvasBoardTheme } from '../CanvasBoard/types';
import { DrawHandler } from '../CanvasBoard/drawHandlers';
import MarkupHandler from './propertyHandlers/MarkupHandler';
import MoveHandler from './propertyHandlers/MoveHandler';
import MarkupLineHandler from './propertyHandlers/MarkupLineHandler';
import MarkupLabelHandler from './propertyHandlers/MarkupLabelHandler';
import ViewportHandler from './propertyHandlers/ViewportHandler';
export interface PlainPlayerConfig {
    boardTheme: CanvasBoardTheme;
    currentMoveBlackMark: DrawHandler;
    currentMoveWhiteMark: DrawHandler;
    enableMouseWheel: boolean;
    enableKeys: boolean;
}
export declare const defaultPlainPlayerConfig: PlainPlayerConfig;
export declare const plainPlayerPropertyHandlers: (MarkupHandler | MarkupLabelHandler | MarkupLineHandler | MoveHandler | ViewportHandler)[];
export default class PlainPlayer extends PlayerBase {
    element: HTMLElement;
    config: PlainPlayerConfig;
    board: CanvasBoard;
    stoneBoardsObjects: FieldObject[];
    _mouseWheelEvent: EventListenerOrEventListenerObject;
    _keyEvent: EventListenerOrEventListenerObject;
    constructor(element: HTMLElement, config?: PartialRecursive<PlainPlayerConfig>);
    init(): void;
    destroy(): void;
    protected updateStones(): void;
}
