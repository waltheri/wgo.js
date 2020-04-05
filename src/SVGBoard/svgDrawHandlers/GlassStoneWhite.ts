import { SVGBoardConfig, NS } from '../types';
import SVGStoneDrawHandler from './SVGStoneDrawHandler';
import generateId from '../generateId';

export default class GlassStoneWhite extends SVGStoneDrawHandler {
  filterElement1: SVGElement;
  filterElement2: SVGElement;

  createElement(config: SVGBoardConfig, addDef: (def: SVGElement) => void) {
    super.createElement(config, addDef);

    if (!this.filterElement1) {
      const filter1 = document.createElementNS(NS, 'radialGradient');
      filter1.setAttribute('id', generateId('filter'));
      filter1.setAttribute('fx', '30%');
      filter1.setAttribute('fy', '30%');
      filter1.innerHTML = `
        <stop offset="10%" stop-color="rgba(255,255,255,0.9)" />
        <stop offset="100%" stop-color="rgba(255,255,255,0)" />
      `;

      addDef(filter1);
      this.filterElement1 = filter1;

      const filter2 = document.createElementNS(NS, 'radialGradient');
      filter2.setAttribute('id', generateId('filter'));
      filter2.setAttribute('fx', '70%');
      filter2.setAttribute('fy', '70%');
      filter2.innerHTML = `
        <stop offset="10%" stop-color="rgba(255,255,255,0.7)" />
        <stop offset="100%" stop-color="rgba(255,255,255,0)" />
      `;

      addDef(filter2);
      this.filterElement2 = filter2;
    }

    const stoneGroup = document.createElementNS(NS, 'g');

    const stone = document.createElementNS(NS, 'circle');
    stone.setAttribute('cx', '0');
    stone.setAttribute('cy', '0');
    stone.setAttribute('fill', '#ccc');
    stone.setAttribute('r', config.theme.stoneSize as any);
    stoneGroup.appendChild(stone);

    const glow1 = document.createElementNS(NS, 'circle');
    glow1.setAttribute('cx', '0');
    glow1.setAttribute('cy', '0');
    glow1.setAttribute('r', config.theme.stoneSize as any);
    glow1.setAttribute('fill', `url(#${this.filterElement1.id})`);
    stoneGroup.appendChild(glow1);

    const glow2 = document.createElementNS(NS, 'circle');
    glow2.setAttribute('cx', '0');
    glow2.setAttribute('cy', '0');
    glow2.setAttribute('r', config.theme.stoneSize as any);
    glow2.setAttribute('fill', `url(#${this.filterElement2.id})`);
    stoneGroup.appendChild(glow2);

    return stoneGroup;
  }
}
