import { BoardObject } from '../../BoardBase';
import SimplePlayer from '../SimplePlayer';
import { PropertyHandler } from '../../PlayerBase';
import { Label } from '../../types';
export default class MarkupLabelHandler extends PropertyHandler<Label[], BoardObject<any>[]> {
    applyNodeChanges(values: Label[], player: SimplePlayer): BoardObject<any>[];
    clearNodeChanges(values: Label[], player: SimplePlayer, propertyData: BoardObject<any>[]): BoardObject<any>[];
}
