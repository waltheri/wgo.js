import { DrawHandler } from '../drawHandlers';
export default class BoardObject {
    type: string | DrawHandler;
    zIndex: number;
    constructor(type: string | DrawHandler);
}
