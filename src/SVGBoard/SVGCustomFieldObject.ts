import { FieldObject } from '../BoardBase';
import { SVGDrawHandler, SVGCustomObject } from './types';

export default class SVGCustomFieldObject extends FieldObject implements SVGCustomObject {
  handler: SVGDrawHandler;

  constructor(handler: SVGDrawHandler, x = 0, y = 0) {
    super('custom', x, y);
    this.handler = handler;
  }
}
