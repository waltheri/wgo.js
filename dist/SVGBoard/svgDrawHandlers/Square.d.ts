import { SVGBoardConfig, SVG_OBJECTS, SVG_GRID_MASK } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';
export default class Square extends SVGMarkupDrawHandler {
    createElement(config: SVGBoardConfig): {
        objects: SVGRectElement;
        gridMask: SVGRectElement;
    };
}
