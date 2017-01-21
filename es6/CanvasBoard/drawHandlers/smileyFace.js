import {getMarkupColor, themeVariable} from "../helpers";

export default {
	stone: {
		draw: function(canvasCtx, args, board) {
			var xr = board.getX(args.x),
				yr = board.getY(args.y),
				sr = board.stoneRadius;
				
			canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
			canvasCtx.lineWidth = (args.lineWidth || themeVariable("markupLinesWidth", board) || 1)*2;
			canvasCtx.beginPath();
			canvasCtx.arc(xr-sr/3, yr-sr/3, sr/6, 0, 2*Math.PI, true);
			canvasCtx.stroke();
			canvasCtx.beginPath();
			canvasCtx.arc(xr+sr/3, yr-sr/3, sr/6, 0, 2*Math.PI, true);
			canvasCtx.stroke();
			canvasCtx.beginPath();
			canvasCtx.moveTo(xr-sr/1.5,yr);
			canvasCtx.bezierCurveTo(xr-sr/1.5,yr+sr/2,xr+sr/1.5,yr+sr/2,xr+sr/1.5,yr);
			canvasCtx.stroke();
		}
	}
}