import { Color } from '../types';
import FieldObject from './FieldObject';
/**
 * Board markup object is special type of object, which can have 3 variations - for empty field
 * and for black and white stone.
 */
export default class BoardMarkupObject<T> extends FieldObject<T> {
    variation: Color;
    constructor(type: string | T, variation?: Color);
}
