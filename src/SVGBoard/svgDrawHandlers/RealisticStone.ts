import SVGStoneDrawHandler from './SVGStoneDrawHandler';
import SVGFieldDrawHandler from './SVGFieldDrawHandler';
import { SVGBoardConfig, NS, OBJECTS } from '../types';

export default class RealisticStone extends SVGStoneDrawHandler {
  paths: string[];
  fallback: SVGFieldDrawHandler;
  randSeed: number;

  constructor (paths: string[], fallback: SVGFieldDrawHandler) {
    super();
    this.fallback = fallback;
    this.randSeed = Math.ceil(Math.random() * 9999999);
    this.paths = paths;
  }

  createElement(config: SVGBoardConfig, addDef: (def: SVGElement) => void) {
    super.createElement(config, addDef);

    const group = document.createElementNS(NS, 'g');
    let fallbackElement = this.fallback.createElement(config, addDef);

    if (!(fallbackElement instanceof SVGElement)) {
      fallbackElement = fallbackElement[OBJECTS];
    }

    group.appendChild(fallbackElement);

    const image = document.createElementNS(NS, 'image');
    const id = Math.floor(Math.random() * this.paths.length);
    image.setAttribute('href', this.paths[id]);
    image.setAttribute('width', config.theme.stoneSize * 2 as any);
    image.setAttribute('height', config.theme.stoneSize * 2 as any);
    image.setAttribute('x', -config.theme.stoneSize as any);
    image.setAttribute('y', -config.theme.stoneSize as any);
    image.setAttribute('filter', `url(#${this.shadowFilterElement.id})`);
    image.setAttribute('opacity', '0');
    image.addEventListener('load', () => {
      image.setAttribute('opacity', '1');
      group.removeChild(fallbackElement as SVGElement);
    });

    group.appendChild(image);

    return group;
  }
}
