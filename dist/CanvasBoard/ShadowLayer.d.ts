import CanvasLayer from './CanvasLayer';
import CanvasBoard from './CanvasBoard';
/**
 * @class
 * @extends WGo.CanvasBoard.CanvasLayer
 * Layer for shadows. It is slightly translated.
 */
export default class ShadowLayer extends CanvasLayer {
    setDimensions(width: number, height: number, board: CanvasBoard): void;
}
