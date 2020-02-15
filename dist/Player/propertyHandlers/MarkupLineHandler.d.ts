import { BoardObject } from '../../CanvasBoard';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from './PropertyHandler';
import { Vector } from '../../types';
export default class MarkupLineHandler extends PropertyHandler<Vector[], BoardObject[]> {
    nextNode(values: Vector[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[];
    previousNode(values: Vector[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[];
    beforeNextNode(values: Vector[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[];
    beforePreviousNode(values: Vector[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[];
}
