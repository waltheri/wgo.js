import PlayerBase, { PlayerInitParams } from '../PlayerBase';
import PropertyHandler from '../PropertyHandler';
export default class BoardSizeHandler extends PropertyHandler<number> {
    beforeInit(value: number, player: PlayerBase, params: PlayerInitParams): PlayerInitParams;
}
