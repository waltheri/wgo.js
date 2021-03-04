import { PartialRecursive } from '../../utils/makeConfig';
import PlayerDOM from '../PlayerDOM';
import PlayerDOMComponent from './PlayerDOMComponent';
interface GameInfoBoxConfig {
    gameInfoProperties: {
        [key: string]: string;
    };
    stretch: boolean;
}
export default class GameInfoBox implements PlayerDOMComponent {
    element: HTMLElement;
    infoTable: HTMLElement;
    player: PlayerDOM;
    config: GameInfoBoxConfig;
    constructor(config?: PartialRecursive<GameInfoBoxConfig>);
    create(player: PlayerDOM): HTMLElement;
    didMount(): void;
    destroy(): void;
    addInfo(propIdent: string, value: string): void;
    removeInfo(propIdent: string): void;
    printInfo(): void;
}
export {};
