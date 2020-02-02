/* global document, window */
import CanvasBoard from './CanvasBoard';
import { DrawFunction, BoardFieldObject, BoardFreeObject } from './types';
import { Point } from '../types';

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

  draw<P extends BoardFreeObject>(drawingFn: DrawFunction<P>, args: P) {
    try {
      this.context.save();
      drawingFn(this.context, args, this.board);
      this.context.restore();
    } catch (err) {
      // If the board is too small some canvas painting function can throw an exception, but we don't
      // want to break our app
      // tslint:disable-next-line:no-console
      console.error(`Object couldn't be rendered. Error: ${err.message}`, args);
    }
  }

  drawField<P extends BoardFieldObject>(drawingFn: DrawFunction<P>, args: P) {
    try {
      const leftOffset = this.board.getX(args.field.x);
      const topOffset = this.board.getY(args.field.y);

      // create a "sandbox" for drawing function
      this.context.save();

      this.context.transform(this.board.fieldSize, 0, 0, this.board.fieldSize, leftOffset, topOffset);
      //this.context.beginPath();
      //this.context.rect(-0.5, -0.5, 1, 1);
      //this.context.clip();
      drawingFn(this.context, args, this.board);

      // restore context
      this.context.restore();
    } catch (err) {
      // If the board is too small some canvas painting function can throw an exception, but we don't
      // want to break our app
      // tslint:disable-next-line:no-console
      console.error(`Object couldn't be rendered. Error: ${err.message}`, args);
    }
  }

  clear() {
    this.context.clearRect(0, 0, this.element.width, this.element.height);
  }

  clearField(field: Point) {
    const leftOffset = this.board.getX(field.x);
    const topOffset = this.board.getY(field.y);

    this.context.clearRect(
      leftOffset - this.board.fieldSize / 2,
      topOffset - this.board.fieldSize / 2,
      this.board.fieldSize,
      this.board.fieldSize,
    );
  }
}
