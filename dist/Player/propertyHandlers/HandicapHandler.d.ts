import PlayerBase from '../PlayerBase';
import PropertyHandler from './PropertyHandler';
export default class HandicapHandler extends PropertyHandler<number> {
    constructor();
    afterInit(value: number, player: PlayerBase): void;
}
