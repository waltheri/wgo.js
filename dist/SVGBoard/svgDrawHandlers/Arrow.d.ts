import { SVGBoardConfig, SVGDrawHandler, SVG_OBJECTS, BoardObjectSVGElements, SVG_GRID_MASK } from '../types';
import { LineBoardObject } from '../../BoardBase';
interface LineParams {
    color?: string;
    lineWidth?: number;
}
export default class Arrow implements SVGDrawHandler {
    params: LineParams;
    constructor(params?: LineParams);
    createElement(): {
        objects: SVGGElement;
        gridMask: SVGGElement;
    };
    protected createSVGElements(): SVGGElement;
    updateElement(elem: BoardObjectSVGElements, boardObject: LineBoardObject, config: SVGBoardConfig): void;
    protected updateSVGElements(elem: SVGElement, boardObject: LineBoardObject): void;
}
export {};
