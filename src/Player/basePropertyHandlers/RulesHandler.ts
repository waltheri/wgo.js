import PlayerBase, { PlayerInitParams } from '../PlayerBase';
import PropertyHandler from '../PropertyHandler';
import { goRules } from '../../Game';

export default class RulesHandler extends PropertyHandler<string> {
  beforeInit(value: string, player: PlayerBase) {
    if ((goRules as any)[value]) {
      player.params.rules = (goRules as any)[value];
    }
  }
}
