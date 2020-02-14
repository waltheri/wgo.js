import DrawHandler from './DrawHandler';

export default class Dim extends DrawHandler<{ color: string }> {
  stone(canvasCtx: CanvasRenderingContext2D) {
    canvasCtx.fillStyle = this.params.color;
    canvasCtx.fillRect(-0.5, -0.5, 1, 1);
  }
}
