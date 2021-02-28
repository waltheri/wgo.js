import PlayerDOM from '../PlayerDOM';
import PlayerDOMComponent from './PlayerDOMComponent';

export default class Container implements PlayerDOMComponent {
  player: PlayerDOM;
  element: HTMLElement;
  children: PlayerDOMComponent[];
  direction: string;

  constructor(direction: string, children: PlayerDOMComponent[] = []) {
    this.direction = direction;
    this.children = children;
  }

  create(player: PlayerDOM) {
    this.element = document.createElement('div');
    this.element.className = `wgo-player__container wgo-player__container--${this.direction}`;

    this.children.forEach(child => this.element.appendChild(child.create(player)));

    return this.element;
  }

  didMount() {
    this.children.forEach(child => typeof child.didMount === 'function' && child.didMount());
  }

  destroy() {
    this.children.forEach(child => typeof child.destroy === 'function' && child.destroy());
  }
}
