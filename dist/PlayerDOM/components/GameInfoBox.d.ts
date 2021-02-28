import PlayerDOM from '../PlayerDOM';
import PlayerDOMComponent from './PlayerDOMComponent';
export default class GameInfoBox implements PlayerDOMComponent {
    element: HTMLElement;
    infoTable: HTMLElement;
    player: PlayerDOM;
    constructor();
    create(player: PlayerDOM): HTMLElement;
    didMount(): void;
    destroy(): void;
    addInfo(propIdent: string, value: string): void;
    removeInfo(propIdent: string): void;
    printInfo(): void;
}
