import {WHITE} from "../../core";
import shadow from "./stoneShadow";

export default {
	stone: {
		draw: function(canvasCtx, args, board) {
			var xr = board.getX(args.x),
				yr = board.getY(args.y),
				sr = board.stoneRadius,
				radgrad;
				
			if(args.c == WHITE) {
				radgrad = canvasCtx.createRadialGradient(xr-2*sr/5,yr-2*sr/5,2,xr-sr/5,yr-sr/5,4*sr/5);
				radgrad.addColorStop(0, '#fff');
				radgrad.addColorStop(1, '#ddd');
			}
			else {
				radgrad = canvasCtx.createRadialGradient(xr-2*sr/5,yr-2*sr/5,1,xr-sr/5,yr-sr/5,4*sr/5);
				radgrad.addColorStop(0, '#111');
				radgrad.addColorStop(1, '#000');				
			}
			
			canvasCtx.beginPath();
			canvasCtx.fillStyle = radgrad;
			canvasCtx.arc(xr-board.ls, yr-board.ls, Math.max(0, sr-0.5), 0, 2*Math.PI, true);
			canvasCtx.fill();
			
			canvasCtx.beginPath();
			canvasCtx.lineWidth = sr/6;
			
			if(args.c == WHITE) {
				canvasCtx.strokeStyle = '#999';
				canvasCtx.arc(xr+sr/8, yr+sr/8, sr/2, 0, Math.PI/2, false);
			}
			else {
				canvasCtx.strokeStyle = '#ccc';
				canvasCtx.arc(xr-sr/8, yr-sr/8, sr/2, Math.PI, 1.5*Math.PI);
			}
			
			canvasCtx.stroke();
		}
	},
	shadow,
}