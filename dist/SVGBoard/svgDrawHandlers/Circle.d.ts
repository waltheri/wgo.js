import { OBJECTS, GRID_MASK, SVGBoardConfig } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';
export default class Circle extends SVGMarkupDrawHandler {
    createElement(config: SVGBoardConfig): {
        [OBJECTS]: SVGCircleElement;
        [GRID_MASK]: SVGCircleElement;
    };
}
