import { BoardObject } from '../../CanvasBoard';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from '../PropertyHandler';
import { Label } from '../../types';
export default class MarkupLabelHandler extends PropertyHandler<Label[], BoardObject[]> {
    applyNodeChanges(values: Label[], player: PlainPlayer): BoardObject[];
    clearNodeChanges(values: Label[], player: PlainPlayer, propertyData: BoardObject[]): BoardObject[];
}
