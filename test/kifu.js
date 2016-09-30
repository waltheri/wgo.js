/* Test of WGo kifu classes and functionality */

import {assert} from "chai";
import * as WGo from "../src/core";
import Kifu from "../src/kifu/Kifu";
import KNode from "../src/kifu/KNode";
import Game, {rules, DEFAULT_RULES, CHINESE_RULES, NO_RULES} from "../src/Game";

describe("Kifu", function() {
	describe("(1) Kifu object is created correctly", function() {
		it("No arguments", function() {
			var kifu = new Kifu();
			
			assert.instanceOf(kifu.rootNode, KNode);
			assert(kifu.rootNode === kifu.currentNode);
			assert(kifu.ruleSet === rules[DEFAULT_RULES]);
			assert(kifu.rootNode.getProperty("RU") === DEFAULT_RULES);
			assert(kifu.rootNode.getProperty("SZ") === 19);
		});
		
		it("With board size argument", function() {
			var kifu = new Kifu(9);
			
			assert.instanceOf(kifu.rootNode, KNode);
			assert(kifu.rootNode === kifu.currentNode);
			assert(kifu.ruleSet === rules[DEFAULT_RULES]);
			assert(kifu.rootNode.getProperty("RU") === DEFAULT_RULES);
			assert(kifu.rootNode.getProperty("SZ") === 9);
		});
		
		it("With board size and rules arguments", function() {
			var kifu = new Kifu(9, "Chinese");
			
			assert.instanceOf(kifu.rootNode, KNode);
			assert(kifu.rootNode === kifu.currentNode);
			assert(kifu.ruleSet === CHINESE_RULES);
			assert(kifu.rootNode.getProperty("RU") === "Chinese");
			assert(kifu.rootNode.getProperty("SZ") === 9);
		});
		
		it("With unknown rules", function() {
			var kifu = new Kifu(19, "Foo");

			assert(kifu.ruleSet === rules[DEFAULT_RULES]);
			assert(kifu.rootNode.getProperty("RU") === "Foo");
		});
		
		it("With no rules", function() {
			var kifu = new Kifu(19, NO_RULES);

			assert(kifu.ruleSet === NO_RULES);
			assert(kifu.rootNode.getProperty("RU") == null);
		});
		
		it("With KNode argument", function() {
			var kNode = KNode.fromSGF("(;PB[Foo]PW[Bar];B[ij])");
			var childNode = kNode.children[0];
			var kifu = new Kifu(childNode);

			assert(kifu.rootNode === kNode);
			assert(kifu.currentNode === childNode);
			assert(kifu.ruleSet === rules[DEFAULT_RULES]);
			assert(kifu.rules == null);
		});
		
		it("With KNode argument with rules", function() {
			var kNode = KNode.fromSGF("(;RU[Chinese];B[ij])");
			var kifu = new Kifu(kNode);

			assert(kifu.rootNode === kNode);
			assert(kifu.currentNode === kNode);			
			assert(kifu.rules === "Chinese");
			assert(kifu.ruleSet === CHINESE_RULES);
		});
	});
	
	describe("(2) Node manipulation (adding, removing)", () => {
		var kifu;
		
		beforeEach(() => {
			var kNode = KNode.fromSGF("(;SZ[19](;B[ij])(;B[ji];W[gg]))");
			kifu = new Kifu(kNode);
		});
		
		it("Add new node at the end", () => {
			kifu.addNode();
			assert(kifu.currentNode.children.length === 3);
			assert.instanceOf(kifu.currentNode.children[2], KNode);
		});
		it("Add new node at the specific position", () => {
			kifu.addNode(1);
			assert(kifu.currentNode.children.length === 3);
			assert.instanceOf(kifu.currentNode.children[1], KNode);
			assert(kifu.currentNode.children[0].getSGFProperty("B") === "[ij]");
			assert(kifu.currentNode.children[2].getSGFProperty("B") === "[ji]");
		});
		it("Add specific node at the beginning", () => {
			kifu.addNode(KNode.fromSGF("(;B[aa])"), 0);
			assert(kifu.currentNode.children.length === 3);
			assert.instanceOf(kifu.currentNode.children[0], KNode);
			assert(kifu.currentNode.children[0].getSGFProperty("B") === "[aa]");
		});
		it("Remove last node", () => {
			kifu.removeNode();
			assert(kifu.currentNode.children.length === 2);
			assert(kifu.currentNode.children[1].getSGFProperty("W") === "[gg]");
		});
		it("Remove node from specific position", () => {
			kifu.removeNode(0);
			assert(kifu.currentNode.children.length === 1);
			assert(kifu.currentNode.children[0].getSGFProperty("B") === "[ji]");
		});
		it("Move child node", () => {
			kifu.moveNode(0,1);
			assert(kifu.currentNode.children.length === 2);
			assert(kifu.currentNode.children[0].getSGFProperty("B") === "[ji]");
			assert(kifu.currentNode.children[1].getSGFProperty("B") === "[ij]");
			kifu.moveNode(1,0);
			assert(kifu.currentNode.children[0].getSGFProperty("B") === "[ij]");
			assert(kifu.currentNode.children[1].getSGFProperty("B") === "[ji]");
		});
		it("Remove entire branch", () => {
			kifu.removeBranch();
			assert(kifu.currentNode.children.length === 1);
			assert(kifu.currentNode.children[0].getSGFProperty("B") === "[ij]");
		});
	});
});
