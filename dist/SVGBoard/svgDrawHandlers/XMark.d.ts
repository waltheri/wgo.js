import { OBJECTS, GRID_MASK, SVGBoardConfig } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';
export default class XMark extends SVGMarkupDrawHandler {
    createElement(config: SVGBoardConfig): {
        [OBJECTS]: SVGPathElement;
        [GRID_MASK]: SVGCircleElement;
    };
}
