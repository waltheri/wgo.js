// size reducing modificator

export default function(drawHandler) {
	return {
		stone: {
			draw: function(canvasCtx, args, board) {
				const stoneRadius = board.stoneRadius;

				// temporary reduce stone radius
				board.stoneRadius = board.stoneRadius/2;
				drawHandler.stone.draw.call(canvasCtx, args, board);
				
				// revert it
				board.stoneRadius = stoneRadius;
			}
		}
	}
}