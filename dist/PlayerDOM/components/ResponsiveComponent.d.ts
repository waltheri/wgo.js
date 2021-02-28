import PlayerDOM from '../PlayerDOM';
import PlayerDOMComponent from './PlayerDOMComponent';
interface ResponsiveComponentParams {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    orientation?: 'portrait' | 'landscape';
}
export default class ResponsiveComponent implements PlayerDOMComponent {
    private params;
    private component;
    private player;
    private element;
    private visible;
    constructor(params: ResponsiveComponentParams, component: PlayerDOMComponent);
    create(player: PlayerDOM): Node;
    didMount(): void;
    destroy(): void;
    private shouldRenderComponent;
    private createPlaceholder;
}
export {};
