import DrawHandler from './DrawHandler';

/**
 * TODO: rename this
 */
export default class Dot extends DrawHandler<{ color: string }> {
  stone(canvasCtx: CanvasRenderingContext2D) {
    canvasCtx.fillStyle = this.params.color;
    canvasCtx.shadowBlur = 10;
    canvasCtx.shadowColor = canvasCtx.fillStyle;

    canvasCtx.beginPath();
    canvasCtx.arc(0, 0, 0.15, 0, 2 * Math.PI, true);
    canvasCtx.fill();
  }
}
