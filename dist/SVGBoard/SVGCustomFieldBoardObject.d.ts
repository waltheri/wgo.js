import { FieldBoardObject } from '../BoardBase';
import { SVGDrawHandler, SVGCustomObject } from './types';
export default class SVGCustomFieldBoardObject extends FieldBoardObject implements SVGCustomObject {
    handler: SVGDrawHandler;
    constructor(handler: SVGDrawHandler, x?: number, y?: number);
}
