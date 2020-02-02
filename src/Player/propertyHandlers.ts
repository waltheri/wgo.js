// tslint-disable:function-name
import { Player } from '..';

export interface PropertyHandler {
  (player: Player, propIdent: string, propValue: any): void;
}

const propertyHandlers: { [propIdent: string]: PropertyHandler } = {
  B(player, propIdent, propValue) {
    player.addTemporaryBoardObject({ type: 'CR', field: propValue, params: { color: 'white' } });
  },
  W(player, propIdent, propValue) {
    player.addTemporaryBoardObject({ type: 'CR', field: propValue, params: { color: 'black' } });
  },
};

export default propertyHandlers;
