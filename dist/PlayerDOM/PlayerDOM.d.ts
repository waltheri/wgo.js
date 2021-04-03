import { PlayerBase } from '../PlayerBase';
import { PartialRecursive } from '../utils/makeConfig';
import PlayerDOMComponent from './components/PlayerDOMComponent';
export interface PlayerDOMConfig {
    enableMouseWheel: boolean;
    enableKeys: boolean;
    fastReplay: number;
}
export declare const playerDOMDefaultConfig: {
    enableMouseWheel: boolean;
    enableKeys: boolean;
    fastReplay: number;
};
/**
 * Player with support to render visual elements into the DOM.
 */
export default class PlayerDOM extends PlayerBase {
    config: PlayerDOMConfig;
    components: Map<HTMLElement, PlayerDOMComponent>;
    fastReplayTimeout: number;
    fastReplayEnabled: boolean;
    constructor(config?: PartialRecursive<PlayerDOMConfig>);
    /**
     * Renders PlayerDOM component into specified HTML element. If there is content inside that element
     * it will be removed. Render method can be called multiple times - this allows to have player's component
     * anywhere you want.
     *
     * @param component
     * @param container
     */
    render(component: PlayerDOMComponent, container: HTMLElement): void;
    /**
     * Removes component rendered via `render` method. Call this to clean event listeners of the component.
     *
     * @param container
     */
    clear(container: HTMLElement): void;
    private createWrapper;
    private handleResize;
    private handleMouseWheel;
    private handleKeydown;
    private handleKeyup;
    private hasFocus;
}
