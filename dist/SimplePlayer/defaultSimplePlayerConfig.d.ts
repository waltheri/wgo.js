import { BoardBaseTheme } from '../BoardBase/types';
import { SVGDrawHandler } from '../SVGBoard/types';
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
    formatNicks: boolean;
    formatMoves: boolean;
}
declare const defaultSimplePlayerConfig: SimplePlayerConfig;
export default defaultSimplePlayerConfig;
