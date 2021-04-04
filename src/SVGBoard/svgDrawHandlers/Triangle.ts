import { SVGBoardConfig, SVG_NS, SVG_OBJECTS, SVG_GRID_MASK } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';

export default class Triangle extends SVGMarkupDrawHandler {
  createElement(config: SVGBoardConfig) {
    const triangle = document.createElementNS(SVG_NS, 'polygon');
    triangle.setAttribute('points', '0,-0.25 -0.25,0.166666 0.25,0.166666');

    const mask = document.createElementNS(SVG_NS, 'polygon');
    mask.setAttribute('points', '0,-0.35 -0.35,0.2333333 0.35,0.2333333');
    mask.setAttribute('fill', `rgba(0,0,0,${config.theme.markupGridMask})`);

    return {
      [SVG_OBJECTS]: triangle,
      [SVG_GRID_MASK]: mask,
    };
  }
}
