import { BoardMarkupObject, BoardObject } from '../../CanvasBoard';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from '../PropertyHandler';
import { Point } from '../../types';

export default class MarkupHandler extends PropertyHandler<Point[], BoardObject[]> {
  type: string;

  constructor(type: string) {
    super();

    this.type = type;
  }

  applyNodeChanges(values: Point[], player: PlainPlayer) {
    const objects: BoardObject[] = [];

    values.forEach((value) => {
      // add markup
      const boardMarkup = new BoardMarkupObject(this.type, player.game.getStone(value.x, value.y));
      boardMarkup.zIndex = 10;
      player.board.addObjectAt(value.x, value.y, boardMarkup);
      objects.push(boardMarkup);
    });

    return objects;
  }

  clearNodeChanges(values: Point[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[] {
    player.board.removeObject(propertyData);

    return null;
  }
}
