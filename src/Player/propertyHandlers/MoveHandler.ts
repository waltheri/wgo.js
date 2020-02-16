import { BoardMarkupObject, BoardObject } from '../../CanvasBoard';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from './PropertyHandler';
import { Point } from '../../types';

function samePoint(p1: Point, p2: any) {
  return p2 && p1.x === p2.x && p1.y === p2.y;
}

function isThereMarkup(ignore: string, field: Point, properties: { [key: string]: any }) {
  const propIdents = Object.keys(properties);

  for (let i = 0; i < propIdents.length; i++) {
    if (propIdents[i] === ignore) {
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

export default class MoveHandler extends PropertyHandler<Point, BoardObject> {
  nextNode(value: Point, player: PlainPlayer, propertyData: BoardObject) {
    if (isThereMarkup(this.type, value, player.currentNode.properties)) {
      return;
    }

    // add current move mark
    const boardMarkup = new BoardMarkupObject(
      this.type === 'B' ? player.config.currentMoveBlackMark : player.config.currentMoveWhiteMark,
    );
    boardMarkup.zIndex = 10;
    player.board.addObjectAt(value.x, value.y, boardMarkup);

    return boardMarkup;
  }

  previousNode(value: Point, player: PlainPlayer, propertyData: BoardObject) {
    return this.nextNode(value, player, propertyData);
  }

  beforeNextNode(value: Point, player: PlainPlayer, propertyData: BoardObject): BoardObject {
    if (propertyData) {
      player.board.removeObject(propertyData);
    }
    return null;
  }

  beforePreviousNode(value: Point, player: PlainPlayer, propertyData: BoardObject): BoardObject {
    return this.beforeNextNode(value, player, propertyData);
  }
}
