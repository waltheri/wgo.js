// size reducing modificator

export default function(drawHandler) {
	return {
		stone: {
			draw: function(canvasCtx, args, board) {
				board.stoneRadius = board.stoneRadius/2;
				drawHandler.stone.draw.call(canvasCtx, args, board);
				board.stoneRadius = board.stoneRadius*2;
			}
		}
	}
}