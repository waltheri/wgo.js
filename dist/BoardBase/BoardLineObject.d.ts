import { Point } from '../types';
import BoardObject from './BoardObject';
/**
 * Board markup object is special type of object, which can have 3 variations - for empty field
 * and for black and white stone.
 */
export default class BoardLineObject<T> extends BoardObject<T> {
    start: Point;
    end: Point;
    constructor(type: string | T, start: Point, end: Point);
}
