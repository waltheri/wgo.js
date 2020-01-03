import CanvasLayer from './CanvasLayer';
import gridHandler from './drawHandlers/grid';
import CanvasBoard from './CanvasBoard';

/**
 * @class
 * @extends WGo.CanvasBoard.CanvasLayer
 * Layer which renders board grid.
 */

export default class GridLayer extends CanvasLayer {
  initialDraw(board: CanvasBoard) {
    gridHandler.grid.draw(this.context, {}, board);
  }
}
