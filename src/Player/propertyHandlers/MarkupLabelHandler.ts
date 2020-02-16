import { BoardObject, BoardLabelObject } from '../../CanvasBoard';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from './PropertyHandler';
import { Point, Label } from '../../types';

export default class MarkupLabelHandler extends PropertyHandler<Label[], BoardObject[]> {
  constructor() {
    super('LB');
  }

  nextNode(values: Label[], player: PlainPlayer, propertyData: BoardObject[]) {
    const objects: BoardObject[] = [];

    values.forEach((value) => {
      // add markup
      const boardMarkup = new BoardLabelObject(value.text, player.game.getStone(value.x, value.y));
      boardMarkup.zIndex = 10;
      player.board.addObjectAt(value.x, value.y, boardMarkup);
      objects.push(boardMarkup);
    });

    return objects;
  }

  previousNode(values: Label[], player: PlainPlayer, propertyData: BoardObject[]) {
    return this.nextNode(values, player, propertyData);
  }

  beforeNextNode(values: Label[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[] {
    propertyData.forEach((object) => {
      player.board.removeObject(object);
    });

    return null;
  }

  beforePreviousNode(values: Label[], player: PlainPlayer, propertyData: BoardObject[]) {
    return this.beforeNextNode(values, player, propertyData);
  }
}
