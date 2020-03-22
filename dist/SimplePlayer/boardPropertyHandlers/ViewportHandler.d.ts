import SimplePlayer from '../SimplePlayer';
import { PropertyHandler } from '../../PlayerBase';
import { Vector } from '../../types';
import { BoardViewport } from '../../BoardBase';
export default class ViewportHandler extends PropertyHandler<Vector, BoardViewport> {
    applyGameChanges(value: Vector, player: SimplePlayer): any;
    clearGameChanges(value: Vector, player: SimplePlayer, propertyData: BoardViewport): BoardViewport;
}
