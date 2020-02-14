import { BoardMarkupObject, BoardObject } from '../../CanvasBoard';
import Player from '../Player';
import PropertyHandler from './PropertyHandler';
import { Point } from '../../types';

export default class MarkupHandler extends PropertyHandler<Point[], BoardObject[]> {
  nextNode(values: Point[], propertyData: BoardObject[], player: Player) {
    const objects: BoardObject[] = [];

    values.forEach((value) => {
      // add markup
      const boardMarkup = new BoardMarkupObject(this.type);
      boardMarkup.zIndex = 10;
      player.board.addObjectAt(value.x, value.y, boardMarkup);
      objects.push(boardMarkup);
    });

    return objects;
  }

  previousNode(values: Point[], propertyData: BoardObject[], player: Player) {
    return this.nextNode(values, propertyData, player);
  }

  beforeNextNode(values: Point[], propertyData: BoardObject[], player: Player): BoardObject[] {
    propertyData.forEach((object) => {
      player.board.removeObject(object);
    });

    return null;
  }

  beforePreviousNode(values: Point[], propertyData: BoardObject[], player: Player) {
    return this.beforeNextNode(values, propertyData, player);
  }
}
