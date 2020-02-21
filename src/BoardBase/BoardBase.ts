import EventEmitter from '../utils/EventEmitter';
import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import { Board, BoardBaseConfig, BoardViewport } from './types';
import { BoardObject } from '.';
import FieldObject from './FieldObject';

const defaultBoardBaseConfig = {
  size: 19,
  width: 0,
  height: 0,
  starPoints: {
    5: [{ x: 2, y: 2 }],
    7: [{ x: 3, y: 3 }],
    8: [{ x: 2, y: 2 }, { x: 5, y: 2 }, { x: 2, y: 5 }, { x: 5, y: 5 }],
    9: [{ x: 2, y: 2 }, { x: 6, y: 2 }, { x: 4, y: 4 }, { x: 2, y: 6 }, { x: 6, y: 6 }],
    10: [{ x: 2, y: 2 }, { x: 7, y: 2 }, { x: 2, y: 7 }, { x: 7, y: 7 }],
    11: [{ x: 2, y: 2 }, { x: 8, y: 2 }, { x: 5, y: 5 }, { x: 2, y: 8 }, { x: 8, y: 8 }],
    12: [{ x: 3, y: 3 }, { x: 8, y: 3 }, { x: 3, y: 8 }, { x: 8, y: 8 }],
    13: [{ x: 3, y: 3 }, { x: 9, y: 3 }, { x: 6, y: 6 }, { x: 3, y: 9 }, { x: 9, y: 9 }],
    14: [{ x: 3, y: 3 }, { x: 10, y: 3 }, { x: 3, y: 10 }, { x: 10, y: 10 }],
    15: [{ x: 3, y: 3 }, { x: 11, y: 3 }, { x: 7, y: 7 }, { x: 3, y: 11 }, { x: 11, y: 11 }],
    16: [{ x: 3, y: 3 }, { x: 12, y: 3 }, { x: 3, y: 12 }, { x: 12, y: 12 }],
    17: [{ x: 3, y: 3 }, { x: 8, y: 3 }, { x: 13, y: 3 }, { x: 3, y: 8 }, { x: 8, y: 8 },
    { x: 13, y: 8 }, { x: 3, y: 13 }, { x: 8, y: 13 }, { x: 13, y: 13 }],
    18: [{ x: 3, y: 3 }, { x: 14, y: 3 }, { x: 3, y: 14 }, { x: 14, y: 14 }],
    19: [{ x: 3, y: 3 }, { x: 9, y: 3 }, { x: 15, y: 3 }, { x: 3, y: 9 }, { x: 9, y: 9 },
    { x: 15, y: 9 }, { x: 3, y: 15 }, { x: 9, y: 15 }, { x: 15, y: 15 }],
    20: [{ x: 3, y: 3 }, { x: 16, y: 3 }, { x: 3, y: 16 }, { x: 16, y: 16 }],
    21: [{ x: 3, y: 3 }, { x: 10, y: 3 }, { x: 17, y: 3 }, { x: 3, y: 10 }, { x: 10, y: 10 },
    { x: 17, y: 10 }, { x: 3, y: 17 }, { x: 10, y: 17 }, { x: 17, y: 17 }],
  },
  viewport: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  coordinates: false,
};

export default class BoardBase<T> extends EventEmitter implements Board<T> {
  config: BoardBaseConfig;
  element: HTMLElement;
  // boardElement: HTMLElement;
  objects: BoardObject<T>[] = [];

  // following props are computed in resize() method for performance
  // width: number;
  // height: number;
  // leftOffset: number;
  // topOffset: number;
  // fieldSize: number;

  constructor(element: HTMLElement, config: PartialRecursive<BoardBaseConfig> = {}) {
    super();

    // merge user config with default
    this.element = element;
    this.config = makeConfig(defaultBoardBaseConfig, config);
  }

  /**
   * Updates dimensions and redraws everything
   */
  resize() {
    // subclass may do resize things here
  }

  /**
   * Redraw everything.
   */
  redraw() {
    // subclass should implement this
  }

  /**
   * Add board object. Main function for adding graphics on the board.
   *
   * @param boardObject
   */
  addObject(boardObject: BoardObject<T> | BoardObject<T>[]) {
    // handling multiple objects
    if (Array.isArray(boardObject)) {
      for (let i = 0; i < boardObject.length; i++) {
        this.addObject(boardObject[i]);
      }
      return;
    }

    // if (typeof boardObject.type === 'string') {
    //   if (!this.config.theme.drawHandlers[boardObject.type]) {
    //  throw new TypeError(`Board object type "${boardObject.type}" doesn't exist in \`config.theme.drawHandlers\`.`);
    //   }
    // } else {
    //   if (boardObject.type == null || !(boardObject.type instanceof DrawHandler)) {
    //     throw new TypeError('Invalid board object type.');
    //   }
    // }

    this.objects.push(boardObject);
    this.redraw();
  }

  /**
   * Shortcut method to add object and set its position.
   */
  addObjectAt(x: number, y: number, boardObject: FieldObject<T>) {
    boardObject.setPosition(x, y);
    this.addObject(boardObject);
  }

  /**
   * Remove board object. Main function for removing graphics on the board.
   *
   * @param boardObject
   */
  removeObject(boardObject: BoardObject<T> | BoardObject<T>[]) {
    // handling multiple objects
    if (Array.isArray(boardObject)) {
      for (let i = 0; i < boardObject.length; i++) {
        this.removeObject(boardObject[i]);
      }
      return;
    }

    const objectPos = this.objects.indexOf(boardObject);

    if (objectPos === -1) {
      // object isn't on the board, ignore it
      return;
    }

    this.objects.splice(objectPos, 1);
    this.redraw();
  }

  removeObjectsAt(x: number, y: number) {
    this.objects.forEach((obj) => {
      if (obj instanceof FieldObject && obj.x === x && obj.y === y) {
        this.removeObject(obj);
      }
    });
  }

  removeAllObjects() {
    this.objects = [];
    this.redraw();
  }

  hasObject(boardObject: BoardObject<T>) {
    return this.objects.indexOf(boardObject) >= 0;
  }

  /**
   * Sets width of the board, height will be automatically computed. Then everything will be redrawn.
   *
   * @param width
   */
  setWidth(width: number) {
    this.config.width = width;
    this.config.height = 0;
    this.resize();
  }

  /**
   * Sets height of the board, width will be automatically computed. Then everything will be redrawn.
   *
   * @param height
   */
  setHeight(height: number) {
    this.config.width = 0;
    this.config.height = height;
    this.resize();
  }

  /**
   * Sets exact dimensions of the board. Then everything will be redrawn.
   *
   * @param width
   * @param height
   */
  setDimensions(width: number, height: number) {
    this.config.width = width;
    this.config.height = height;
    this.resize();
  }

  /**
	 * Get currently visible section of the board
	 */

  getViewport() {
    return this.config.viewport;
  }

  /**
	 * Set section of the board to be displayed
	 */

  setViewport(viewport: BoardViewport) {
    this.config.viewport = viewport;
    this.resize();
  }

  getSize() {
    return this.config.size;
  }

  setSize(size: number = 19) {
    if (size !== this.config.size) {
      this.config.size = size;
      this.resize();
    }
  }

  getCoordinates() {
    return this.config.coordinates;
  }

  setCoordinates(coordinates: boolean) {
    if (this.config.coordinates !== coordinates) {
      this.config.coordinates = coordinates;
      this.resize();
    }
  }
}
