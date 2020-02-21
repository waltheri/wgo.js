import { BoardObject } from '../../BoardBase';
import PlainPlayer from '../PlainPlayer';
import PropertyHandler from '../PropertyHandler';
import { Label } from '../../types';
export default class MarkupLabelHandler extends PropertyHandler<Label[], BoardObject<any>[]> {
    applyNodeChanges(values: Label[], player: PlainPlayer): BoardObject<any>[];
    clearNodeChanges(values: Label[], player: PlainPlayer, propertyData: BoardObject<any>[]): BoardObject<any>[];
}
