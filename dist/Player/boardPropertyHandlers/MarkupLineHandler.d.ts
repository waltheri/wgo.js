import { BoardObject } from '../../BoardBase';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from '../PropertyHandler';
import { Vector } from '../../types';
export default class MarkupLineHandler extends PropertyHandler<Vector[], BoardObject<any>[]> {
    type: string;
    constructor(type: string);
    applyNodeChanges(values: Vector[], player: PlainPlayer, propertyData: BoardObject<any>[]): BoardObject<any>[];
    clearNodeChanges(values: Vector[], player: PlainPlayer, propertyData: BoardObject<any>[]): BoardObject<any>[];
}
