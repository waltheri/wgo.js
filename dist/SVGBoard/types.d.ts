import { BoardBaseConfig, BoardBaseTheme } from '../BoardBase/types';
import { BoardObject } from '../BoardBase';
export declare const SVG_NS = "http://www.w3.org/2000/svg";
export declare const SVG_OBJECTS = "objects";
export declare const SVG_GRID_MASK = "gridMask";
export declare const SVG_SHADOWS = "shadows";
export interface BoardObjectSVGElements {
    [key: string]: SVGElement;
}
export interface SVGDrawHandler {
    /** Should return SVG element representing the board object, can be <g> for multiple elements. */
    createElement(config: SVGBoardConfig, addDef: (def: SVGElement) => void): SVGElement | BoardObjectSVGElements;
    /** This will be called any time, board object changes. */
    updateElement(elem: BoardObjectSVGElements, boardObject: BoardObject, config: SVGBoardConfig): void;
}
export interface SVGBoardTheme extends BoardBaseTheme {
    markupGridMask: number;
    coordinates: BoardBaseTheme['coordinates'] & {
        fontSize: number;
        top: boolean;
        right: boolean;
        bottom: boolean;
        left: boolean;
    };
    drawHandlers: {
        [key: string]: SVGDrawHandler;
    };
}
export interface SVGBoardConfig extends BoardBaseConfig {
    theme: SVGBoardTheme;
}
export interface SVGCustomObject extends BoardObject {
    handler: SVGDrawHandler;
}
export declare type SVGBoardObject = BoardObject | SVGCustomObject;
