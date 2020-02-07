import { CanvasBoardConfig } from '../types';

export default abstract class BoardObject<P = {}> {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotate: number;
  opacity: number;
  drawStone?(context: CanvasRenderingContext2D, config: CanvasBoardConfig): void;
  drawShadow?(context: CanvasRenderingContext2D, config: CanvasBoardConfig): void;
  drawGrid?(context: CanvasRenderingContext2D, config: CanvasBoardConfig): void;
  params: P;

  constructor(params: P = {} as any) {
    this.x = 0;
    this.y = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotate = 0;
    this.params = params;
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
