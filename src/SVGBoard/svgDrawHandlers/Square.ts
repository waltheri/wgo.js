import { SVGBoardConfig, NS } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';

export default class Square extends SVGMarkupDrawHandler {
  createElement(config: SVGBoardConfig) {
    const square = document.createElementNS(NS, 'rect');
    square.setAttribute('x', '-0.25');
    square.setAttribute('y', '-0.25');
    square.setAttribute('width', '0.50');
    square.setAttribute('height', '0.50');

    this.setDefaultAttributes(config, square);

    return square;
  }
}
