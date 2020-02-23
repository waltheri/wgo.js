import { SVGBoardConfig } from '../types';
import SVGFieldDrawHandler from './SVGFieldDrawHandler';
export default class Dot extends SVGFieldDrawHandler {
    params: {
        color: string;
    };
    constructor(params: {
        color: string;
    });
    createElement(config: SVGBoardConfig): SVGCircleElement;
}
