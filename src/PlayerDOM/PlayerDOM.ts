import { PlayerBase } from '../PlayerBase';
import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import PlayerDOMComponent from './components/PlayerDOMComponent';

interface PlayerDOMConfig {
  enableMouseWheel: boolean;
  enableKeys: boolean;
}

const defaultConfig = {
  enableMouseWheel: true,
  enableKeys: true,
};

/**
 * Player with support to render visual elements into the DOM.
 */
export default class PlayerDOM extends PlayerBase {
  config: PlayerDOMConfig;
  components: Map<HTMLElement, PlayerDOMComponent> = new Map();

  constructor(config: PartialRecursive<PlayerDOMConfig> = {}) {
    super();
    this.config = makeConfig(defaultConfig, config);

    window.addEventListener('resize', this.handleResize);
    document.addEventListener('keydown', this.handleKeydown);
  }

  /**
   * Renders PlayerDOM component into specified HTML element. If there is content inside that element
   * it will be removed. Render method can be called multiple times - this allows to have player's component
   * anywhere you want.
   *
   * @param component
   * @param container
   */
  render(component: PlayerDOMComponent, container: HTMLElement) {
    // clear content of the container
    container.innerHTML = '';

    // creates wrapper
    const wrapper = this.createWrapper();
    container.appendChild(wrapper);

    // creates the component HTML element
    const elem = component.create(this);
    wrapper.appendChild(elem);

    if (typeof component.didMount === 'function') {
      component.didMount();
    }

    this.components.set(container, component);
  }

  /**
   * Removes component rendered via `render` method. Call this to clean event listeners of the component.
   *
   * @param container
   */
  clear(container: HTMLElement) {
    const component = this.components.get(container);

    if (component && typeof component.destroy === 'function') {
      component.destroy();
    }

    const wrapper = container.firstChild as HTMLDivElement;
    wrapper.removeEventListener('wheel', this.handleMouseWheel);
    container.removeChild(wrapper);

    this.components.delete(container);
  }

  private createWrapper() {
    const element = document.createElement('div');
    element.className = 'wgo-player';
    element.tabIndex = 1;

    element.addEventListener('wheel', this.handleMouseWheel);

    return element;
  }

  private handleResize = () => {
    this.emit('resize');
  }

  private handleMouseWheel = (e: WheelEvent) => {
    if (this.config.enableMouseWheel) {
      if (e.deltaY > 0) {
        this.next();
      } else if (e.deltaY < 0) {
        this.previous();
      }
      e.preventDefault();
    }
  }

  private handleKeydown = (e: KeyboardEvent) => {
    if (this.config.enableKeys && this.hasFocus()) {
      if (e.key === 'ArrowRight') {
        this.next();
      } else if (e.key === 'ArrowLeft') {
        this.previous();
      }

      return false;
    }
  }

  private hasFocus() {
    for (const elem of this.components.keys()) {
      if (elem.firstChild === document.activeElement) {
        return true;
      }
    }

    return false;
  }
}
