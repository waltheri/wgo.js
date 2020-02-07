import { CanvasBoardConfig } from '../types';
export default abstract class BoardObject<P = {}> {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotate: number;
    opacity: number;
    drawStone?(context: CanvasRenderingContext2D, config: CanvasBoardConfig): void;
    drawShadow?(context: CanvasRenderingContext2D, config: CanvasBoardConfig): void;
    drawGrid?(context: CanvasRenderingContext2D, config: CanvasBoardConfig): void;
    params: P;
    constructor(params?: P);
    setPosition(x: number, y: number): void;
    setScale(factor: number): void;
    setOpacity(value: number): void;
}
