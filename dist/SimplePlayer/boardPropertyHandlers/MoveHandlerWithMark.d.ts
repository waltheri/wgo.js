import { BoardMarkupObject, BoardObject } from '../../BoardBase';
import SimplePlayer from '../SimplePlayer';
import { Point } from '../../types';
import MoveHandler from '../../PlayerBase/basePropertyHandlers/MoveHandler';
export default class MoveHandlerWithMark extends MoveHandler<BoardObject<any>> {
    applyNodeChanges(value: Point, player: SimplePlayer): BoardMarkupObject<import("../../SVGBoard/types").SVGDrawHandler>;
    clearNodeChanges(value: Point, player: SimplePlayer, propertyData: BoardObject<any>): BoardObject<any>;
}
