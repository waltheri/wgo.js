import { SVGBoardConfig, NS } from '../types';
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

    return text;
  }

  updateElement(elem: SVGElement, boardObject: BoardLabelObject, config: SVGBoardConfig) {
    super.updateElement(elem, boardObject, config);
    elem.setAttribute('stroke', '');
    elem.setAttribute('fill', '');

    elem.setAttribute('font', this.params.font || config.theme.font);
    elem.setAttribute('stroke-width', this.params.font || config.theme.font);

    elem.textContent = boardObject.text;

    // TODO
  }
}
