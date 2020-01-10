import CanvasBoard from '..';
import { BoardFieldObject } from '../types';

export default {
  drawField: {
    stone (canvasCtx: CanvasRenderingContext2D, args: BoardFieldObject, board: CanvasBoard) {
      const params = args.params || {};

      const font = params.font || board.config.theme.font || '';

      canvasCtx.fillStyle = params.color || board.config.theme.markupNoneColor;

      let fontSize = 0.5;

      if (params.text.length === 1) {
        fontSize = 0.75;
      } else if (params.text.length === 2) {
        fontSize = 0.6;
      }

      canvasCtx.beginPath();
      canvasCtx.textBaseline = 'middle';
      canvasCtx.textAlign = 'center';
      canvasCtx.font = `${fontSize}px ${font}`;
      canvasCtx.fillText(params.text, 0, 0.02 + (fontSize - 0.5) * 0.08, 2);
    },
  },
};
