import SimplePlayer from '../SimplePlayer';
import Component from './Component';

export default class ControlPanel extends Component {
  element: HTMLElement;
  moveNumber: HTMLInputElement;
  first: HTMLButtonElement;
  previous: HTMLButtonElement;
  next: HTMLButtonElement;
  last: HTMLButtonElement;

  constructor(player: SimplePlayer) {
    super(player);
    this.update = this.update.bind(this);
  }

  create() {
    this.element = document.createElement('div');
    this.element.className = 'wgo-player__control-panel';

    const buttonGroup = document.createElement('form');
    buttonGroup.className = 'wgo-player__button-group';
    this.element.appendChild(buttonGroup);
    buttonGroup.addEventListener('submit', (e) => {
      e.preventDefault();
      this.player.goTo(parseInt(this.moveNumber.value, 10));
    });

    this.first = document.createElement('button');
    this.first.type = 'button';
    this.first.className = 'wgo-player__button';
    this.first.innerHTML = '<span class="wgo-player__icon-to-end wgo-player__icon--reverse"></span>';
    this.first.addEventListener('click', () => this.player.first());
    buttonGroup.appendChild(this.first);

    this.previous = document.createElement('button');
    this.previous.type = 'button';
    this.previous.className = 'wgo-player__button';
    this.previous.innerHTML = '<span class="wgo-player__icon-play wgo-player__icon--reverse"></span>';
    this.previous.addEventListener('click', () => this.player.previous());
    buttonGroup.appendChild(this.previous);

    this.moveNumber = document.createElement('input');
    this.moveNumber.className = 'wgo-player__button wgo-player__move-number';
    this.moveNumber.value = '0';
    this.moveNumber.addEventListener('blur', (e) => {
      this.player.goTo(parseInt(this.moveNumber.value, 10));
    });
    buttonGroup.appendChild(this.moveNumber);

    this.next = document.createElement('button');
    this.next.type = 'button';
    this.next.className = 'wgo-player__button';
    this.next.innerHTML = '<span class="wgo-player__icon-play"></span>';
    this.next.addEventListener('click', () => this.player.next());
    buttonGroup.appendChild(this.next);

    this.last = document.createElement('button');
    this.last.type = 'button';
    this.last.className = 'wgo-player__button';
    this.last.innerHTML = '<span class="wgo-player__icon-to-end"></span>';
    this.last.addEventListener('click', () => this.player.last());
    buttonGroup.appendChild(this.last);

    const menu = document.createElement('button');
    menu.type = 'button';
    menu.className = 'wgo-player__button wgo-player__button--menu';
    menu.innerHTML = '<span class="wgo-player__icon-menu"></span>';
    // menu.addEventListener('click', () => this.player.last());
    this.element.appendChild(menu);

    this.player.on('applyNodeChanges', this.update);

    return this.element;
  }

  destroy() {
    this.player.off('applyNodeChanges', this.update);
  }

  update() {
    this.moveNumber.value = String(this.player.getCurrentPath().depth);

    if (!this.player.currentNode.parent) {
      this.first.disabled = true;
      this.previous.disabled = true;
    } else {
      this.first.disabled = false;
      this.previous.disabled = false;
    }

    if (this.player.currentNode.children.length === 0) {
      this.next.disabled = true;
      this.last.disabled = true;
    } else {
      this.next.disabled = false;
      this.last.disabled = false;
    }
  }
}
