/**
 * Generic shadow draw handler for all stones
 */

import { themeVariable } from "../helpers";

export default {
	draw: function (canvasCtx, args, board) {
		const stoneRadius = board.stoneRadius;
		const blur = themeVariable("shadowBlur", board);
		
		let gradient = canvasCtx.createRadialGradient(0, 0, stoneRadius - 1 - blur,	0, 0, stoneRadius + blur);
		gradient.addColorStop(0, themeVariable("shadowColor", board));
		gradient.addColorStop(1, themeVariable("shadowTransparentColor", board));

		canvasCtx.beginPath();
		canvasCtx.fillStyle = gradient;
		canvasCtx.arc(0, 0, stoneRadius + blur, 0, 2 * Math.PI, true);
		canvasCtx.fill();
	}
}
