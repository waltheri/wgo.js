import { Color } from '../types';
import BoardMarkupObject from './BoardMarkupObject';
/**
 * Board label object is special type of markup object, which renders text on the field.
 */
export default class BoardLabelObject extends BoardMarkupObject {
    text: string;
    constructor(text: string, x?: number, y?: number, variation?: Color);
}
