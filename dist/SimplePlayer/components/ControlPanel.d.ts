import SimplePlayer from '../SimplePlayer';
import Component from './Component';
export default class ControlPanel extends Component {
    element: HTMLElement;
    moveNumber: HTMLInputElement;
    first: HTMLButtonElement;
    previous: HTMLButtonElement;
    next: HTMLButtonElement;
    last: HTMLButtonElement;
    constructor(player: SimplePlayer);
    create(): HTMLElement;
    destroy(): void;
    update(): void;
}
