import { Color } from '../../types';
import BoardObject from './BoardObject';
import { DrawHandler } from '../drawHandlers';

/**
 * Board markup object is special type of object, which can have 3 variations - for empty field
 * and for black and white stone.
 */
export default class BoardMarkupObject extends BoardObject {
  variation: Color;

  constructor(type: string | DrawHandler, variation: Color = Color.E) {
    super(type);
    this.variation = variation;
  }
}
