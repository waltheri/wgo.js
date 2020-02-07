import { Player } from '..';

export interface PropertyHandler {
  (player: Player, propIdent: string, propValue: any): void;
}

const propertyHandlers: { [propIdent: string]: PropertyHandler } = {
  //B(player, propIdent, propValue) {
  //  player.addTemporaryBoardObject({ type: 'CR', field: propValue, params: { color: 'rgba(255,255,255,0.8)' } });
  //},
  //W(player, propIdent, propValue) {
  //  player.addTemporaryBoardObject({ type: 'CR', field: propValue, params: { color: 'rgba(0,0,0,0.8)' } });
  //},
};

export default propertyHandlers;
