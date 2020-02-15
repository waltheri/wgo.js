import { BoardObject } from '../../CanvasBoard';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from './PropertyHandler';
import { Label } from '../../types';
export default class MarkupLabelHandler extends PropertyHandler<Label[], BoardObject[]> {
    constructor();
    nextNode(values: Label[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[];
    previousNode(values: Label[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[];
    beforeNextNode(values: Label[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[];
    beforePreviousNode(values: Label[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[];
}
