import { SVGBoardConfig, NS } from '../types';
import SVGStoneDrawHandler from './SVGStoneDrawHandler';

export default class GlassStoneBlack extends SVGStoneDrawHandler {
  filterId: string;
  filterElement: SVGFilterElement;

  init(config: SVGBoardConfig): SVGElement {
    const shadow = super.init(config);

    if (!this.filterElement) {
      this.filterId = `filter-${Math.floor(Math.random() * 1000000000).toString(36)}`;
      const filter = document.createElementNS(NS, 'filter');

      filter.setAttribute('id', this.filterId);
      filter.setAttribute('x', '-300%');
      filter.setAttribute('y', '-300%');
      filter.setAttribute('width', '600%');
      filter.setAttribute('height', '600%');

      const blur = document.createElementNS(NS, 'feGaussianBlur');

      blur.setAttribute('in', 'SourceGraphic');
      blur.setAttribute('stdDeviation', 0.3 * config.theme.stoneSize as any);
      filter.appendChild(blur);

      this.filterElement = filter;

      const filterGroup = document.createElementNS(NS, 'g');
      filterGroup.appendChild(filter);
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
    stone.setAttribute('fill', '#000');
    stone.setAttribute('r', config.theme.stoneSize as any);
    stone.setAttribute('filter', `url(#${this.shadowFilterId})`);
    stoneGroup.appendChild(stone);

    const glow1 = document.createElementNS(NS, 'circle');
    glow1.setAttribute('cx', -0.4 * config.theme.stoneSize as any);
    glow1.setAttribute('cy', -0.4 * config.theme.stoneSize as any);
    glow1.setAttribute('r', 0.25 * config.theme.stoneSize as any);
    glow1.setAttribute('fill', '#fff');
    glow1.setAttribute('filter', `url(#${this.filterId})`);
    stoneGroup.appendChild(glow1);

    const glow2 = document.createElementNS(NS, 'circle');
    glow2.setAttribute('cx', 0.4 * config.theme.stoneSize as any);
    glow2.setAttribute('cy', 0.4 * config.theme.stoneSize as any);
    glow2.setAttribute('r', 0.15 * config.theme.stoneSize as any);
    glow2.setAttribute('fill', '#fff');
    glow2.setAttribute('filter', `url(#${this.filterId})`);
    stoneGroup.appendChild(glow2);

    return stoneGroup;
  }
}
