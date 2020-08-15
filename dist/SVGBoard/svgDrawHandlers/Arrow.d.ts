import { SVGBoardConfig, SVGDrawHandler, OBJECTS, BoardObjectSVGElements, GRID_MASK } from '../types';
import { BoardLineObject } from '../../BoardBase';
interface LineParams {
    color?: string;
    lineWidth?: number;
}
export default class Arrow implements SVGDrawHandler {
    params: LineParams;
    constructor(params?: LineParams);
    createElement(): {
        [OBJECTS]: SVGGElement;
        [GRID_MASK]: SVGGElement;
    };
    protected createSVGElements(): SVGGElement;
    updateElement(elem: BoardObjectSVGElements, boardObject: BoardLineObject, config: SVGBoardConfig): void;
    protected updateSVGElements(elem: SVGElement, boardObject: BoardLineObject): void;
}
export {};
