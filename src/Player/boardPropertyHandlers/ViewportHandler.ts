import PlainPlayer from '../PlainPlayer';
import PropertyHandler from '../PropertyHandler';
import { Vector } from '../../types';
import { BoardViewport } from '../../CanvasBoard/types';

export default class ViewportHandler extends PropertyHandler<Vector, BoardViewport> {
  applyGameChanges(value: Vector, player: PlainPlayer) {
    const currentViewport = player.board.getViewport();

    if (value) {
      const minX = Math.min(value[0].x, value[1].x);
      const minY = Math.min(value[0].y, value[1].y);
      const maxX = Math.max(value[0].x, value[1].x);
      const maxY = Math.max(value[0].y, value[1].y);

      player.board.setViewport({
        left: minX,
        top: minY,
        right: player.board.getSize() - maxX - 1,
        bottom: player.board.getSize() - maxY - 1,
      });
    } else {
      player.board.setViewport({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      });
    }

    return currentViewport;
  }

  clearGameChanges(value: Vector, player: PlainPlayer, propertyData: BoardViewport): BoardViewport {
    player.board.setViewport(propertyData);

    return null;
  }
}
