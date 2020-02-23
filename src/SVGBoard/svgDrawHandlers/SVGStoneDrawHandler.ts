import SVGFieldDrawHandler from './SVGFieldDrawHandler';
import { SVGBoardConfig, NS } from '../types';

export default abstract class SVGStoneDrawHandler extends SVGFieldDrawHandler {
  shadowFilterId: string;
  shadowFilterElement: SVGFilterElement;

  init(config: SVGBoardConfig): SVGElement {
    if (!this.shadowFilterElement) {
      this.shadowFilterId = `filter-${Math.floor(Math.random() * 1000000000).toString(36)}`;

      const filter = document.createElementNS(NS, 'filter');
      filter.setAttribute('id', this.shadowFilterId);
      filter.innerHTML = `
        <feGaussianBlur in="SourceAlpha" stdDeviation="0.05" />
        <feOffset dx="0.03" dy="0.03" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      `;

      this.shadowFilterElement = filter;
      return filter;
    }
    return null;
  }
}
