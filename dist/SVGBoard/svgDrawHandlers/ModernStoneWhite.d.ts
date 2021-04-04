import { SVGBoardConfig, SVG_OBJECTS, SVG_SHADOWS } from '../types';
import SVGStoneDrawHandler from './SVGStoneDrawHandler';
export default class GlassStoneWhite extends SVGStoneDrawHandler {
    filterElement1: SVGElement;
    filterElement2: SVGElement;
    createElement(config: SVGBoardConfig, addDef: (def: SVGElement) => void): {
        objects: SVGGElement;
        shadows: SVGCircleElement;
    };
}
