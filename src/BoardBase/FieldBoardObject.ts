import BoardObject from './BoardObject';

/**
 * Represents board object specified by type, which can be painted on the specific field of the board.
 * It can be also transformed.
 */
export default class FieldBoardObject extends BoardObject {
  x: number;
  y: number;
  scaleX: number = 1;
  scaleY: number = 1;
  rotate: number = 0;

  constructor(type: string, x = 0, y = 0) {
    super(type);

    this.x = x;
    this.y = y;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setScale(factor: number) {
    this.scaleX = factor;
    this.scaleY = factor;
  }
}
