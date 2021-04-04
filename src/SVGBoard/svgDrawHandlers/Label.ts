import { SVGBoardConfig, NS, OBJECTS, BoardObjectSVGElements, GRID_MASK } from '../types';
import SVGMarkupDrawHandler, { SVGMarkupDrawHandlerParams } from './SVGMarkupDrawHandler';
import { BoardLabelObject } from '../../BoardBase';
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
    const text = document.createElementNS(NS, 'text');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('lengthAdjust', 'spacingAndGlyphs');

    const mask = document.createElementNS(NS, 'text');
    mask.setAttribute('text-anchor', 'middle');
    mask.setAttribute('dominant-baseline', 'middle');
    mask.setAttribute('stroke-width', '0.2');
    mask.setAttribute('stroke', `rgba(0,0,0,${config.theme.markupGridMask})`);
    mask.setAttribute('lengthAdjust', 'spacingAndGlyphs');

    return {
      [OBJECTS]: text,
      [GRID_MASK]: mask,
    };
  }

  updateElement(elem: BoardObjectSVGElements, boardObject: BoardLabelObject, config: SVGBoardConfig) {
    super.updateElement(elem, boardObject, config);

    let fontSize = 0.5;
    if (boardObject.text.length === 1) {
      fontSize = 0.7;
    } else if (boardObject.text.length === 2) {
      fontSize = 0.6;
    }

    if (this.params.color) {
      elem[OBJECTS].setAttribute('fill', this.params.color);
    } else {
      if (boardObject.variation === Color.B) {
        elem[OBJECTS].setAttribute('fill', config.theme.markupBlackColor);
      } else if (boardObject.variation === Color.W) {
        elem[OBJECTS].setAttribute('fill', config.theme.markupWhiteColor);
      } else {
        elem[OBJECTS].setAttribute('fill', config.theme.markupNoneColor);
      }
    }

    elem[OBJECTS].removeAttribute('stroke');
    elem[OBJECTS].setAttribute('font-family', this.params.font || config.theme.font);
    elem[OBJECTS].setAttribute('stroke-width', '0');
    elem[OBJECTS].setAttribute('font-size', fontSize as any);
    elem[OBJECTS].textContent = boardObject.text;

    elem[GRID_MASK].setAttribute('font-size', fontSize as any);
    elem[GRID_MASK].textContent = boardObject.text;

    if (this.params.maxWidth > 0) {
      if ((elem[OBJECTS] as SVGTextElement).getComputedTextLength() > this.params.maxWidth) {
        elem[OBJECTS].setAttribute('textLength', `${this.params.maxWidth}`);
        elem[GRID_MASK].setAttribute('textLength', `${this.params.maxWidth}`);
      } else {
        elem[OBJECTS].removeAttribute('textLength');
        elem[GRID_MASK].removeAttribute('textLength');
      }
    }
  }
}
