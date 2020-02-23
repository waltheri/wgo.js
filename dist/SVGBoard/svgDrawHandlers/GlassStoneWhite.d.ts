import { SVGBoardConfig } from '../types';
import SVGStoneDrawHandler from './SVGStoneDrawHandler';
export default class GlassStoneWhite extends SVGStoneDrawHandler {
    filterId: string;
    init(config: SVGBoardConfig): SVGElement;
    createElement(config: SVGBoardConfig): SVGGElement;
}
