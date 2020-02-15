import PlayerBase from '../PlayerBase';
import PropertyHandler from './PropertyHandler';
export default class RulesHandler extends PropertyHandler<string> {
    constructor();
    beforeInit(value: string, player: PlayerBase): void;
}
