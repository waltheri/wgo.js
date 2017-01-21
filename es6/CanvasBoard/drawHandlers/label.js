import {getMarkupColor, themeVariable, isHereStone, redrawLayer} from "../helpers";

export default {
	stone: {
		draw: function(canvasCtx, args, board) {
			var xr = board.getX(args.x),
				yr = board.getY(args.y),
				sr = board.stoneRadius,
				font = args.font || themeVariable("font", board) || "";
			
			canvasCtx.fillStyle = args.c || getMarkupColor(board, args.x, args.y);
			
			if(args.text.length == 1) canvasCtx.font = Math.round(sr*1.5)+"px "+font;
			else if(args.text.length == 2) canvasCtx.font = Math.round(sr*1.2)+"px "+font;
			else canvasCtx.font = Math.round(sr)+"px "+font;
			
			canvasCtx.beginPath();
			canvasCtx.textBaseline="middle";
			canvasCtx.textAlign="center";
			canvasCtx.fillText(args.text, xr, yr, 2*sr);
			
		},
	},
	
	// modifies grid layer too
	grid: {
		draw: function(canvasCtx, args, board) {
			if(!isHereStone(board, args.x, args.y) && !args._nodraw) {
				var xr = board.getX(args.x),
					yr = board.getY(args.y),
					sr = board.stoneRadius;
				this.clearRect(xr-sr,yr-sr,2*sr,2*sr);
			}
		},
		clear: function(canvasCtx, args, board) {
			if(!isHereStone(board, args.x, args.y))  {
				args._nodraw = true;
				redrawLayer(board, "grid");
				delete args._nodraw;
			}
		}
	},
}
