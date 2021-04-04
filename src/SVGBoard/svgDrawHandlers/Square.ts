import { SVGBoardConfig, SVG_NS, SVG_OBJECTS, SVG_GRID_MASK } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';

export default class Square extends SVGMarkupDrawHandler {
  createElement(config: SVGBoardConfig) {
    const square = document.createElementNS(SVG_NS, 'rect');
    square.setAttribute('x', '-0.25');
    square.setAttribute('y', '-0.25');
    square.setAttribute('width', '0.50');
    square.setAttribute('height', '0.50');

    const mask = document.createElementNS(SVG_NS, 'rect');
    mask.setAttribute('x', '-0.35');
    mask.setAttribute('y', '-0.35');
    mask.setAttribute('width', '0.70');
    mask.setAttribute('height', '0.70');
    mask.setAttribute('fill', `rgba(0,0,0,${config.theme.markupGridMask})`);

    return {
      [SVG_OBJECTS]: square,
      [SVG_GRID_MASK]: mask,
    };
  }
}
