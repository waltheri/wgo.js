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
    element: Node;
    player: PlayerDOM;
    visible: boolean;
    constructor(params: ResponsiveComponentParams, component: PlayerDOMComponent);
    create(player: PlayerDOM): void;
    resize(): void;
    destroy(): void;
    private shouldRenderComponent;
    private createPlaceholder;
}
export {};
