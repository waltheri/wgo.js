import { SVGBoardConfig, SVG_OBJECTS, BoardObjectSVGElements, SVG_GRID_MASK } from '../types';
import SVGMarkupDrawHandler, { SVGMarkupDrawHandlerParams } from './SVGMarkupDrawHandler';
import { LabelBoardObject } from '../../BoardBase';
interface LabelParams extends SVGMarkupDrawHandlerParams {
    font?: string;
    maxWidth?: number;
}
export default class Label extends SVGMarkupDrawHandler {
    params: LabelParams;
    constructor(params?: LabelParams);
    createElement(config: SVGBoardConfig): {
        objects: SVGTextElement;
        gridMask: SVGTextElement;
    };
    updateElement(elem: BoardObjectSVGElements, boardObject: LabelBoardObject, config: SVGBoardConfig): void;
}
export {};
