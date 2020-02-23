
import { SVGDrawHandler, SVGBoardConfig } from '../types';
import { FieldObject } from '../../BoardBase';

export default abstract class SVGFieldDrawHandler implements SVGDrawHandler {
  init(config: SVGBoardConfig): SVGElement {
    return null;
  }

  abstract createElement(config: SVGBoardConfig): SVGElement;

  updateElement(elem: SVGElement, boardObject: FieldObject<SVGDrawHandler>, config: SVGBoardConfig) {
    const transform = `translate(${boardObject.x}, ${boardObject.y})`;
    const scale = `scale(${boardObject.scaleX}, ${boardObject.scaleY})`;
    const rotate = `rotate(${boardObject.rotate})`;

    elem.setAttribute('transform', `${transform} ${scale} ${rotate}`);
    elem.setAttribute('opacity', boardObject.opacity as any);
  }
}
