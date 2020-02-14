import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import { PlayerConfig } from './types';
import playerDefaultConfig from './defaultConfig';
import CanvasBoard, { BoardObject, FieldObject } from '../CanvasBoard';
import KifuReader from '../kifu/KifuReader';
import KifuNode from '../kifu/KifuNode';
import { Color } from '../types';
import propertyHandlers from './propertyHandlers';
import PlayerBase from './PlayerBase';

const colorsMap: { [key: string]: Color } = {
  B: Color.BLACK,
  W: Color.WHITE,
};

export default class Player extends PlayerBase {
  element: HTMLElement;
  config: PlayerConfig;
  board: CanvasBoard;
  kifuReader: KifuReader;
  stoneBoardsObjects: FieldObject[];
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
      if (this.kifuReader.game.getStone(boardObject.x, boardObject.y) !== colorsMap[boardObject.type as string]) {
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
          boardObject => boardObject.x === x && boardObject.y === y && c === colorsMap[boardObject.type as string],
        )) {
          const boardObject = new FieldObject(c === Color.B ? 'B' : 'W');
          this.board.addObjectAt(x, y, boardObject);
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
    this.board.addObject(boardObject);
  }
}
