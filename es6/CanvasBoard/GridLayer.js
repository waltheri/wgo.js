import CanvasLayer from "./CanvasLayer";
import gridHandler from "./drawHandlers/grid";

/**
 * @class
 * @extends WGo.CanvasBoard.CanvasLayer
 * Layer which renders board grid.
 */
 
export default class GridLayer extends CanvasLayer {
	constructor() {
		super();
	}
	
	initialDraw(board) {
		gridHandler.grid.draw(this.context, {}, board);
	}
}
