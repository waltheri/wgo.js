import { DrawHandler } from '../drawHandlers';

export default class BoardObject {
  type: string | DrawHandler;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotate: number;
  opacity: number;

  constructor(type: string | DrawHandler) {
    this.type = type;
    this.x = 0;
    this.y = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotate = 0;
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setScale(factor: number) {
    this.scaleX = factor;
    this.scaleY = factor;
  }

  setOpacity(value: number) {
    this.opacity = value;
  }
}
