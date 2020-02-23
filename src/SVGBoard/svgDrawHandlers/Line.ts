import { SVGBoardConfig, NS, SVGDrawHandler } from '../types';
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

  init(): SVGElement {
    return null;
  }

  createElement(config: SVGBoardConfig) {
    const line = document.createElementNS(NS, 'line');

    return line;
  }

  updateElement(elem: SVGLineElement, boardObject: BoardLineObject<SVGDrawHandler>, config: SVGBoardConfig) {
    elem.setAttribute('stroke', this.params.color || config.theme.markupNoneColor);
    elem.setAttribute('stroke-width', this.params.lineWidth || config.theme.markupLineWidth as any);
    elem.setAttribute('x1', boardObject.start.x as any);
    elem.setAttribute('y1', boardObject.start.y as any);
    elem.setAttribute('x2', boardObject.end.x as any);
    elem.setAttribute('y2', boardObject.end.y as any);
  }
}
