import { SVGBoardConfig, SVG_NS, SVGDrawHandler, SVG_OBJECTS, BoardObjectSVGElements, SVG_GRID_MASK } from '../types';
import { LineBoardObject } from '../../BoardBase';

interface LineParams {
  color?: string;
  lineWidth?: number;
}

export default class Arrow implements SVGDrawHandler {
  params: LineParams;

  constructor(params: LineParams = {}) {
    this.params = params;
  }

  createElement() {
    return {
      [SVG_OBJECTS]: this.createSVGElements(),
      [SVG_GRID_MASK]: this.createSVGElements(),
    };
  }

  protected createSVGElements() {
    const group = document.createElementNS(SVG_NS, 'g');
    const startCircle = document.createElementNS(SVG_NS, 'circle');
    const line = document.createElementNS(SVG_NS, 'line');
    const endTriangle = document.createElementNS(SVG_NS, 'polygon');

    group.appendChild(startCircle);
    group.appendChild(line);
    group.appendChild(endTriangle);
    return group;
  }

  updateElement(elem: BoardObjectSVGElements, boardObject: LineBoardObject, config: SVGBoardConfig) {
    // basic UI definitions
    elem[SVG_OBJECTS].setAttribute('stroke', this.params.color || config.theme.markupNoneColor);
    elem[SVG_OBJECTS].setAttribute('fill', this.params.color || config.theme.markupNoneColor);
    elem[SVG_OBJECTS].setAttribute('stroke-width', this.params.lineWidth || config.theme.markupLineWidth as any);
    this.updateSVGElements(elem[SVG_OBJECTS], boardObject);

    elem[SVG_GRID_MASK].setAttribute('stroke', `rgba(0,0,0,${config.theme.markupGridMask})`);
    elem[SVG_GRID_MASK].setAttribute('fill', `rgba(0,0,0,${config.theme.markupGridMask})`);
    elem[SVG_GRID_MASK].setAttribute(
      'stroke-width',
      (this.params.lineWidth || config.theme.markupLineWidth) * 3 as any,
    );
    this.updateSVGElements(elem[SVG_GRID_MASK], boardObject);
  }

  protected updateSVGElements(elem: SVGElement, boardObject: LineBoardObject) {
    // SVG elements of arrow
    const startCircle = elem.children[0];
    const line = elem.children[1];
    const endTriangle = elem.children[2];

    const x1 = boardObject.start.x;
    const y1 = boardObject.start.y;
    const x2 = boardObject.end.x;
    const y2 = boardObject.end.y;

    // length of the main line
    const length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

    // line parametric functions
    const getLineX = (t: number) => x1 + t * (x2 - x1);
    const getLineY = (t: number) => y1 + t * (y2 - y1);

    // triangle base line position on the main line
    const triangleLen = 1 / length / 2.5;
    const tx = getLineX(1 - triangleLen);
    const ty = getLineY(1 - triangleLen);

    // triangle base line parametric functions
    const getBaseLineX = (t: number) => tx + t * (y2 - y1);
    const getBaseLineY = (t: number) => ty + t * (x1 - x2);

    // initial circle length
    const circleLen = 0.1;

    // draw initial circle
    startCircle.setAttribute('cx', x1 as any);
    startCircle.setAttribute('cy', y1 as any);
    startCircle.setAttribute('r', circleLen as any);

    // draw line
    line.setAttribute('x1', getLineX(1 / length * circleLen) as any);
    line.setAttribute('y1', getLineY(1 / length * circleLen) as any);
    line.setAttribute('x2', tx as any);
    line.setAttribute('y2', ty as any);

    // draw triangle at the end to make arrow
    endTriangle.setAttribute('points', `
      ${getBaseLineX(- triangleLen / 1.75)},${getBaseLineY(- triangleLen / 1.75)}
      ${getBaseLineX(triangleLen / 1.75)},${getBaseLineY(triangleLen / 1.75)}
      ${x2},${y2}
    `);
  }
}
