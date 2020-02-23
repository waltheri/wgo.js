import { SVGBoardConfig, NS } from '../types';
import SVGStoneDrawHandler from './SVGStoneDrawHandler';

export default class GlassStoneWhite extends SVGStoneDrawHandler {
  filterId: string;

  init(config: SVGBoardConfig): SVGElement {
    const shadow = super.init(config);

    if (!this.filterId) {
      this.filterId = `filter-${Math.floor(Math.random() * 1000000000).toString(36)}`;

      const filter1 = document.createElementNS(NS, 'radialGradient');
      filter1.setAttribute('id', `${this.filterId}-1`);
      filter1.setAttribute('fx', '30%');
      filter1.setAttribute('fy', '30%');
      filter1.innerHTML = `
        <stop offset="10%" stop-color="rgba(255,255,255,1)" />
        <stop offset="100%" stop-color="rgba(255,255,255,0)" />
      `;

      const filter2 = document.createElementNS(NS, 'radialGradient');

      filter2.setAttribute('id', `${this.filterId}-2`);
      filter2.setAttribute('fx', '70%');
      filter2.setAttribute('fy', '70%');
      filter2.innerHTML = `
        <stop offset="10%" stop-color="rgba(255,255,255,0.75)" />
        <stop offset="100%" stop-color="rgba(255,255,255,0)" />
      `;

      const filterGroup = document.createElementNS(NS, 'g');
      filterGroup.appendChild(filter1);
      filterGroup.appendChild(filter2);

      if (shadow) {
        filterGroup.appendChild(shadow);
      }
      return filterGroup;
    }
    return null;
  }

  createElement(config: SVGBoardConfig) {
    const stoneGroup = document.createElementNS(NS, 'g');

    const stone = document.createElementNS(NS, 'circle');
    stone.setAttribute('cx', '0');
    stone.setAttribute('cy', '0');
    stone.setAttribute('fill', '#ccc');
    stone.setAttribute('r', config.theme.stoneSize as any);
    stone.setAttribute('filter', `url(#${this.shadowFilterId})`);
    stoneGroup.appendChild(stone);

    const glow1 = document.createElementNS(NS, 'circle');
    glow1.setAttribute('cx', '0');
    glow1.setAttribute('cy', '0');
    glow1.setAttribute('r', config.theme.stoneSize as any);
    glow1.setAttribute('fill', `url(#${this.filterId}-1)`);
    stoneGroup.appendChild(glow1);

    const glow2 = document.createElementNS(NS, 'circle');
    glow2.setAttribute('cx', '0');
    glow2.setAttribute('cy', '0');
    glow2.setAttribute('r', config.theme.stoneSize as any);
    glow2.setAttribute('fill', `url(#${this.filterId}-2)`);
    stoneGroup.appendChild(glow2);

    return stoneGroup;
  }
}
