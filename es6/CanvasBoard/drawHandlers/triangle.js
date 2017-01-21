import {getMarkupColor, themeVariable} from "../helpers";

export default {
	stone: {
		draw: function(canvasCtx, args, board) {
			var xr = board.getX(args.x),
				yr = board.getY(args.y),
				sr = board.stoneRadius;
				
			canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
			canvasCtx.lineWidth = args.lineWidth || themeVariable("markupLinesWidth", board) || 1;
			canvasCtx.beginPath();
			canvasCtx.moveTo(xr-board.ls, yr-board.ls-Math.round(sr/2));
			canvasCtx.lineTo(Math.round(xr-sr/2)-board.ls, Math.round(yr+sr/3)+board.ls);
			canvasCtx.lineTo(Math.round(xr+sr/2)+board.ls, Math.round(yr+sr/3)+board.ls);
			canvasCtx.closePath();
			canvasCtx.stroke();
		}
	}
}