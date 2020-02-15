import PlainPlayer from '../PlainPlayer';
import PropertyHandler from './PropertyHandler';
import { Vector } from '../../types';
import { BoardViewport } from '../../CanvasBoard/types';
export default class ViewportHandler extends PropertyHandler<Vector, BoardViewport> {
    constructor();
    nextNode(value: Vector, player: PlainPlayer, propertyData: BoardViewport): BoardViewport;
    beforePreviousNode(value: Vector, player: PlainPlayer, propertyData: BoardViewport): BoardViewport;
}
