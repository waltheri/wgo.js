import { SVG_OBJECTS, SVG_GRID_MASK, SVGBoardConfig } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';
export default class XMark extends SVGMarkupDrawHandler {
    createElement(config: SVGBoardConfig): {
        objects: SVGPathElement;
        gridMask: SVGCircleElement;
    };
}
