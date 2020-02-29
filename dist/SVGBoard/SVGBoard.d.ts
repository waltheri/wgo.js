import { BoardBase, BoardViewport, BoardObject } from '../BoardBase';
import { PartialRecursive } from '../utils/makeConfig';
import { SVGDrawHandler, SVGBoardConfig, BoardObjectSVGElements } from './types';
import { Point } from '../types';
export default class SVGBoard extends BoardBase<SVGDrawHandler> {
    config: SVGBoardConfig;
    boardElement: HTMLElement;
    touchArea: HTMLElement;
    svgElement: SVGElement;
    defsElement: SVGElement;
    objectsElementMap: Map<BoardObject<SVGDrawHandler>, BoardObjectSVGElements>;
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
    addObject(boardObject: BoardObject<SVGDrawHandler> | BoardObject<SVGDrawHandler>[]): void;
    protected createObjectElements(boardObject: BoardObject<SVGDrawHandler>): void;
    getObjectHandler(boardObject: BoardObject<SVGDrawHandler>): SVGDrawHandler;
    removeObject(boardObject: BoardObject<SVGDrawHandler> | BoardObject<SVGDrawHandler>[]): void;
    updateObject(boardObject: BoardObject<SVGDrawHandler> | BoardObject<SVGDrawHandler>[]): void;
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
