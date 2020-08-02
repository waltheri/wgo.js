import { BoardBaseTheme } from '../BoardBase/types';
import { SVGDrawHandler } from '../SVGBoard/types';
import Component from './components/Component';
export interface SimplePlayerBoardConfig {
}
export interface SimplePlayerComponent<T> {
    component: typeof Component;
    params: T;
}
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
