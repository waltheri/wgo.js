import { BoardObject } from '../../BoardBase';
import SimplePlayer from '../SimplePlayer';
import { PropertyHandler } from '../../PlayerBase';
import { Vector } from '../../types';
export default class MarkupLineHandler extends PropertyHandler<Vector[], BoardObject<any>[]> {
    type: string;
    constructor(type: string);
    applyNodeChanges(values: Vector[], player: SimplePlayer, propertyData: BoardObject<any>[]): BoardObject<any>[];
    clearNodeChanges(values: Vector[], player: SimplePlayer, propertyData: BoardObject<any>[]): BoardObject<any>[];
}
