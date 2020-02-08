import { CanvasBoardConfig } from '../types';
import DrawHandler from './DrawHandler';
import { Color } from '../../types';
import { BoardMarkupObject } from '../boardObjects';

interface MarkupDrawHandlerParams {
  color?: string;
  lineWidth?: number;
  fillColor?: string;
}

export default abstract class MarkupDrawHandler<P = {}> extends DrawHandler<MarkupDrawHandlerParams & P> {
  grid(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig, boardObject: BoardMarkupObject) {
    if (boardObject.variation === Color.E) {
      canvasCtx.clearRect(
        -boardConfig.theme.stoneSize,
        -boardConfig.theme.stoneSize,
        boardConfig.theme.stoneSize * 2,
        boardConfig.theme.stoneSize * 2,
      );
    }
  }

  getColor(boardConfig: CanvasBoardConfig, boardObject: BoardMarkupObject) {
    if (this.params.color) {
      return this.params.color;
    }

    if (boardObject.variation === Color.B) {
      return boardConfig.theme.markupBlackColor;
    }

    if (boardObject.variation === Color.W) {
      return boardConfig.theme.markupWhiteColor;
    }

    return boardConfig.theme.markupNoneColor;
  }
}
