import { SVGBoardConfig, SVG_NS, SVGDrawHandler, BoardObjectSVGElements, SVG_OBJECTS, SVG_GRID_MASK } from '../types';
import { BoardLineObject } from '../../BoardBase';

interface LineParams {
  color?: string;
  lineWidth?: number;
}

export default class Line implements SVGDrawHandler {
  params: LineParams;

  constructor(params: LineParams = {}) {
    this.params = params;
  }

  createElement() {
    const line = document.createElementNS(SVG_NS, 'line');
    const mask = document.createElementNS(SVG_NS, 'line');

    return {
      [SVG_OBJECTS]: line,
      [SVG_GRID_MASK]: mask,
    };
  }

  updateElement(elem: BoardObjectSVGElements, boardObject: BoardLineObject, config: SVGBoardConfig) {
    elem[SVG_OBJECTS].setAttribute('stroke', this.params.color || config.theme.markupNoneColor);
    elem[SVG_OBJECTS].setAttribute('stroke-width', this.params.lineWidth || config.theme.markupLineWidth as any);
    elem[SVG_OBJECTS].setAttribute('x1', boardObject.start.x as any);
    elem[SVG_OBJECTS].setAttribute('y1', boardObject.start.y as any);
    elem[SVG_OBJECTS].setAttribute('x2', boardObject.end.x as any);
    elem[SVG_OBJECTS].setAttribute('y2', boardObject.end.y as any);

    elem[SVG_GRID_MASK].setAttribute('stroke', `rgba(0,0,0,${config.theme.markupGridMask})`);
    elem[SVG_GRID_MASK].setAttribute('stroke-width', (this.params.lineWidth || config.theme.markupLineWidth) * 2 as any);
    elem[SVG_GRID_MASK].setAttribute('x1', boardObject.start.x as any);
    elem[SVG_GRID_MASK].setAttribute('y1', boardObject.start.y as any);
    elem[SVG_GRID_MASK].setAttribute('x2', boardObject.end.x as any);
    elem[SVG_GRID_MASK].setAttribute('y2', boardObject.end.y as any);
  }
}
