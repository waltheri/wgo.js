// Black and white stone
import {WHITE} from "../../core";
import {themeVariable} from "../helpers";

export default {
	stone: {
		draw: function(canvasCtx, args, board) {
			var xr = board.getX(args.x),
				yr = board.getY(args.y),
				sr = board.stoneRadius,
				lw = themeVariable("markupLinesWidth", board) || 1;
				
			if(args.c == WHITE) canvasCtx.fillStyle = "white";
			else canvasCtx.fillStyle = "black";			
			
			canvasCtx.beginPath();
			canvasCtx.arc(xr, yr, Math.max(0, sr-lw), 0, 2*Math.PI, true);
			canvasCtx.fill();
			
			canvasCtx.lineWidth = lw;
			canvasCtx.strokeStyle = "black";
			canvasCtx.stroke();
		}
	},
}
