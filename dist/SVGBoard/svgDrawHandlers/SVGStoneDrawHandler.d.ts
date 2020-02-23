import SVGFieldDrawHandler from './SVGFieldDrawHandler';
import { SVGBoardConfig } from '../types';
export default abstract class SVGStoneDrawHandler extends SVGFieldDrawHandler {
    shadowFilterId: string;
    shadowFilterElement: SVGFilterElement;
    init(config: SVGBoardConfig): SVGElement;
}
