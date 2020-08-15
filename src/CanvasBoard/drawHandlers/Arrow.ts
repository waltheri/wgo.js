import DrawHandler from './DrawHandler';
import { CanvasBoardConfig } from '../types';
import { BoardLineObject } from '../../BoardBase';

interface ArrowParams {
  color?: string;
  lineWidth?: number;
}

export default class Arrow extends DrawHandler<ArrowParams> {
  stone(
    canvasCtx: CanvasRenderingContext2D,
    boardConfig: CanvasBoardConfig,
    boardObject: BoardLineObject,
  ) {
    canvasCtx.strokeStyle = this.params.color ? this.params.color : boardConfig.theme.markupNoneColor;
    canvasCtx.fillStyle = canvasCtx.strokeStyle;
    canvasCtx.lineWidth = this.params.lineWidth || boardConfig.theme.markupLineWidth;
    canvasCtx.shadowBlur = 10;
    canvasCtx.shadowColor = canvasCtx.strokeStyle;

    const x1 = boardObject.start.x;
    const y1 = boardObject.start.y;
    const x2 = boardObject.end.x;
    const y2 = boardObject.end.y;

    // length of the main line
    const length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

    // line parametric functions
    const getLineX = (t: number) => x1 + t * (x2 - x1);
    const getLineY = (t: number) => y1 + t * (y2 - y1);

    // triangle base line position on the main line
    const triangleLen = 1 / length / 2.5;
    const tx = getLineX(1 - triangleLen);
    const ty = getLineY(1 - triangleLen);

    // triangle base line parametric functions
    const getBaseLineX = (t: number) => tx + t * (y2 - y1);
    const getBaseLineY = (t: number) => ty + t * (x1 - x2);

    // initial circle length
    const circleLen = 0.1;

    // draw initial circle
    canvasCtx.beginPath();
    canvasCtx.arc(x1, y1, circleLen, 0, 2 * Math.PI, true);
    canvasCtx.fill();

    // draw line
    canvasCtx.beginPath();
    canvasCtx.moveTo(getLineX(1 / length * circleLen), getLineY(1 / length * circleLen));
    canvasCtx.lineTo(tx, ty);
    canvasCtx.stroke();

    // draw triangle at the end to make arrow
    canvasCtx.beginPath();
    canvasCtx.moveTo(getBaseLineX(- triangleLen / 1.75), getBaseLineY(- triangleLen / 1.75));
    canvasCtx.lineTo(getBaseLineX(triangleLen / 1.75), getBaseLineY(triangleLen / 1.75));
    canvasCtx.lineTo(x2, y2);
    canvasCtx.closePath();
    canvasCtx.fill();
  }
}
