import { SVGBoardConfig, NS } from '../types';
import SVGMarkupDrawHandler from './SVGMarkupDrawHandler';

export default class XMark extends SVGMarkupDrawHandler {
  createElement(config: SVGBoardConfig) {
    const path = document.createElementNS(NS, 'path');
    path.setAttribute('d', 'M -0.20,-0.20 L 0.20,0.20 M 0.20,-0.20 L -0.20,0.20');

    this.setDefaultAttributes(config, path);

    return path;
  }
}
