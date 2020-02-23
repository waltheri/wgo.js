import { SVGDrawHandler, SVGBoardConfig } from '../types';
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

  updateElement(elem: SVGElement, boardObject: BoardMarkupObject<SVGDrawHandler>, config: SVGBoardConfig) {
    super.updateElement(elem, boardObject, config);

    if (boardObject.variation === Color.B) {
      elem.setAttribute('stroke', config.theme.markupBlackColor);
      elem.setAttribute('fill', this.params.fillColor || 'rgba(0,0,0,0)');
    } else if (boardObject.variation === Color.W) {
      elem.setAttribute('stroke', config.theme.markupWhiteColor);
      elem.setAttribute('fill', this.params.fillColor || 'rgba(0,0,0,0)');
    } else {
      elem.setAttribute('stroke', this.params.color || config.theme.markupNoneColor);
      elem.setAttribute('fill', this.params.fillColor || config.theme.backgroundColor);
    }
  }

  setDefaultAttributes(config: SVGBoardConfig, elem: SVGElement) {
    elem.setAttribute('stroke-width', this.params.lineWidth || config.theme.markupLineWidth as any);
  }
}
