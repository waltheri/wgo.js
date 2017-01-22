// transparent modificator

export default function (drawHandler) {
	return {
		stone: {
			draw: function (canvasCtx, args, board) {
				if (args.alpha) canvasCtx.globalAlpha = args.alpha;
				else canvasCtx.globalAlpha = 0.3;
				drawHandler.stone.draw.call(canvasCtx, args, board);
				canvasCtx.globalAlpha = 1;
			}
		}
	}
}