import { Point, Color } from '../types';
import CanvasBoard from './CanvasBoard';
export interface BoardViewport {
    top: number;
    right: number;
    bottom: number;
    left: number;
}
export interface CanvasBoardTheme {
    gridLinesWidth: number;
    gridLinesColor: string;
    starColor: string;
    starSize: number;
    stoneSize: number;
    markupBlackColor: string;
    markupWhiteColor: string;
    markupNoneColor: string;
    markupLinesWidth: number;
    shadowColor: string;
    shadowTransparentColor: string;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    coordinatesHandler: DrawHandler;
    coordinatesColor: string;
    coordinatesX: string | (string | number)[];
    coordinatesY: string | (string | number)[];
    font: string;
    linesShift: number;
    imageFolder: string;
    backgroundColor: string;
    backgroundImage: string;
    drawHandlers: {
        [key: string]: DrawHandler<BoardFieldObject>;
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
}
export interface DrawFunction<P> {
    (context: CanvasRenderingContext2D, args: P, board: CanvasBoard): void;
}
export interface DrawHandler<P = any> {
    [layer: string]: {
        draw: DrawFunction<P>;
        clear?: DrawFunction<P>;
    };
}
export interface BoardFieldObject {
    x: number;
    y: number;
    c?: Color;
    [key: string]: any;
}
export interface BoardCustomObject {
    handler: DrawHandler<BoardCustomObject>;
    [key: string]: any;
}
