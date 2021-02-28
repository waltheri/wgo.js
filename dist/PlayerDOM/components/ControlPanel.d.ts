import PlayerDOM from '../PlayerDOM';
import PlayerDOMComponent from './PlayerDOMComponent';
export default class ControlPanel implements PlayerDOMComponent {
    element: HTMLElement;
    player: PlayerDOM;
    moveNumber: HTMLInputElement;
    first: HTMLButtonElement;
    previous: HTMLButtonElement;
    next: HTMLButtonElement;
    last: HTMLButtonElement;
    constructor();
    create(player: PlayerDOM): HTMLElement;
    destroy(): void;
    update(): void;
    createMenuItems(menu: HTMLElement): void;
}
