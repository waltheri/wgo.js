/* global document, window */
import { themeVariable } from './helpers';
import CanvasBoard from './CanvasBoard';
import { DrawFunction } from './types';

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
    // this.context.scale(this.pixelRatio, this.pixelRatio);
    // this.context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    this.context.scale(this.pixelRatio, this.pixelRatio);
    this.context.save();
  }

  setDimensions(width: number, height: number, board: CanvasBoard) {
    const linesShift = themeVariable('linesShift', board);

    this.element.width = width;
    this.element.style.width = `${width / this.pixelRatio}px`;
    this.element.height = height;
    this.element.style.height = `${height / this.pixelRatio}px`;

    this.context.restore();
    this.context.save();
    this.context.transform(1, 0, 0, 1, linesShift, linesShift);
  }

  appendTo(element: HTMLElement, weight: number) {
    this.element.style.position = 'absolute';
    this.element.style.zIndex = weight.toString(10);
    element.appendChild(this.element);
  }

  removeFrom(element: HTMLElement) {
    element.removeChild(this.element);
  }

  getContext() {
    return this.context;
  }

  initialDraw(_board: CanvasBoard) {
    // no op
  }

  draw<P>(drawingFn: DrawFunction<P>, args: P, board: CanvasBoard) {
    this.context.save();
    drawingFn(this.context, args, board);
    this.context.restore();
  }

  drawField<P>(drawingFn: DrawFunction<P>, args: any, board: CanvasBoard) {
    const leftOffset = Math.round(board.left + args.x * board.fieldWidth);
    const topOffset = Math.round(board.top + args.y * board.fieldHeight);

    // create a "sandbox" for drawing function
    this.context.save();

    this.context.transform(board.fieldWidth - 1, 0, 0, board.fieldHeight - 1, leftOffset, topOffset);
    this.context.beginPath();
    this.context.rect(-0.5, -0.5, 1, 1);
    this.context.clip();
    drawingFn(this.context, args, board);

    // restore context
    this.context.restore();
  }

  clear(_board: CanvasBoard) {
    this.context.clearRect(0, 0, this.element.width, this.element.height);
  }
}
