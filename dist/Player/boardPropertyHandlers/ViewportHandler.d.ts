import PlainPlayer from '../PlainPlayer';
import PropertyHandler from '../PropertyHandler';
import { Vector } from '../../types';
import { BoardViewport } from '../../BoardBase';
export default class ViewportHandler extends PropertyHandler<Vector, BoardViewport> {
    applyGameChanges(value: Vector, player: PlainPlayer): BoardViewport;
    clearGameChanges(value: Vector, player: PlainPlayer, propertyData: BoardViewport): BoardViewport;
}
