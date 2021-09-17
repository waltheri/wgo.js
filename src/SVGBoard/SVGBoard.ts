import { BoardBase, BoardViewport } from '../BoardBase';
import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import createGrid from './createGrid';
import createCoordinates from './createCoordinates';
import {
  SVGBoardConfig,
  SVG_NS,
  SVG_OBJECTS,
  BoardObjectSVGElements,
  SVG_GRID_MASK,
  SVG_SHADOWS,
  SVGBoardObject,
} from './types';
import { defaultBoardBaseConfig } from '../BoardBase/defaultConfig';
import defaultSVGTheme from './defaultSVGTheme';
import generateId from './generateId';
import { Point } from '../types';

const svgBoardDefaultConfig: SVGBoardConfig = {
  ...defaultBoardBaseConfig,
  theme: defaultSVGTheme,
};

export default class SVGBoard extends BoardBase {
  config: SVGBoardConfig;
  boardElement: HTMLElement;
  touchArea: HTMLElement;
  svgElement: SVGElement;
  defsElement: SVGElement;
  objects: SVGBoardObject[] = [];
  objectsElementMap: Map<SVGBoardObject, BoardObjectSVGElements>;
  top: number;
  left: number;
  bottom: number;
  right: number;

  /** Drawing contexts - elements to put additional board objects. Similar to layers. */
  contexts: {
    [key: string]: SVGElement;
  } = {};

  constructor (elem: HTMLElement, config: PartialRecursive<SVGBoardConfig> = {}) {
    super(elem, makeConfig(svgBoardDefaultConfig, config));

    this.boardElement = document.createElement('div');
    this.boardElement.style.display = 'inline-block';
    this.boardElement.style.position = 'relative';
    this.boardElement.style.verticalAlign = 'middle';
    this.boardElement.style.userSelect = 'none';
    this.element.appendChild(this.boardElement);

    this.touchArea = document.createElement('div');
    this.touchArea.style.position = 'absolute';
    this.touchArea.style.top = '0';
    this.touchArea.style.left = '0';
    this.touchArea.style.bottom = '0';
    this.touchArea.style.right = '0';
    this.touchArea.style.zIndex = '1';
    this.touchArea.style.borderTop = '#F0E7A7 solid 1px';
    this.touchArea.style.borderRight = '#D1A974 solid 1px';
    this.touchArea.style.borderLeft = '#CCB467 solid 1px';
    this.touchArea.style.borderBottom = '#665926 solid 1px';
    this.boardElement.appendChild(this.touchArea);

    this.svgElement = document.createElementNS(SVG_NS, 'svg');
    this.svgElement.style.display = 'block';
    this.boardElement.appendChild(this.svgElement);

    this.defsElement = document.createElementNS(SVG_NS, 'defs');
    this.svgElement.appendChild(this.defsElement);

    this.setViewport();
    this.resize();
    this.redraw();
  }

  resize() {
    if (this.config.width && this.config.height) {
      this.boardElement.style.width = '';
      this.svgElement.style.width = `${this.config.width}px`;
      this.svgElement.style.height = `${this.config.height}px`;
    } else if (this.config.width) {
      this.boardElement.style.width = '';
      this.svgElement.style.width = `${this.config.width}px`;
      this.svgElement.style.height = 'auto';
    } else if (this.config.height) {
      this.boardElement.style.width = '';
      this.svgElement.style.width = 'auto';
      this.svgElement.style.height = `${this.config.height}px`;
    } else {
      this.boardElement.style.width = '100%';
      this.svgElement.style.width = '100%';
      this.svgElement.style.height = 'auto';
    }
  }

  redraw() {
    this.svgElement.style.backgroundColor = this.config.theme.backgroundColor;

    if (this.config.theme.backgroundImage) {
      this.svgElement.style.backgroundImage = `url('${this.config.theme.backgroundImage}')`;
    } else {
      this.svgElement.style.backgroundImage = '';
    }

    this.drawGrid();
    this.drawCoordinates();
    this.drawObjects();
  }

  drawGrid() {
    if (this.contexts[SVG_GRID_MASK]) {
      this.svgElement.removeChild(this.contexts[SVG_GRID_MASK]);
    }

    if (this.contexts.gridElement) {
      this.svgElement.removeChild(this.contexts.gridElement);
    }

    // create grid mask
    const size = this.getSize();
    this.contexts[SVG_GRID_MASK] = document.createElementNS(SVG_NS, 'mask');
    this.contexts[SVG_GRID_MASK].id = generateId('mask');
    this.contexts[SVG_GRID_MASK].innerHTML = `<rect x="-0.5" y="-0.5" width="${size.x}" height="${size.y}" fill="white" />`;
    this.svgElement.appendChild(this.contexts[SVG_GRID_MASK]);

    // create grid
    this.contexts.gridElement = createGrid(this);
    this.contexts.gridElement.setAttribute('mask', `url(#${this.contexts[SVG_GRID_MASK].id})`);
    this.svgElement.appendChild(this.contexts.gridElement);
  }

  drawCoordinates() {
    if (this.contexts.coordinatesElement) {
      this.svgElement.removeChild(this.contexts.coordinatesElement);
    }

    this.contexts.coordinatesElement = createCoordinates(this);
    this.contexts.coordinatesElement.style.opacity = this.config.coordinates ? '' : '0';
    this.svgElement.appendChild(this.contexts.coordinatesElement);
  }

  drawObjects() {
    // remove old shadows layer
    if (this.contexts[SVG_SHADOWS]) {
      this.svgElement.removeChild(this.contexts[SVG_SHADOWS]);
    }

    // remove old objects layer
    if (this.contexts[SVG_OBJECTS]) {
      this.svgElement.removeChild(this.contexts[SVG_OBJECTS]);
    }

    // append new shadows layer
    this.contexts[SVG_SHADOWS] = document.createElementNS(SVG_NS, 'g');
    this.svgElement.appendChild(this.contexts[SVG_SHADOWS]);

    // append new object layer
    this.contexts[SVG_OBJECTS] = document.createElementNS(SVG_NS, 'g');
    this.svgElement.appendChild(this.contexts[SVG_OBJECTS]);

    // prepare map for objects and add all objects
    this.objectsElementMap = new Map();
    this.objects.forEach(boardObject => this.createObjectElements(boardObject));
  }

  addObject(boardObject: SVGBoardObject | SVGBoardObject[]) {
    super.addObject(boardObject);

    if (!Array.isArray(boardObject)) {
      if (this.objectsElementMap.get(boardObject)) {
        // already added - just redraw it
        this.updateObject(boardObject);
        return;
      }

      this.createObjectElements(boardObject);
    }
  }

  protected createObjectElements(boardObject: SVGBoardObject) {
    const handler = this.getObjectHandler(boardObject);

    // create element or elements and add them to the svg
    const elem = handler.createElement(this.config, (def: SVGElement) => this.defsElement.appendChild(def));
    let elements: BoardObjectSVGElements;

    if (elem instanceof SVGElement) {
      elements = { [SVG_OBJECTS]: elem };
    } else {
      elements = elem;
    }
    this.objectsElementMap.set(boardObject, elements);
    Object.keys(elements).forEach(key => this.contexts[key].appendChild(elements[key]));

    handler.updateElement(elements, boardObject, this.config);
  }

  getObjectHandler(boardObject: SVGBoardObject) {
    return 'handler' in boardObject ? boardObject.handler : this.config.theme.drawHandlers[boardObject.type];
  }

  removeObject(boardObject: SVGBoardObject | SVGBoardObject[]) {
    super.removeObject(boardObject);

    if (!Array.isArray(boardObject)) {
      const elements = this.objectsElementMap.get(boardObject);
      if (elements) {
        this.objectsElementMap.delete(boardObject);
        Object.keys(elements).forEach(key => this.contexts[key].removeChild(elements[key]));
      }
    }
  }

  updateObject(boardObject: SVGBoardObject | SVGBoardObject[]) {
    // handling multiple objects
    if (Array.isArray(boardObject)) {
      for (let i = 0; i < boardObject.length; i++) {
        this.updateObject(boardObject[i]);
      }
      return;
    }

    const elements = this.objectsElementMap.get(boardObject);

    if (!elements) {
      // updated object isn't on board - ignore, add or warning?
      return;
    }

    const handler = this.getObjectHandler(boardObject);
    handler.updateElement(elements, boardObject, this.config);
  }

  setViewport(viewport: BoardViewport = this.config.viewport) {
    super.setViewport(viewport);

    const { coordinates, theme } = this.config;
    const size = this.getSize();
    const {
      marginSize,
      coordinates: {
        fontSize,
        top: coordinatesTop,
        left: coordinatesLeft,
        bottom: coordinatesBottom,
        right: coordinatesRight,
      },
    } = theme;

    this.top = viewport.top - 0.5 - (coordinates && coordinatesTop && !viewport.top ? fontSize : 0) - marginSize;
    this.left = viewport.left - 0.5 - (coordinates && coordinatesLeft && !viewport.left ? fontSize : 0) - marginSize;
    // tslint:disable-next-line:max-line-length
    this.bottom = size.y - 0.5 - this.top - viewport.bottom + (coordinates && coordinatesBottom && !viewport.bottom ? fontSize : 0) + marginSize;
    // tslint:disable-next-line:max-line-length
    this.right = size.x - 0.5 - this.left - viewport.right + (coordinates && coordinatesRight && !viewport.right ? fontSize : 0) + marginSize;
    this.svgElement.setAttribute('viewBox', `${this.left} ${this.top} ${this.right} ${this.bottom}`);
  }

  setSize(sizeX: number = 19, sizeY = sizeX) {
    super.setSize(sizeX, sizeY);
    this.setViewport();
    this.redraw();
  }

  setCoordinates(coordinates: boolean) {
    super.setCoordinates(coordinates);
    this.contexts.coordinatesElement.style.opacity = this.config.coordinates ? '' : '0';
    this.setViewport();
  }

  on(type: string, callback: (event: UIEvent, point: Point) => void) {
    super.on(type, callback);
    this.registerBoardListener(type);
  }

  registerBoardListener(type: string) {
    this.touchArea.addEventListener(type, (evt) => {
      if ((evt as any).layerX != null) {
        const pos = this.getRelativeCoordinates((evt as any).layerX, (evt as any).layerY);
        this.emit(type, evt, pos);
      } else {
        this.emit(type, evt);
      }
    });
  }

  getRelativeCoordinates(absoluteX: number, absoluteY: number) {
    // new hopefully better translation of coordinates

    const fieldWidth = this.touchArea.offsetWidth / (this.right);
    const fieldHeight = this.touchArea.offsetHeight / (this.bottom);

    const x = Math.round((absoluteX / fieldWidth + this.left));
    const y = Math.round((absoluteY / fieldHeight + this.top));
    const size = this.getSize();

    if (x < 0 || x >= size.x || y < 0 || y >= size.y) {
      return null;
    }

    return { x, y };
  }
}
