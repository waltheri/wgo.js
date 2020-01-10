import { Point } from '../types';
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
}
export interface DrawFunction<P> {
    (context: CanvasRenderingContext2D, args: P, board: CanvasBoard): void;
}
export interface FieldDrawHandler {
    drawField: {
        [layer: string]: DrawFunction<BoardFieldObject>;
    };
}
export interface FreeDrawHandler {
    drawFree: {
        [layer: string]: DrawFunction<BoardFreeObject>;
    };
}
export declare type DrawHandler = FieldDrawHandler | FreeDrawHandler;
export interface BoardObjectBase {
    params?: {
        [key: string]: any;
    };
}
export declare type BoardFieldObject = ({
    type?: string;
    handler?: FieldDrawHandler;
}) & BoardObjectBase & {
    field: Point;
};
export declare type BoardFreeObject = ({
    type?: string;
    handler?: FreeDrawHandler;
}) & BoardObjectBase;
export declare type BoardObject = BoardFieldObject | BoardFreeObject;
