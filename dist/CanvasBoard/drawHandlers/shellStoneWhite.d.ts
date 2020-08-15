import { CanvasBoardConfig } from '../types';
import Stone from './Stone';
import { FieldObject } from '../../BoardBase';
export default class ShellStoneWhite extends Stone {
    stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig, boardObject: FieldObject): void;
    drawShell(arg: any): void;
    drawShellLine(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, startAngle: number, endAngle: number, factor: number, thickness: number): void;
}
