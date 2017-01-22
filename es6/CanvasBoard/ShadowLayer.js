import CanvasLayer from "./CanvasLayer";

/**
 * @class
 * @extends WGo.CanvasBoard.CanvasLayer
 * Layer for shadows. It is slightly translated.
 */

export default class ShadowLayer extends CanvasLayer {
	constructor(shadowSize) {
		super();
		this.shadowSize = shadowSize === undefined ? 1 : shadowSize;
	}

	setDimensions(width, height, board) {
		super.setDimensions(width, height, board);
		this.context.transform(1, 0, 0, 1, Math.round(this.shadowSize * board.stoneRadius / 7), Math.round(this.shadowSize * board.stoneRadius / 7));
	}
}
