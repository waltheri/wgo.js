import SimplePlayer from '../SimplePlayer';
import Component from './Component';
export default class GameInfoBox extends Component {
    element: HTMLElement;
    infoTable: HTMLElement;
    constructor(player: SimplePlayer);
    create(): HTMLElement;
    destroy(): void;
    addInfo(propIdent: string, value: string): void;
    removeInfo(propIdent: string): void;
    printInfo(): void;
}
