import { CanvasBoardConfig } from '../types';
import Stone from './Stone';
import { BoardObject } from '../boardObjects';
export default class ShellStoneWhite extends Stone {
    stone(canvasCtx: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig, boardObject: BoardObject): void;
    drawShell(arg: any): void;
    drawShellLine(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, startAngle: number, endAngle: number, factor: number, thickness: number): void;
}
