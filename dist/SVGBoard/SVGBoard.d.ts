import { BoardBase, BoardViewport, BoardObject } from '../BoardBase';
import { PartialRecursive } from '../utils/makeConfig';
import { SVGDrawHandler, SVGBoardConfig } from './types';
export default class SVGBoard extends BoardBase<SVGDrawHandler> {
    config: SVGBoardConfig;
    svgElement: SVGElement;
    defsElement: SVGElement;
    gridElement: SVGElement;
    coordinatesElement: SVGElement;
    objectsElementMap: Map<BoardObject<SVGDrawHandler>, SVGElement>;
    constructor(elem: HTMLElement, config?: PartialRecursive<SVGBoardConfig>);
    resize(): void;
    redraw(): void;
    drawGrid(): void;
    drawCoordinates(): void;
    drawObjects(): void;
    addObject(boardObject: BoardObject<SVGDrawHandler> | BoardObject<SVGDrawHandler>[]): void;
    setViewport(viewport?: BoardViewport): void;
    setSize(size?: number): void;
    setCoordinates(coordinates: boolean): void;
}
