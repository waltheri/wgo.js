import PlayerBase from '../PlayerBase';
import PropertyHandler from './PropertyHandler';
import { Point, Color } from '../../types';

export default class SetupHandler extends PropertyHandler<Point[]> {
  color: Color;

  constructor(type: string, color: Color) {
    super(type);
    this.color = color;
  }

  beforeMove(values: Point[], player: PlayerBase) {
    values.forEach((value) => {
      // add stone
      player.game.setStone(value.x, value.y, this.color);
    });
  }
}
