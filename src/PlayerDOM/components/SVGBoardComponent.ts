import { SVGBoard } from '../../SVGBoard';
import {
  FieldBoardObject,
  LabelBoardObject,
  MarkupBoardObject,
  BoardObject,
  LineBoardObject,
  BoardViewport,
} from '../../BoardBase';
import { Color, Point, Label, Vector } from '../../types';
import { LifeCycleEvent } from '../../PlayerBase/types';
import { SVGBoardObject, SVGDrawHandler, SVGBoardTheme } from '../../SVGBoard/types';
import SVGCustomFieldBoardObject from '../../SVGBoard/SVGCustomFieldBoardObject';
import SVGCustomLabelBoardObject from '../../SVGBoard/SVGCustomLabelBoardObject';
import makeConfig, { PartialRecursive } from '../../utils/makeConfig';
import { Circle, Label as SVGLabel } from '../../SVGBoard/svgDrawHandlers';
import PlayerDOMComponent from './PlayerDOMComponent';
import PlayerDOM from '../PlayerDOM';
import { PropIdent } from '../../SGFParser/sgfTypes';

const colorsMap: { [key: string]: Color } = {
  B: Color.BLACK,
  W: Color.WHITE,
};

export interface SVGBoardComponentConfig {
  coordinates: boolean;
  currentMoveBlackMark: SVGDrawHandler;
  currentMoveWhiteMark: SVGDrawHandler;
  variationDrawHandler: SVGDrawHandler;
  highlightCurrentMove: boolean;
  showVariations: boolean;
  showCurrentVariations: boolean;
  theme?: PartialRecursive<SVGBoardTheme>;
}

export const defaultSVGBoardComponentConfig: SVGBoardComponentConfig = {
  coordinates: true,
  currentMoveBlackMark: new Circle({ color: 'rgba(255,255,255,0.8)', fillColor:'rgba(0,0,0,0)' }),
  currentMoveWhiteMark: new Circle({ color: 'rgba(0,0,0,0.8)', fillColor:'rgba(0,0,0,0)' }),
  variationDrawHandler: new SVGLabel({ color: '#33f' }),
  highlightCurrentMove: true,
  showVariations: true,
  showCurrentVariations: false,
};

export default class SVGBoardComponent implements PlayerDOMComponent {
  // Underlying SVG board object
  board: SVGBoard;
  config: SVGBoardComponentConfig;
  element: HTMLElement;
  player: PlayerDOM;

  // Current board objects for stones - should match the position object of the game
  stoneBoardsObjects: FieldBoardObject[];

  // Temporary board object, will be removed after each node update
  temporaryBoardObjects: SVGBoardObject[];

  // Board viewport stack, for efficient reverting of board viewport
  viewportStack: BoardViewport[];

  boardMouseX: number;
  boardMouseY: number;

  constructor(config: PartialRecursive<SVGBoardComponentConfig> = {}) {
    this.config = makeConfig(defaultSVGBoardComponentConfig, config);
    this.viewportStack = [];

    this.beforeInitSZ = this.beforeInitSZ.bind(this);
    this.applyNodeChanges = this.applyNodeChanges.bind(this);
    this.clearNodeChanges = this.clearNodeChanges.bind(this);
    this.applyMarkupProperty = this.applyMarkupProperty.bind(this);
    this.applyLabelMarkupProperty = this.applyLabelMarkupProperty.bind(this);
    this.applyLineMarkupProperty = this.applyLineMarkupProperty.bind(this);
    this.applyViewportProperty = this.applyViewportProperty.bind(this);
    this.clearViewportProperty = this.clearViewportProperty.bind(this);
    this.applyMoveProperty = this.applyMoveProperty.bind(this);
    this.addTemporaryBoardObject = this.addTemporaryBoardObject.bind(this);
    this.removeTemporaryBoardObject = this.removeTemporaryBoardObject.bind(this);
    this.updateTemporaryBoardObject = this.updateTemporaryBoardObject.bind(this);
    this.setCoordinates = this.setCoordinates.bind(this);

    this.createDOM();
  }

  createDOM() {
    this.element = document.createElement('div');
    this.element.className = 'wgo-player__board';

    this.stoneBoardsObjects = [];
    this.temporaryBoardObjects = [];

    this.board = new SVGBoard(this.element, {
      coordinates: this.config.coordinates,
      theme: this.config.theme,
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
  }

  create(player: PlayerDOM) {
    this.player = player;

    // set size during kifu load
    this.player.on('beforeInit.SZ', this.beforeInitSZ); 

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

    // viewport SGF property listeners
    this.player.on('applyGameChanges.VW', this.applyViewportProperty);
    this.player.on('clearGameChanges.VW', this.clearViewportProperty);

    // add current move marker
    this.player.on('applyNodeChanges.B', this.applyMoveProperty);
    this.player.on('applyNodeChanges.W', this.applyMoveProperty);

    this.player.on('board.addTemporaryObject', this.addTemporaryBoardObject);
    this.player.on('board.removeTemporaryObject', this.removeTemporaryBoardObject);
    this.player.on('board.updateTemporaryObject', this.updateTemporaryBoardObject);
    this.player.on('board.setCoordinates', this.setCoordinates);
  }

  destroy() {
    this.player.off('beforeInit.SZ', this.beforeInitSZ);
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

    this.player.off('applyGameChanges.VW', this.applyViewportProperty);
    this.player.off('clearGameChanges.VW', this.clearViewportProperty);

    this.player.off('applyNodeChanges.B', this.applyMoveProperty);
    this.player.off('applyNodeChanges.W', this.applyMoveProperty);

    this.player.off('board.addTemporaryObject', this.addTemporaryBoardObject);
    this.player.off('board.removeTemporaryObject', this.removeTemporaryBoardObject);
    this.player.off('board.updateTemporaryObject', this.updateTemporaryBoardObject);
    this.player.off('board.setCoordinates', this.setCoordinates);

    this.player = null;
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

    for (let x = 0; x < position.sizeX; x++) {
      for (let y = 0; y < position.sizeY; y++) {
        const c = position.get(x, y);
        if (c && !this.stoneBoardsObjects.some(
          boardObject => boardObject.x === x && boardObject.y === y && c === colorsMap[boardObject.type as string],
        )) {
          const boardObject = new FieldBoardObject(c === Color.B ? 'B' : 'W', x, y);
          this.board.addObject(boardObject);
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
          const obj = new SVGCustomLabelBoardObject(String.fromCodePoint(65 + i), move.x, move.y);
          obj.handler = this.config.variationDrawHandler;
          this.addTemporaryBoardObject(obj);
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
    this.player.emit('board.click', point);

    const moves = this.getVariations();
    if (moves.length > 1) {
      const ind = moves.findIndex(move => move && move.x === point.x && move.y === point.y);

      if (ind >= 0) {
        if (this.shouldShowCurrentVariations()) {
          this.player.previous();
          this.player.next(ind);
        } else {
          this.player.next(ind);
        }
      }
    }
  }

  protected handleBoardMouseMove(point: Point) {
    this.player.emit('board.mouseMove', point);
    this.handleVariationCursor(point.x, point.y, this.getVariations());
  }

  protected handleBoardMouseOut() {
    this.player.emit('board.mouseOut');
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

  private beforeInitSZ(event: LifeCycleEvent<number[]>) {
    const [x, y] = event.value;

    this.board.setSize(x, y);
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
    event.value.forEach((value) => {
      // add markup
      const boardMarkup = new MarkupBoardObject(
        event.propIdent,
        value.x,
        value.y,
        this.player.game.getStone(value.x, value.y),
      );
      boardMarkup.zIndex = 10;
      this.addTemporaryBoardObject(boardMarkup);
    });
  }

  private applyLabelMarkupProperty(event: LifeCycleEvent<Label[]>) {
    event.value.forEach((value) => {
      // add markup
      const boardMarkup = new LabelBoardObject(
        value.text,
        value.x,
        value.y,
        this.player.game.getStone(value.x, value.y),
      );
      boardMarkup.zIndex = 10;
      this.addTemporaryBoardObject(boardMarkup);
    });
  }

  private applyLineMarkupProperty(event: LifeCycleEvent<Vector[]>) {
    event.value.forEach((value) => {
      // add markup
      const boardMarkup = new LineBoardObject(event.propIdent, value[0], value[1]);
      boardMarkup.zIndex = 10;
      this.addTemporaryBoardObject(boardMarkup);
    });
  }

  private applyViewportProperty(event: LifeCycleEvent<Vector>) {
    const currentViewport = this.board.getViewport();
    this.viewportStack.push(currentViewport);

    if (event.value) {
      const minX = Math.min(event.value[0].x, event.value[1].x);
      const minY = Math.min(event.value[0].y, event.value[1].y);
      const maxX = Math.max(event.value[0].x, event.value[1].x);
      const maxY = Math.max(event.value[0].y, event.value[1].y);
      const size = this.board.getSize();

      this.board.setViewport({
        left: minX,
        top: minY,
        right: size.x - maxX - 1,
        bottom: size.y - maxY - 1,
      });
    } else {
      this.board.setViewport({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      });
    }
  }

  private clearViewportProperty() {
    const previousViewport = this.viewportStack.pop();
    if (previousViewport) {
      this.board.setViewport(previousViewport);
    }
  }

  private applyMoveProperty(event: LifeCycleEvent<Point>) {
    if (this.config.highlightCurrentMove) {
      if (!event.value) {
        // no markup when pass
        return;
      }
      if (isThereMarkup(event.value, this.player.currentNode.properties)) {
        // don't show current move markup, when there is markup in kifu node
        return;
      }

      if (this.getVariations().length > 1 && this.shouldShowCurrentVariations()) {
        // don't show current move markup, if there is multiple variations and "show current variations" style set
        return;
      }

      // add current move mark
      const boardMarkup = new SVGCustomFieldBoardObject(
        event.propIdent === 'B' ? this.config.currentMoveBlackMark : this.config.currentMoveWhiteMark,
        event.value.x,
        event.value.y,
      );
      boardMarkup.zIndex = 10;
      this.addTemporaryBoardObject(boardMarkup);
    }
  }

  addTemporaryBoardObject(obj: BoardObject) {
    this.temporaryBoardObjects.push(obj);
    this.board.addObject(obj);
  }

  removeTemporaryBoardObject(obj: FieldBoardObject) {
    this.temporaryBoardObjects = this.temporaryBoardObjects.filter(o => o !== obj);
    this.board.removeObject(obj);
  }

  updateTemporaryBoardObject(obj: FieldBoardObject) {
    this.board.updateObject(obj);
  }

  setCoordinates(b: boolean) {
    this.config.coordinates = b;
    this.board.setCoordinates(b);
  }

  getVariations(): Point[] {
    if (this.shouldShowVariations()) {
      if (this.shouldShowCurrentVariations()) {
        if (this.player.currentNode.parent) {
          return this.player.currentNode.parent.children.map(node => node.getProperty('B') || node.getProperty('W'));
        }
      } else {
        return this.player.currentNode.children.map(node => node.getProperty('B') || node.getProperty('W'));
      }
    }
    return [];
  }

  shouldShowVariations() {
    // look in kifu, whether to show variation markup
    const st = this.player.rootNode.getProperty(PropIdent.VariationsStyle);
    if (st != null) {
      return !(st & 2);
    }

    // otherwise use configuration value
    return this.config.showVariations;
  }

  shouldShowCurrentVariations() {
    // in edit mode not possible
    // if (this.editMode) {
    //   return false;
    // }

    // look at variation style in kifu
    const st = this.player.rootNode.getProperty(PropIdent.VariationsStyle);
    if (st != null) {
      return !!(st & 1);
    }

    // or use variation style from configuration
    return this.config.showCurrentVariations;
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
