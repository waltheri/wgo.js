import { SVGBoardConfig, SVG_OBJECTS, SVG_SHADOWS } from '../types';
import SVGStoneDrawHandler from './SVGStoneDrawHandler';
export default class GlassStoneBlack extends SVGStoneDrawHandler {
    filterElement: SVGFilterElement;
    createElement(config: SVGBoardConfig, addDef: (def: SVGElement) => void): {
        objects: SVGGElement;
        shadows: SVGCircleElement;
    };
}
