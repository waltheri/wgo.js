import Component from './Component';
import SimplePlayer from '../SimplePlayer';

// temporary - should be responsive
interface ContainerConfig {
  direction: 'row' | 'column';
}

export default class Container extends Component {
  element: HTMLElement;
  children: Component[];
  config: ContainerConfig;

  constructor(player: SimplePlayer, config: ContainerConfig, children: Component[]) {
    super(player);
    this.children = children;
    this.config = config;
  }

  create() {
    this.element = document.createElement('div');
    this.element.className = `wgo-player__container wgo-player__container--${this.config.direction}`;

    this.children.forEach((child) => {
      this.element.appendChild(child.create());
    });

    return this.element;
  }

  destroy() {
    this.children.forEach((child) => {
      child.destroy();
      this.element.removeChild(this.element.firstChild);
    });
  }
}
