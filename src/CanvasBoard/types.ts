import { BoardObject } from '../boardBase';
import DrawHandler from './drawHandlers/DrawHandler';
import { BoardBaseConfig, BoardBaseTheme } from '../BoardBase/types';

export interface CanvasBoardTheme extends BoardBaseTheme {
  snapToGrid: boolean;
  linesShift: number;
  drawHandlers: {
    [key: string]: DrawHandler;
  };
}

export interface CanvasBoardConfig extends BoardBaseConfig {
  theme: CanvasBoardTheme;
}

export interface DrawFunction {
  // tslint:disable-next-line:max-line-length
  (context: CanvasRenderingContext2D, boardConfig: CanvasBoardConfig, boardObject: BoardObject<DrawHandler>): void | Promise<void>;
}
