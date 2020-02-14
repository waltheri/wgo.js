import BoardObject from './BoardObject';
import { DrawHandler } from '../drawHandlers';
import { Point } from '../../types';
export default class AreaObject extends BoardObject {
    points: Point[];
    constructor(type: string | DrawHandler);
    addPoint(point: Point): void;
    removePoint(point: Point): void;
}
