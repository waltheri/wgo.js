/* Test of WGo.Game class and (handling of go game) */

import {assert} from "chai";
import * as WGo from "../src/core";
import Game from "../src/Game.js";
import Position from "../src/Position.js";

describe("Game", function() {
	describe("(1) Basic Game object functionality", function() {
		var game;
		
		beforeEach(function(){
			game = new Game();
		});
		
		it("Game is correctly created.", function() {
			assert(game.size === 19);
			assert(game.position.turn === WGo.B);
			assert.deepEqual(game.position.capCount, {black: 0, white: 0});
			assert(game.isOnBoard(0,0) === true);
			assert(game.isOnBoard(18,18) === true);
			assert(game.isOnBoard(-1,-1) === false);
			assert(game.isOnBoard(19,19) === false);
		});
		
		it("Basic methods - play(), pass().", function() {
			// move 1
			assert.deepEqual(game.play(5,5), []);
			assert(game.position.get(5,5) === WGo.B);
			assert(game.position.turn === WGo.W);
			
			// move 2
			assert.deepEqual(game.play(5,6), []);
			assert(game.position.get(5,6) === WGo.W);
			assert(game.position.turn === WGo.B);
			
			// move 3
			assert.deepEqual(game.play(5,7), []);
			assert(game.position.get(5,7) === WGo.B);
			assert(game.position.turn === WGo.W);
			
			// move 4 (color change)
			assert.deepEqual(game.play(6,6, WGo.B), []);
			assert(game.position.get(6,6) === WGo.B);
			assert(game.position.turn === WGo.W);
			
			// move 5 (pass)
			game.pass();
			assert(game.position.turn === WGo.B);
			assert(game.stack.length == 6);
			
			// move 6 (capture)
			assert.deepEqual(game.play(4,6), [{x:5, y:6}]);
			assert(game.position.get(5,6) === WGo.E);
			assert(game.getCaptureCount(WGo.B) == 1);
		});
		
		it("Add, set, get and remove stones.", function(){
			// add stones
			assert(game.addStone(9,9, WGo.B) === true);
			assert(game.position.get(9,9) === WGo.B);
			assert(game.addStone(10,10, WGo.W) === true);
			assert(game.addStone(10,10, WGo.W) === false);
			assert(game.addStone(10,10, WGo.B) === false);
			assert(game.position.get(10,10) === WGo.W);
			
			// set stones
			assert(game.setStone(9,10, WGo.W) === true);
			assert(game.position.get(9,10) === WGo.W);
			assert(game.setStone(10,10, WGo.B) === true);
			assert(game.position.get(10,10) === WGo.B);
			
			// get stone
			assert(game.getStone(9,9) === WGo.B);
			assert(game.getStone(-10,-10) === null);
			assert(game.getStone(11,11) === WGo.E);
			
			// remove stones
			assert(game.removeStone(10,10) === true);
			assert(game.position.get(10,10) === WGo.E);
			assert(game.removeStone(9,9) === true);
			assert(game.position.get(9,9) === WGo.E);
			assert(game.removeStone(10,9) === false);
			
			assert(game.stack.length == 1);
		});
		
		it("Capturing of big group", function(){
			game.addStone(2,4, WGo.B);
			game.addStone(1,5, WGo.B);
			game.addStone(2,5, WGo.W);
			game.addStone(3,5, WGo.B);
			game.addStone(4,5, WGo.B);
			game.addStone(0,6, WGo.B);
			game.addStone(1,6, WGo.W);
			game.addStone(2,6, WGo.W);
			game.addStone(3,6, WGo.W);
			game.addStone(4,6, WGo.W);
			game.addStone(5,6, WGo.B);
			game.addStone(0,7, WGo.W);
			game.addStone(1,7, WGo.W);
			game.addStone(2,7, WGo.W);
			game.addStone(4,7, WGo.W);
			game.addStone(5,7, WGo.B);
			game.addStone(0,8, WGo.B);
			game.addStone(1,8, WGo.B);
			game.addStone(2,8, WGo.W);
			game.addStone(3,8, WGo.W);
			game.addStone(4,8, WGo.B);
			game.addStone(2,9, WGo.B);
			game.addStone(3,9, WGo.B);

			assert.sameDeepMembers(game.play(3,7), [{x: 2, y: 5}, {x: 1, y: 6}, {x: 2, y: 6}, {x: 3, y: 6}, {x: 4, y: 6}, {x: 0, y: 7}, {x: 1, y: 7}, {x: 2, y: 7}, {x: 4, y: 7}, {x: 2, y: 8}, {x: 3, y: 8}]);
			
			assert(game.position.get(2,5) === WGo.E);
			assert(game.position.get(1,6) === WGo.E);
			assert(game.position.get(2,6) === WGo.E);
			assert(game.position.get(3,6) === WGo.E);
			assert(game.position.get(4,6) === WGo.E);
			assert(game.position.get(0,7) === WGo.E);
			assert(game.position.get(1,7) === WGo.E);
			assert(game.position.get(2,7) === WGo.E);
			assert(game.position.get(4,7) === WGo.E);
			assert(game.position.get(2,8) === WGo.E);
			assert(game.position.get(3,8) === WGo.E);
			assert(game.getCaptureCount(WGo.B) == 11);
			assert(game.getCaptureCount(WGo.W) == 0);
		})
		
		it("Invalid moves and suicides.", function(){
			// out of board
			assert(game.isValid(-1,-1) === false);
			assert(game.play(-1,-1) === Game.MOVE_OUT_OF_BOARD);
			assert(game.isValid(19,19) === false);
			assert(game.play(19,19) === Game.MOVE_OUT_OF_BOARD);
			assert(game.isValid(0,0) === true);
			assert(game.position.turn === WGo.B);
			assert(game.stack.length === 1);
			game.play(0,0);
			
			// occupied
			assert(game.play(0,0) === Game.FIELD_OCCUPIED);
			
			// suicide of 1 stone
			game.addStone(1,1,WGo.B);
			game.addStone(0,2,WGo.B);
			assert(game.play(0,1) === Game.MOVE_SUICIDE);
			
			// suicide of more stones
			game.addStone(1,0,WGo.W);
			game.addStone(2,1,WGo.W);
			game.addStone(1,2,WGo.W);
			game.addStone(0,3,WGo.W);
			assert(game.play(0,1, WGo.B) === Game.MOVE_SUICIDE);
			
			// repeated suicide
			assert.sameDeepMembers(game.play(0,1), [{x: 0, y: 0}, {x: 1, y: 1}, {x: 0,y: 2}]);
			assert(game.play(0,0) === Game.MOVE_SUICIDE);
			
			// ko
			game.addStone(2,0,WGo.B);
			game.addStone(3,1,WGo.B);
			game.addStone(2,2,WGo.B);
			assert.deepEqual(game.play(1,1), [{x: 2, y: 1}]);
			assert(game.play(2,1) === Game.POSITION_REPEATED);
			
			// threat
			game.play(5,5);
			game.play(5,6);
			assert(game.isValid(2,1) === true);
			assert.deepEqual(game.play(2,1), [{x: 1, y: 1}]);
			assert(game.isValid(1,1) === false);
		});
		
		it("Push, pop, validate and first position.", function(){
			var firstPosition = game.position.clone();
			
			// basic push position
			game.addStone(9,9,WGo.B);
			var position = game.getPosition();
			game.pushPosition();
			assert.deepEqual(position, game.position);
			
			game.addStone(9, 8, WGo.W);
			game.addStone(9, 10, WGo.W);
			game.addStone(8, 9, WGo.W);
			position = game.position;
			
			assert.deepEqual(game.play(10, 9, WGo.W), [{x: 9, y: 9}]);
			assert(game.position.get(9, 9) == WGo.E);
			
			// basic pop position
			var change = game.popPosition().compare(game.position);
			assert.sameDeepMembers(change.remove, [{x: 10, y: 9}]);
			assert.sameDeepMembers(change.add, [{x: 9, y: 9, c: WGo.B}]);
			
			assert.deepEqual(position, game.position);
			
			// push specific position
			var newPosition = new Position(19);
			newPosition.set(1,0,WGo.B).set(2,0,WGo.W).set(3,0,WGo.W).set(4,0,WGo.B).set(2,1,WGo.B).set(3,1,WGo.B);
			game.pushPosition(newPosition);
			
			assert.deepEqual(newPosition, game.position);
			
			// validate position
			assert.sameDeepMembers(game.validatePosition(), [{x:2, y:0}, {x:3, y:0}]);
			
			assert(game.position.get(2, 0) == WGo.E);
			assert(game.position.get(3, 0) == WGo.E);
			assert(game.getCaptureCount(WGo.B) == 2);
			
			// pop position again
			game.popPosition();
			assert.deepEqual(position, game.position);
			
			// first position
			game.firstPosition();
			assert.deepEqual(firstPosition, game.position);
		});
	});
});