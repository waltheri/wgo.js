import { SVGDrawHandler, SVGBoardConfig } from '../types';
import { FieldObject } from '../../BoardBase';
export default abstract class SVGFieldDrawHandler implements SVGDrawHandler {
    init(config: SVGBoardConfig): SVGElement;
    abstract createElement(config: SVGBoardConfig): SVGElement;
    updateElement(elem: SVGElement, boardObject: FieldObject<SVGDrawHandler>, config: SVGBoardConfig): void;
}
