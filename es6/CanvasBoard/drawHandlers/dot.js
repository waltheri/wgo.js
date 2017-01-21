import {getMarkupColor} from "../helpers";

export default {
	stone: {
		draw: function(canvasCtx, args, board) {
			var xr = board.getX(args.x),
				yr = board.getY(args.y),
				sr = board.stoneRadius;
				
			canvasCtx.fillStyle = args.c || getMarkupColor(board, args.x, args.y);
			canvasCtx.beginPath();
			canvasCtx.rect(xr-sr/2, yr-sr/2, sr, sr);
			canvasCtx.fill();
		}
	}
}