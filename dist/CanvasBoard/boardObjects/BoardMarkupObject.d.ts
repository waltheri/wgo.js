import { Color } from '../../types';
import FieldObject from './FieldObject';
import { DrawHandler } from '../drawHandlers';
/**
 * Board markup object is special type of object, which can have 3 variations - for empty field
 * and for black and white stone.
 */
export default class BoardMarkupObject extends FieldObject {
    variation: Color;
    constructor(type: string | DrawHandler, variation?: Color);
}