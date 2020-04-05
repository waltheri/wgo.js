import { NS, SVGBoardConfig } from '../types';
import SVGFieldDrawHandler from './SVGFieldDrawHandler';

export default class SimpleStone extends SVGFieldDrawHandler {
  color: string;

  constructor(color: string) {
    super();
    this.color = color;
  }

  createElement(config: SVGBoardConfig) {
    const stone = document.createElementNS(NS, 'circle');

    stone.setAttribute('cx', '0');
    stone.setAttribute('cy', '0');
    stone.setAttribute('r', config.theme.stoneSize as any);
    stone.setAttribute('fill', this.color);

    return stone;
  }
}
