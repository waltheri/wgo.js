import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import CanvasBoard, { defaultBoardConfig, FieldObject, BoardLabelObject } from '../CanvasBoard';
import PlayerBase from './PlayerBase';
import { CanvasBoardTheme } from '../CanvasBoard/types';
import { DrawHandler, Circle, Label } from '../CanvasBoard/drawHandlers';
import MarkupHandler from './boardPropertyHandlers/MarkupHandler';
import MarkupLineHandler from './boardPropertyHandlers/MarkupLineHandler';
import { Color, Point } from '../types';
import MarkupLabelHandler from './boardPropertyHandlers/MarkupLabelHandler';
import ViewportHandler from './boardPropertyHandlers/ViewportHandler';
import MoveHandlerWithMark from './boardPropertyHandlers/MoveHandlerWithMark';
import { KifuNode } from '..';

export interface PlainPlayerConfig {
  boardTheme: CanvasBoardTheme;
  currentMoveBlackMark: DrawHandler;
  currentMoveWhiteMark: DrawHandler;
  enableMouseWheel: boolean;
  enableKeys: boolean;
  showVariations: boolean;
  showCurrentVariations: boolean;
  variationDrawHandler: DrawHandler;
}

export const defaultPlainPlayerConfig: PlainPlayerConfig = {
  boardTheme: defaultBoardConfig.theme,
  currentMoveBlackMark: new Circle({ color: 'rgba(255,255,255,0.8)' }),
  currentMoveWhiteMark: new Circle({ color: 'rgba(0,0,0,0.8)' }),
  enableMouseWheel: true,
  enableKeys: true,
  showVariations: true,
  showCurrentVariations: false,
  variationDrawHandler: new Label({ color: '#33f' }),
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
  boardMouseX: number;
  boardMouseY: number;

  protected stoneBoardsObjects: FieldObject[];
  protected variationBoardObjects: FieldObject[];

  private _mouseWheelEvent: EventListenerOrEventListenerObject;
  private _keyEvent: EventListenerOrEventListenerObject;

  constructor(element: HTMLElement, config: PartialRecursive<PlainPlayerConfig> = {}) {
    super();

    // merge user config with default
    this.element = element;
    this.config = makeConfig(defaultPlainPlayerConfig, config);

    this.init();
  }

  init() {
    this.stoneBoardsObjects = [];
    this.variationBoardObjects = [];

    this.board = new CanvasBoard(this.element, {
      theme: this.config.boardTheme,
    });

    this.board.on('click', (event, point) => {
      this.handleBoardClick(point);
    });

    this.board.on('mousemove', (event, point) => {
      if (!point) {
        if (this.boardMouseX != null) {
          this.boardMouseX = null;
          this.boardMouseY = null;
          this.handleBoardMouseOut();
        }
        return;
      }
      if (point.x !== this.boardMouseX || point.y !== this.boardMouseY) {
        this.boardMouseX = point.x;
        this.boardMouseY = point.y;
        this.handleBoardMouseMove(point);
      }
    });

    this.board.on('mouseout', (event, point) => {
      if (!point && this.boardMouseX != null) {
        this.boardMouseX = null;
        this.boardMouseY = null;
        this.handleBoardMouseOut();
        return;
      }
    });

    this.on('applyNodeChanges', () => {
      this.updateStones();
      this.addVariationMarkup();
    });

    this.on('clearNodeChanges', () => {
      this.removeVariationMarkup();
    });

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

  protected addVariationMarkup() {
    const moves = this.getVariations();

    if (moves.length > 1) {
      moves.forEach((move, i) => {
        if (move) {
          const obj = new BoardLabelObject(String.fromCodePoint(65 + i));
          this.variationBoardObjects.push(obj);
          obj.type = this.config.variationDrawHandler;
          this.board.addObjectAt(move.x, move.y, obj);
        }
      });
      if (this.boardMouseX != null) {
        this.handleVariationCursor(this.boardMouseX, this.boardMouseY, moves);
      }
    }
  }

  protected getVariations(): Point[] {
    if (this.config.showVariations) {
      if (this.config.showCurrentVariations && this.currentNode.parent) {
        return this.currentNode.parent.children.map(node => node.getProperty('B') || node.getProperty('W'));
      }
      if (!this.config.showCurrentVariations) {
        return this.currentNode.children.map(node => node.getProperty('B') || node.getProperty('W'));
      }
    }
    return [];
  }

  protected removeVariationMarkup() {
    if (this.variationBoardObjects.length) {
      this.board.removeObject(this.variationBoardObjects);
      this.variationBoardObjects = [];
      this.removeVariationCursor();
    }
  }

  protected handleBoardClick(point: Point) {
    this.emit('boardClick', point);

    const moves = this.getVariations();
    if (moves.length > 1) {
      const ind = moves.findIndex(move => move && move.x === point.x && move.y === point.y);

      if (ind >= 0) {
        if (this.config.showCurrentVariations) {
          this.previous();
          this.next(ind);
        } else {
          this.next(ind);
        }
      }
    }
  }

  protected handleBoardMouseMove(point: Point) {
    this.emit('boardMouseMove', point);
    this.handleVariationCursor(point.x, point.y, this.getVariations());
  }

  protected handleBoardMouseOut() {
    this.emit('boardMouseOut');
    this.removeVariationCursor();
  }

  private handleVariationCursor(x: number, y: number, moves: Point[]) {
    if (moves.length > 1) {
      const ind = moves.findIndex(move => move && move.x === x && move.y === y);

      if (ind >= 0) {
        this.element.style.cursor = 'pointer';
        return;
      }
    }

    this.removeVariationCursor();
  }

  private removeVariationCursor() {
    if (this.element.style.cursor) {
      this.element.style.cursor = '';
    }
  }
}
