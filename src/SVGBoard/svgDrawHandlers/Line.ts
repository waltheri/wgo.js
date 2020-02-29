import { SVGBoardConfig, NS, SVGDrawHandler, BoardObjectSVGElements, OBJECTS, GRID_MASK } from '../types';
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
    const line = document.createElementNS(NS, 'line');
    const mask = document.createElementNS(NS, 'line');

    return {
      [OBJECTS]: line,
      [GRID_MASK]: mask,
    };
  }

  updateElement(elem: BoardObjectSVGElements, boardObject: BoardLineObject<SVGDrawHandler>, config: SVGBoardConfig) {
    elem[OBJECTS].setAttribute('stroke', this.params.color || config.theme.markupNoneColor);
    elem[OBJECTS].setAttribute('stroke-width', this.params.lineWidth || config.theme.markupLineWidth as any);
    elem[OBJECTS].setAttribute('x1', boardObject.start.x as any);
    elem[OBJECTS].setAttribute('y1', boardObject.start.y as any);
    elem[OBJECTS].setAttribute('x2', boardObject.end.x as any);
    elem[OBJECTS].setAttribute('y2', boardObject.end.y as any);

    elem[GRID_MASK].setAttribute('stroke', `rgba(0,0,0,${config.theme.markupGridMask})`);
    elem[GRID_MASK].setAttribute('stroke-width', (this.params.lineWidth || config.theme.markupLineWidth) * 2 as any);
    elem[GRID_MASK].setAttribute('x1', boardObject.start.x as any);
    elem[GRID_MASK].setAttribute('y1', boardObject.start.y as any);
    elem[GRID_MASK].setAttribute('x2', boardObject.end.x as any);
    elem[GRID_MASK].setAttribute('y2', boardObject.end.y as any);
  }
}
