import PlayerBase from '../PlayerBase';
import PropertyHandler from './PropertyHandler';

export default class BoardSizeHandler extends PropertyHandler<number> {
  constructor() {
    super('SZ');
  }

  beforeInit(value: number, player: PlayerBase) {
    player.params.size = value;
  }
}
