import CanvasLayer from './CanvasLayer';

/**
 * @class
 * @extends WGo.CanvasBoard.CanvasLayer
 * Layer for shadows. It is slightly translated.
 */

export default class ShadowLayer extends CanvasLayer {
  resize(width: number, height: number) {
    super.resize(width, height);
    this.context.transform(
      1,
      0,
      0,
      1,
      this.board.config.theme.shadowOffsetX * this.board.fieldSize,
      this.board.config.theme.shadowOffsetY * this.board.fieldSize,
    );
  }
}
