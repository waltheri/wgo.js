import { FieldObject } from '../BoardBase';
import { SVGDrawHandler, SVGCustomObject } from './types';
export default class SVGCustomFieldObject extends FieldObject implements SVGCustomObject {
    handler: SVGDrawHandler;
    constructor(handler: SVGDrawHandler, x?: number, y?: number);
}
