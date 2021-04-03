import PlayerDOM from '../PlayerDOM';
import PlayerDOMComponent from './PlayerDOMComponent';

export default class Container implements PlayerDOMComponent {
  element: HTMLElement;
  children: PlayerDOMComponent[];
  direction: string;

  constructor(direction: string, children: PlayerDOMComponent[] = []) {
    this.direction = direction;
    this.children = children;

    // create HTML
    this.element = document.createElement('div');
    this.element.className = `wgo-player__container wgo-player__container--${this.direction}`;
    this.children.forEach(child => this.element.appendChild(child.element));
  }

  create(player: PlayerDOM) {
    this.children.forEach(child => child.create(player));
  }

  destroy() {
    this.children.forEach(child => typeof child.destroy === 'function' && child.destroy());
  }
}
