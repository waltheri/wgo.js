import { SVGBoardConfig } from '../types';
import SVGMarkupDrawHandler, { SVGMarkupDrawHandlerParams } from './SVGMarkupDrawHandler';
import { BoardLabelObject } from '../../BoardBase';
interface LabelParams extends SVGMarkupDrawHandlerParams {
    font?: string;
}
export default class Label extends SVGMarkupDrawHandler {
    params: LabelParams;
    constructor(params?: LabelParams);
    createElement(config: SVGBoardConfig): SVGTextElement;
    updateElement(elem: SVGElement, boardObject: BoardLabelObject, config: SVGBoardConfig): void;
}
export {};
