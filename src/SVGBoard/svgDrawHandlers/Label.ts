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
    text.setAttribute('font-size', '0.5');

    const mask = document.createElementNS(NS, 'text');
    mask.setAttribute('text-anchor', 'middle');
    mask.setAttribute('dominant-baseline', 'middle');
    mask.setAttribute('font-size', '0.5');
    mask.setAttribute('stroke-width', '0.3');
    mask.setAttribute('stroke', `rgba(0,0,0,${config.theme.markupGridMask})`);

    return {
      [OBJECTS]: text,
      [GRID_MASK]: mask,
    };
  }

  updateElement(elem: BoardObjectSVGElements, boardObject: BoardLabelObject, config: SVGBoardConfig) {
    super.updateElement(elem, boardObject, config);

    elem[OBJECTS].setAttribute('fill', this.params.color || config.theme.markupNoneColor);
    elem[OBJECTS].setAttribute('font', this.params.font || config.theme.font);
    elem[OBJECTS].setAttribute('stroke-width', '0');

    elem[OBJECTS].textContent = boardObject.text;
    elem[GRID_MASK].textContent = boardObject.text;

    // TODO
  }
}
