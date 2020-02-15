import { BoardMarkupObject, BoardObject } from '../../CanvasBoard';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from './PropertyHandler';
import { Point } from '../../types';
export default class MoveHandler extends PropertyHandler<Point, BoardObject> {
    nextNode(value: Point, player: PlainPlayer, propertyData: BoardObject): BoardMarkupObject;
    previousNode(value: Point, player: PlainPlayer, propertyData: BoardObject): BoardMarkupObject;
    beforeNextNode(value: Point, player: PlainPlayer, propertyData: BoardObject): BoardObject;
    beforePreviousNode(value: Point, player: PlainPlayer, propertyData: BoardObject): BoardObject;
}
