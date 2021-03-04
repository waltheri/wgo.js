import { SVGBoardComponent } from '.';
import { EditMode } from '../../PlayerBase/plugins';
import { PartialRecursive } from '../../utils/makeConfig';
import PlayerDOM from '../PlayerDOM';
import PlayerDOMComponent from './PlayerDOMComponent';
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
interface ControlPanelConfig {
    menuItems: MenuItem[];
}
export default class ControlPanel implements PlayerDOMComponent {
    element: HTMLElement;
    player: PlayerDOM;
    moveNumber: HTMLInputElement;
    first: HTMLButtonElement;
    previous: HTMLButtonElement;
    next: HTMLButtonElement;
    last: HTMLButtonElement;
    config: ControlPanelConfig;
    constructor(config?: PartialRecursive<ControlPanelConfig>);
    create(player: PlayerDOM): HTMLElement;
    destroy(): void;
    update(): void;
    createMenuItems(menu: HTMLElement): void;
    /**
     * Some common menu items, probably just temporary.
     */
    static menuItems: {
        /** Renders menu item with SGF download link */
        download: {
            name: string;
            fn(this: ControlPanel): void;
        };
        /** Renders menu item to toggle coordinates of SVGBoardComponent */
        displayCoordinates: (boardComponent: SVGBoardComponent) => {
            name: string;
            fn(this: ControlPanel): boolean;
            checkable: boolean;
            defaultChecked: boolean;
        };
        /** Renders menu item to toggle edit mode (using EditMode plugin) */
        editMode: (editMode: EditMode) => {
            name: string;
            fn(): boolean;
            checkable: boolean;
            defaultChecked: boolean;
        };
    };
}
export {};
