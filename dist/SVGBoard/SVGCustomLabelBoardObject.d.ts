import { LabelBoardObject } from '../BoardBase';
import { SVGDrawHandler, SVGCustomObject } from './types';
export default class SVGCustomLabelBoardObject extends LabelBoardObject implements SVGCustomObject {
    handler: SVGDrawHandler;
}
