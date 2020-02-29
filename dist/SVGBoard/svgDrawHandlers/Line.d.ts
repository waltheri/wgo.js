import { SVGBoardConfig, SVGDrawHandler, BoardObjectSVGElements, OBJECTS, GRID_MASK } from '../types';
import { BoardLineObject } from '../../BoardBase';
interface LineParams {
    color?: string;
    lineWidth?: number;
}
export default class Line implements SVGDrawHandler {
    params: LineParams;
    constructor(params?: LineParams);
    createElement(): {
        [OBJECTS]: SVGLineElement;
        [GRID_MASK]: SVGLineElement;
    };
    updateElement(elem: BoardObjectSVGElements, boardObject: BoardLineObject<SVGDrawHandler>, config: SVGBoardConfig): void;
}
export {};
