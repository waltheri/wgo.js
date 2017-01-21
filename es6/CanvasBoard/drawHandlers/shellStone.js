import {WHITE} from "../../core";
import shadow from "./stoneShadow";

// shell stone helping functions
var shellSeed;

var drawShellLine = function(ctx, x, y, radius, startAngle, endAngle, factor, thickness) {
	ctx.strokeStyle = "rgba(64,64,64,0.2)";

	ctx.lineWidth = (radius/30)*thickness;
	ctx.beginPath();
	
	radius -= Math.max(1, ctx.lineWidth);
	
	var x1 = x + radius*Math.cos(startAngle*Math.PI);
	var y1 = y + radius*Math.sin(startAngle*Math.PI);
	var x2 = x + radius*Math.cos(endAngle*Math.PI);
	var y2 = y + radius*Math.sin(endAngle*Math.PI);
	
	var m, angle, diffX, diffY;
	if(x2 > x1) {
		m = (y2-y1)/(x2-x1);
		angle = Math.atan(m);
	}
	else if(x2 == x1) {
		angle = Math.PI/2;
	}
	else {
		m = (y2-y1)/(x2-x1);
		angle = Math.atan(m)-Math.PI;
	}

	var c = factor*radius;
	diffX = Math.sin(angle) * c;
	diffY = Math.cos(angle) * c;

	var bx1 = x1 + diffX;
	var by1 = y1 - diffY;
	
	var bx2 = x2 + diffX;
	var by2 = y2 - diffY;
	
	ctx.moveTo(x1,y1);
	ctx.bezierCurveTo(bx1, by1, bx2, by2, x2, y2);
	ctx.stroke();
}

var drawShell = function(arg) {
	var fromAngle = arg.angle;
	var toAngle = arg.angle;
	
	for(var i = 0; i < arg.lines.length; i++) {
		fromAngle += arg.lines[i];
		toAngle -= arg.lines[i];
		drawShellLine(arg.ctx, arg.x, arg.y, arg.radius, fromAngle, toAngle, arg.factor, arg.thickness);
	}
}

export default {
	stone: {
		draw: function(canvasCtx, args, board) {
			var xr,
				yr,
				sr = board.stoneRadius;
			
			shellSeed = shellSeed || Math.ceil(Math.random()*9999999);
			
			xr = board.getX(args.x);
			yr = board.getY(args.y);
				
			var radgrad;

			if(args.c == WHITE) {
				radgrad = "#aaa";
			}
			else {
				radgrad = "#000";
			}
			
			canvasCtx.beginPath();
			canvasCtx.fillStyle = radgrad;
			canvasCtx.arc(xr-board.ls, yr-board.ls, Math.max(0, sr-0.5), 0, 2*Math.PI, true);
			canvasCtx.fill();
			
			// do shell magic here
			if(args.c == WHITE) {
				// do shell magic here
				var type = shellSeed%(3+args.x*board.size+args.y)%3;
				var z = board.size*board.size+args.x*board.size+args.y;
				var angle = (2/z)*(shellSeed%z);

				if(type == 0) {
					drawShell({
						ctx: canvasCtx,
						x: xr,
						y: yr,
						radius: sr,
						angle: angle,
						lines: [0.10, 0.12, 0.11, 0.10, 0.09, 0.09, 0.09, 0.09],
						factor: 0.25,
						thickness: 1.75
					});
				}
				else if(type == 1) {
					drawShell({
						ctx: canvasCtx,
						x: xr,
						y: yr,
						radius: sr,
						angle: angle,
						lines: [0.10, 0.09, 0.08, 0.07, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
						factor: 0.2,
						thickness: 1.5
					});
				}
				else {
					drawShell({
						ctx: canvasCtx,
						x: xr,
						y: yr,
						radius: sr,
						angle: angle,
						lines: [0.12, 0.14, 0.13, 0.12, 0.12, 0.12],
						factor: 0.3,
						thickness: 2
					});
				}
				radgrad = canvasCtx.createRadialGradient(xr-2*sr/5,yr-2*sr/5,sr/3,xr-sr/5,yr-sr/5,5*sr/5);
				radgrad.addColorStop(0, 'rgba(255,255,255,0.9)');
				radgrad.addColorStop(1, 'rgba(255,255,255,0)');
				
				// add radial gradient //
				canvasCtx.beginPath();
				canvasCtx.fillStyle = radgrad;
				canvasCtx.arc(xr-board.ls, yr-board.ls, Math.max(0, sr-0.5), 0, 2*Math.PI, true);
				canvasCtx.fill();
			}
			else {
				radgrad = canvasCtx.createRadialGradient(xr+0.4*sr, yr+0.4*sr, 0, xr+0.5*sr, yr+0.5*sr, sr);
				radgrad.addColorStop(0, 'rgba(32,32,32,1)');
				radgrad.addColorStop(1, 'rgba(0,0,0,0)');
				
				canvasCtx.beginPath();
				canvasCtx.fillStyle = radgrad;
				canvasCtx.arc(xr-board.ls, yr-board.ls, Math.max(0, sr-0.5), 0, 2*Math.PI, true);
				canvasCtx.fill();
			
				radgrad = canvasCtx.createRadialGradient(xr-0.4*sr, yr-0.4*sr, 1, xr-0.5*sr, yr-0.5*sr, 1.5*sr);
				radgrad.addColorStop(0, 'rgba(64,64,64,1)');
				radgrad.addColorStop(1, 'rgba(0,0,0,0)');
				
				canvasCtx.beginPath();
				canvasCtx.fillStyle = radgrad;
				canvasCtx.arc(xr-board.ls, yr-board.ls, Math.max(0, sr-0.5), 0, 2*Math.PI, true);
				canvasCtx.fill();
			}
		}
	},
	shadow,
}
