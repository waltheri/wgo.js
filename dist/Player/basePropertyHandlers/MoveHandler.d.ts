import PropertyHandler from '../PropertyHandler';
import { Point, Color } from '../../types';
import { PlayerBase } from '..';
export default class MoveHandler<D> extends PropertyHandler<Point, D> {
    color: Color;
    constructor(color: Color);
    applyGameChanges(value: Point, player: PlayerBase, propertyData: D): D;
}
