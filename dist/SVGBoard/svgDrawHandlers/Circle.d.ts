import { SVG_OBJECTS, SVG_GRID_MASK, SVGBoardConfig } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';
export default class Circle extends SVGMarkupDrawHandler {
    createElement(config: SVGBoardConfig): {
        objects: SVGCircleElement;
        gridMask: SVGCircleElement;
    };
}
