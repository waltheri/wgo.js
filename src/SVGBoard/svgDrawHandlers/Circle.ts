import { SVGBoardConfig, NS } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';

export default class Circle extends SVGMarkupDrawHandler {
  createElement(config: SVGBoardConfig) {
    const circle = document.createElementNS(NS, 'circle');
    circle.setAttribute('cx', '0');
    circle.setAttribute('cy', '0');
    circle.setAttribute('r', '0.25');

    this.setDefaultAttributes(config, circle);

    return circle;
  }
}
