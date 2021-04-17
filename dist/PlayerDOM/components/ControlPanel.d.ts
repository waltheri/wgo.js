import { SVGBoardComponent } from '.';
import { PlayerBase } from '../../PlayerBase';
import { EditMode } from '../../PlayerBase/plugins';
import { PartialRecursive } from '../../utils/makeConfig';
import PlayerDOM from '../PlayerDOM';
import PlayerDOMComponent from './PlayerDOMComponent';
interface MenuItem {
    /** Title of the menu item. */
    name: string;
    /** If true, there can be check state of the menu item. */
    checkable?: boolean;
    /** Function executed upon click. If checkable, should return new check state. */
    handleClick(): boolean | void;
    /** If checkable, function which return initial check state. */
    defaultChecked?(): boolean;
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
    createDOM(): void;
    create(player: PlayerDOM): void;
    destroy(): void;
    update(): void;
    createMenuItems(menu: HTMLElement): void;
    /**
     * Some common menu items, probably just temporary.
     */
    static menuItems: {
        /** Renders menu item with SGF download link */
        download: (player: PlayerBase) => {
            name: string;
            handleClick(): void;
        };
        /** Renders menu item to toggle coordinates of SVGBoardComponent */
        displayCoordinates: (boardComponent: SVGBoardComponent) => {
            name: string;
            checkable: boolean;
            handleClick(): boolean;
            defaultChecked: () => boolean;
        };
        /** Renders menu item to toggle edit mode (using EditMode plugin) */
        editMode: (editMode: EditMode) => {
            name: string;
            checkable: boolean;
            handleClick(): boolean;
            defaultChecked: () => boolean;
        };
        gameInfo: (player: PlayerDOM, callback: (modalWrapper: HTMLElement) => void) => {
            name: string;
            handleClick(): void;
        };
    };
}
export {};
