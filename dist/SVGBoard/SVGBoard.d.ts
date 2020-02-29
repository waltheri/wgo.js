import { BoardBase, BoardViewport, BoardObject } from '../BoardBase';
import { PartialRecursive } from '../utils/makeConfig';
import { SVGDrawHandler, SVGBoardConfig, BoardObjectSVGElements } from './types';
export default class SVGBoard extends BoardBase<SVGDrawHandler> {
    config: SVGBoardConfig;
    svgElement: SVGElement;
    defsElement: SVGElement;
    objectsElementMap: Map<BoardObject<SVGDrawHandler>, BoardObjectSVGElements>;
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
}
