import SimplePlayer from '../SimplePlayer';
import Component from './Component';
interface MenuItem {
    /** Title of the menu item. */
    name: string;
    /** Function executed upon click. If checkable, should return new check state. */
    fn(this: ControlPanel): boolean | void;
    /** If true, there can be check state of the menu item. */
    checkable?: boolean;
    /** If checkable, function which return initial check state. */
    defaultChecked?(this: ControlPanel): boolean;
}
export default class ControlPanel extends Component {
    player: SimplePlayer;
    static menuItems: MenuItem[];
    element: HTMLElement;
    moveNumber: HTMLInputElement;
    first: HTMLButtonElement;
    previous: HTMLButtonElement;
    next: HTMLButtonElement;
    last: HTMLButtonElement;
    constructor();
    create(player: SimplePlayer): HTMLElement;
    destroy(): void;
    update(): void;
    createMenuItems(menu: HTMLElement): void;
}
export {};
