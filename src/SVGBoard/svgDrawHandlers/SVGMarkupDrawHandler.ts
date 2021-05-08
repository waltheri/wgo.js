import { SVGDrawHandler, SVGBoardConfig, BoardObjectSVGElements, SVG_OBJECTS } from '../types';
import { MarkupBoardObject } from '../../BoardBase';
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

  updateElement(elem: BoardObjectSVGElements, boardObject: MarkupBoardObject, config: SVGBoardConfig) {
    super.updateElement(elem, boardObject, config);

    if (boardObject.variation === Color.B) {
      elem[SVG_OBJECTS].setAttribute('stroke', config.theme.markupBlackColor);
      elem[SVG_OBJECTS].setAttribute('fill', this.params.fillColor || 'rgba(0,0,0,0)');
    } else if (boardObject.variation === Color.W) {
      elem[SVG_OBJECTS].setAttribute('stroke', config.theme.markupWhiteColor);
      elem[SVG_OBJECTS].setAttribute('fill', this.params.fillColor || 'rgba(0,0,0,0)');
    } else {
      elem[SVG_OBJECTS].setAttribute('stroke', this.params.color || config.theme.markupNoneColor);
      elem[SVG_OBJECTS].setAttribute('fill', this.params.fillColor || 'rgba(0,0,0,0)');
    }

    elem[SVG_OBJECTS].setAttribute('stroke-width', this.params.lineWidth || config.theme.markupLineWidth as any);
  }
}
