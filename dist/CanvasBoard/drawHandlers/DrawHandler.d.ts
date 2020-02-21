import { CanvasBoardConfig } from '../types';
import { BoardObject } from '../../boardBase';
export default abstract class DrawHandler<P extends object = {}> {
    params: P;
    constructor(params?: P);
    stone?(context: CanvasRenderingContext2D, config: CanvasBoardConfig, boardObject: BoardObject<DrawHandler>): void;
    shadow?(context: CanvasRenderingContext2D, config: CanvasBoardConfig, boardObject: BoardObject<DrawHandler>): void;
    grid?(context: CanvasRenderingContext2D, config: CanvasBoardConfig, boardObject: BoardObject<DrawHandler>): void;
}
