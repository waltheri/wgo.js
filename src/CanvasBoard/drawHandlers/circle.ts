import ShapeMarkup from './ShapeMarkup';

export default class Circle extends ShapeMarkup {
  drawShape(canvasCtx: CanvasRenderingContext2D) {
    canvasCtx.arc(0, 0, 0.25, 0, 2 * Math.PI, true);
  }
}
