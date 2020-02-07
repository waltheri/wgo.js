import BoardObject from './BoardObject';
import { CanvasBoardConfig } from '../types';
export default class ThemedObject extends BoardObject<any> {
    type: string;
    constructor(type: string, params: any);
    drawStone(context: CanvasRenderingContext2D, config: CanvasBoardConfig): void;
    drawGrid(context: CanvasRenderingContext2D, config: CanvasBoardConfig): void;
    drawShadow(context: CanvasRenderingContext2D, config: CanvasBoardConfig): void;
}
