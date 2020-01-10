import { Point, Color } from '../types';
import CanvasBoard from './CanvasBoard';

export interface BoardViewport {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface CanvasBoardTheme {
  stoneSize: number;

  // grid & star points
  grid: {
    handler: DrawHandler;
    params: {
      linesWidth: number;
      linesColor: string;
      starColor: string;
      starSize: number;
    }
  };

  // markup
  markupBlackColor: string;
  markupWhiteColor: string;
  markupNoneColor: string;
  markupLinesWidth: number;

  // shadow
  shadowColor: string;
  shadowTransparentColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;

  // coordinates
  coordinates: {
    handler: DrawHandler;
    params: {
      color: string;
      x: string | (string | number)[];
      y: string | (string | number)[];
    }
  };

  // other
  font: string;
  linesShift: number;

  // background
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

export interface DrawHandlerBase {
}

export interface FieldDrawHandler extends DrawHandlerBase {
  drawField: {
    [layer: string]: DrawFunction<BoardFieldObject>;
  };
}

export interface FreeDrawHandler extends DrawHandlerBase {
  drawFree: {
    [layer: string]: DrawFunction<BoardFreeObject>;
  };
}

export type DrawHandler = FieldDrawHandler | FreeDrawHandler;

export interface BoardObjectBase {
  type?: string;
  params?: {
    [key: string]: any;
  };
}

export type BoardFieldObject = ({ type?: string, handler?: DrawHandler }) & BoardObjectBase & {
  field: Point;
};

export type BoardFreeObject = ({ type?: string, handler?: DrawHandler }) & BoardObjectBase;

export type BoardObject = BoardFieldObject | BoardFreeObject;
