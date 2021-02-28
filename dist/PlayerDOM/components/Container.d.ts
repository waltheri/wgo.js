import PlayerDOM from '../PlayerDOM';
import PlayerDOMComponent from './PlayerDOMComponent';
export default class Container implements PlayerDOMComponent {
    player: PlayerDOM;
    element: HTMLElement;
    children: PlayerDOMComponent[];
    direction: string;
    constructor(direction: string, children?: PlayerDOMComponent[]);
    create(player: PlayerDOM): HTMLElement;
    didMount(): void;
    destroy(): void;
}
