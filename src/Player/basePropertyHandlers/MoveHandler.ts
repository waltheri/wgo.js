import PropertyHandler from '../PropertyHandler';
import { Point, Color } from '../../types';
import { PlayerBase } from '..';

export default class MoveHandler<D> extends PropertyHandler<Point, D> {
  color: Color;

  constructor(color: Color) {
    super();
    this.color = color;
  }

  applyGameChanges(value: Point, player: PlayerBase, propertyData: D) {
    if (value) {
      player.game.position.applyMove(value.x, value.y, this.color, true, true);
    }
    player.game.position.turn = -this.color;

    return propertyData;
  }
}
