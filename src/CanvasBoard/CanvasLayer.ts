/* global document, window */
import CanvasBoard from './CanvasBoard';
import { BoardObject } from './boardObjects';
import { DrawFunction } from './types';

/**
 * @class
 * Implements one layer of the HTML5 canvas
 */

export default class CanvasLayer {
  element: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  pixelRatio: number;
  board: CanvasBoard;

  constructor(board: CanvasBoard) {
    this.board = board;
    this.init();
  }

  init() {
    this.element = document.createElement('canvas');
    this.element.style.position = 'absolute';
    // this.element.style.zIndex = weight.toString(10);
    this.element.style.width = '100%';
    this.element.style.height = '100%';

    this.context = this.element.getContext('2d');
    this.context.scale(this.board.pixelRatio, this.board.pixelRatio);
    this.context.save();

    this.board.boardElement.appendChild(this.element);
  }

  resize(width: number, height: number) {
    const linesShift = this.board.config.theme.linesShift;

    this.element.width = width;
    this.element.height = height;

    this.context.transform(1, 0, 0, 1, linesShift, linesShift);
  }

  draw(drawFunction: DrawFunction, boardObject: BoardObject) {
    try {
      const leftOffset = this.board.getX(boardObject.x);
      const topOffset = this.board.getY(boardObject.y);
      const fieldSize = this.board.fieldSize;

      // create a "sandbox" for drawing function
      this.context.save();

      this.context.transform(
        fieldSize * boardObject.scaleX,
        0, 0,
        fieldSize * boardObject.scaleY,
        leftOffset,
        topOffset,
      );
      this.context.rotate(boardObject.rotate);
      this.context.globalAlpha = boardObject.opacity;

      drawFunction(this.context, this.board.config, boardObject);

      // restore context
      this.context.restore();
    } catch (err) {
      // If the board is too small some canvas painting function can throw an exception, but we don't
      // want to break our app
      // tslint:disable-next-line:no-console
      console.error(`Object couldn't be rendered. Error: ${err.message}`, boardObject);
    }
  }

  clear() {
    this.context.clearRect(0, 0, this.element.width, this.element.height);
  }
}
