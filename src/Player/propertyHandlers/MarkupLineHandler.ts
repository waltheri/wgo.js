import { BoardObject, BoardLineObject } from '../../CanvasBoard';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from './PropertyHandler';
import { Vector } from '../../types';

export default class MarkupLineHandler extends PropertyHandler<Vector[], BoardObject[]> {
  nextNode(values: Vector[], player: PlainPlayer, propertyData: BoardObject[]) {
    const objects: BoardObject[] = [];

    values.forEach((value) => {
      // add markup
      const boardMarkup = new BoardLineObject(this.type, value[0], value[1]);
      boardMarkup.zIndex = 10;
      player.board.addObject(boardMarkup);
      objects.push(boardMarkup);
    });

    return objects;
  }

  previousNode(values: Vector[], player: PlainPlayer, propertyData: BoardObject[]) {
    return this.nextNode(values, player, propertyData);
  }

  beforeNextNode(values: Vector[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[] {
    propertyData.forEach((object) => {
      player.board.removeObject(object);
    });

    return null;
  }

  beforePreviousNode(values: Vector[], player: PlainPlayer, propertyData: BoardObject[]) {
    return this.beforeNextNode(values, player, propertyData);
  }
}
