import { Color } from '../types';
import BoardMarkupObject from './BoardMarkupObject';

export default class BoardLabelObject extends BoardMarkupObject<any> {
  text: string;

  constructor(text: string, variation?: Color) {
    super('LB', variation);

    this.text = text;
  }
}
