import {themeVariable} from "../helpers";

export default {
	grid: {
		draw: function(canvasCtx, args, board) {
			// draw grid
			var tmp;

			canvasCtx.beginPath();
			canvasCtx.lineWidth = themeVariable("gridLinesWidth", board);
			canvasCtx.strokeStyle = themeVariable("gridLinesColor", board);
			
			var tx = Math.round(board.left),
				ty = Math.round(board.top),
				bw = Math.round(board.fieldWidth*(board.size-1)),
				bh = Math.round(board.fieldHeight*(board.size-1));
			
			canvasCtx.strokeRect(tx-board.ls, ty-board.ls, bw, bh);

			for(var i = 1; i < board.size-1; i++) {
				tmp = Math.round(board.getX(i))-board.ls;
				canvasCtx.moveTo(tmp, ty);
				canvasCtx.lineTo(tmp, ty+bh);
				
				tmp = Math.round(board.getY(i))-board.ls;
				canvasCtx.moveTo(tx, tmp);
				canvasCtx.lineTo(tx+bw, tmp);
			}

			canvasCtx.stroke();
			
			// draw stars
			canvasCtx.fillStyle = themeVariable("starColor", board);
			
			if(board.starPoints[board.size]) {
				for(var key in board.starPoints[board.size]) {
					canvasCtx.beginPath();
					canvasCtx.arc(
						board.getX(board.starPoints[board.size][key].x)-board.ls, 
						board.getY(board.starPoints[board.size][key].y)-board.ls, 
						themeVariable("starSize", board), 0, 2*Math.PI,true
					);
					canvasCtx.fill();
				}
			}
		}
	}
}