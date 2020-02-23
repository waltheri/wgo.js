import { SVGBoardConfig, NS } from '../types';
import SVGFieldDrawHandler from './SVGFieldDrawHandler';

export default class Dim extends SVGFieldDrawHandler {
  params: { color: string };

  constructor(params: { color: string }) {
    super();
    this.params = params;
  }

  createElement(config: SVGBoardConfig) {
    const rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('x', '-0.5');
    rect.setAttribute('y', '-0.5');
    rect.setAttribute('width', '1');
    rect.setAttribute('height', '1');
    rect.setAttribute('fill', this.params.color);

    return rect;
  }
}
