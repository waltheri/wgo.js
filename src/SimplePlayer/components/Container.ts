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

  constructor(params: ContainerConfig) {
    super();

    this.items = params.items;
    this.direction = params.direction;
  }

  create() {
    this.element = document.createElement('div');
    this.element.className = `wgo-player__container wgo-player__container--${this.direction}`;

    return this.element;
  }

  didMount(player: SimplePlayer) {
    this.items.forEach((item) => {
      if (!item.condition || item.condition(this)) {
        const child = new item.component(item.params);
        this.element.appendChild(child.create(player));
        child.didMount(player);
      }
    });
  }

  destroy(player: SimplePlayer) {
    this.children.forEach((child) => {
      child.destroy(player);
      this.element.removeChild(this.element.firstChild);
    });
  }
}
