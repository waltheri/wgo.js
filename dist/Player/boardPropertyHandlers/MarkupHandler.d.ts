import { BoardObject } from '../../CanvasBoard';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from '../PropertyHandler';
import { Point } from '../../types';
export default class MarkupHandler extends PropertyHandler<Point[], BoardObject[]> {
    type: string;
    constructor(type: string);
    applyNodeChanges(values: Point[], player: PlainPlayer): BoardObject[];
    clearNodeChanges(values: Point[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[];
}
