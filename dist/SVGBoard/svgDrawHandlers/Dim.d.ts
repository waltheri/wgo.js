import { SVGBoardConfig } from '../types';
import SVGFieldDrawHandler from './SVGFieldDrawHandler';
export default class Dim extends SVGFieldDrawHandler {
    params: {
        color: string;
    };
    constructor(params: {
        color: string;
    });
    createElement(config: SVGBoardConfig): SVGRectElement;
}
