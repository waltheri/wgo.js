import { defaultBoardBaseTheme } from '../BoardBase/defaultConfig';
import { BoardBaseTheme } from '../BoardBase/types';
import { SVGDrawHandler } from '../SVGBoard/types';
import { Circle, Label } from '../SVGBoard/svgDrawHandlers';

export interface SimplePlayerConfig {
  boardTheme: BoardBaseTheme;
  highlightCurrentMove: boolean;
  currentMoveBlackMark: SVGDrawHandler;
  currentMoveWhiteMark: SVGDrawHandler;
  enableMouseWheel: boolean;
  enableKeys: boolean;
  showVariations: boolean;
  showCurrentVariations: boolean;
  variationDrawHandler: SVGDrawHandler;
}

const defaultSimplePlayerConfig: SimplePlayerConfig = {
  boardTheme: defaultBoardBaseTheme,
  highlightCurrentMove: true,
  currentMoveBlackMark: new Circle({ color: 'rgba(255,255,255,0.8)', fillColor:'rgba(0,0,0,0)' }),
  currentMoveWhiteMark: new Circle({ color: 'rgba(0,0,0,0.8)', fillColor:'rgba(0,0,0,0)' }),
  enableMouseWheel: true,
  enableKeys: true,
  showVariations: true,
  showCurrentVariations: false,
  variationDrawHandler: new Label({ color: '#33f' }),
};

export default defaultSimplePlayerConfig;
