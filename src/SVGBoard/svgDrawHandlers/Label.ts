import { SVGBoardConfig, NS, OBJECTS, BoardObjectSVGElements, GRID_MASK } from '../types';
import SVGMarkupDrawHandler, { SVGMarkupDrawHandlerParams } from './SVGMarkupDrawHandler';
import { BoardLabelObject } from '../../BoardBase';

interface LabelParams extends SVGMarkupDrawHandlerParams {
  font?: string;
}

export default class Label extends SVGMarkupDrawHandler {
  params: LabelParams;

  constructor(params: LabelParams = {}) {
    super(params);
  }

  createElement(config: SVGBoardConfig) {
    const text = document.createElementNS(NS, 'text');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');

    const mask = document.createElementNS(NS, 'text');
    mask.setAttribute('text-anchor', 'middle');
    mask.setAttribute('dominant-baseline', 'middle');
    mask.setAttribute('stroke-width', '0.2');
    mask.setAttribute('stroke', `rgba(0,0,0,${config.theme.markupGridMask})`);

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

    elem[OBJECTS].setAttribute('fill', this.params.color || config.theme.markupNoneColor);
    elem[OBJECTS].setAttribute('font-family', this.params.font || config.theme.font);
    elem[OBJECTS].setAttribute('stroke-width', '0');
    elem[OBJECTS].setAttribute('font-size', fontSize as any);
    elem[OBJECTS].textContent = boardObject.text;

    elem[GRID_MASK].setAttribute('font-size', fontSize as any);
    elem[GRID_MASK].textContent = boardObject.text;
  }
}
