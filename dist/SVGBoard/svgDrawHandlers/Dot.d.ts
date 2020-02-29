import SVGFieldDrawHandler from './SVGFieldDrawHandler';
export default class Dot extends SVGFieldDrawHandler {
    params: {
        color: string;
    };
    constructor(params: {
        color: string;
    });
    createElement(): SVGCircleElement;
}
