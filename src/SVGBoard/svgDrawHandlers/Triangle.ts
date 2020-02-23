import { SVGBoardConfig, NS } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';

export default class Triangle extends SVGMarkupDrawHandler {
  createElement(config: SVGBoardConfig) {
    const triangle = document.createElementNS(NS, 'polygon');
    triangle.setAttribute('points', '0,-0.25 -0.25,0.166666 0.25,0.166666');

    this.setDefaultAttributes(config, triangle);

    return triangle;
  }
}
