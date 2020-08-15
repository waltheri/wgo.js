import { Color } from '../types';
import BoardMarkupObject from './BoardMarkupObject';

/**
 * Board label object is special type of markup object, which renders text on the field.
 */
export default class BoardLabelObject extends BoardMarkupObject {
  text: string;

  constructor(text: string, x = 0, y = 0, variation?: Color) {
    super('LB', x, y, variation);

    this.text = text;
  }
}
