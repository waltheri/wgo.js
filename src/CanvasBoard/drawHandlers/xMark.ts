import ShapeMarkup from './ShapeMarkup';

export default class XMark extends ShapeMarkup {
  drawShape(canvasCtx: CanvasRenderingContext2D) {
    canvasCtx.moveTo(-0.20, -0.20);
    canvasCtx.lineTo(0.20, 0.20);
    canvasCtx.moveTo(0.20, -0.20);
    canvasCtx.lineTo(-0.20, 0.20);
  }
}
