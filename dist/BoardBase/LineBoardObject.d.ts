import { Point } from '../types';
import BoardObject from './BoardObject';
/**
 * Board line object is special type of object, which consist from start and end point.
 */
export default class LineBoardObject extends BoardObject {
    start: Point;
    end: Point;
    constructor(type: string, start: Point, end: Point);
}
