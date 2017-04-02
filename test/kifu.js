/* Test of WGo kifu classes and functionality */

import {assert} from "chai";
import * as WGo from "../es6/core";
import Kifu, {KifuError, KNode} from "../es6/Kifu";
import {rules, defaultRules} from "../es6/Game";
import {CHINESE_RULES, NO_RULES} from "../es6/Game/rules";

describe("Kifu", function() {
	describe("(1) Kifu object is created correctly", () => {
		it("No arguments", function() {
			var kifu = new Kifu();
			
			assert.instanceOf(kifu.rootNode, KNode);
			assert.strictEqual(kifu.rootNode, kifu.currentNode);
			assert.strictEqual(kifu.ruleSet, rules[defaultRules]);
			assert.strictEqual(kifu.rootNode.getProperty("RU"), defaultRules);
			assert.strictEqual(kifu.rootNode.getProperty("SZ"), 19);
		});
		
		it("With board size argument", function() {
			var kifu = new Kifu(9);
			
			assert.instanceOf(kifu.rootNode, KNode);
			assert.strictEqual(kifu.rootNode, kifu.currentNode);
			assert.strictEqual(kifu.ruleSet, rules[defaultRules]);
			assert.strictEqual(kifu.rootNode.getProperty("RU"), defaultRules);
			assert.strictEqual(kifu.rootNode.getProperty("SZ"), 9);
		});
		
		it("With board size and rules arguments", function() {
			var kifu = new Kifu(9, "Chinese");
			
			assert.instanceOf(kifu.rootNode, KNode);
			assert.strictEqual(kifu.rootNode, kifu.currentNode);
			assert.strictEqual(kifu.ruleSet, CHINESE_RULES);
			assert.strictEqual(kifu.rootNode.getProperty("RU"), "Chinese");
			assert.strictEqual(kifu.rootNode.getProperty("SZ"), 9);
		});
		
		it("With unknown rules", function() {
			var kifu = new Kifu(19, "Foo");

			assert.strictEqual(kifu.ruleSet, rules[defaultRules]);
			assert.strictEqual(kifu.rootNode.getProperty("RU"), "Foo");
		});
		
		it("With no rules", function() {
			var kifu = new Kifu(19, NO_RULES);

			assert.strictEqual(kifu.ruleSet, NO_RULES);
			assert.equal(kifu.rootNode.getProperty("RU"), null);
		});
		
		it("With KNode argument", function() {
			var kNode = KNode.fromSGF("(;PB[Foo]PW[Bar];B[ij])");
			var childNode = kNode.children[0];
			var kifu = new Kifu(childNode);

			assert.strictEqual(kifu.rootNode, kNode);
			assert.strictEqual(kifu.currentNode, childNode);
			assert.strictEqual(kifu.ruleSet, rules[defaultRules]);
			assert.equal(kifu.rootNode.getProperty("RU"), null);
		});
		
		it("With KNode argument with rules", function() {
			var kNode = KNode.fromSGF("(;RU[Chinese];B[ij])");
			var kifu = new Kifu(kNode);

			assert.strictEqual(kifu.rootNode, kNode);
			assert.strictEqual(kifu.currentNode, kNode);			
			assert.strictEqual(kifu.rootNode.getProperty("RU"), "Chinese");
			assert.strictEqual(kifu.ruleSet, CHINESE_RULES);
		});
	});
	
	describe("(2) Kifu traversing methods", () => {
		var kifu, kNode;
		
		beforeEach(() => {
			kNode = KNode.fromSGF("(;SZ[19](;B[ji];W[gg])(;B[ij]))");
			kifu = new Kifu(kNode);
		});

		it("Method next()", () => {
			assert.strictEqual(kifu.currentNode, kNode);
			kifu.next();
			assert.strictEqual(kifu.rootNode, kNode);
			assert.strictEqual(kifu.currentNode, kNode.children[0]);
			assert.lengthOf(kifu.game.stack, 2);
			assert.strictEqual(kifu.game.position.get(9, 8), WGo.B);
			assert.strictEqual(kifu.game.turn, WGo.W);
		});

		it("Method next() with index parameter", () => {
			kifu.next(1);
			assert.strictEqual(kifu.rootNode, kNode);
			assert.strictEqual(kifu.currentNode, kNode.children[1]);
			assert.lengthOf(kifu.game.stack, 2);
			assert.strictEqual(kifu.game.position.get(8, 9), WGo.B);
			assert.strictEqual(kifu.game.turn, WGo.W);
		});

		it("Method last()", () => {
			kifu.last();
			assert.strictEqual(kifu.rootNode, kNode);
			assert.strictEqual(kifu.currentNode, kNode.children[0].children[0]);
			assert.lengthOf(kifu.game.stack, 3);
			assert.strictEqual(kifu.game.position.get(9, 8), WGo.B);
			assert.strictEqual(kifu.game.position.get(6, 6), WGo.W);
			assert.strictEqual(kifu.game.turn, WGo.B);
		});

		it("Method previous()", () => {
			kifu.last();
			kifu.previous();
			assert.strictEqual(kifu.rootNode, kNode);
			assert.strictEqual(kifu.currentNode, kNode.children[0]);
			assert.lengthOf(kifu.game.stack, 2);
			assert.strictEqual(kifu.game.position.get(9, 8), WGo.B);
			assert.strictEqual(kifu.game.position.get(6, 6), WGo.E);
			assert.strictEqual(kifu.game.turn, WGo.W);
		});

		it("Method first()", () => {
			kifu.last();
			kifu.first();
			assert.strictEqual(kifu.rootNode, kNode);
			assert.strictEqual(kifu.currentNode, kNode);
			assert.lengthOf(kifu.game.stack, 1);
			assert.strictEqual(kifu.game.position.get(9, 8), WGo.E);
			assert.strictEqual(kifu.game.position.get(6, 6), WGo.E);
			assert.strictEqual(kifu.game.turn, WGo.B);
		});

		it("Correct position setting up.", () => {
			kifu = Kifu.fromSGF("(;SZ[19]AB[ah][bf]PL[W];AW[bg][ah]AB[ai]AE[bf])");
			assert.strictEqual(kifu.game.position.get(0, 7), WGo.B);
			assert.strictEqual(kifu.game.position.get(1, 5), WGo.B);
			assert.strictEqual(kifu.game.turn, WGo.W);

			kifu.next();
			assert.strictEqual(kifu.game.position.get(0, 7), WGo.W);
			assert.strictEqual(kifu.game.position.get(1, 5), WGo.E);
			assert.strictEqual(kifu.game.position.get(1, 6), WGo.W);
			assert.strictEqual(kifu.game.position.get(0, 8), WGo.B);
			assert.strictEqual(kifu.game.turn, WGo.W);
		});
	});

	describe("(3) Node manipulation (adding, removing)", () => {
		var kifu;
		
		beforeEach(() => {
			var kNode = KNode.fromSGF("(;SZ[19](;B[ij])(;B[ji];W[gg]))");
			kifu = new Kifu(kNode);
		});
		
		it("Add new branch at the end", () => {
			kifu.addNode();
			assert.lengthOf(kifu.currentNode.children, 3);
			assert.instanceOf(kifu.currentNode.children[2], KNode);
		});

		it("Add new branch at the specific position", () => {
			kifu.addNode(1);
			assert.lengthOf(kifu.currentNode.children, 3);
			assert.instanceOf(kifu.currentNode.children[1], KNode);
			assert.strictEqual(kifu.currentNode.children[0].getSGFProperty("B"), "[ij]");
			assert.strictEqual(kifu.currentNode.children[2].getSGFProperty("B"), "[ji]");
		});
		it("Add specific branch at the beginning", () => {
			kifu.addNode(KNode.fromSGF("(;B[aa])"), 0);
			assert.lengthOf(kifu.currentNode.children, 3);
			assert.instanceOf(kifu.currentNode.children[0], KNode);
			assert.strictEqual(kifu.currentNode.children[0].getSGFProperty("B"), "[aa]");
		});
		it("Move branch", () => {
			kifu.moveNode(0,1);
			assert.lengthOf(kifu.currentNode.children, 2);
			assert.strictEqual(kifu.currentNode.children[0].getSGFProperty("B"), "[ji]");
			assert.strictEqual(kifu.currentNode.children[1].getSGFProperty("B"), "[ij]");
			kifu.moveNode(1,0);
			assert.strictEqual(kifu.currentNode.children[0].getSGFProperty("B"), "[ij]");
			assert.strictEqual(kifu.currentNode.children[1].getSGFProperty("B"), "[ji]");
		});
		it("Remove entire branch", () => {
			var removedNode = kifu.removeNode();
			assert.lengthOf(kifu.currentNode.children, 1);
			assert.strictEqual(kifu.currentNode.children[0].getSGFProperty("B"), "[ij]");
			assert.strictEqual(removedNode.getSGFProperty("B"), "[ji]");
		});
		it("Remove entire branch at specific position", () => {
			var removedNode = kifu.removeNode(0);
			assert.lengthOf(kifu.currentNode.children, 1);
			assert.strictEqual(kifu.currentNode.children[0].getSGFProperty("B"), "[ji]");
			assert.strictEqual(removedNode.getSGFProperty("B"), "[ij]");
		});
	});
	
	describe("(4) Markup", () => {
		var kifu;
		
		beforeEach(() => {
			var kNode = KNode.fromSGF("(;SZ[19]CR[ae]TR[be])");
			kifu = new Kifu(kNode);
		});

		it("Get all markup.", () => {
			var markup;

			markup = kifu.getMarkup();
			assert.sameDeepMembers([{x: 0, y: 4, type: "CR"}, {x: 1, y: 4, type: "TR"}], markup);
		});
		
		it("Get markup at specific position.", () => {
			var markup;
			
			markup = kifu.getMarkupAt(0, 4);
			assert.deepEqual({x: 0, y: 4, type: "CR"}, markup);

			markup = kifu.getMarkupAt(0, 5);
			assert.isNull(markup);
		});

		it("Set markup", () => {
			kifu.setMarkup(0, 4, "SQ");
			assert.equal(kifu.currentNode.getSGFProperty("SQ"), "[ae]");
			assert.isNotOk(kifu.currentNode.getSGFProperty("CR"));
			
			kifu.setMarkup({x: 1, y: 4, type: "SL"});
			assert.equal(kifu.currentNode.getSGFProperty("SL"), "[be]");
			assert.isNotOk(kifu.currentNode.getSGFProperty("TR"));
		});
		
		it("Remove markup", () => {
			kifu.removeMarkup(0, 4);
			assert.isNotOk(kifu.currentNode.getSGFProperty("CR"));
			
			kifu.setMarkup({x: 2, y: 4, type: "TR"});
			assert.sameDeepMembers(kifu.currentNode.getProperty("TR"), [{x:1, y:4}, {x:2, y:4}]);
			kifu.removeMarkup({x: 1, y: 4});
			assert.equal(kifu.currentNode.getSGFProperty("TR"), "[ce]");
		});
	});

	describe("(5) Setup", () => {
		var kifu;
		
		beforeEach(() => {
			kifu = new Kifu(KNode.fromSGF("(;SZ[19]AB[ae]AW[be];B[ce])"));
		});
		
		it("Get all setup stones.", () => {
			var setup;

			setup = kifu.getSetup();
			assert.sameDeepMembers([{x: 0, y: 4, c: WGo.B}, {x: 1, y: 4, c: WGo.W}], setup);
		});

		it("Get setup stone at position.", () => {
			var setup;
			
			setup = kifu.getSetupAt(0, 4);
			assert.deepEqual({x: 0, y: 4, c: WGo.B}, setup);

			setup = kifu.getSetupAt(0, 5);
			assert.isNull(setup);
		});

		it("Set setup.", () => {
			kifu.setSetup(0, 4, WGo.W);
			assert.sameDeepMembers(kifu.currentNode.getProperty("AW"), [{x: 0, y: 4}, {x: 1, y: 4}]);
			assert.strictEqual(kifu.game.position.get(0, 4), WGo.W);
			assert.strictEqual(kifu.game.position.get(1, 4), WGo.W);

			kifu.setSetup({x: 1, y: 4, c: WGo.B});
			assert.equal(kifu.currentNode.getSGFProperty("AW"), "[ae]");
			assert.equal(kifu.currentNode.getSGFProperty("AB"), "[be]");
			assert.strictEqual(kifu.game.position.get(0, 4), WGo.W);
			assert.strictEqual(kifu.game.position.get(1, 4), WGo.B);

			kifu.next();
			assert.throws(() => kifu.setSetup(1, 1, WGo.B), KifuError);

			kifu.addNode();
			kifu.next();
			assert.strictEqual(kifu.game.position.get(2, 4), WGo.B);
			kifu.setSetup(2, 4, WGo.E);
			assert.equal(kifu.currentNode.getSGFProperty("AE"), "[ce]");
			assert.strictEqual(kifu.game.position.get(2, 4), WGo.E);
		});

		it("Remove setup.", () => {
			kifu.removeSetup(1, 4);
			assert.isNotOk(kifu.currentNode.getSGFProperty("AW"));
			assert.equal(kifu.currentNode.getSGFProperty("AB"), "[ae]");
			assert.strictEqual(kifu.game.position.get(0, 4), WGo.B);
			assert.strictEqual(kifu.game.position.get(1, 4), WGo.E);

			kifu.setSetup(1, 4, WGo.B);
			kifu.removeSetup(0, 4);
			assert.equal(kifu.currentNode.getSGFProperty("AB"), "[be]");
			assert.strictEqual(kifu.game.position.get(0, 4), WGo.E);
			assert.strictEqual(kifu.game.position.get(1, 4), WGo.B);

			kifu.last();
			kifu.addNode();
			kifu.next();
			assert.strictEqual(kifu.game.position.get(2, 4), WGo.B);
			kifu.setSetup(2, 4, WGo.W);
			assert.strictEqual(kifu.game.position.get(2, 4), WGo.W);
			kifu.removeSetup(2, 4);
			assert.strictEqual(kifu.game.position.get(2, 4), WGo.B);
			assert.isNotOk(kifu.currentNode.getSGFProperty("AW"));
		});
	});

	describe("(7) Move related methods.", () => {
		var kifu;
		
		beforeEach(() => {
			kifu = new Kifu(KNode.fromSGF("(;SZ[19];B[ce];AB[ae])"));
		});

		it("Get move", () => {
			var move;
			
			move = kifu.getMove();
			assert.isNull(move);

			kifu.next();
			move = kifu.getMove();
			assert.deepEqual({x: 2, y: 4, c: WGo.B}, move);
		});

		it("Set move", () => {
			var move;

			kifu.next();
			assert.strictEqual(kifu.game.position.get(2, 4), WGo.B);
			kifu.setMove(2, 5, WGo.W);
			move = kifu.getMove();

			assert.deepEqual({x: 2, y: 5, c: WGo.W}, move);
			assert.isNotOk(kifu.currentNode.getSGFProperty("B"));
			assert.strictEqual(kifu.currentNode.getSGFProperty("W"), "[cf]");
			assert.strictEqual(kifu.game.position.get(2, 5), WGo.W);
			assert.strictEqual(kifu.game.position.get(2, 4), WGo.E);

			kifu.setMove({x: 1, y: 5, c: WGo.B});
			move = kifu.getMove();

			assert.deepEqual({x: 1, y: 5, c: WGo.B}, move);
			assert.isNotOk(kifu.currentNode.getSGFProperty("W"));
			assert.strictEqual(kifu.currentNode.getSGFProperty("B"), "[bf]");
			assert.strictEqual(kifu.game.position.get(2, 5), WGo.E);
			assert.strictEqual(kifu.game.position.get(2, 4), WGo.E);
			assert.strictEqual(kifu.game.position.get(1, 5), WGo.B);
			
			kifu.next();
			assert.throws(() => kifu.setMove(1, 1, WGo.B), KifuError);

			kifu.first();
			assert.throws(() => kifu.setMove(1, 1, WGo.B), KifuError);
		});

		it("Remove move", () => {
			var move;
			kifu.next();
			kifu.removeMove();
			move = kifu.getMove();

			assert.isNull(move);
			assert.isNotOk(kifu.currentNode.getSGFProperty("B"));
			assert.strictEqual(kifu.game.position.get(2, 4), WGo.E);
		});

		it("Get turn", () => {
			assert.strictEqual(kifu.getTurn(), WGo.B);
			kifu.next();
			assert.strictEqual(kifu.getTurn(), WGo.W);
		});

		it("Set turn", () => {
			kifu.next();
			assert.throws(() => kifu.setTurn(1, 1, WGo.B), KifuError);

			kifu.next();
			assert.strictEqual(kifu.getTurn(), WGo.W);

			kifu.setTurn(WGo.B);
			assert.strictEqual(kifu.getTurn(), WGo.B);
			assert.strictEqual(kifu.currentNode.getSGFProperty("PL"), "[B]");

			kifu.setTurn(WGo.W);
			assert.strictEqual(kifu.getTurn(), WGo.W);
			assert.strictEqual(kifu.currentNode.getSGFProperty("PL"), "[W]");

			kifu.setTurn();
			assert.strictEqual(kifu.getTurn(), WGo.W);
			assert.isNotOk(kifu.currentNode.getSGFProperty("PL"));
		});
	});

	describe("(8) Other helper methods.", () => {
		it("Method play (creating a new variant)", () => {
			var kifu = Kifu.fromSGF("(;SZ[19];B[ce])");

			kifu.play({x: 1, y: 4, c: WGo.B});
			assert.lengthOf(kifu.rootNode.children, 2);
			assert.strictEqual(kifu.currentNode, kifu.rootNode.children[1]);
			assert.deepEqual(kifu.getMove(), {x: 1, y: 4, c: WGo.B});
			assert.strictEqual(kifu.currentNode.getSGFProperty("B"), "[be]");
			assert.strictEqual(kifu.getPosition().get(1,4), WGo.B);
		});

		it("Method play (within a current branch)", () => {
			var kifu = Kifu.fromSGF("(;SZ[19];B[ce])");

			kifu.play({x: 1, y: 4, c: WGo.B}, false);
			assert.lengthOf(kifu.rootNode.children, 1);
			assert.strictEqual(kifu.currentNode, kifu.rootNode.children[0]);
			assert.lengthOf(kifu.currentNode.children, 1);

			assert.deepEqual(kifu.getMove(), {x: 1, y: 4, c: WGo.B});
			assert.strictEqual(kifu.currentNode.getSGFProperty("B"), "[be]");
			assert.strictEqual(kifu.getPosition().get(1,4), WGo.B);

			kifu.next();
			assert.deepEqual(kifu.getMove(), {x: 2, y: 4, c: WGo.B});
			assert.strictEqual(kifu.currentNode.getSGFProperty("B"), "[ce]");
			assert.strictEqual(kifu.getPosition().get(1,4), WGo.B);
			assert.strictEqual(kifu.getPosition().get(2,4), WGo.B);
		});
	});
});
