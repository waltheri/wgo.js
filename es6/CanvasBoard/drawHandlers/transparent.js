// transparent modificator

export default function(drawHandler) {
	return {
		stone: {
			draw: function(canvasCtx, args, board) {
				if(args.alpha) this.globalAlpha = args.alpha;
				else this.globalAlpha = 0.3;
				drawHandler.stone.draw.call(this, args, board);
				this.globalAlpha = 1;
			}
		}
	}
}