import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import { Color, Point } from '../types';
import { PropIdent } from '../SGFParser/sgfTypes';
import { PlayerBase } from '../PlayerBase';
import defaultSimplePlayerConfig, { SimplePlayerConfig } from './defaultSimplePlayerConfig';
import SVGBoardComponent from './components/SVGBoardComponent';

const colorsMap: { [key: string]: Color } = {
  B: Color.BLACK,
  W: Color.WHITE,
};

export default class SimplePlayer extends PlayerBase {
  element: HTMLElement;
  config: SimplePlayerConfig;

  private _mouseWheelEvent: EventListenerOrEventListenerObject;
  private _keyEvent: EventListenerOrEventListenerObject;

  constructor(element: HTMLElement, config: PartialRecursive<SimplePlayerConfig> = {}) {
    super();

    // merge user config with default
    this.element = element;
    this.config = makeConfig(defaultSimplePlayerConfig, config);

    this.init();
  }

  init() {
    if (this.element.tabIndex < 0) {
      this.element.tabIndex = 1;
    }

    document.addEventListener('mousewheel', this._mouseWheelEvent = (e: any) => {
      if (document.activeElement === this.element && this.config.enableMouseWheel) {
        if (e.deltaY > 0) {
          this.next();
        } else if (e.deltaY < 0) {
          this.previous();
        }

        return false;
      }
    });

    document.addEventListener('keydown', this._keyEvent = (e: any) => {
      if (document.activeElement === this.element && this.config.enableKeys) {
        if (e.key === 'ArrowRight') {
          this.next();
        } else if (e.key === 'ArrowLeft') {
          this.previous();
        }

        return false;
      }
    });

    // temp
    const boardComponent = new SVGBoardComponent(this);
    const boardElement = boardComponent.create();
    this.element.appendChild(boardElement);
  }

  destroy() {
    document.removeEventListener('mousewheel', this._mouseWheelEvent);
    this._mouseWheelEvent = null;
    document.removeEventListener('keydown', this._keyEvent);
  }

  getVariations(): Point[] {
    if (this.shouldShowVariations()) {
      if (this.shouldShowCurrentVariations()) {
        if (this.currentNode.parent) {
          return this.currentNode.parent.children.map(node => node.getProperty('B') || node.getProperty('W'));
        }
      } else {
        return this.currentNode.children.map(node => node.getProperty('B') || node.getProperty('W'));
      }
    }
    return [];
  }

  shouldShowVariations() {
    const st = this.rootNode.getProperty(PropIdent.VARIATIONS_STYLE);
    if (st != null) {
      return !(st & 2);
    }
    return this.config.showVariations;
  }

  shouldShowCurrentVariations() {
    const st = this.rootNode.getProperty(PropIdent.VARIATIONS_STYLE);
    if (st != null) {
      return !!(st & 1);
    }
    return this.config.showCurrentVariations;
  }
}
