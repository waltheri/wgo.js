import { SVGBoardConfig } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';
export default class Triangle extends SVGMarkupDrawHandler {
    createElement(config: SVGBoardConfig): SVGPolygonElement;
}
