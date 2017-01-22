import {getMarkupColor, themeVariable, gridClearField} from "../helpers";

export default {
	stone: {
		draw: function(canvasCtx, args, board) {
			const stoneRadius = Math.round(board.stoneRadius);
				
			canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
			canvasCtx.lineWidth = args.lineWidth || themeVariable("markupLinesWidth", board) || 1;
			canvasCtx.beginPath();
			canvasCtx.rect(Math.round(-stoneRadius/2), Math.round(-stoneRadius/2), stoneRadius, stoneRadius);
			canvasCtx.stroke();
		}
	},
	grid: gridClearField
}