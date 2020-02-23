import ShapeMarkup from './ShapeMarkup';

export default class Triangle extends ShapeMarkup {
  drawShape(canvasCtx: CanvasRenderingContext2D) {
    canvasCtx.moveTo(0, -0.25);
    canvasCtx.lineTo(-0.25, 0.166666);
    canvasCtx.lineTo(0.25, 0.166666);
    canvasCtx.closePath();
  }
}
