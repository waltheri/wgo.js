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
import GameInfoBox from './components/GameInfoBox';
import ControlPanel from './components/ControlPanel';
import KifuNode from '../kifu/KifuNode';
import { runInThisContext } from 'vm';
import { FieldObject } from '../BoardBase';
import { SVGDrawHandler } from '../SVGBoard/types';

export default class SimplePlayer extends PlayerBase {
  element: HTMLElement;
  mainElement: HTMLElement;
  config: SimplePlayerConfig;
  layout: Component;
  boardComponent: SVGBoardComponent;
  editMode: boolean;

  private _mouseWheelEvent: EventListenerOrEventListenerObject;
  private _keyEvent: EventListenerOrEventListenerObject;
  private _boardMouseMoveEvent: Function;
  private _boardMouseOutEvent: Function;
  private _boardClickEvent: Function;

  constructor(element: HTMLElement, config: PartialRecursive<SimplePlayerConfig> = {}) {
    super();

    // merge user config with default
    this.element = element;
    this.config = makeConfig(defaultSimplePlayerConfig, config);

    this.init();
  }

  init() {
    this.editMode = false;
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
    const boardComponent = new SVGBoardComponent(this);
    this.boardComponent = boardComponent;
    this.layout = new Container(this, { direction: 'row' }, [
      boardComponent,
      new Container(this, { direction: 'column' }, [
        new PlayerTag(this, Color.B),
        new PlayerTag(this, Color.W),
        new ControlPanel(this),
        new GameInfoBox(this),
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

  setEditMode(b: boolean) {
    if (b && !this.editMode) {
      this.save();
      this.editMode = true;

      let lastX = -1;
      let lastY = -1;
      let boardObject: FieldObject<any>;

      this._boardMouseMoveEvent = (p: Point) => {
        if (lastX !== p.x || lastY !== p.y) {
          if (this.game.isValid(p.x, p.y)) {
            if (!boardObject) {
              // TODO - somehow change color, when turn changes
              boardObject = new FieldObject('MA');
              this.boardComponent.board.addObject(boardObject);
            }

            boardObject.setPosition(p.x, p.y);
            this.boardComponent.board.updateObject(boardObject);

            lastX = p.x;
            lastY = p.y;
          } else {
            this._boardMouseOutEvent();
          }
        }
      };

      this._boardMouseOutEvent = () => {
        this.boardComponent.board.removeObject(boardObject);
        boardObject = null;
        lastX = -1;
        lastY = -1;
      };

      this._boardClickEvent = (p: Point) => {
        this._boardMouseOutEvent();
        if (this.game.isValid(p.x, p.y)) {
          // TODO - don't play, if already played, also should avoid conflicts with variations
          this.play(p.x, p.y);
        }
      };

      this.on('boardMouseMove', this._boardMouseMoveEvent);
      this.on('boardMouseOut', this._boardMouseOutEvent);
      this.on('boardClick', this._boardClickEvent);
    } else if (!b && this.editMode) {
      this.off('boardMouseMove', this._boardMouseMoveEvent);
      this.off('boardMouseOut', this._boardMouseOutEvent);
      this.off('boardClick', this._boardClickEvent);

      this.editMode = false;
      this.restore();
    }
  }
}
