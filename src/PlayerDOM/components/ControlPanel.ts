import { SVGBoardComponent } from '.';
import { PlayerBase } from '../../PlayerBase';
import { EditMode } from '../../PlayerBase/plugins';
import { PropIdent } from '../../SGFParser/sgfTypes';
import makeConfig, { PartialRecursive } from '../../utils/makeConfig';
import PlayerDOM from '../PlayerDOM';
import GameInfoBox from './GameInfoBox';
import PlayerDOMComponent from './PlayerDOMComponent';

interface MenuItem {
  /** Title of the menu item. */
  name: string;

  /** If true, there can be check state of the menu item. */
  checkable?: boolean;

  /** Function executed upon click. If checkable, should return new check state. */
  handleClick(): boolean | void;

  /** If checkable, function which return initial check state. */
  defaultChecked?(): boolean;
}

interface ControlPanelConfig {
  menuItems: MenuItem[];
}

const defaultConfig: ControlPanelConfig = {
  menuItems: [],
};

export default class ControlPanel implements PlayerDOMComponent {
  element: HTMLElement;
  player: PlayerDOM;
  moveNumber: HTMLInputElement;
  first: HTMLButtonElement;
  previous: HTMLButtonElement;
  next: HTMLButtonElement;
  last: HTMLButtonElement;
  config: ControlPanelConfig;

  constructor(config: PartialRecursive<ControlPanelConfig> = {}) {
    this.config = makeConfig(defaultConfig, config);
    this.update = this.update.bind(this);

    this.createDOM();
  }

  createDOM() {
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

    if (this.config.menuItems.length) {
      const menuWrapper = document.createElement('div');
      menuWrapper.className = 'wgo-player__menu-wrapper';
      this.element.appendChild(menuWrapper);

      const menuButton = document.createElement('button');
      menuButton.type = 'button';
      menuButton.className = 'wgo-player__button wgo-player__button--menu';
      menuButton.innerHTML = '<span class="wgo-player__icon-menu"></span>';
      menuWrapper.appendChild(menuButton);

      const menu = document.createElement('div');
      menu.className = 'wgo-player__menu';
      this.createMenuItems(menu);
      menuWrapper.appendChild(menu);
    }
  }

  create(player: PlayerDOM) {
    this.player = player;
    this.player.on('applyNodeChanges', this.update);

    if (this.player.currentNode) {
      this.update();
    }
  }

  destroy() {
    this.player.off('applyNodeChanges', this.update);
    this.player = null;
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

  createMenuItems(menu: HTMLElement) {
    this.config.menuItems.forEach((menuItem) => {
      const menuItemElement = document.createElement('a');
      menuItemElement.className = 'wgo-player__menu-item';
      menuItemElement.tabIndex = 0;
      menuItemElement.textContent = menuItem.name;
      menuItemElement.href = 'javascript: void(0)';

      if (menuItem.defaultChecked && menuItem.defaultChecked()) {
        menuItemElement.classList.add('wgo-player__menu-item--checked');
      }

      menuItemElement.addEventListener('click', (e) => {
        e.preventDefault();

        const res = menuItem.handleClick();

        if (menuItem.checkable) {
          if (!res) {
            menuItemElement.classList.remove('wgo-player__menu-item--checked');
          } else {
            menuItemElement.classList.add('wgo-player__menu-item--checked');
          }
        }

        menuItemElement.blur();
      });

      menu.appendChild(menuItemElement);
    });
  }

  /**
   * Some common menu items, probably just temporary.
   */
  static menuItems = {
    /** Renders menu item with SGF download link */
    download: (player: PlayerBase) => ({
      name: 'Download SGF',
      handleClick() {
        const name = player.rootNode.getProperty(PropIdent.GameName) || 'game';
        const sgf = player.rootNode.toSGF();

        const element = document.createElement('a');
        element.setAttribute('href', `data:application/x-go-sgf;charset=utf-8,${encodeURIComponent(sgf)}`);
        element.setAttribute('download', `${name}.sgf`);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
      },
    }),

    /** Renders menu item to toggle coordinates of SVGBoardComponent */
    displayCoordinates: (boardComponent: SVGBoardComponent) => ({
      name: 'Display coordinates',
      checkable: true,
      handleClick() {
        boardComponent.setCoordinates(!boardComponent.config.coordinates);
        return boardComponent.config.coordinates;
      },
      defaultChecked: () => boardComponent.config.coordinates,
    }),

    /** Renders menu item to toggle edit mode (using EditMode plugin) */
    editMode: (editMode: EditMode) => ({
      name: 'Edit mode',
      checkable: true,
      handleClick() {
        editMode.setEnabled(!editMode.config.enabled);
        return editMode.config.enabled;
      },
      defaultChecked: () => editMode.config.enabled,
    }),

    gameInfo: (player: PlayerDOM, callback: (modalWrapper: HTMLElement) => void) => ({
      name: 'Game info',
      handleClick() {
        const overlay = document.createElement('div');
        overlay.className = 'wgo-player__overlay';

        const overlayClose = document.createElement('div');
        overlayClose.className = 'wgo-player__overlay__close';
        overlayClose.addEventListener('click', () => {
          overlay.parentElement.removeChild(overlay);
          gameInfo.destroy();
        });
        overlay.appendChild(overlayClose);

        const modal = document.createElement('div');
        modal.className = 'wgo-player__modal';
        overlay.appendChild(modal);

        const modalContent = document.createElement('div');
        modalContent.className = 'wgo-player__modal__content';
        modal.appendChild(modalContent);

        const gameInfo = new GameInfoBox({
          hideResult: false,
        });
        gameInfo.create(player);
        modalContent.appendChild(gameInfo.element);

        const wgoInfo = document.createElement('div');
        wgoInfo.className = 'wgo-player__wgo-info';
        // tslint:disable-next-line:max-line-length
        wgoInfo.innerHTML = 'Game viewed in open source JS player <a href="https://github.com/waltheri/wgo.js" target="_blank">WGo</a>.';
        modalContent.appendChild(wgoInfo);

        callback(overlay);
      },
    }),
  };
}
