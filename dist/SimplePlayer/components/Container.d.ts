import Component, { ComponentConstructor } from './Component';
import SimplePlayer from '../SimplePlayer';
export interface Condition {
    (container: Container): boolean;
}
export interface ContainerItem<T> {
    component: ComponentConstructor<T>;
    params?: T;
    condition?: Condition;
}
export interface ContainerConfig {
    direction: 'row' | 'column';
    items: ContainerItem<any>[];
}
export default class Container extends Component {
    player: SimplePlayer;
    element: HTMLElement;
    direction: 'row' | 'column';
    items: ContainerItem<any>[];
    children: Component[];
    constructor(params: ContainerConfig);
    create(player: SimplePlayer): HTMLElement;
    didMount(player: SimplePlayer): void;
    destroy(player: SimplePlayer): void;
    handleResize(): void;
}
