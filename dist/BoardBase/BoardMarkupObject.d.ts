import { Color } from '../types';
import FieldObject from './FieldObject';
/**
 * Board markup object is special type of field object, which can have 3 variations - for empty field
 * and for black and white stone.
 */
export default class BoardMarkupObject extends FieldObject {
    variation: Color;
    constructor(type: string, x?: number, y?: number, variation?: Color);
}
