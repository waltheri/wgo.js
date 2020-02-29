import { SVGBoardConfig, OBJECTS, GRID_MASK } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';
export default class Square extends SVGMarkupDrawHandler {
    createElement(config: SVGBoardConfig): {
        [OBJECTS]: SVGRectElement;
        [GRID_MASK]: SVGRectElement;
    };
}
