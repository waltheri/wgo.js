import { BoardObject } from '../../BoardBase';
import SimplePlayer from '../SimplePlayer';
import { PropertyHandler } from '../../PlayerBase';
import { Point } from '../../types';
export default class MarkupHandler extends PropertyHandler<Point[], BoardObject<any>[]> {
    type: string;
    constructor(type: string);
    applyNodeChanges(values: Point[], player: SimplePlayer): BoardObject<any>[];
    clearNodeChanges(values: Point[], player: SimplePlayer, propertyData: BoardObject<any>[]): BoardObject<any>[];
}
