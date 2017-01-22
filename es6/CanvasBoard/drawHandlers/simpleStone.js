// Black and white stone
import {WHITE} from "../../core";
import {themeVariable} from "../helpers";

export default {
	stone: {
		draw: function(canvasCtx, args, board) {
			const stoneRadius = board.stoneRadius;
			const lw = themeVariable("markupLinesWidth", board) || 1;
				
			if(args.c == WHITE) canvasCtx.fillStyle = "white";
			else canvasCtx.fillStyle = "black";			
			
			canvasCtx.beginPath();
			canvasCtx.arc(0, 0, Math.max(0, stoneRadius-lw), 0, 2*Math.PI, true);
			canvasCtx.fill();
			
			canvasCtx.lineWidth = lw;
			canvasCtx.strokeStyle = "black";
			canvasCtx.stroke();
		}
	},
}
