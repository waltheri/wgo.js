import { BoardObject } from '../../CanvasBoard';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from '../PropertyHandler';
import { Vector } from '../../types';
export default class MarkupLineHandler extends PropertyHandler<Vector[], BoardObject[]> {
    type: string;
    constructor(type: string);
    applyNodeChanges(values: Vector[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[];
    clearNodeChanges(values: Vector[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[];
}
