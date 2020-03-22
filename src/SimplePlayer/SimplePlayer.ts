import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import { Point, Color } from '../types';
import { PropIdent } from '../SGFParser/sgfTypes';
import { PlayerBase } from '../PlayerBase';
import defaultSimplePlayerConfig, { SimplePlayerConfig } from './defaultSimplePlayerConfig';
import SVGBoardComponent from './components/SVGBoardComponent';
import Component from './components/Component';
import Container from './components/Container';
import PlayerTag from './components/PlayerTag';
import CommentBox from './components/CommentsBox';

export default class SimplePlayer extends PlayerBase {
  element: HTMLElement;
  mainElement: HTMLElement;
  config: SimplePlayerConfig;
  layout: Component;

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
    this.mainElement = document.createElement('div');
    this.mainElement.className = 'wgo-player';
    this.mainElement.tabIndex = 1;
    this.element.appendChild(this.mainElement);

    document.addEventListener('mousewheel', this._mouseWheelEvent = (e: any) => {
      if (document.activeElement === this.mainElement && this.config.enableMouseWheel) {
        if (e.deltaY > 0) {
          this.next();
        } else if (e.deltaY < 0) {
          this.previous();
        }

        return false;
      }
    });

    document.addEventListener('keydown', this._keyEvent = (e: any) => {
      if (document.activeElement === this.mainElement && this.config.enableKeys) {
        if (e.key === 'ArrowRight') {
          this.next();
        } else if (e.key === 'ArrowLeft') {
          this.previous();
        }

        return false;
      }
    });

    // temp (maybe)
    this.layout = new Container(this, { direction: 'row' }, [
      new SVGBoardComponent(this),
      new Container(this, { direction: 'column' }, [
        new PlayerTag(this, Color.B),
        new PlayerTag(this, Color.W),
        new CommentBox(this),
      ]),
    ]);
    this.mainElement.appendChild(this.layout.create());
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
