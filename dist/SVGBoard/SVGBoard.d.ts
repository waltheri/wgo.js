import { BoardBase, BoardViewport } from '../BoardBase';
import { PartialRecursive } from '../utils/makeConfig';
import { SVGDrawHandler, SVGBoardConfig, BoardObjectSVGElements, SVGBoardObject } from './types';
import { Point } from '../types';
export default class SVGBoard extends BoardBase {
    config: SVGBoardConfig;
    boardElement: HTMLElement;
    touchArea: HTMLElement;
    svgElement: SVGElement;
    defsElement: SVGElement;
    objects: SVGBoardObject[];
    objectsElementMap: Map<SVGBoardObject, BoardObjectSVGElements>;
    top: number;
    left: number;
    bottom: number;
    right: number;
    /** Drawing contexts - elements to put additional board objects. Similar to layers. */
    contexts: {
        [key: string]: SVGElement;
    };
    constructor(elem: HTMLElement, config?: PartialRecursive<SVGBoardConfig>);
    resize(): void;
    redraw(): void;
    drawGrid(): void;
    drawCoordinates(): void;
    drawObjects(): void;
    addObject(boardObject: SVGBoardObject | SVGBoardObject[]): void;
    protected createObjectElements(boardObject: SVGBoardObject): void;
    getObjectHandler(boardObject: SVGBoardObject): SVGDrawHandler;
    removeObject(boardObject: SVGBoardObject | SVGBoardObject[]): void;
    updateObject(boardObject: SVGBoardObject | SVGBoardObject[]): void;
    setViewport(viewport?: BoardViewport): void;
    setSize(size?: number): void;
    setCoordinates(coordinates: boolean): void;
    on(type: string, callback: (event: UIEvent, point: Point) => void): void;
    registerBoardListener(type: string): void;
    getRelativeCoordinates(absoluteX: number, absoluteY: number): {
        x: number;
        y: number;
    };
}
