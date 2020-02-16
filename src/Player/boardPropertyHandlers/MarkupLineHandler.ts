import { BoardObject, BoardLineObject } from '../../CanvasBoard';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from '../PropertyHandler';
import { Vector } from '../../types';

export default class MarkupLineHandler extends PropertyHandler<Vector[], BoardObject[]> {
  type: string;

  constructor(type: string) {
    super();

    this.type = type;
  }

  applyNodeChanges(values: Vector[], player: PlainPlayer, propertyData: BoardObject[]) {
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

  clearNodeChanges(values: Vector[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[] {
    player.board.removeObject(propertyData);

    return null;
  }
}
