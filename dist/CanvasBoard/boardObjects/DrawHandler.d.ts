import { CanvasBoardConfig } from '../types';
import BoardObject from './BoardObject';
export default abstract class DrawHandler<P extends object = {}> {
    params: P;
    constructor(params?: P);
    stone?(context: CanvasRenderingContext2D, config: CanvasBoardConfig, boardObject: BoardObject): void;
    shadow?(context: CanvasRenderingContext2D, config: CanvasBoardConfig, boardObject: BoardObject): void;
    grid?(context: CanvasRenderingContext2D, config: CanvasBoardConfig, boardObject: BoardObject): void;
}
