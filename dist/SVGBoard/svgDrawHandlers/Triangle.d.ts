import { SVGBoardConfig, OBJECTS, GRID_MASK } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';
export default class Triangle extends SVGMarkupDrawHandler {
    createElement(config: SVGBoardConfig): {
        [OBJECTS]: SVGPolygonElement;
        [GRID_MASK]: SVGPolygonElement;
    };
}
