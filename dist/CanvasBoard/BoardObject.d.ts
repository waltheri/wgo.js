import { DrawHandler } from './drawHandlers';
export default class BoardObject {
    type: string | DrawHandler;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotate: number;
    opacity: number;
    constructor(type: string | DrawHandler);
    setPosition(x: number, y: number): void;
    setScale(factor: number): void;
    setOpacity(value: number): void;
}
