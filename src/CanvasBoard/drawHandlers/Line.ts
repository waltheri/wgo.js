import DrawHandler from './DrawHandler';
import { CanvasBoardConfig } from '../types';
import { BoardLineObject } from '../boardObjects';

interface LineParams {
  color?: string;
  lineWidth?: number;
}

export default class Line extends DrawHandler<LineParams> {
  stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig, boardObject: BoardLineObject) {
    canvasCtx.strokeStyle = this.params.color ? this.params.color : boardConfig.theme.markupNoneColor;
    canvasCtx.lineWidth = this.params.lineWidth || boardConfig.theme.markupLineWidth;
    canvasCtx.shadowBlur = 10;
    canvasCtx.shadowColor = canvasCtx.strokeStyle;

    canvasCtx.beginPath();
    canvasCtx.moveTo(boardObject.start.x, boardObject.start.y);
    canvasCtx.lineTo(boardObject.end.x, boardObject.end.y);
    canvasCtx.stroke();
  }
}
