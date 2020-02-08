import ShapeMarkup from './ShapeMarkup';

export default class Square extends ShapeMarkup {
  drawShape(canvasCtx: CanvasRenderingContext2D) {
    canvasCtx.rect(-0.25, -0.25, 0.5, 0.5);
  }
}
