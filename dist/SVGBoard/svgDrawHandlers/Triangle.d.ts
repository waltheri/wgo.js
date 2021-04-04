import { SVGBoardConfig, SVG_OBJECTS, SVG_GRID_MASK } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';
export default class Triangle extends SVGMarkupDrawHandler {
    createElement(config: SVGBoardConfig): {
        objects: SVGPolygonElement;
        gridMask: SVGPolygonElement;
    };
}
