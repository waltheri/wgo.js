import { BoardObject, FieldBoardObject } from '../BoardBase';
import { SVGBoard, SVGBoardObject, SVGDrawHandler, SVGRenderer } from '../SVGBoard';
import SVGCustomFieldBoardObject from '../SVGBoard/SVGCustomFieldBoardObject';
import SVGCustomLabelBoardObject from '../SVGBoard/SVGCustomLabelBoardObject';
import { Editor } from '../editor';
import { KifuNode } from '../kifu';
import { Color, Point } from '../types';

enum VariationMarkupStyle {
  None = 'NONE',
  Siblings = 'SIBLINGS',
  Children = 'CHILDREN',
}

interface SVGBoardComponentConfig {
  coordinates: boolean;
  currentMoveBlackMark: SVGDrawHandler;
  currentMoveWhiteMark: SVGDrawHandler;
  variationDrawHandler: SVGDrawHandler;
  highlightCurrentMove: boolean;
  variationMarkupStyle: VariationMarkupStyle;
  // theme?: PartialRecursive<SVGBoardTheme>;
}

const defaultSVGBoardComponentConfig: SVGBoardComponentConfig = {
  coordinates: true,
  currentMoveBlackMark: new SVGRenderer.Circle({
    color: 'rgba(255,255,255,0.8)',
    fillColor: 'rgba(0,0,0,0)',
  }),
  currentMoveWhiteMark: new SVGRenderer.Circle({
    color: 'rgba(0,0,0,0.8)',
    fillColor: 'rgba(0,0,0,0)',
  }),
  variationDrawHandler: new SVGRenderer.Label({ color: '#33f' }),
  highlightCurrentMove: true,
  variationMarkupStyle: VariationMarkupStyle.Children,
};

/**
 * This class connects SVG board and editor together. It registers all necessary event listeners and updates
 * board accordingly.
 */
export class SVGBoardComponent {
  editor: Editor;
  board: SVGBoard;
  config: SVGBoardComponentConfig;
  element: HTMLElement;
  mousePosition: Point | null = null;

  // Current board objects for stones - should match the position object of the game
  #stoneBoardObjects: FieldBoardObject[];

  // Board object valid just for current node - usually markup and other temporary objects like current move marker.
  #nodeBoardObjects: SVGBoardObject[];

  // Alternative variations for current node
  #variations: KifuNode[] = [];

  // Variation markup style - cached because it is used often
  #variationMarkupStyle: VariationMarkupStyle = VariationMarkupStyle.None;

  #handleGameLoad = () => {
    const { rows, cols } = this.editor.gameState.position;
    this.board.setSize(cols, rows);
    this.#variationMarkupStyle = this.#getVariationMarkupStyle();
  };

  #handleNodeChange = () => {
    this.#variations = this.editor.getVariations();
    this.#removeAllNodeBoardObjects();
    this.#highlightCurrentMove();
    this.#addVariationMarkup();
  };

  #handleGameStateChange = () => {
    this.#updateStones();
  };

  #handleBoardClick = ({ point }) => {
    //this.player.emit('board.click', point);

    this.#selectVariation(point);
  };

  #handleBoardMouseMove = ({ point }) => {
    if (!point) {
      this.mousePosition = null;
      // this.player.emit('board.mouseOut');
      this.#removeVariationCursor();
      return;
    }
    if (
      !this.mousePosition ||
      point.x !== this.mousePosition.x ||
      point.y !== this.mousePosition.y
    ) {
      this.mousePosition = {
        x: point.x,
        y: point.y,
      };
      // this.player.emit('board.mouseMove', point);
      this.#addVariationCursor(point);
    }
  };

  #handleBoardMouseOut = () => {
    if (this.mousePosition != null) {
      this.mousePosition = null;
      // this.player.emit('board.mouseOut');
      this.#removeVariationCursor();
    }
  };

  constructor(editor: Editor, config: SVGBoardComponentConfig = defaultSVGBoardComponentConfig) {
    this.editor = editor;
    this.config = config;
    this.#init();
  }

  destroy() {
    this.editor.off('gameLoad', this.#handleGameLoad);
    this.editor.off('nodeChange', this.#handleNodeChange);
    this.editor.off('gameStateChange', this.#handleGameStateChange);
  }

  render(container: HTMLElement) {
    container.innerHTML = '';
    container.appendChild(this.element);
  }

  addNodeBoardObject(obj: BoardObject) {
    this.#nodeBoardObjects.push(obj);
    this.board.addObject(obj);
  }

  removeNodeBoardObject(obj: BoardObject) {
    this.#nodeBoardObjects = this.#nodeBoardObjects.filter((o) => o !== obj);
    this.board.removeObject(obj);
  }

  #init() {
    this.element = document.createElement('div');
    this.board = new SVGBoard(this.element);

    this.board.on('click', this.#handleBoardClick);
    this.board.on('mousemove', this.#handleBoardMouseMove);
    this.board.on('mouseout', this.#handleBoardMouseOut);

    this.#stoneBoardObjects = [];
    this.#nodeBoardObjects = [];

    this.editor.on('gameLoad', this.#handleGameLoad);
    this.editor.on('nodeChange', this.#handleNodeChange);
    this.editor.on('gameStateChange', this.#handleGameStateChange);
  }

  #updateStones() {
    // Remove missing stones in current position
    this.#stoneBoardObjects = this.#stoneBoardObjects.filter((boardObject) => {
      if (
        this.editor.gameState.position.get(boardObject.x, boardObject.y) !==
        colorsMap[boardObject.type]
      ) {
        this.board.removeObject(boardObject);
        return false;
      }
      return true;
    });

    // Add new stones from current position
    const position = this.editor.gameState.position;

    for (let x = 0; x < position.cols; x++) {
      for (let y = 0; y < position.rows; y++) {
        const c = position.get(x, y);
        if (
          c &&
          !this.#stoneBoardObjects.some(
            (boardObject) =>
              boardObject.x === x &&
              boardObject.y === y &&
              c === colorsMap[boardObject.type as string],
          )
        ) {
          const boardObject = new FieldBoardObject(c === Color.B ? 'B' : 'W', x, y);
          this.board.addObject(boardObject);
          this.#stoneBoardObjects.push(boardObject);
        }
      }
    }
  }

  #removeAllNodeBoardObjects() {
    this.#nodeBoardObjects.forEach((obj) => this.board.removeObject(obj));
    this.#nodeBoardObjects = [];
  }

  #highlightCurrentMove() {
    if (!this.config.highlightCurrentMove) {
      return;
    }
    const { move, markup } = this.editor.currentNode;

    if (!move || !('x' in move)) {
      // move is missing, or pass
      return;
    }

    if (markup.some((m) => 'x' in m && m.x === move.x && m.y === move.y)) {
      // don't show current move markup, when there is markup in kifu node
      return;
    }

    if (
      this.#variations.length > 1 &&
      this.#variationMarkupStyle === VariationMarkupStyle.Siblings
    ) {
      // don't show current move markup, if there is multiple variations and "show current variations" style set
      return;
    }

    // add current move mark
    const boardMarkup = new SVGCustomFieldBoardObject(
      move.c === Color.Black ? this.config.currentMoveBlackMark : this.config.currentMoveWhiteMark,
      move.x,
      move.y,
    );
    boardMarkup.zIndex = 10;
    this.addNodeBoardObject(boardMarkup);
  }

  #getVariationMarkupStyle() {
    const { variationsStyle } = this.editor.kifu.info;

    if (variationsStyle) {
      if (variationsStyle.noMarkup) {
        return VariationMarkupStyle.None;
      }
      if (variationsStyle.currentNode != null) {
        return variationsStyle.currentNode
          ? VariationMarkupStyle.Siblings
          : VariationMarkupStyle.Children;
      }
    }

    return this.config.variationMarkupStyle;
  }

  #addVariationMarkup() {
    if (this.#variationMarkupStyle === VariationMarkupStyle.None || this.#variations.length <= 1) {
      return;
    }

    this.#variations.forEach((node, i) => {
      if (!('x' in node.move!)) {
        return;
      }

      const obj = new SVGCustomLabelBoardObject(
        String.fromCodePoint(65 + i),
        node.move!.x,
        node.move!.y,
      );
      obj.handler = this.config.variationDrawHandler;
      this.addNodeBoardObject(obj);
    });

    if (this.mousePosition) {
      this.#addVariationCursor(this.mousePosition);
    }
  }

  #selectVariation(point: Point) {
    if (this.#variationMarkupStyle === VariationMarkupStyle.None || this.#variations.length <= 1) {
      return;
    }

    const node = this.#findVariation(point);

    if (node) {
      if (this.#variationMarkupStyle === VariationMarkupStyle.Siblings) {
        this.editor.previous();
        this.editor.next(node);
      } else {
        this.editor.next(node);
      }
    }
  }

  #findVariation(point: Point) {
    return this.#variations.find(
      ({ move }) => 'x' in move! && move.x === point.x && move.y === point.y,
    );
  }

  #addVariationCursor(point: Point) {
    if (this.#variationMarkupStyle === VariationMarkupStyle.None || this.#variations.length <= 1) {
      return;
    }

    if (this.#findVariation(point)) {
      this.element.style.cursor = 'pointer';
    } else {
      this.#removeVariationCursor();
    }
  }

  #removeVariationCursor() {
    if (this.element.style.cursor) {
      this.element.style.cursor = '';
    }
  }
}

const colorsMap = {
  B: Color.Black,
  W: Color.White,
} as const;
