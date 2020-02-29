import { SVGBoardConfig } from '../types';
import SVGFieldDrawHandler from './SVGFieldDrawHandler';
export default class SimpleStone extends SVGFieldDrawHandler {
    color: string;
    constructor(color: string);
    createElement(config: SVGBoardConfig): SVGCircleElement;
}
