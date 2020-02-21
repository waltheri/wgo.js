import { CanvasBoardConfig } from '../types';
import { BoardMarkupObject } from '../../BoardBase';
import MarkupDrawHandler from './MarkupDrawHandler';

export default abstract class ShapeMarkup extends MarkupDrawHandler {
  stone(
    canvasCtx: CanvasRenderingContext2D,
    boardConfig: CanvasBoardConfig,
    boardObject: BoardMarkupObject<MarkupDrawHandler>,
  ) {
    canvasCtx.strokeStyle = this.getColor(boardConfig, boardObject);
    canvasCtx.lineWidth = this.params.lineWidth || boardConfig.theme.markupLineWidth;
    canvasCtx.shadowBlur = 10;
    canvasCtx.shadowColor = canvasCtx.strokeStyle;

    canvasCtx.beginPath();
    this.drawShape(canvasCtx);
    canvasCtx.stroke();

    if (this.params.fillColor) {
      canvasCtx.fillStyle = this.params.fillColor;
      canvasCtx.fill();
    }
  }

  abstract drawShape(canvasCtx: CanvasRenderingContext2D): void;
}
