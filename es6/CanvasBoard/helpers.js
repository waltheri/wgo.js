/**
 * Utilities methods for Canvas board 
 */

import { BLACK, WHITE } from "./../core";

export function themeVariable(key, board) {
	return typeof board.theme[key] == "function" ? board.theme[key](board) : board.theme[key];
}

export function getMarkupColor(board, x, y) {
	if (board.obj_arr[x][y][0].c == BLACK) return themeVariable("markupBlackColor", board);
	else if (board.obj_arr[x][y][0].c == WHITE) return themeVariable("markupWhiteColor", board);
	return themeVariable("markupNoneColor", board);
}

export function isHereStone(board, x, y) {
	return (board.obj_arr[x][y][0] && board.obj_arr[x][y][0].c == WHITE || board.obj_arr[x][y][0].c == BLACK);
}

export function defaultFieldClear(canvasCtx, args, board) {
	canvasCtx.clearRect(-board.fieldWidth / 2, -board.fieldHeight / 2, board.fieldWidth, board.fieldHeight);
}

export var gridClearField = {
	draw: function (canvasCtx, args, board) {
		if (!isHereStone(board, args.x, args.y) && !args._nodraw) {
			const stoneRadius = board.stoneRadius;

			canvasCtx.clearRect(-stoneRadius, -stoneRadius, 2 * stoneRadius, 2 * stoneRadius);
		}
	},
	clear: function (canvasCtx, args, board) {
		if (!isHereStone(board, args.x, args.y)) {
			args._nodraw = true;
			canvasCtx.restore(); // small hack for now
			board.redrawLayer("grid");
			canvasCtx.save();
			delete args._nodraw;
		}
	}
}
