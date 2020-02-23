import { SVGBoardConfig } from '../types';
import SVGStoneDrawHandler from './SVGStoneDrawHandler';
export default class GlassStoneBlack extends SVGStoneDrawHandler {
    filterId: string;
    filterElement: SVGFilterElement;
    init(config: SVGBoardConfig): SVGElement;
    createElement(config: SVGBoardConfig): SVGGElement;
}
