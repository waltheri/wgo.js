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
  children: Component[] = [];

  constructor(params: ContainerConfig) {
    super();

    this.items = params.items;
    this.direction = params.direction;
    this.handleResize = this.handleResize.bind(this);
  }

  create(player: SimplePlayer) {
    this.player = player;
    this.element = document.createElement('div');
    this.element.className = `wgo-player__container wgo-player__container--${this.direction}`;

    player.on('resize', this.handleResize);

    return this.element;
  }

  didMount(player: SimplePlayer) {
    this.items.forEach((item) => {
      if (!item.condition || item.condition(this)) {
        const child = new item.component(item.params);
        this.element.appendChild(child.create(player));
        child.didMount(player);
        this.children.push(child);
      } else {
        this.children.push(null);
      }
    });
  }

  destroy(player: SimplePlayer) {
    this.children.forEach((child) => {
      if (child) {
        child.destroy(player);
        this.element.removeChild(this.element.firstChild);
      }
    });
    player.off('resize', this.handleResize);
  }

  handleResize() {
    let elemIt = 0;

    this.items.forEach((item, ind) => {
      if (!item.condition || item.condition(this)) {
        if (this.children[ind] == null) {
          const child = new item.component(item.params);
          this.element.insertBefore(child.create(this.player), this.element.children[elemIt]);
          child.didMount(this.player);
          this.children[ind] = child;
        }
        elemIt++;
      } else {
        if (this.children[ind]) {
          this.children[ind].destroy(this.player);
          this.children[ind] = null;
          this.element.removeChild(this.element.children[elemIt]);
        }
      }
    });
  }
}
