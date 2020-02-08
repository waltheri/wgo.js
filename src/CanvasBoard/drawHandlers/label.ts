import { CanvasBoardConfig } from '../types';
import { Color } from '../../types';
import BoardLabelObject from '../boardObjects/BoardLabelObject';
import MarkupDrawHandler from './MarkupDrawHandler';

interface LabelParams {
  font?: string;
}

export default class Label extends MarkupDrawHandler<LabelParams> {
  stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig, boardObject: BoardLabelObject) {
    const font = this.params.font || boardConfig.theme.font || '';

    canvasCtx.fillStyle = this.getColor(boardConfig, boardObject);

    let fontSize = 0.5;

    if (boardObject.text.length === 1) {
      fontSize = 0.75;
    } else if (boardObject.text.length === 2) {
      fontSize = 0.6;
    }

    canvasCtx.beginPath();
    canvasCtx.textBaseline = 'middle';
    canvasCtx.textAlign = 'center';
    canvasCtx.font = `${fontSize}px ${font}`;
    canvasCtx.fillText(boardObject.text, 0, 0.02 + (fontSize - 0.5) * 0.08, 1);
  }
}
