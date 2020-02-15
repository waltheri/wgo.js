import PlayerBase from '../PlayerBase';
import PropertyHandler from './PropertyHandler';
export default class BoardSizeHandler extends PropertyHandler<number> {
    constructor();
    beforeInit(value: number, player: PlayerBase): void;
}
