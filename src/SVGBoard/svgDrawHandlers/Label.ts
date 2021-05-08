import { SVGBoardConfig, SVG_NS, SVG_OBJECTS, BoardObjectSVGElements, SVG_GRID_MASK } from '../types';
import SVGMarkupDrawHandler, { SVGMarkupDrawHandlerParams } from './SVGMarkupDrawHandler';
import { LabelBoardObject } from '../../BoardBase';
import { Color } from '../../types';

interface LabelParams extends SVGMarkupDrawHandlerParams {
  font?: string;
  maxWidth?: number;
}

export default class Label extends SVGMarkupDrawHandler {
  params: LabelParams;

  constructor(params: LabelParams = {}) {
    super(params);

    if (!params.maxWidth && params.maxWidth !== 0) {
      params.maxWidth = 0.95;
    }
  }

  createElement(config: SVGBoardConfig) {
    const text = document.createElementNS(SVG_NS, 'text');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('lengthAdjust', 'spacingAndGlyphs');

    const mask = document.createElementNS(SVG_NS, 'text');
    mask.setAttribute('text-anchor', 'middle');
    mask.setAttribute('dominant-baseline', 'middle');
    mask.setAttribute('stroke-width', '0.2');
    mask.setAttribute('stroke', `rgba(0,0,0,${config.theme.markupGridMask})`);
    mask.setAttribute('lengthAdjust', 'spacingAndGlyphs');

    return {
      [SVG_OBJECTS]: text,
      [SVG_GRID_MASK]: mask,
    };
  }

  updateElement(elem: BoardObjectSVGElements, boardObject: LabelBoardObject, config: SVGBoardConfig) {
    super.updateElement(elem, boardObject, config);

    let fontSize = 0.5;
    if (boardObject.text.length === 1) {
      fontSize = 0.7;
    } else if (boardObject.text.length === 2) {
      fontSize = 0.6;
    }

    if (this.params.color) {
      elem[SVG_OBJECTS].setAttribute('fill', this.params.color);
    } else {
      if (boardObject.variation === Color.B) {
        elem[SVG_OBJECTS].setAttribute('fill', config.theme.markupBlackColor);
      } else if (boardObject.variation === Color.W) {
        elem[SVG_OBJECTS].setAttribute('fill', config.theme.markupWhiteColor);
      } else {
        elem[SVG_OBJECTS].setAttribute('fill', config.theme.markupNoneColor);
      }
    }

    elem[SVG_OBJECTS].removeAttribute('stroke');
    elem[SVG_OBJECTS].setAttribute('font-family', this.params.font || config.theme.font);
    elem[SVG_OBJECTS].setAttribute('stroke-width', '0');
    elem[SVG_OBJECTS].setAttribute('font-size', fontSize as any);
    elem[SVG_OBJECTS].textContent = boardObject.text;

    elem[SVG_GRID_MASK].setAttribute('font-size', fontSize as any);
    elem[SVG_GRID_MASK].textContent = boardObject.text;

    if (this.params.maxWidth > 0) {
      if ((elem[SVG_OBJECTS] as SVGTextElement).getComputedTextLength() > this.params.maxWidth) {
        elem[SVG_OBJECTS].setAttribute('textLength', `${this.params.maxWidth}`);
        elem[SVG_GRID_MASK].setAttribute('textLength', `${this.params.maxWidth}`);
      } else {
        elem[SVG_OBJECTS].removeAttribute('textLength');
        elem[SVG_GRID_MASK].removeAttribute('textLength');
      }
    }
  }
}
