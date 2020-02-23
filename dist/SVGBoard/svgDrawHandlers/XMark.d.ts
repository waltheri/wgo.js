import { SVGBoardConfig } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';
export default class XMark extends SVGMarkupDrawHandler {
    createElement(config: SVGBoardConfig): SVGPathElement;
}
