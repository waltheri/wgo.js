import BoardObject from './BoardObject';
/**
 * Represents board object specified by type, which can be painted on the specific field of the board.
 * It can be also transformed.
 */
export default class FieldBoardObject extends BoardObject {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotate: number;
    constructor(type: string, x?: number, y?: number);
    setPosition(x: number, y: number): void;
    setScale(factor: number): void;
}
