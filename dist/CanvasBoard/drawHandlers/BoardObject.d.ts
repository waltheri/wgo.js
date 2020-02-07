import { CanvasBoardConfig } from '../types';
export default class BoardObject {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotate: number;
    opacity: number;
    stone?(context: CanvasRenderingContext2D, config: CanvasBoardConfig): void;
    shadow?(context: CanvasRenderingContext2D, config: CanvasBoardConfig): void;
    grid?(context: CanvasRenderingContext2D, config: CanvasBoardConfig): void;
    constructor();
    setPosition(x: number, y: number): void;
    setScale(factor: number): void;
    setOpacity(value: number): void;
}
