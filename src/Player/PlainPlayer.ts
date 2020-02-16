import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import CanvasBoard, { defaultBoardConfig, FieldObject } from '../CanvasBoard';
import PlayerBase from './PlayerBase';
import { CanvasBoardTheme } from '../CanvasBoard/types';
import { DrawHandler, Circle } from '../CanvasBoard/drawHandlers';
import MarkupHandler from './boardPropertyHandlers/MarkupHandler';
import MarkupLineHandler from './boardPropertyHandlers/MarkupLineHandler';
import { Color } from '../types';
import MarkupLabelHandler from './boardPropertyHandlers/MarkupLabelHandler';
import ViewportHandler from './boardPropertyHandlers/ViewportHandler';
import MoveHandlerWithMark from './boardPropertyHandlers/MoveHandlerWithMark';

export interface PlainPlayerConfig {
  boardTheme: CanvasBoardTheme;
  currentMoveBlackMark: DrawHandler;
  currentMoveWhiteMark: DrawHandler;
  enableMouseWheel: boolean;
  enableKeys: boolean;
}

export const defaultPlainPlayerConfig: PlainPlayerConfig = {
  boardTheme: defaultBoardConfig.theme,
  currentMoveBlackMark: new Circle({ color: 'rgba(255,255,255,0.8)' }),
  currentMoveWhiteMark: new Circle({ color: 'rgba(0,0,0,0.8)' }),
  enableMouseWheel: true,
  enableKeys: true,
};

const colorsMap: { [key: string]: Color } = {
  B: Color.BLACK,
  W: Color.WHITE,
};

export default class PlainPlayer extends PlayerBase {
  static propertyHandlers = {
    ...PlayerBase.propertyHandlers,
    CR: new MarkupHandler('CR'),
    DD: new MarkupHandler('DD'),
    MA: new MarkupHandler('MA'),
    SL: new MarkupHandler('SL'),
    SQ: new MarkupHandler('SQ'),
    TR: new MarkupHandler('TR'),
    LB: new MarkupLabelHandler(),
    AR: new MarkupLineHandler('AR'),
    LN: new MarkupLineHandler('LN'),
    VW: new ViewportHandler(),
    B: new MoveHandlerWithMark(Color.BLACK),
    W: new MoveHandlerWithMark(Color.WHITE),
  };

  element: HTMLElement;
  config: PlainPlayerConfig;
  board: CanvasBoard;
  stoneBoardsObjects: FieldObject[];
  _mouseWheelEvent: EventListenerOrEventListenerObject;
  _keyEvent: EventListenerOrEventListenerObject;

  constructor(element: HTMLElement, config: PartialRecursive<PlainPlayerConfig> = {}) {
    super();

    // merge user config with default
    this.element = element;
    this.config = makeConfig(defaultPlainPlayerConfig, config);

    this.init();
  }

  init() {
    this.board = new CanvasBoard(this.element, {
      theme: this.config.boardTheme,
    });
    this.stoneBoardsObjects = [];

    this.on('applyNodeChanges', () => this.updateStones());

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
  }

  destroy() {
    document.removeEventListener('mousewheel', this._mouseWheelEvent);
    this._mouseWheelEvent = null;
    document.removeEventListener('keydown', this._keyEvent);

  }

  protected updateStones() {
    // Remove missing stones in current position
    this.stoneBoardsObjects = this.stoneBoardsObjects.filter((boardObject) => {
      if (this.game.getStone(boardObject.x, boardObject.y) !== colorsMap[boardObject.type as string]) {
        this.board.removeObject(boardObject);
        return false;
      }
      return true;
    });

    // Add new stones from current position
    const position = this.game.position;

    for (let x = 0; x < position.size; x++) {
      for (let y = 0; y < position.size; y++) {
        const c = position.get(x, y);
        if (c && !this.stoneBoardsObjects.some(
          boardObject => boardObject.x === x && boardObject.y === y && c === colorsMap[boardObject.type as string],
        )) {
          const boardObject = new FieldObject(c === Color.B ? 'B' : 'W');
          this.board.addObjectAt(x, y, boardObject);
          this.stoneBoardsObjects.push(boardObject);
        }
      }
    }
  }
}
