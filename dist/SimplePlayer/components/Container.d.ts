import SimplePlayer from '../SimplePlayer';
import Component from './Component';
import { LayoutItem } from '../defaultSimplePlayerConfig';
export interface Condition {
    (container: Container): boolean;
}
/**
 * Special kind of component which handles rendering of player's component by layout config.
 * It should not be used directly. It is created internally by SimplePlayer and itself.
 */
export default class Container extends Component {
    player: SimplePlayer;
    element: HTMLElement;
    items: LayoutItem[];
    children: Component[];
    direction: string;
    constructor(player: SimplePlayer, items: LayoutItem[], direction: string);
    create(): HTMLElement;
    didMount(): void;
    private appendComponent;
    private appendContainer;
    private appendElementToDOM;
    destroy(): void;
}
