import SimplePlayer from '../SimplePlayer';
import Component from './Component';
import { LayoutItem } from '../defaultSimplePlayerConfig';

export interface Condition {
  (container: Container): boolean;
}

/**
 * Special kind of component which handles rendering of player's component by layout config.
 * It should not be used directly. It is created internally by SimplePlayer and itself.
 */
export default class Container extends Component {
  player: SimplePlayer;
  element: HTMLElement;
  items: LayoutItem[];
  children: Component[] = [];
  direction: string;

  constructor(player: SimplePlayer, items: LayoutItem[], direction: string) {
    super(player);

    this.items = items;
    this.direction = direction;
  }

  create() {
    this.element = document.createElement('div');
    this.element.className = `wgo-player__container wgo-player__container--${this.direction}`;
    return this.element;
  }

  didMount() {
    this.items.forEach((layoutItem, position) => {
      if (typeof layoutItem === 'string') {
        this.appendComponent(this.player.components[layoutItem], position);
        return;
      }

      if (layoutItem.if && !layoutItem.if(this)) {
        if (this.children[position]) {
          if ([].indexOf.call(this.element.children, this.children[position].element as any) >= 0) {
            this.element.removeChild(this.children[position].element);
          }
        }
        this.children[position] = null;
        return;
      }

      if ('column' in layoutItem) {
        this.appendContainer(layoutItem.column, 'column', position);
      } else if ('row' in layoutItem) {
        this.appendContainer(layoutItem.row, 'row', position);
      } else if ('component' in layoutItem) {
        this.appendComponent(this.player.components[layoutItem.component], position);
      }
    });
  }

  private appendComponent(component: Component, position: number) {
    if (this.children[position] == null) {
      const elem = component.element || component.create();

      this.appendElementToDOM(elem, position);
      this.children[position] = component;
    }
    component.didMount();
  }

  private appendContainer(items: LayoutItem[], direction: string, position: number) {
    if (this.children[position] == null) {
      const container = new Container(this.player, items, direction);
      const elem = container.create();

      this.appendElementToDOM(elem, position);
      this.children[position] = container;
    }
    this.children[position].didMount();
  }

  private appendElementToDOM(elem: HTMLElement, position: number) {
    let nextComponent: Component = null;
    let i = position + 1;

    // find next rendered component to use it as reference for inserting this one
    while (i < this.children.length && nextComponent == null) {
      nextComponent = this.children[i];
      i++;
    }

    if (nextComponent) {
      this.element.insertBefore(elem, nextComponent.element);
    } else {
      this.element.appendChild(elem);
    }
  }

  destroy() {
    this.items.forEach((layoutItem, position) => {
      if (typeof layoutItem !== 'string' && !('component' in layoutItem)) {
        if (this.children[position]) {
          // destroy only existing containers
          this.children[position].destroy();
        }
      }

      if (this.children[position]) {
        this.element.removeChild(this.children[position].element);
      }
    });
  }
}
