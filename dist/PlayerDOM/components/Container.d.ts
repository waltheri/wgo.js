import PlayerDOM from '../PlayerDOM';
import PlayerDOMComponent from './PlayerDOMComponent';
export default class Container implements PlayerDOMComponent {
    element: HTMLElement;
    children: PlayerDOMComponent[];
    direction: string;
    constructor(direction: string, children?: PlayerDOMComponent[]);
    create(player: PlayerDOM): void;
    destroy(): void;
}
