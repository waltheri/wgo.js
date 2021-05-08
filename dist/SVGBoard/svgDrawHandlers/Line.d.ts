import { SVGBoardConfig, SVGDrawHandler, BoardObjectSVGElements, SVG_OBJECTS, SVG_GRID_MASK } from '../types';
import { LineBoardObject } from '../../BoardBase';
interface LineParams {
    color?: string;
    lineWidth?: number;
}
export default class Line implements SVGDrawHandler {
    params: LineParams;
    constructor(params?: LineParams);
    createElement(): {
        objects: SVGLineElement;
        gridMask: SVGLineElement;
    };
    updateElement(elem: BoardObjectSVGElements, boardObject: LineBoardObject, config: SVGBoardConfig): void;
}
export {};
