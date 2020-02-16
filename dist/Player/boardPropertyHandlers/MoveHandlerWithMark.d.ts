import { BoardMarkupObject, BoardObject } from '../../CanvasBoard';
import PlainPlayer from '../PlainPlayer';
import { Point } from '../../types';
import MoveHandler from '../basePropertyHandlers/MoveHandler';
export default class MoveHandlerWithMark extends MoveHandler<BoardObject> {
    applyNodeChanges(value: Point, player: PlainPlayer): BoardMarkupObject;
    clearNodeChanges(value: Point, player: PlainPlayer, propertyData: BoardObject): BoardObject;
}
