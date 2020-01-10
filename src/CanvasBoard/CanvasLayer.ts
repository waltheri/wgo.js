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

  constructor() {
    this.element = document.createElement('canvas');
    this.context = this.element.getContext('2d');

    // Adjust pixel ratio for HDPI screens (e.g. Retina)
    this.pixelRatio = window.devicePixelRatio || 1;
    this.context.scale(this.pixelRatio, this.pixelRatio);
    this.context.save();
  }

  setDimensions(width: number, height: number, board: CanvasBoard) {
    const linesShift = board.config.theme.linesShift;

    this.element.width = width;
    this.element.style.width = `${width / this.pixelRatio}px`;
    this.element.height = height;
    this.element.style.height = `${height / this.pixelRatio}px`;

    this.context.transform(1, 0, 0, 1, linesShift, linesShift);
  }

  appendTo(element: HTMLElement, weight: number) {
    this.element.style.position = 'absolute';
    this.element.style.zIndex = weight.toString(10);
    this.element.style.top = '0';
    this.element.style.bottom = '0';
    this.element.style.left = '0';
    this.element.style.right = '0';
    this.element.style.margin = 'auto';
    element.appendChild(this.element);
  }

  removeFrom(element: HTMLElement) {
    element.removeChild(this.element);
  }

  getContext() {
    return this.context;
  }

  draw<P extends BoardFreeObject>(drawingFn: DrawFunction<P>, args: P, board: CanvasBoard) {
    try {
      this.context.save();
      drawingFn(this.context, args, board);
      this.context.restore();
    } catch (err) {
      // If the board is too small some canvas painting function can throw an exception, but we don't
      // want to break our app
      // tslint:disable-next-line:no-console
      console.error(`Object couldn't be rendered. Error: ${err.message}`, args);
    }
  }

  drawField<P extends BoardFieldObject>(drawingFn: DrawFunction<P>, args: P, board: CanvasBoard) {
    try {
      const leftOffset = Math.round(board.getX(args.field.x));
      const topOffset = Math.round(board.getY(args.field.y));

      // create a "sandbox" for drawing function
      this.context.save();

      this.context.transform(board.fieldSize - 1, 0, 0, board.fieldSize - 1, leftOffset, topOffset);
      this.context.beginPath();
      this.context.rect(-0.5, -0.5, 1, 1);
      this.context.clip();
      drawingFn(this.context, args, board);

      // restore context
      this.context.restore();
    } catch (err) {
      // If the board is too small some canvas painting function can throw an exception, but we don't
      // want to break our app
      // tslint:disable-next-line:no-console
      console.error(`Object couldn't be rendered. Error: ${err.message}`, args);
    }
  }

  clear(_board: CanvasBoard) {
    this.context.clearRect(0, 0, this.element.width, this.element.height);
  }

  clearField(field: Point, board: CanvasBoard) {
    const leftOffset = Math.round(board.getX(field.x));
    const topOffset = Math.round(board.getY(field.y));

    this.context.clearRect(
      leftOffset - board.fieldSize / 2,
      topOffset - board.fieldSize / 2,
      board.fieldSize,
      board.fieldSize,
    );
  }
}
