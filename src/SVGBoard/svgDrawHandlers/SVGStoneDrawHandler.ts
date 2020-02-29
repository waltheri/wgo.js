import SVGFieldDrawHandler from './SVGFieldDrawHandler';
import { SVGBoardConfig, NS, BoardObjectSVGElements } from '../types';
import generateId from '../generateId';

export default abstract class SVGStoneDrawHandler extends SVGFieldDrawHandler {
  shadowFilterElement: SVGFilterElement;

  createElement(config: SVGBoardConfig, addDef: (def: SVGElement) => void): SVGElement | BoardObjectSVGElements {
    if (!this.shadowFilterElement) {
      this.shadowFilterElement = document.createElementNS(NS, 'filter');
      this.shadowFilterElement.setAttribute('id', generateId('filter'));
      this.shadowFilterElement.innerHTML = `
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

      addDef(this.shadowFilterElement);
    }

    return null;
  }
}
