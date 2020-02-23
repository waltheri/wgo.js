import { BoardBaseConfig, BoardBaseTheme } from '../BoardBase/types';
import { BoardObject } from '../BoardBase';

export const NS = 'http://www.w3.org/2000/svg';

export interface SVGDrawHandler {
  /** Handler can create SVG element, which will be added into <defs> tag. This is called before `createElement`. */
  init(config: SVGBoardConfig): SVGElement;

  /** Should return SVG element representing the board object, can be <g> for multiple elements. */
  createElement(config: SVGBoardConfig): SVGElement;

  /** This will be called any time, board object changes. */
  updateElement(elem: SVGElement, boardObject: BoardObject<SVGDrawHandler>, config: SVGBoardConfig): void;
}

export interface SVGBoardTheme extends BoardBaseTheme {
  coordinates: BoardBaseTheme['coordinates'] & {
    fontSize: number,
  };

  drawHandlers: {
    [key: string]: SVGDrawHandler;
  };
}

export interface SVGBoardConfig extends BoardBaseConfig {
  theme: SVGBoardTheme;
}
