import { Color } from '../types';
import MarkupBoardObject from './MarkupBoardObject';

/**
 * Board label object is special type of markup object, which renders text on the field.
 */
export default class LabelBoardObject extends MarkupBoardObject {
  text: string;

  constructor(text: string, x = 0, y = 0, variation?: Color) {
    super('LB', x, y, variation);

    this.text = text;
  }
}
