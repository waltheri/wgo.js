import SVGFieldDrawHandler from './SVGFieldDrawHandler';
export default class Dim extends SVGFieldDrawHandler {
    params: {
        color: string;
    };
    constructor(params: {
        color: string;
    });
    createElement(): SVGRectElement;
}
