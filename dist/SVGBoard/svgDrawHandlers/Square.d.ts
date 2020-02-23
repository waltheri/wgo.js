import { SVGBoardConfig } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';
export default class Square extends SVGMarkupDrawHandler {
    createElement(config: SVGBoardConfig): SVGRectElement;
}
