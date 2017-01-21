/**
 * Draws coordinates on the board 
 */

import {themeVariable} from "../helpers";

export default {
	grid: {
		draw: function(canvasCtx, args, board) {
			var t, xright, xleft, ytop, ybottom;
			
			canvasCtx.fillStyle = themeVariable("coordinatesColor", board);
			canvasCtx.textBaseline = "middle";
			canvasCtx.textAlign = "center";
			canvasCtx.font = board.stoneRadius+"px "+(board.font || "");
			
			xright = board.getX(-0.75);
			xleft = board.getX(board.size-0.25);
			ytop = board.getY(-0.75);
			ybottom = board.getY(board.size-0.25);
			
			const coordinatesX = themeVariable("coordinatesX", board);
			const coordinatesY = themeVariable("coordinatesY", board);

			for(var i = 0; i < board.size; i++) {
				t = board.getY(i);
				canvasCtx.fillText(coordinatesX[i], xright, t);
				canvasCtx.fillText(coordinatesX[i], xleft, t);
				
				t = board.getX(i);
				canvasCtx.fillText(coordinatesY[i], t, ytop);
				canvasCtx.fillText(coordinatesY[i], t, ybottom);
			}
			
			canvasCtx.fillStyle = "black";
		}
	}
}
