import BoardObject from './BoardObject';

export default class FieldObject<T> extends BoardObject<T> {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotate: number;
  opacity: number;

  constructor(type: string | T) {
    super(type);

    this.x = 0;
    this.y = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotate = 0;
    this.opacity = 1;
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
