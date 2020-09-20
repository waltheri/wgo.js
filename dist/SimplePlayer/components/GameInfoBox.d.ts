import SimplePlayer from '../SimplePlayer';
import Component from './Component';
export default class GameInfoBox extends Component {
    infoTable: HTMLElement;
    constructor(player: SimplePlayer);
    create(): HTMLElement;
    destroy(): void;
    addInfo(propIdent: string, value: string): void;
    removeInfo(propIdent: string): void;
    printInfo(): void;
}
