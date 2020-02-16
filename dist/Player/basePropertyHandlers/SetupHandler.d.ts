import PlayerBase from '../PlayerBase';
import PropertyHandler from '../PropertyHandler';
import { Point, Color } from '../../types';
export default class SetupHandler extends PropertyHandler<Point[]> {
    color: Color;
    constructor(color: Color);
    applyGameChanges(values: Point[], player: PlayerBase): void;
}
