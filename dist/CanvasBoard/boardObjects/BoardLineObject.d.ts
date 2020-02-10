import { Point } from '../../types';
import FieldObject from './FieldObject';
import { DrawHandler } from '../drawHandlers';
/**
 * Board markup object is special type of object, which can have 3 variations - for empty field
 * and for black and white stone.
 */
export default class BoardLineObject extends FieldObject {
    start: Point;
    end: Point;
    constructor(type: string | DrawHandler, start: Point, end: Point);
}
