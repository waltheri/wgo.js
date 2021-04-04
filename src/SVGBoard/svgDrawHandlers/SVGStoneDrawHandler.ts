import SVGFieldDrawHandler from './SVGFieldDrawHandler';
import { SVGBoardConfig, SVG_NS, BoardObjectSVGElements } from '../types';
import generateId from '../generateId';

export default abstract class SVGStoneDrawHandler extends SVGFieldDrawHandler {
  shadowFilterElement: SVGElement;

  createElement(config: SVGBoardConfig, addDef: (def: SVGElement) => void): SVGElement | BoardObjectSVGElements {
    /*if (!this.shadowFilterElement) {
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
    }*/

    return null;
  }

  createShadow(config: SVGBoardConfig, addDef: (def: SVGElement) => void) {
    const stoneRadius = config.theme.stoneSize;

    if (!this.shadowFilterElement) {
      const shadowFilterElement = document.createElementNS(SVG_NS, 'radialGradient');
      const blur = config.theme.shadowBlur;

      const startRadius = Math.max(stoneRadius - stoneRadius * blur, 0.00001);
      const stopRadius = stoneRadius + (1 / 7 * stoneRadius) * blur;

      shadowFilterElement.setAttribute('id', generateId('shadowFilter'));
      shadowFilterElement.setAttribute('fr', String(startRadius));
      shadowFilterElement.setAttribute('r', String(stopRadius));
      shadowFilterElement.innerHTML = `
        <stop offset="0%" stop-color="${config.theme.shadowColor}" />
        <stop offset="100%" stop-color="${config.theme.shadowTransparentColor}" />
      `;

      addDef(shadowFilterElement);
      this.shadowFilterElement = shadowFilterElement;
    }

    const shadow = document.createElementNS(SVG_NS, 'circle');

    shadow.setAttribute('cx', String(config.theme.shadowOffsetX));
    shadow.setAttribute('cy', String(config.theme.shadowOffsetY));
    shadow.setAttribute('r', String(stoneRadius));
    shadow.setAttribute('fill', `url(#${this.shadowFilterElement.id})`);

    return shadow;
  }
}
