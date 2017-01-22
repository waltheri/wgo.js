import { getMarkupColor, themeVariable, gridClearField } from "../helpers";

export default {
	stone: {
		draw: function (canvasCtx, args, board) {
			const stoneRadius = board.stoneRadius;

			canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
			canvasCtx.lineWidth = args.lineWidth || themeVariable("markupLinesWidth", board) || 1;
			canvasCtx.beginPath();
			canvasCtx.moveTo(0, 0 - Math.round(stoneRadius / 2));
			canvasCtx.lineTo(Math.round(-stoneRadius / 2), Math.round(stoneRadius / 3));
			canvasCtx.lineTo(Math.round(+stoneRadius / 2), Math.round(stoneRadius / 3));
			canvasCtx.closePath();
			canvasCtx.stroke();
		}
	},
	grid: gridClearField
}