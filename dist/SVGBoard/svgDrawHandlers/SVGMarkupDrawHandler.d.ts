import { SVGDrawHandler, SVGBoardConfig, BoardObjectSVGElements } from '../types';
import { BoardMarkupObject } from '../../BoardBase';
import SVGFieldDrawHandler from './SVGFieldDrawHandler';
export interface SVGMarkupDrawHandlerParams {
    color?: string;
    lineWidth?: number;
    fillColor?: string;
}
export default abstract class SVGMarkupDrawHandler extends SVGFieldDrawHandler {
    params: SVGMarkupDrawHandlerParams;
    constructor(params?: SVGMarkupDrawHandlerParams);
    updateElement(elem: BoardObjectSVGElements, boardObject: BoardMarkupObject<SVGDrawHandler>, config: SVGBoardConfig): void;
}
