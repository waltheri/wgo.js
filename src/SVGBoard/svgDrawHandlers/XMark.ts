import { SVG_NS, SVG_OBJECTS, SVG_GRID_MASK, SVGBoardConfig } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';

export default class XMark extends SVGMarkupDrawHandler {
  createElement(config: SVGBoardConfig) {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('d', 'M -0.20,-0.20 L 0.20,0.20 M 0.20,-0.20 L -0.20,0.20');

    const mask = document.createElementNS(SVG_NS, 'circle');
    mask.setAttribute('cx', '0');
    mask.setAttribute('cy', '0');
    mask.setAttribute('r', '0.15');
    mask.setAttribute('fill', `rgba(0,0,0,${config.theme.markupGridMask})`);

    return {
      [SVG_OBJECTS]: path,
      [SVG_GRID_MASK]: mask,
    };
  }
}
