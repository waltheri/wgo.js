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
import { FieldObject } from '../BoardBase';
import ContainerCondition from './components/ContainerCondition';

export default class SimplePlayer extends PlayerBase {
  element: HTMLElement;
  mainElement: HTMLElement;
  config: SimplePlayerConfig;
  layout: Component;
  editMode: boolean;
  coordinates: boolean;

  private _mouseWheelEvent: EventListenerOrEventListenerObject;
  private _keyEvent: EventListenerOrEventListenerObject;
  private _resizeEvent: EventListenerOrEventListenerObject;
  private _boardMouseMoveEvent: Function;
  private _boardMouseOutEvent: Function;
  private _boardClickEvent: Function;
  private _nodeChange: Function;

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

    window.addEventListener('resize', this._resizeEvent = (e: any) => this.resize());

    // temp (maybe)
    // this.boardComponent = new SVGBoardComponent(this);

    this.layout = new Container({
      direction: 'column',
      items: [
        {
          component: Container,
          condition: ContainerCondition.maxWidth(749),
          params: {
            direction: 'row',
            items: [
              { component: PlayerTag, params: Color.B },
              { component: PlayerTag, params: Color.W },
            ],
          },
        },
        {
          component: Container,
          params: {
            direction: 'row',
            items: [
              { component: SVGBoardComponent },
              {
                component: Container,
                condition: ContainerCondition.minWidth(650),
                params: {
                  direction: 'column',
                  items: [
                    { component: PlayerTag, params: Color.B, condition: ContainerCondition.minWidth(250) },
                    { component: PlayerTag, params: Color.W, condition: ContainerCondition.minWidth(250) },
                    { component: ControlPanel, condition: ContainerCondition.minWidth(250) },
                    { component: GameInfoBox },
                    { component: CommentBox },
                  ],
                },
              },
            ],
          },
        },
        { component: ControlPanel, condition: ContainerCondition.maxWidth(749) },
        { component: CommentBox, condition: ContainerCondition.maxWidth(649) },
      ],
    });

    this.mainElement.appendChild(this.layout.create(this));
    this.layout.didMount(this);
  }

  destroy() {
    document.removeEventListener('mousewheel', this._mouseWheelEvent);
    this._mouseWheelEvent = null;

    document.removeEventListener('keydown', this._keyEvent);
    this._keyEvent = null;

    window.removeEventListener('resize', this._resizeEvent);
    this._resizeEvent = null;
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
    // look in kifu, whether to show variation markup
    const st = this.rootNode.getProperty(PropIdent.VARIATIONS_STYLE);
    if (st != null) {
      return !(st & 2);
    }

    // otherwise use configuration value
    return this.config.showVariations;
  }

  shouldShowCurrentVariations() {
    // in edit mode not possible
    if (this.editMode) {
      return false;
    }

    // look at variation style in kifu
    const st = this.rootNode.getProperty(PropIdent.VARIATIONS_STYLE);
    if (st != null) {
      return !!(st & 1);
    }

    // or use variation style from configuration
    return this.config.showCurrentVariations;
  }

  /**
   * Can be called, when dimension of player changes, to update components or layout.
   * It is called automatically on window resize event.
   */
  resize() {
    this.emit('resize', this);
  }

  setEditMode(b: boolean) {
    if (b && !this.editMode) {
      this.save();
      this.editMode = true;

      let lastX = -1;
      let lastY = -1;

      const blackStone = new FieldObject('B');
      blackStone.opacity = 0.35;

      const whiteStone = new FieldObject('W');
      whiteStone.opacity = 0.35;

      let addedStone: FieldObject = null;

      this._boardMouseMoveEvent = (p: Point) => {
        if (lastX !== p.x || lastY !== p.y) {
          if (this.game.isValid(p.x, p.y)) {
            const boardObject = this.game.turn === Color.BLACK ? blackStone : whiteStone;
            boardObject.setPosition(p.x, p.y);

            if (addedStone) {
              this.emit('board.updateTemporaryObject', boardObject);
            } else {
              this.emit('board.addTemporaryObject', boardObject);
              addedStone = boardObject;
            }

          } else {
            this._boardMouseOutEvent();
          }
          lastX = p.x;
          lastY = p.y;
        }
      };

      this._boardMouseOutEvent = () => {
        if (addedStone) {
          this.emit('board.removeTemporaryObject', addedStone);
          addedStone = null;
        }
        lastX = -1;
        lastY = -1;
      };

      this._boardClickEvent = (p: Point) => {
        this._boardMouseOutEvent();

        if (p == null) {
          return;
        }

        // check, whether some of the next node contains this move
        for (let i = 0; i < this.currentNode.children.length; i++) {
          const move = this.currentNode.children[i].getProperty('B') || this.currentNode.children[i].getProperty('W');
          if (move.x === p.x && move.y === p.y) {
            this.next(i);
            return;
          }
        }

        // otherwise play if valid
        if (this.game.isValid(p.x, p.y)) {
          this.play(p.x, p.y);
        }
      };

      this._nodeChange = () => {
        const current = { x: lastX, y: lastY };
        this._boardMouseOutEvent();
        this._boardMouseMoveEvent(current);
      };

      this.on('boardMouseMove', this._boardMouseMoveEvent);
      this.on('boardMouseOut', this._boardMouseOutEvent);
      this.on('boardClick', this._boardClickEvent);
      this.on('applyNodeChanges', this._nodeChange);
    } else if (!b && this.editMode) {
      this.off('boardMouseMove', this._boardMouseMoveEvent);
      this.off('boardMouseOut', this._boardMouseOutEvent);
      this.off('boardClick', this._boardClickEvent);
      this.off('applyNodeChanges', this._nodeChange);

      this.editMode = false;
      this.restore();
    }
  }
}
