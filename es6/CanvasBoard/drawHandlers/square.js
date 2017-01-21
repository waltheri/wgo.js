import {getMarkupColor, themeVariable} from "../helpers";

export default {
	stone: {
		draw: function(canvasCtx, args, board) {
			var xr = board.getX(args.x),
				yr = board.getY(args.y),
				sr = Math.round(board.stoneRadius);
				
			canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
			canvasCtx.lineWidth = args.lineWidth || themeVariable("markupLinesWidth", board) || 1;
			canvasCtx.beginPath();
			canvasCtx.rect(Math.round(xr-sr/2)-board.ls, Math.round(yr-sr/2)-board.ls, sr, sr);
			canvasCtx.stroke();
		}
	}
}