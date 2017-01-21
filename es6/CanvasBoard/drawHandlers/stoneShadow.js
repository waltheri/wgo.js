/**
 * Generic shadow draw handler for all stones
 */

import { themeVariable } from "../helpers";

export default {
	draw: function (canvasCtx, {x, y, stoneRadius}, args, board) {
		const blur = themeVariable("shadowBlur", board);
		
		let gradient = canvasCtx.createRadialGradient(
			x,
			y,
			stoneRadius - 1 - blur,
			x,
			y,
			stoneRadius + blur
		);
		gradient.addColorStop(0, themeVariable("shadowColor", board));
		gradient.addColorStop(1, themeVariable("shadowTransparentColor", board));

		canvasCtx.beginPath();
		canvasCtx.fillStyle = gradient;
		canvasCtx.arc(x, y, stoneRadius + blur, 0, 2 * Math.PI, true);
		canvasCtx.fill();
	}
}
