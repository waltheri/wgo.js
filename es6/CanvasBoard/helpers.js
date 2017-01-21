/**
 * Utilities methods for Canvas board 
 */

import {BLACK, WHITE} from "./../core";

export function themeVariable(key, board) {
	return typeof board.theme[key] == "function" ? board.theme[key](board) : board.theme[key];
}

export function getMarkupColor(board, x, y) {
	if(board.obj_arr[x][y][0].c == BLACK) return themeVariable("markupBlackColor", board);
	else if(board.obj_arr[x][y][0].c == WHITE) return themeVariable("markupWhiteColor", board);
	return themeVariable("markupNoneColor", board);
}

export function isHereStone(board, x, y) {
	return (board.obj_arr[x][y][0] && board.obj_arr[x][y][0].c == WHITE || board.obj_arr[x][y][0].c == BLACK);
}

export function redrawLayer(board, layer) {
	var obj, handler;
	
	board[layer].clear();
	board[layer].draw(board);
	
	for(var x = 0; x < board.size; x++) {
		for(var y = 0; y < board.size; y++) {
			for(var z = 0; z < board.obj_arr[x][y].length; z++) {
				obj = board.obj_arr[x][y][z];
				if(!obj.type) handler = themeVariable("stoneHandler", board);
				else if(typeof obj.type == "string") handler = themeVariable("markupHandlers", board)[obj.type];
				else handler = obj.type;
		
				if(handler[layer]) handler[layer].draw(board[layer].getContext(obj), obj, board);
			}
		}
	}
	
	for(var i = 0; i < board.obj_list.length; i++) {
		obj = board.obj_list[i];
		handler = obj.handler;
		
		if(handler[layer]) handler[layer].draw(board[layer].getContext(obj.args), obj.args, board);
	}
}

export function defaultFieldClear(canvasCtx, field, args, board) {
	canvasCtx.clearRect(0, 0, board.fieldWidth, board.fieldHeight);
}
