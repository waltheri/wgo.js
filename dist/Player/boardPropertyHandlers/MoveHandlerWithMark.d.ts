import { BoardMarkupObject, BoardObject } from '../../BoardBase';
import PlainPlayer from '../PlainPlayer';
import { Point } from '../../types';
import MoveHandler from '../basePropertyHandlers/MoveHandler';
export default class MoveHandlerWithMark extends MoveHandler<BoardObject<any>> {
    applyNodeChanges(value: Point, player: PlainPlayer): BoardMarkupObject<import("../../SVGBoard/types").SVGDrawHandler>;
    clearNodeChanges(value: Point, player: PlainPlayer, propertyData: BoardObject<any>): BoardObject<any>;
}
