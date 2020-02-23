import { BoardBase, BoardViewport, BoardObject, FieldObject } from '../BoardBase';
import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import createGrid from './createGrid';
import createCoordinates from './createCoordinates';
import { SVGDrawHandler, SVGBoardConfig, NS } from './types';
import Circle from './svgDrawHandlers/Circle';
import SVGFieldDrawHandler from './svgDrawHandlers/SVGFieldDrawHandler';
import { defaultBoardBaseConfig } from '../BoardBase/defaultConfig';
import defaultSVGTheme from './defaultSVGTheme';

const svgBoardDefaultConfig: SVGBoardConfig = {
  ...defaultBoardBaseConfig,
  theme: defaultSVGTheme,
};

export default class SVGBoard extends BoardBase<SVGDrawHandler> {
  config: SVGBoardConfig;
  svgElement: SVGElement;
  defsElement: SVGElement;
  gridElement: SVGElement;
  coordinatesElement: SVGElement;
  objectsElementMap: Map<BoardObject<SVGDrawHandler>, SVGElement>;

  constructor (elem: HTMLElement, config: PartialRecursive<SVGBoardConfig> = {}) {
    super(elem, makeConfig(svgBoardDefaultConfig, config));

    this.svgElement = document.createElementNS(NS, 'svg');
    this.svgElement.style.cursor = 'default';
    this.element.appendChild(this.svgElement);

    this.defsElement = document.createElementNS(NS, 'defs');
    this.svgElement.appendChild(this.defsElement);

    this.setViewport();
    this.resize();
    this.redraw();
  }

  resize() {
    if (this.config.width && this.config.height) {
      this.svgElement.style.width = `${this.config.width}px`;
      this.svgElement.style.height = `${this.config.height}px`;
    } else if (this.config.width) {
      this.svgElement.style.width = `${this.config.width}px`;
      this.svgElement.style.height = 'auto';
    } else if (this.config.height) {
      this.svgElement.style.width = 'auto';
      this.svgElement.style.height = `${this.config.height}px`;
    } else {
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
    if (this.gridElement) {
      this.svgElement.removeChild(this.gridElement);
    }

    this.gridElement = createGrid(this.config);
    this.svgElement.appendChild(this.gridElement);
  }

  drawCoordinates() {
    if (this.coordinatesElement) {
      this.svgElement.removeChild(this.coordinatesElement);
    }

    this.coordinatesElement = createCoordinates(this.config);
    this.coordinatesElement.style.opacity = this.config.coordinates ? '' : '0';
    this.svgElement.appendChild(this.coordinatesElement);
  }

  drawObjects() {
    if (this.objectsElementMap) {
      this.objectsElementMap.forEach(elem => this.svgElement.removeChild(elem));
    }
    this.objectsElementMap = new Map();
  }

  addObject(boardObject: BoardObject<SVGDrawHandler> | BoardObject<SVGDrawHandler>[]) {
    super.addObject(boardObject);

    if (!Array.isArray(boardObject)) {
      if (this.objectsElementMap.get(boardObject)) {
        // already added - just redraw it
        return;
      }

      // tslint:disable-next-line:max-line-length
      const handler = typeof boardObject.type === 'string' ? this.config.theme.drawHandlers[boardObject.type] : boardObject.type;

      // create optional definitions for handler
      const def = handler.init(this.config);
      if (def) {
        this.defsElement.appendChild(def);
      }

      // create element and add to the svg
      const elem = handler.createElement(this.config);
      this.objectsElementMap.set(boardObject, elem);
      this.svgElement.appendChild(elem);

      // set elements params according to the board object
      handler.updateElement(elem, boardObject, this.config);
    }
  }

  setViewport(viewport: BoardViewport = this.config.viewport) {
    super.setViewport(viewport);

    const { coordinates, theme, size } = this.config;
    const { marginSize } = theme;
    const { fontSize } = theme.coordinates;

    const top = viewport.top - 0.5 - (coordinates && !viewport.top ? fontSize : 0) - marginSize;
    const left = viewport.left - 0.5 - (coordinates && !viewport.left ? fontSize : 0) - marginSize;
    const bottom = size - 0.5 - top - viewport.bottom + (coordinates && !viewport.bottom ? fontSize : 0) + marginSize;
    const right = size - 0.5 - left - viewport.right + (coordinates && !viewport.right ? fontSize : 0) + marginSize;
    this.svgElement.setAttribute('viewBox', `${left} ${top} ${right} ${bottom}`);
  }

  setSize(size: number = 19) {
    super.setSize(size);
    this.drawGrid();
    this.drawCoordinates();
    this.setViewport();
  }

  setCoordinates(coordinates: boolean) {
    super.setCoordinates(coordinates);
    this.coordinatesElement.style.opacity = this.config.coordinates ? '' : '0';
    this.setViewport();
  }
}
