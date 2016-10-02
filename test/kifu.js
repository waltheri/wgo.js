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
		
		it("Add new branch at the end", () => {
			kifu.addBranch();
			assert(kifu.currentNode.children.length === 3);
			assert.instanceOf(kifu.currentNode.children[2], KNode);
		});
		it("Add new branch at the specific position", () => {
			kifu.addBranch(1);
			assert(kifu.currentNode.children.length === 3);
			assert.instanceOf(kifu.currentNode.children[1], KNode);
			assert(kifu.currentNode.children[0].getSGFProperty("B") === "[ij]");
			assert(kifu.currentNode.children[2].getSGFProperty("B") === "[ji]");
		});
		it("Add specific branch at the beginning", () => {
			kifu.addBranch(KNode.fromSGF("(;B[aa])"), 0);
			assert(kifu.currentNode.children.length === 3);
			assert.instanceOf(kifu.currentNode.children[0], KNode);
			assert(kifu.currentNode.children[0].getSGFProperty("B") === "[aa]");
		});
		it("Move branch", () => {
			kifu.moveBranch(0,1);
			assert(kifu.currentNode.children.length === 2);
			assert(kifu.currentNode.children[0].getSGFProperty("B") === "[ji]");
			assert(kifu.currentNode.children[1].getSGFProperty("B") === "[ij]");
			kifu.moveBranch(1,0);
			assert(kifu.currentNode.children[0].getSGFProperty("B") === "[ij]");
			assert(kifu.currentNode.children[1].getSGFProperty("B") === "[ji]");
		});
		it("Remove entire branch", () => {
			kifu.removeBranch();
			assert(kifu.currentNode.children.length === 1);
			assert(kifu.currentNode.children[0].getSGFProperty("B") === "[ij]");
		});
		it("Remove entire branch at specific position", () => {
			kifu.removeBranch(0);
			assert(kifu.currentNode.children.length === 1);
			assert(kifu.currentNode.children[0].getSGFProperty("B") === "[ji]");
		});
		it("Insert a new node", () => {
			kifu.addNode(0);
			assert(kifu.currentNode.children.length === 2);
			assert(kifu.currentNode.children[0].children.length === 1);
			assert(kifu.currentNode.children[0].children[0].getSGFProperty("B") === "[ij]");
		});
		it("Insert a specific node", () => {
			kifu.addNode(KNode.fromSGF("(;B[aa];W[bb])"), 1);
			assert(kifu.currentNode.children.length === 2);
			assert(kifu.currentNode.children[1].getSGFProperty("B") === "[aa]");
			assert(kifu.currentNode.children[1].children[0].getSGFProperty("W") === "[bb]");
			assert(kifu.currentNode.children[1].children[0].children[0].getSGFProperty("B") === "[ji]");
			assert(kifu.currentNode.children[1].children[0].children[0].children[0].getSGFProperty("W") === "[gg]");
		});
		it("Remove last node", () => {
			kifu.removeNode();
			assert(kifu.currentNode.children.length === 2);
			assert(kifu.currentNode.children[1].getSGFProperty("W") === "[gg]");
		});
		it("Remove node from specific position", () => {
			kifu.currentNode.children[0].appendChild(KNode.fromSGF("(;B[aa])"));
			kifu.currentNode.children[0].appendChild(KNode.fromSGF("(;B[bb])"));
			kifu.removeNode(0);
			assert(kifu.currentNode.children.length === 3);
			assert(kifu.currentNode.children[0].getSGFProperty("B") === "[aa]");
			assert(kifu.currentNode.children[1].getSGFProperty("B") === "[bb]");
			assert(kifu.currentNode.children[2].getSGFProperty("B") === "[ji]");
		});
	});
	
	describe("(3) Markup", () => {
		var kifu;
		
		beforeEach(() => {
			var kNode = KNode.fromSGF("(;SZ[19]CR[ae]TR[be])");
			kifu = new Kifu(kNode);
		});
		
		it("Get markup", () => {
			var markup = kifu.getMarkup(0,4);
			assert.deepEqual({x: 0, y: 4, type: "CR"}, markup);
			
			markup = kifu.getMarkup();
			assert.sameDeepMembers([{x: 0, y: 4, type: "CR"}, {x: 1, y: 4, type: "TR"}], markup);
		});
		
		it("Add markup", () => {
			var added = kifu.addMarkup(0, 4, "SQ");
			assert.isFalse(added);
			assert.equal(kifu.currentNode.getSGFProperty("CR"), "[ae]");
			assert.isNotOk(kifu.currentNode.getSGFProperty("SQ"));
			
			added = kifu.addMarkup({x: 2, y: 4, type: "SQ"});
			assert.isTrue(added);
			assert.equal(kifu.currentNode.getSGFProperty("SQ"), "[ce]");
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
			
			kifu.addMarkup({x: 2, y: 4, type: "TR"});
			assert.sameDeepMembers(kifu.currentNode.getProperty("TR"), [{x:1, y:4}, {x:2, y:4}]);
			kifu.removeMarkup({x: 1, y: 4});
			assert.equal(kifu.currentNode.getSGFProperty("TR"), "[ce]");
		});
	});
	
	describe("(4) Setup", () => {
		var kifu;
		
		beforeEach(() => {
			kifu = new Kifu(KNode.fromSGF("(;SZ[19]AB[ae]AW[be];B[ce])"));
		});
		
		it("Get setup", () => {
			var setup;
			
			setup = kifu.getSetup(0, 4);
			assert.deepEqual({x: 0, y: 4, c: WGo.B}, setup);
			
			setup = kifu.getSetup();
			assert.sameDeepMembers([{x: 0, y: 4, c: WGo.B}, {x: 1, y: 4, c: WGo.W}], setup);
		});
		
		it("Add setup", () => {
			var added;
			
			added = kifu.addSetup(0, 4, WGo.W);
			assert.isFalse(added);
			assert.equal(kifu.currentNode.getSGFProperty("AB"), "[ae]");
			assert.equal(kifu.currentNode.getSGFProperty("AW"), "[be]");
			
			added = kifu.addSetup({x: 2, y: 4, c: WGo.B});
			assert.isTrue(added);
			assert.sameDeepMembers(kifu.currentNode.getProperty("AB"), [{x: 0, y: 4}, {x: 2, y: 4}]);
		});
		
		it("Set setup", () => {
			var added;
			
			added = kifu.setSetup(0, 4, WGo.W);
			assert.isTrue(added);
			assert.sameDeepMembers(kifu.currentNode.getProperty("AW"), [{x: 0, y: 4}, {x: 1, y: 4}]);
			
			added = kifu.setSetup({x: 1, y: 4, c: WGo.B});
			assert.isTrue(added);
			
			assert.equal(kifu.currentNode.getSGFProperty("AW"), "[ae]");
			assert.equal(kifu.currentNode.getSGFProperty("AB"), "[be]");
		});
	});
});
