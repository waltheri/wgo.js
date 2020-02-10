import { DrawHandler } from '../drawHandlers';
export default class BoardObject {
    type: string | DrawHandler;
    constructor(type: string | DrawHandler);
}
