import { BoardMarkupObject, BoardObject } from '../../BoardBase';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from '../PropertyHandler';
import { Point } from '../../types';

export default class MarkupHandler extends PropertyHandler<Point[], BoardObject<any>[]> {
  type: string;

  constructor(type: string) {
    super();

    this.type = type;
  }

  applyNodeChanges(values: Point[], player: PlainPlayer) {
    const objects: BoardObject<any>[] = [];

    values.forEach((value) => {
      // add markup
      const boardMarkup = new BoardMarkupObject(this.type, player.game.getStone(value.x, value.y));
      boardMarkup.zIndex = 10;
      player.board.addObjectAt(value.x, value.y, boardMarkup);
      objects.push(boardMarkup);
    });

    return objects;
  }

  clearNodeChanges(values: Point[], player: PlainPlayer, propertyData: BoardObject<any>[]): BoardObject<any>[] {
    player.board.removeObject(propertyData);

    return null;
  }
}
