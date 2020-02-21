import { BoardObject } from '../../BoardBase';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from '../PropertyHandler';
import { Point } from '../../types';
export default class MarkupHandler extends PropertyHandler<Point[], BoardObject<any>[]> {
    type: string;
    constructor(type: string);
    applyNodeChanges(values: Point[], player: PlainPlayer): BoardObject<any>[];
    clearNodeChanges(values: Point[], player: PlainPlayer, propertyData: BoardObject<any>[]): BoardObject<any>[];
}
