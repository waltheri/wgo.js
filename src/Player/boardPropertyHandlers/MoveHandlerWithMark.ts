import { BoardMarkupObject, BoardObject } from '../../CanvasBoard';
import PlainPlayer from '../PlainPlayer';
import { Point, Color } from '../../types';
import MoveHandler from '../basePropertyHandlers/MoveHandler';

function samePoint(p1: Point, p2: any) {
  return p2 && p1.x === p2.x && p1.y === p2.y;
}

function isThereMarkup(field: Point, properties: { [key: string]: any }) {
  const propIdents = Object.keys(properties);

  for (let i = 0; i < propIdents.length; i++) {
    if (propIdents[i] === 'B' || propIdents[i] === 'W') {
      continue;
    }

    const value = properties[propIdents[i]];
    if (Array.isArray(value)) {
      for (let j = 0; j < value.length; j++) {
        if (samePoint(field, value[j])) {
          return true;
        }
      }
    } else if (samePoint(field, value)) {
      return true;
    }
  }

  return false;
}

export default class MoveHandlerWithMark extends MoveHandler<BoardObject> {
  applyNodeChanges(value: Point, player: PlainPlayer) {
    if (player.config.highlightCurrentMove) {
      const variationsMarkup = player.getVariations().length > 1 && player.showCurrentVariations();
      if (isThereMarkup(value, player.currentNode.properties) || variationsMarkup) {
        return;
      }

      // add current move mark
      const boardMarkup = new BoardMarkupObject(
        this.color === Color.BLACK ? player.config.currentMoveBlackMark : player.config.currentMoveWhiteMark,
      );
      boardMarkup.zIndex = 10;
      player.board.addObjectAt(value.x, value.y, boardMarkup);

      return boardMarkup;
    }

    return null;
  }

  clearNodeChanges(value: Point, player: PlainPlayer, propertyData: BoardObject): BoardObject {
    if (propertyData) {
      player.board.removeObject(propertyData);
    }
    return null;
  }
}
