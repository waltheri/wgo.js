import SVGFieldDrawHandler from './SVGFieldDrawHandler';
import { SVGBoardConfig, BoardObjectSVGElements } from '../types';
export default abstract class SVGStoneDrawHandler extends SVGFieldDrawHandler {
    shadowFilterElement: SVGFilterElement;
    createElement(config: SVGBoardConfig, addDef: (def: SVGElement) => void): SVGElement | BoardObjectSVGElements;
}
