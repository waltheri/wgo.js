import BoardObject from './BoardObject';
export default class FieldObject<T> extends BoardObject<T> {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotate: number;
    opacity: number;
    constructor(type: string | T);
    setPosition(x: number, y: number): void;
    setScale(factor: number): void;
    setOpacity(value: number): void;
}
