import SVGStoneDrawHandler from './SVGStoneDrawHandler';
import SVGFieldDrawHandler from './SVGFieldDrawHandler';
import { SVGBoardConfig } from '../types';
export default class RealisticStone extends SVGStoneDrawHandler {
    paths: string[];
    fallback: SVGFieldDrawHandler;
    randSeed: number;
    loadedPaths: {
        [path: string]: boolean;
    };
    constructor(paths: string[], fallback: SVGFieldDrawHandler);
    createElement(config: SVGBoardConfig, addDef: (def: SVGElement) => void): SVGGElement;
}
