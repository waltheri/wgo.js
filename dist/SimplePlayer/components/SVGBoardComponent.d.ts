import Component from './Component';
import { SVGBoard } from '../../SVGBoard';
import { FieldObject, BoardObject, BoardViewport } from '../../BoardBase';
import { Point } from '../../types';
import SimplePlayer from '../SimplePlayer';
import { SVGBoardObject, SVGDrawHandler, SVGBoardTheme } from '../../SVGBoard/types';
import { PartialRecursive } from '../../utils/makeConfig';
export interface SVGBoardComponentConfig {
    coordinates: boolean;
    currentMoveBlackMark: SVGDrawHandler;
    currentMoveWhiteMark: SVGDrawHandler;
    variationDrawHandler: SVGDrawHandler;
    starPoints?: {
        [size: number]: Point[];
    };
    coordinateLabelsX?: string | (string | number)[];
    coordinateLabelsY?: string | (string | number)[];
    theme?: PartialRecursive<SVGBoardTheme>;
}
export declare const defaultSVGBoardComponentConfig: SVGBoardComponentConfig;
export default class SVGBoardComponent extends Component implements Component {
    board: SVGBoard;
    config: SVGBoardComponentConfig;
    stoneBoardsObjects: FieldObject[];
    temporaryBoardObjects: SVGBoardObject[];
    viewportStack: BoardViewport[];
    boardMouseX: number;
    boardMouseY: number;
    constructor(player: SimplePlayer, config?: PartialRecursive<SVGBoardComponentConfig>);
    create(): HTMLElement;
    destroy(): void;
    protected updateStones(): void;
    protected addVariationMarkup(): void;
    protected clearTemporaryBoardObjects(): void;
    protected handleBoardClick(point: Point): void;
    protected handleBoardMouseMove(point: Point): void;
    protected handleBoardMouseOut(): void;
    private handleVariationCursor;
    private removeVariationCursor;
    private applyNodeChanges;
    private clearNodeChanges;
    private applyMarkupProperty;
    private applyLabelMarkupProperty;
    private applyLineMarkupProperty;
    private applyViewportProperty;
    private clearViewportProperty;
    private applyMoveProperty;
    addTemporaryBoardObject(obj: BoardObject): void;
    removeTemporaryBoardObject(obj: FieldObject): void;
    updateTemporaryBoardObject(obj: FieldObject): void;
    setCoordinates(b: boolean): void;
}
