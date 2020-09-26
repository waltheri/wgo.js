import { LayoutItem } from '../defaultSimplePlayerConfig';
import SimplePlayer from '../SimplePlayer';
import Container from './Container';
/**
 * Encapsulate main/root HTML element of the player. It is special kind of Container which
 * register root mouse and key events for player control. This component is directly used
 * by SimplePlayer and shouldn't be used manually.
 */
export default class PlayerWrapper extends Container {
    constructor(player: SimplePlayer, items?: LayoutItem[]);
    create(): HTMLElement;
    destroy(): void;
    private handleMouseWheel;
    private handleKeydown;
    private handleResize;
}
