import { SVGBoardConfig, SVG_NS, SVG_OBJECTS, SVG_SHADOWS } from '../types';
import SVGStoneDrawHandler from './SVGStoneDrawHandler';
import generateId from '../generateId';

export default class GlassStoneWhite extends SVGStoneDrawHandler {
  filterElement1: SVGElement;
  filterElement2: SVGElement;

  createElement(config: SVGBoardConfig, addDef: (def: SVGElement) => void) {
    super.createElement(config, addDef);

    if (!this.filterElement1) {
      const filter1 = document.createElementNS(SVG_NS, 'radialGradient');
      filter1.setAttribute('id', generateId('filter'));
      filter1.setAttribute('cx', '45%');
      filter1.setAttribute('cy', '45%');
      filter1.setAttribute('fx', '20%');
      filter1.setAttribute('fy', '20%');
      filter1.setAttribute('r', '60%');
      filter1.innerHTML = `
        <stop offset="0%" stop-color="rgba(48,48,48,1)" />
        <stop offset="80%" stop-color="rgba(16,16,16,1)" />
        <stop offset="100%" stop-color="rgba(0,0,0,1)" />
      `;

      addDef(filter1);
      this.filterElement1 = filter1;
    }

    const stoneGroup = document.createElementNS(SVG_NS, 'g');

    const stone = document.createElementNS(SVG_NS, 'circle');
    stone.setAttribute('cx', '0');
    stone.setAttribute('cy', '0');
    stone.setAttribute('fill', `url(#${this.filterElement1.id})`);
    stone.setAttribute('r', config.theme.stoneSize as any);
    stoneGroup.appendChild(stone);

    return {
      [SVG_OBJECTS]: stoneGroup,
      [SVG_SHADOWS]: this.createShadow(config, addDef),
    };
  }
}
