import { SVGBoardConfig } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';
export default class Circle extends SVGMarkupDrawHandler {
    createElement(config: SVGBoardConfig): SVGCircleElement;
}
