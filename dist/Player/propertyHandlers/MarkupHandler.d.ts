import { BoardObject } from '../../CanvasBoard';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from './PropertyHandler';
import { Point } from '../../types';
export default class MarkupHandler extends PropertyHandler<Point[], BoardObject[]> {
    nextNode(values: Point[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[];
    previousNode(values: Point[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[];
    beforeNextNode(values: Point[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[];
    beforePreviousNode(values: Point[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[];
}
