import { PartialRecursive } from '../../utils/makeConfig';
import PlayerDOM from '../PlayerDOM';
import PlayerDOMComponent from './PlayerDOMComponent';
export interface GameInfoBoxConfig {
    gameInfoProperties: {
        [key: string]: string;
    };
    hideResult: boolean;
}
export declare const gameInfoBoxDefaultConfig: {
    gameInfoProperties: {
        DT: string;
        KM: string;
        HA: string;
        AN: string;
        CP: string;
        GC: string;
        GN: string;
        ON: string;
        OT: string;
        TM: string;
        RE: string;
        RO: string;
        RU: string;
        US: string;
        PC: string;
        EV: string;
        SO: string;
    };
    hideResult: boolean;
};
export default class GameInfoBox implements PlayerDOMComponent {
    element: HTMLElement;
    infoTable: HTMLElement;
    player: PlayerDOM;
    config: GameInfoBoxConfig;
    constructor(config?: PartialRecursive<GameInfoBoxConfig>);
    create(player: PlayerDOM): void;
    destroy(): void;
    addInfo(propIdent: string, value: string, hide: boolean): void;
    removeInfo(propIdent: string): void;
    printInfo(): void;
}
