import Component from './Component';
import { SVGBoard } from '../../SVGBoard';
import { FieldObject, BoardLabelObject, BoardMarkupObject, BoardObject, BoardLineObject } from '../../BoardBase';
import { Color, Point, Label, Vector } from '../../types';
import { LifeCycleEvent } from '../../PlayerBase/types';
import SimplePlayer from '../SimplePlayer';
import PropertiesData from '../../PlayerBase/PropertiesData';

const colorsMap: { [key: string]: Color } = {
  B: Color.BLACK,
  W: Color.WHITE,
};

export default class SVGBoardComponent extends Component {
  // Underlying SVG board object
  board: SVGBoard;

  // Main wrapper element for the board
  boardElement: HTMLElement;

  // Current board objects for stones - should match the position object of the game
  stoneBoardsObjects: FieldObject<any>[];

  // Temporary board object, will be removed after each node update
  temporaryBoardObjects: FieldObject<any>[];

  // For data associated with Kifu properties, it is used to revert some board changes
  propertiesData: PropertiesData;

  boardMouseX: number;
  boardMouseY: number;

  constructor(player: SimplePlayer) {
    super(player);

    this.propertiesData = new PropertiesData(player);

    this.applyNodeChanges = this.applyNodeChanges.bind(this);
    this.clearNodeChanges = this.clearNodeChanges.bind(this);
    this.applyMarkupProperty = this.applyMarkupProperty.bind(this);
    this.applyLabelMarkupProperty = this.applyLabelMarkupProperty.bind(this);
    this.applyLineMarkupProperty = this.applyLineMarkupProperty.bind(this);
    this.clearMarkupProperty = this.clearMarkupProperty.bind(this);
    this.applyViewportProperty = this.applyViewportProperty.bind(this);
    this.clearViewportProperty = this.clearViewportProperty.bind(this);
    this.applyMoveProperty = this.applyMoveProperty.bind(this);
    this.clearMoveProperty = this.clearMoveProperty.bind(this);
  }

  create() {
    this.boardElement = document.createElement('div');
    this.boardElement.className = 'wgo-player__board';

    this.stoneBoardsObjects = [];
    this.temporaryBoardObjects = [];

    this.board = new SVGBoard(this.boardElement, {
      // theme: this.config.boardTheme,
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

    // add general node listeners - for setting stones on board based on position
    this.player.on('applyNodeChanges', this.applyNodeChanges);
    this.player.on('clearNodeChanges', this.clearNodeChanges);

    // temporary board markup listeners - add
    this.player.on('applyNodeChanges.CR', this.applyMarkupProperty);
    this.player.on('applyNodeChanges.TR', this.applyMarkupProperty);
    this.player.on('applyNodeChanges.SQ', this.applyMarkupProperty);
    this.player.on('applyNodeChanges.SL', this.applyMarkupProperty);
    this.player.on('applyNodeChanges.MA', this.applyMarkupProperty);
    this.player.on('applyNodeChanges.DD', this.applyMarkupProperty);
    this.player.on('applyNodeChanges.LB', this.applyLabelMarkupProperty);
    this.player.on('applyNodeChanges.LN', this.applyLineMarkupProperty);
    this.player.on('applyNodeChanges.AR', this.applyLineMarkupProperty);

    // temporary board markup listeners - clear
    this.player.on('clearNodeChanges.CR', this.clearMarkupProperty);
    this.player.on('clearNodeChanges.TR', this.clearMarkupProperty);
    this.player.on('clearNodeChanges.SQ', this.clearMarkupProperty);
    this.player.on('clearNodeChanges.SL', this.clearMarkupProperty);
    this.player.on('clearNodeChanges.MA', this.clearMarkupProperty);
    this.player.on('clearNodeChanges.DD', this.clearMarkupProperty);
    this.player.on('clearNodeChanges.LB', this.clearMarkupProperty);
    this.player.on('clearNodeChanges.LN', this.clearMarkupProperty);
    this.player.on('clearNodeChanges.AR', this.clearMarkupProperty);

    // viewport SGF property listeners
    this.player.on('applyGameChanges.VW', this.applyViewportProperty);
    this.player.on('clearGameChanges.VW', this.clearViewportProperty);

    // add current move marker
    this.player.on('applyNodeChanges.B', this.applyMoveProperty);
    this.player.on('applyNodeChanges.W', this.applyMoveProperty);
    this.player.on('clearNodeChanges.B', this.clearMoveProperty);
    this.player.on('clearNodeChanges.W', this.clearMoveProperty);

    return this.boardElement;
  }

  destroy() {
    this.player.off('applyNodeChanges', this.applyNodeChanges);
    this.player.off('clearNodeChanges', this.clearNodeChanges);

    this.player.off('applyNodeChanges', this.applyNodeChanges);
    this.player.off('clearNodeChanges', this.clearNodeChanges);

    this.player.off('applyNodeChanges.CR', this.applyMarkupProperty);
    this.player.off('applyNodeChanges.TR', this.applyMarkupProperty);
    this.player.off('applyNodeChanges.SQ', this.applyMarkupProperty);
    this.player.off('applyNodeChanges.SL', this.applyMarkupProperty);
    this.player.off('applyNodeChanges.MA', this.applyMarkupProperty);
    this.player.off('applyNodeChanges.DD', this.applyMarkupProperty);

    this.player.off('applyNodeChanges.LB', this.applyLabelMarkupProperty);
    this.player.off('applyNodeChanges.LN', this.applyLineMarkupProperty);
    this.player.off('applyNodeChanges.AR', this.applyLineMarkupProperty);

    this.player.off('clearNodeChanges.CR', this.clearMarkupProperty);
    this.player.off('clearNodeChanges.TR', this.clearMarkupProperty);
    this.player.off('clearNodeChanges.SQ', this.clearMarkupProperty);
    this.player.off('clearNodeChanges.SL', this.clearMarkupProperty);
    this.player.off('clearNodeChanges.MA', this.clearMarkupProperty);
    this.player.off('clearNodeChanges.DD', this.clearMarkupProperty);

    this.player.off('clearNodeChanges.LB', this.clearMarkupProperty);
    this.player.off('clearNodeChanges.LN', this.clearMarkupProperty);
    this.player.off('clearNodeChanges.AR', this.clearMarkupProperty);

    this.player.off('applyGameChanges.VW', this.applyViewportProperty);
    this.player.off('clearGameChanges.VW', this.clearViewportProperty);

    this.player.off('applyNodeChanges.B', this.applyMoveProperty);
    this.player.off('applyNodeChanges.W', this.applyMoveProperty);
    this.player.off('clearNodeChanges.B', this.clearMoveProperty);
    this.player.off('clearNodeChanges.W', this.clearMoveProperty);
  }

  protected updateStones() {
    // Remove missing stones in current position
    this.stoneBoardsObjects = this.stoneBoardsObjects.filter((boardObject) => {
      if (this.player.game.getStone(boardObject.x, boardObject.y) !== colorsMap[boardObject.type as string]) {
        this.board.removeObject(boardObject);
        return false;
      }
      return true;
    });

    // Add new stones from current position
    const position = this.player.game.position;

    for (let x = 0; x < position.size; x++) {
      for (let y = 0; y < position.size; y++) {
        const c = position.get(x, y);
        if (c && !this.stoneBoardsObjects.some(
          boardObject => boardObject.x === x && boardObject.y === y && c === colorsMap[boardObject.type as string],
        )) {
          const boardObject = new FieldObject<any>(c === Color.B ? 'B' : 'W');
          this.board.addObjectAt(x, y, boardObject);
          this.stoneBoardsObjects.push(boardObject);
        }
      }
    }
  }

  protected addVariationMarkup() {
    const moves = this.player.getVariations();

    if (moves.length > 1) {
      moves.forEach((move, i) => {
        if (move) {
          const obj = new BoardLabelObject(String.fromCodePoint(65 + i));
          obj.type = this.player.config.variationDrawHandler;
          this.addTemporaryBoardObject(move.x, move.y, obj);
        }
      });
      if (this.boardMouseX != null) {
        this.handleVariationCursor(this.boardMouseX, this.boardMouseY, moves);
      }
    }
  }

  protected clearTemporaryBoardObjects() {
    if (this.temporaryBoardObjects.length) {
      this.board.removeObject(this.temporaryBoardObjects);
      this.temporaryBoardObjects = [];
    }
  }

  protected handleBoardClick(point: Point) {
    this.player.emit('boardClick', point);

    const moves = this.player.getVariations();
    if (moves.length > 1) {
      const ind = moves.findIndex(move => move && move.x === point.x && move.y === point.y);

      if (ind >= 0) {
        if (this.player.shouldShowCurrentVariations()) {
          this.player.previous();
          this.player.next(ind);
        } else {
          this.player.next(ind);
        }
      }
    }
  }

  protected handleBoardMouseMove(point: Point) {
    this.player.emit('boardMouseMove', point);
    this.handleVariationCursor(point.x, point.y, this.player.getVariations());
  }

  protected handleBoardMouseOut() {
    this.player.emit('boardMouseOut');
    this.removeVariationCursor();
  }

  private handleVariationCursor(x: number, y: number, moves: Point[]) {
    if (moves.length > 1) {
      const ind = moves.findIndex(move => move && move.x === x && move.y === y);

      if (ind >= 0) {
        this.boardElement.style.cursor = 'pointer';
        return;
      }
    }

    this.removeVariationCursor();
  }

  private removeVariationCursor() {
    if (this.boardElement.style.cursor) {
      this.boardElement.style.cursor = '';
    }
  }

  private applyNodeChanges() {
    this.updateStones();
    this.addVariationMarkup();
  }

  private clearNodeChanges() {
    this.clearTemporaryBoardObjects();
    this.removeVariationCursor();
  }

  private applyMarkupProperty(event: LifeCycleEvent<Point[]>) {
    const objects: BoardObject<any>[] = [];

    event.value.forEach((value) => {
      // add markup
      const boardMarkup = new BoardMarkupObject(event.propIdent, this.player.game.getStone(value.x, value.y));
      boardMarkup.zIndex = 10;
      this.board.addObjectAt(value.x, value.y, boardMarkup);
      objects.push(boardMarkup);
    });

    this.propertiesData.set(event.propIdent, objects);
  }

  private applyLabelMarkupProperty(event: LifeCycleEvent<Label[]>) {
    const objects: BoardObject<any>[] = [];

    event.value.forEach((value) => {
      // add markup
      const boardMarkup = new BoardLabelObject(value.text, this.player.game.getStone(value.x, value.y));
      boardMarkup.zIndex = 10;
      this.board.addObjectAt(value.x, value.y, boardMarkup);
      objects.push(boardMarkup);
    });

    this.propertiesData.set(event.propIdent, objects);
  }

  private applyLineMarkupProperty(event: LifeCycleEvent<Vector[]>) {
    const objects: BoardObject<any>[] = [];

    event.value.forEach((value) => {
      // add markup
      const boardMarkup = new BoardLineObject(event.propIdent, value[0], value[1]);
      boardMarkup.zIndex = 10;
      this.board.addObject(boardMarkup);
      objects.push(boardMarkup);
    });

    this.propertiesData.set(event.propIdent, objects);
  }

  private clearMarkupProperty(event: LifeCycleEvent<Point[]>) {
    this.board.removeObject(this.propertiesData.get(event.propIdent));
    this.propertiesData.clear(event.propIdent);
  }

  private applyViewportProperty(event: LifeCycleEvent<Vector>) {
    const currentViewport = this.board.getViewport();

    if (event.value) {
      const minX = Math.min(event.value[0].x, event.value[1].x);
      const minY = Math.min(event.value[0].y, event.value[1].y);
      const maxX = Math.max(event.value[0].x, event.value[1].x);
      const maxY = Math.max(event.value[0].y, event.value[1].y);

      this.board.setViewport({
        left: minX,
        top: minY,
        right: this.board.getSize() - maxX - 1,
        bottom: this.board.getSize() - maxY - 1,
      });
    } else {
      this.board.setViewport({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      });
    }

    this.propertiesData.set(event.propIdent, currentViewport);
  }

  private clearViewportProperty(event: LifeCycleEvent<Vector>) {
    this.board.setViewport(this.propertiesData.get(event.propIdent));
    this.propertiesData.clear(event.propIdent, null);
  }

  private applyMoveProperty(event: LifeCycleEvent<Point>) {
    if (this.player.config.highlightCurrentMove) {
      const variationsMarkup = this.player.getVariations().length > 1 && this.player.shouldShowCurrentVariations();
      if (isThereMarkup(event.value, this.player.currentNode.properties) || variationsMarkup) {
        return;
      }

      // add current move mark
      const boardMarkup = new BoardMarkupObject(
        event.propIdent === 'B' ? this.player.config.currentMoveBlackMark : this.player.config.currentMoveWhiteMark,
      );
      boardMarkup.zIndex = 10;
      this.board.addObjectAt(event.value.x, event.value.y, boardMarkup);

      this.propertiesData.set(event.propIdent, boardMarkup);
    }
  }

  private clearMoveProperty(event: LifeCycleEvent<Vector>) {
    const propertyData = this.propertiesData.get(event.propIdent);
    if (propertyData) {
      this.board.removeObject(propertyData);
    }
    this.propertiesData.clear(event.propIdent);
  }

  addTemporaryBoardObject(x: number, y: number, obj: FieldObject<any>) {
    this.temporaryBoardObjects.push(obj);
    this.board.addObjectAt(x, y, obj);
  }

  removeTemporaryBoardObject(obj: FieldObject<any>) {
    this.temporaryBoardObjects = this.temporaryBoardObjects.filter(o => o !== obj);
    this.board.removeObject(obj);
  }
}

function samePoint(p1: Point, p2: any) {
  return p2 && p1.x === p2.x && p1.y === p2.y;
}

function isThereMarkup(field: Point, properties: { [key: string]: any }) {
  const propIdents = Object.keys(properties);

  for (let i = 0; i < propIdents.length; i++) {
    if (propIdents[i] === 'B' || propIdents[i] === 'W') {
      continue;
    }

    const value = properties[propIdents[i]];
    if (Array.isArray(value)) {
      for (let j = 0; j < value.length; j++) {
        if (samePoint(field, value[j])) {
          return true;
        }
      }
    } else if (samePoint(field, value)) {
      return true;
    }
  }

  return false;
}
