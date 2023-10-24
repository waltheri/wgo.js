import { EventEmitter } from '../utils/EventEmitter';
import BoardObject from './BoardObject';
import { Point } from '../types';

/**
 * Represent graphical board renderer.
 */
export interface Board extends EventEmitter {
  resize(): void;
  setWidth(width: number): void;
  setHeight(height: number): void;
  setDimensions(width: number, height: number): void;
  getViewport(): BoardViewport;
  setViewport(viewport: BoardViewport): void;
  getSize(): { x: number; y: number };
  setSize(size: number): void;
  setSize(sizeX: number, sizeY: number): void;
  getCoordinates(): boolean;
  setCoordinates(coordinates: boolean): void;
  redraw(): void;
  addObject(boardObject: BoardObject | BoardObject[]): void;
  updateObject(boardObject: BoardObject | BoardObject[]): void;
  removeObject(boardObject: BoardObject | BoardObject[]): void;
  removeObjectsAt(x: number, y: number): void;
  removeAllObjects(): void;
  hasObject(boardObject: BoardObject): boolean;
}

export interface BoardViewport {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface BoardBaseTheme {
  stoneSize: number;
  marginSize: number;
  font: string;
  backgroundColor: string;
  backgroundImage: string;

  // grid & star points
  grid: {
    linesWidth: number;
    linesColor: string;
    starColor: string;
    starSize: number;
  };

  // markup
  markupBlackColor: string;
  markupWhiteColor: string;
  markupNoneColor: string;
  markupLineWidth: number;

  // shadow
  shadowColor: string;
  shadowTransparentColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;

  // coordinates
  coordinates: {
    color: string;
    bold: boolean;
    labelsX: string | (string | number)[];
    labelsY: string | (string | number)[];
  };

  // star point positions per board size
  starPoints: {
    [size: number | string]: Point[];
  };
}

export interface BoardBaseConfig {
  size: number;
  sizeX?: number;
  sizeY?: number;
  width: number;
  height: number;
  viewport: BoardViewport;
  coordinates: boolean;
  theme: BoardBaseTheme;
}
