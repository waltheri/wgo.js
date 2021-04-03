import { PartialRecursive } from '../utils/makeConfig';
import PlayerDOM, { PlayerDOMConfig } from '../PlayerDOM/PlayerDOM';
import { SVGBoardComponentConfig } from '../PlayerDOM/components/SVGBoardComponent';
import { CommentBoxConfig } from '../PlayerDOM/components/CommentsBox';
import { GameInfoBoxConfig } from '../PlayerDOM/components/GameInfoBox';
interface SimplePlayerConfig extends PlayerDOMConfig {
    board: SVGBoardComponentConfig;
    comments: CommentBoxConfig & {
        enabled: boolean;
    };
    gameInfo: GameInfoBoxConfig & {
        enabled: boolean;
    };
    sgfFile: string | null;
    sgf: string | null;
}
export default class SimplePlayer extends PlayerDOM {
    element: HTMLElement;
    config: SimplePlayerConfig;
    constructor(elem: HTMLElement, config?: PartialRecursive<SimplePlayerConfig>);
    init(): void;
}
export {};
