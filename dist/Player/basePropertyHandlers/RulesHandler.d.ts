import PlayerBase, { PlayerInitParams } from '../PlayerBase';
import PropertyHandler from '../PropertyHandler';
export default class RulesHandler extends PropertyHandler<string> {
    beforeInit(value: string, player: PlayerBase, params: PlayerInitParams): PlayerInitParams;
}
