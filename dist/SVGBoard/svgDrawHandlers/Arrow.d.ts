import { SVGBoardConfig, SVGDrawHandler } from '../types';
import { BoardLineObject } from '../../BoardBase';
interface LineParams {
    color?: string;
    lineWidth?: number;
}
export default class Arrow implements SVGDrawHandler {
    params: LineParams;
    constructor(params?: LineParams);
    init(): SVGElement;
    createElement(config: SVGBoardConfig): SVGLineElement;
    updateElement(elem: SVGLineElement, boardObject: BoardLineObject<SVGDrawHandler>, config: SVGBoardConfig): void;
}
export {};
