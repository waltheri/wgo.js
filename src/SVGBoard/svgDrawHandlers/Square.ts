import { SVGBoardConfig, NS, OBJECTS, GRID_MASK } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';

export default class Square extends SVGMarkupDrawHandler {
  createElement(config: SVGBoardConfig) {
    const square = document.createElementNS(NS, 'rect');
    square.setAttribute('x', '-0.25');
    square.setAttribute('y', '-0.25');
    square.setAttribute('width', '0.50');
    square.setAttribute('height', '0.50');

    const mask = document.createElementNS(NS, 'rect');
    mask.setAttribute('x', '-0.35');
    mask.setAttribute('y', '-0.35');
    mask.setAttribute('width', '0.70');
    mask.setAttribute('height', '0.70');
    mask.setAttribute('fill', `rgba(0,0,0,${config.theme.markupGridMask})`);

    return {
      [OBJECTS]: square,
      [GRID_MASK]: mask,
    };
  }
}
