import { BoardMarkupObject, BoardObject } from '../../CanvasBoard';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from './PropertyHandler';
import { Point } from '../../types';

export default class MarkupHandler extends PropertyHandler<Point[], BoardObject[]> {
  nextNode(values: Point[], player: PlainPlayer, propertyData: BoardObject[]) {
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

  previousNode(values: Point[], player: PlainPlayer, propertyData: BoardObject[]) {
    return this.nextNode(values, player, propertyData);
  }

  beforeNextNode(values: Point[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[] {
    propertyData.forEach((object) => {
      player.board.removeObject(object);
    });

    return null;
  }

  beforePreviousNode(values: Point[], player: PlainPlayer, propertyData: BoardObject[]) {
    return this.beforeNextNode(values, player, propertyData);
  }
}
