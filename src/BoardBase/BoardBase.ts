import EventEmitter from '../utils/EventEmitter';
import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import { Board, BoardBaseConfig, BoardViewport } from './types';
import { BoardObject } from '.';
import FieldObject from './FieldObject';
import { defaultBoardBaseConfig } from './defaultConfig';

// tslint:disable-next-line:max-line-length
export default class BoardBase<T> extends EventEmitter implements Board<T> {
  config: BoardBaseConfig;
  element: HTMLElement;
  objects: BoardObject<T>[] = [];

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

    if (this.objects.indexOf(boardObject) === -1) {
      this.objects.push(boardObject);
    }
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
  }

  getSize() {
    return this.config.size;
  }

  setSize(size: number = 19) {
    this.config.size = size;
  }

  getCoordinates() {
    return this.config.coordinates;
  }

  setCoordinates(coordinates: boolean) {
    this.config.coordinates = coordinates;
  }
}
