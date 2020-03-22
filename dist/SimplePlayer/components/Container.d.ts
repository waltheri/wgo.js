import Component from './Component';
import SimplePlayer from '../SimplePlayer';
interface ContainerConfig {
    direction: 'row' | 'column';
}
export default class Container extends Component {
    element: HTMLElement;
    children: Component[];
    config: ContainerConfig;
    constructor(player: SimplePlayer, config: ContainerConfig, children: Component[]);
    create(): HTMLElement;
    destroy(): void;
}
export {};
