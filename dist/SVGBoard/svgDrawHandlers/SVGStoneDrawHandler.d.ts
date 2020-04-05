import SVGFieldDrawHandler from './SVGFieldDrawHandler';
import { SVGBoardConfig, BoardObjectSVGElements } from '../types';
export default abstract class SVGStoneDrawHandler extends SVGFieldDrawHandler {
    shadowFilterElement: SVGElement;
    createElement(config: SVGBoardConfig, addDef: (def: SVGElement) => void): SVGElement | BoardObjectSVGElements;
    createShadow(config: SVGBoardConfig, addDef: (def: SVGElement) => void): SVGCircleElement;
}
