import { getMarkupColor, gridClearField } from "../helpers";

export default {
	stone: {
		draw: function (canvasCtx, args, board) {
			const stoneRadius = board.stoneRadius;

			canvasCtx.fillStyle = args.c || getMarkupColor(board, args.x, args.y);
			canvasCtx.beginPath();
			canvasCtx.rect(-stoneRadius / 2, -stoneRadius / 2, stoneRadius, stoneRadius);
			canvasCtx.fill();
		}
	},
	grid: gridClearField
}