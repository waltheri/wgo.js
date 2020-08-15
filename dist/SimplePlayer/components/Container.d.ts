import Component, { ComponentConstructor } from './Component';
import SimplePlayer from '../SimplePlayer';
interface ContainerItem<T> {
    component: ComponentConstructor<T>;
    params?: T;
    condition?: (container: Container) => boolean;
}
interface ContainerConfig {
    direction: 'row' | 'column';
    items: ContainerItem<any>[];
}
export default class Container extends Component {
    element: HTMLElement;
    direction: 'row' | 'column';
    items: ContainerItem<any>[];
    children: Component[];
    constructor(params: ContainerConfig);
    create(): HTMLElement;
    didMount(player: SimplePlayer): void;
    destroy(player: SimplePlayer): void;
}
export {};
