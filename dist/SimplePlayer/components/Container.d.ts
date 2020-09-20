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
    direction: 'row' | 'column';
    items: ContainerItem<any>[];
    children: Component[];
    constructor(player: SimplePlayer, params: ContainerConfig);
    create(): HTMLElement;
    didMount(): void;
    destroy(): void;
    handleResize(): void;
}
