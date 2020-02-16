import PlayerBase from '../PlayerBase';
import PropertyHandler from '../PropertyHandler';
import { Point, Color } from '../../types';

export default class SetupHandler extends PropertyHandler<Point[]> {
  color: Color;

  constructor(color: Color) {
    super();
    this.color = color;
  }

  applyGameChanges(values: Point[], player: PlayerBase) {
    values.forEach((value) => {
      // add stone
      player.game.setStone(value.x, value.y, this.color);
    });
  }
}
