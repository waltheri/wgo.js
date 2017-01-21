import {getMarkupColor, themeVariable} from "../helpers";

export default {
	stone: {
		draw: function(canvasCtx, args, board) {
			var xr = board.getX(args.x),
				yr = board.getY(args.y),
				sr = board.stoneRadius;
			
			canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
			canvasCtx.lineCap = "round";
			canvasCtx.lineWidth = (args.lineWidth || themeVariable("markupLinesWidth", board) || 1) * 2 - 1;
			canvasCtx.beginPath();
			canvasCtx.moveTo(Math.round(xr-sr/2), Math.round(yr-sr/2));
			canvasCtx.lineTo(Math.round(xr+sr/2), Math.round(yr+sr/2));
			canvasCtx.moveTo(Math.round(xr+sr/2)-1, Math.round(yr-sr/2));
			canvasCtx.lineTo(Math.round(xr-sr/2)-1, Math.round(yr+sr/2));
			canvasCtx.stroke();
			canvasCtx.lineCap = "butt";
		}
	}
}