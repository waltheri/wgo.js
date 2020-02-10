// tslint:disable: function-name
import { Player } from '..';
import { FieldObject } from '../CanvasBoard';

export interface PropertyHandler {
  (player: Player, propIdent: string, propValue: any): void;
}

const propertyHandlers: { [propIdent: string]: PropertyHandler } = {
  B(player, propIdent, propValue) {
    const circle = new FieldObject(player.config.currentMoveBlackMark);
    circle.x = propValue.x;
    circle.y = propValue.y;
    player.addTemporaryBoardObject(circle);
  },
  W(player, propIdent, propValue) {
    const circle = new FieldObject(player.config.currentMoveWhiteMark);
    circle.x = propValue.x;
    circle.y = propValue.y;
    player.addTemporaryBoardObject(circle);
  },
};

export default propertyHandlers;
