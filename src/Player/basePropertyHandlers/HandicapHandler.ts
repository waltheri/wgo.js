import PlayerBase, { PlayerInitParams } from '../PlayerBase';
import PropertyHandler from '../PropertyHandler';
import { Color } from '../../types';
import { PropIdent } from '../../SGFParser/sgfTypes';

export default class HandicapHandler extends PropertyHandler<number> {
  applyGameChanges(value: number, player: PlayerBase) {
    if (value > 1 && player.currentNode === player.rootNode && !player.getProperty(PropIdent.SET_TURN)) {
      player.game.position.turn = Color.WHITE;
    }
  }
}
