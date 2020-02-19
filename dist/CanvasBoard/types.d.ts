import { Point } from '../types';
import { BoardObject } from './boardObjects';
import DrawHandler from './drawHandlers/DrawHandler';
export interface BoardViewport {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
export interface CanvasBoardTheme {
    stoneSize: number;
    grid: {
        linesWidth: number;
        linesColor: string;
        starColor: string;
        starSize: number;
    };
    markupBlackColor: string;
    markupWhiteColor: string;
    markupNoneColor: string;
    markupLineWidth: number;
    shadowColor: string;
    shadowTransparentColor: string;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    coordinates: {
        color: string;
        bold: boolean;
        x: string | (string | number)[];
        y: string | (string | number)[];
    };
    font: string;
    linesShift: number;
    backgroundColor: string;
    backgroundImage: string;
    drawHandlers: {
        [key: string]: DrawHandler;
    };
}
export interface CanvasBoardConfig {
    size: number;
    width: number;
    height: number;
    starPoints: {
        [size: number]: Point[];
    };
    viewport: BoardViewport;
    coordinates: boolean;
    theme: CanvasBoardTheme;
    /** Size of board margin relative to field size */
    marginSize: number;
    /** This will cause sharper edges, but the board won't have exact specified dimensions (temporary solution I hope) */
    snapToGrid: boolean;
}
export interface DrawFunction {
    (context: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig, boardObject: BoardObject): void | Promise<void>;
}