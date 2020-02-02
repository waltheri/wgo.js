import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import { PlayerConfig } from './types';
import playerDefaultConfig from './defaultConfig';
import CanvasBoard from '../CanvasBoard';
import KifuReader from '../kifu/KifuReader';
import KifuNode from '../kifu/KifuNode';
import { BoardFieldObject, BoardObject } from '../CanvasBoard/types';
import { Color } from '../types';
import EventEmitter from '../utils/EventEmitter';
import propertyHandlers from './propertyHandlers';

const colorsMap: { [key: string]: Color } = {
  B: Color.BLACK,
  W: Color.WHITE,
};

export default class Player extends EventEmitter {
  element: HTMLElement;
  config: PlayerConfig;
  board: CanvasBoard;
  kifuReader: KifuReader;
  stoneBoardsObjects: BoardFieldObject[];
  markupBoardObjects: BoardObject[];

  // handleBoardClick(event: UIEvent, point: Point): void;

  constructor(element: HTMLElement, config: PartialRecursive<PlayerConfig> = {}) {
    super();

    // merge user config with default
    this.element = element;
    this.config = makeConfig(playerDefaultConfig, config);

    this.init();
  }

  init() {
    this.board = new CanvasBoard(this.element, {
      theme: this.config.boardTheme,
    });
    this.stoneBoardsObjects = [];
    this.markupBoardObjects = [];

    if (this.config.sgf) {
      this.kifuReader = new KifuReader(KifuNode.fromSGF(this.config.sgf));
    } else {
      this.kifuReader = new KifuReader();
    }

    this.updateBoard();

    // this.handleBoardClick = (_e, point) => {
    //
    // };

    // this.board.on('click', )
  }

  updateBoard() {
    // Remove missing stones in current position
    this.stoneBoardsObjects = this.stoneBoardsObjects.filter((boardObject) => {
      if (this.kifuReader.game.getStone(boardObject.field.x, boardObject.field.y) !== colorsMap[boardObject.type]) {
        this.board.removeObject(boardObject);
        return false;
      }
      return true;
    });

    // Add new stones from current position
    const position = this.kifuReader.game.position;

    for (let x = 0; x < position.size; x++) {
      for (let y = 0; y < position.size; y++) {
        const c = position.get(x, y);
        if (c && !this.stoneBoardsObjects.some(
          boardObject => boardObject.field.x === x && boardObject.field.y === y && c === colorsMap[boardObject.type],
        )) {
          const boardObject = { type: c === Color.B ? 'B' : 'W', field: { x, y } };
          this.board.addObject(boardObject);
          this.stoneBoardsObjects.push(boardObject);
        }
      }
    }

    // Remove all markup
    this.markupBoardObjects.forEach(boardObject => this.board.removeObject(boardObject));
    this.markupBoardObjects = [];

    Object.keys(this.kifuReader.currentNode.properties).forEach((propIdent) => {
      if (propertyHandlers[propIdent]) {
        propertyHandlers[propIdent](this, propIdent, this.kifuReader.currentNode.properties[propIdent]);
      }
    });

    this.markupBoardObjects.forEach(boardObject => this.board.addObject(boardObject));
  }

  next() {
    this.kifuReader.next();
    this.updateBoard();
  }

  previous() {
    this.kifuReader.previous();
    this.updateBoard();
  }

  /**
   * Adds temporary board object, which will be removed during next position/node update.
   * @param boardObject
   */
  addTemporaryBoardObject(boardObject: BoardObject) {
    this.markupBoardObjects.push(boardObject);
  }
}
