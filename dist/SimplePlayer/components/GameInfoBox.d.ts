import SimplePlayer from '../SimplePlayer';
import Component from './Component';
export default class GameInfoBox extends Component {
    player: SimplePlayer;
    element: HTMLElement;
    infoTable: HTMLElement;
    constructor();
    create(player: SimplePlayer): HTMLElement;
    destroy(): void;
    addInfo(propIdent: string, value: string): void;
    removeInfo(propIdent: string): void;
    printInfo(): void;
}
