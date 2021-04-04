import { SVG_NS, SVG_OBJECTS, SVG_GRID_MASK, SVGBoardConfig } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';

export default class Circle extends SVGMarkupDrawHandler {
  createElement(config: SVGBoardConfig) {
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', '0');
    circle.setAttribute('cy', '0');
    circle.setAttribute('r', '0.25');

    const mask = document.createElementNS(SVG_NS, 'circle');
    mask.setAttribute('cx', '0');
    mask.setAttribute('cy', '0');
    mask.setAttribute('r', '0.35');
    mask.setAttribute('fill', `rgba(0,0,0,${config.theme.markupGridMask})`);

    return {
      [SVG_OBJECTS]: circle,
      [SVG_GRID_MASK]: mask,
    };
  }
}
