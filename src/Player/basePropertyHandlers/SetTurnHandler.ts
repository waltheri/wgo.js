import PlayerBase from '../PlayerBase';
import PropertyHandler from '../PropertyHandler';
import { Color } from '../../types';

export default class SetTurnHandler extends PropertyHandler<Color.BLACK | Color.WHITE> {
  applyGameChanges(value: Color.BLACK | Color.WHITE, player: PlayerBase) {
    player.game.turn = value;
  }
}
