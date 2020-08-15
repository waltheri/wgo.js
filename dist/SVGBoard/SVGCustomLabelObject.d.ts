import { BoardLabelObject } from '../BoardBase';
import { SVGDrawHandler, SVGCustomObject } from './types';
export default class SVGCustomLabelObject extends BoardLabelObject implements SVGCustomObject {
    handler: SVGDrawHandler;
}
