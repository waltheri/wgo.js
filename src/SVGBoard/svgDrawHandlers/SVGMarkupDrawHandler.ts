import { SVGDrawHandler, SVGBoardConfig, BoardObjectSVGElements, OBJECTS } from '../types';
import { BoardMarkupObject } from '../../BoardBase';
import { Color } from '../../types';
import SVGFieldDrawHandler from './SVGFieldDrawHandler';

export interface SVGMarkupDrawHandlerParams {
  color?: string;
  lineWidth?: number;
  fillColor?: string;
}

export default abstract class SVGMarkupDrawHandler extends SVGFieldDrawHandler {
  params: SVGMarkupDrawHandlerParams;

  constructor(params: SVGMarkupDrawHandlerParams = {}) {
    super();
    this.params = params;
  }

  updateElement(elem: BoardObjectSVGElements, boardObject: BoardMarkupObject, config: SVGBoardConfig) {
    super.updateElement(elem, boardObject, config);

    if (boardObject.variation === Color.B) {
      elem[OBJECTS].setAttribute('stroke', config.theme.markupBlackColor);
      elem[OBJECTS].setAttribute('fill', this.params.fillColor || 'rgba(0,0,0,0)');
    } else if (boardObject.variation === Color.W) {
      elem[OBJECTS].setAttribute('stroke', config.theme.markupWhiteColor);
      elem[OBJECTS].setAttribute('fill', this.params.fillColor || 'rgba(0,0,0,0)');
    } else {
      elem[OBJECTS].setAttribute('stroke', this.params.color || config.theme.markupNoneColor);
      elem[OBJECTS].setAttribute('fill', this.params.fillColor || 'rgba(0,0,0,0)');
    }

    elem[OBJECTS].setAttribute('stroke-width', this.params.lineWidth || config.theme.markupLineWidth as any);
  }
}
