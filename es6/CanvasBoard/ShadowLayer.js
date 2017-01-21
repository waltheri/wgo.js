import CanvasLayer from "./CanvasLayer";

/**
 * @class
 * @extends WGo.CanvasBoard.CanvasLayer
 * Layer for shadows. It is slightly translated.
 */

export default class ShadowLayer extends CanvasLayer {
	constructor(board, shadowSize) {
		super();
		this.shadowSize = shadowSize === undefined ? 1 : shadowSize;
		this.board = board;
	}

	setDimensions(width, height) {
		super.setDimensions(width, height);
		this.context.setTransform(1, 0, 0, 1, Math.round(this.shadowSize * this.board.stoneRadius / 7), Math.round(this.shadowSize * this.board.stoneRadius / 7));
	}
}
