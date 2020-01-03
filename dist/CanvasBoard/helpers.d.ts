import CanvasBoard from './CanvasBoard';
/**
 * Utilities methods for Canvas board
 */
export declare function themeVariable(key: string, board: CanvasBoard): any;
export declare function getMarkupColor(board: CanvasBoard, x: number, y: number): any;
export declare function isHereStone(b: CanvasBoard, x: number, y: number): boolean;
export declare function defaultFieldClear(canvasCtx: CanvasRenderingContext2D, _args: any, board: CanvasBoard): void;
export declare let gridClearField: {
    draw(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard): void;
    clear(canvasCtx: CanvasRenderingContext2D, args: any, board: CanvasBoard): void;
};
