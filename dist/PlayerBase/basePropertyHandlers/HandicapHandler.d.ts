import PlayerBase from '../PlayerBase';
import PropertyHandler from '../PropertyHandler';
export default class HandicapHandler extends PropertyHandler<number> {
    applyGameChanges(value: number, player: PlayerBase): void;
}
