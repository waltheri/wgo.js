import { BoardObject, BoardLabelObject } from '../../CanvasBoard';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from '../PropertyHandler';
import { Point, Label } from '../../types';

export default class MarkupLabelHandler extends PropertyHandler<Label[], BoardObject[]> {
  applyNodeChanges(values: Label[], player: PlainPlayer) {
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

  clearNodeChanges(values: Label[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[] {
    player.board.removeObject(propertyData);

    return null;
  }
}
