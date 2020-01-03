import CanvasLayer from './CanvasLayer';
import { themeVariable } from './helpers';
import CanvasBoard from './CanvasBoard';

/**
 * @class
 * @extends WGo.CanvasBoard.CanvasLayer
 * Layer for shadows. It is slightly translated.
 */

export default class ShadowLayer extends CanvasLayer {
  setDimensions(width: number, height: number, board: CanvasBoard) {
    super.setDimensions(width, height, board);
    this.context.transform(1, 0, 0, 1, themeVariable('shadowOffsetX', board), themeVariable('shadowOffsetY', board));
  }
}
