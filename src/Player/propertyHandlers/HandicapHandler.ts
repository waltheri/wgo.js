import PlayerBase from '../PlayerBase';
import PropertyHandler from './PropertyHandler';
import { Color } from '../../types';

export default class HandicapHandler extends PropertyHandler<number> {
  constructor() {
    super('HA');
  }

  afterInit(value: number, player: PlayerBase) {
    if (value > 1) {
      player.game.turn = Color.WHITE;
    }
  }
}
