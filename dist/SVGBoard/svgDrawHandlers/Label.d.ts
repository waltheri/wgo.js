import { SVGBoardConfig, OBJECTS, BoardObjectSVGElements, GRID_MASK } from '../types';
import SVGMarkupDrawHandler, { SVGMarkupDrawHandlerParams } from './SVGMarkupDrawHandler';
import { BoardLabelObject } from '../../BoardBase';
interface LabelParams extends SVGMarkupDrawHandlerParams {
    font?: string;
}
export default class Label extends SVGMarkupDrawHandler {
    params: LabelParams;
    constructor(params?: LabelParams);
    createElement(config: SVGBoardConfig): {
        [OBJECTS]: SVGTextElement;
        [GRID_MASK]: SVGTextElement;
    };
    updateElement(elem: BoardObjectSVGElements, boardObject: BoardLabelObject, config: SVGBoardConfig): void;
}
export {};
