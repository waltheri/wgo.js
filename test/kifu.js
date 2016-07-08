/* Test of WGo kifu classes and functionality */

import {assert} from "chai";
import * as WGo from "../src/core";
import KNode from "../src/kifu/KNode";
import {SGFSyntaxError} from "../src/kifu/SGFParser";
import propertyValueTypes from "../src/kifu/propertyValueTypes";

describe("Kifu", function() {
	describe("(1) Correct transformation of property values.", function() {
		it("No value properties (eg: KO)", function() {
			assert.strictEqual(propertyValueTypes.KO.type.read(""), true);
			assert.strictEqual(propertyValueTypes.KO.type.write(true), "");
		});
		
		it("Numeric properties (eg: MN)", function() {
			assert.strictEqual(propertyValueTypes.MN.type.read("10"), 10);
			assert.strictEqual(propertyValueTypes.MN.type.write(10), "10");
		});
		
		it("Text properties (C)", function() {
			assert.strictEqual(propertyValueTypes.C.type.read("Hello\nworld"), "Hello\nworld");
			assert.strictEqual(propertyValueTypes.C.type.write("Hello\nworld"), "Hello\nworld");
		});	
		
		it("Color properties (PL)", function() {
			assert.strictEqual(propertyValueTypes.PL.type.read("B"), WGo.BLACK);
			assert.strictEqual(propertyValueTypes.PL.type.read("W"), WGo.WHITE);
			assert.strictEqual(propertyValueTypes.PL.type.write(WGo.BLACK), "B");
			assert.strictEqual(propertyValueTypes.PL.type.write(WGo.WHITE), "W");
		});	

		it("Point properties (moves, setups)", function() {
			assert.deepEqual(propertyValueTypes.B.type.read("hm"), {x:7, y:12});
			assert.deepEqual(propertyValueTypes.AW.type.read("fk"), {x:5, y:10});
			assert.deepEqual(propertyValueTypes.B.type.write({x:7, y:12}), "hm");
			assert.deepEqual(propertyValueTypes.AW.type.write({x:5, y:10}), "fk");
		});
		
		it("Empty point properties", function() {
			assert.deepEqual(propertyValueTypes.B.type.read(undefined), false);
			assert.deepEqual(propertyValueTypes.W.type.read(""), false);
			assert.deepEqual(propertyValueTypes.B.type.write(false), "");
			assert.deepEqual(propertyValueTypes.W.type.write(false), "");
		});
		
		it("Label property (LB)", function() {
			assert.deepEqual(propertyValueTypes.LB.type.read("hm:Hello"), {x:7, y:12, text:"Hello"});
			assert.deepEqual(propertyValueTypes.LB.type.write({x:7, y:12, text:"Hello"}), "hm:Hello");
		});
		
		it("Line properties (AR, LN)", function() {
			assert.deepEqual(propertyValueTypes.AR.type.read("hm:fk"), {x1:7, y1:12, x2:5, y2:10});
			assert.deepEqual(propertyValueTypes.AR.type.write({x1:7, y1:12, x2:5, y2:10}), "hm:fk");
		});
	});
	
	describe("(2) KNode's node manipulation methods.", function() {
		var rootNode, node1, node2, node3;

		beforeEach(function(){		
			rootNode = new KNode();
			//rootNode.gameInfo = {}; // provisional game info
			//rootNode.kifuInfo = {}; // provisional kifu info
			
			node1 = new KNode();
			node2 = new KNode();
			node3 = new KNode();
		});
		
		it("appendChild()", function() {
			rootNode.appendChild(node1);
			rootNode.appendChild(node2);
			
			assert.strictEqual(rootNode.children.length, 2);
			assert.strictEqual(rootNode.children[0], node1);
			assert.strictEqual(rootNode.children[1], node2);
			assert.strictEqual(node1.parent, rootNode);
			assert.throws(function(){rootNode.appendChild(rootNode)}, Error);
			
			node2.appendChild(node1);
			
			assert.strictEqual(rootNode.children.length, 1);
			assert.notInclude(rootNode.children, node1);
			assert.strictEqual(node1.parent, node2);
		});
		
		it("cloneNode()");
		
		it("contains()", function() {
			node1.appendChild(node2);
			rootNode.appendChild(node1);
			
			assert.strictEqual(rootNode.contains(node1), true);
			assert.strictEqual(rootNode.contains(node2), true);
			assert.strictEqual(rootNode.contains(node3), false);
		});
		
		it("insertBefore()", function() {
			node3.appendChild(node2);
			
			rootNode.appendChild(node1);
			rootNode.insertBefore(node2, node1);
			
			assert.strictEqual(rootNode.children.length, 2);
			assert.strictEqual(rootNode.children[0], node2);
			assert.strictEqual(rootNode.children[1], node1);
			assert.strictEqual(node2.parent, rootNode);

			assert.notInclude(node3.children, node2);
		});
		
		it("removeChild()", function() {
			rootNode.appendChild(node1);
			rootNode.removeChild(node1);
			
			assert.strictEqual(rootNode.children.length, 0);
			assert.notInclude(rootNode.children, node1);
			assert.equal(node1.parent, null);
		});
		
		it("replaceChild()", function() {
			rootNode.appendChild(node1);
			node3.appendChild(node2);
			rootNode.replaceChild(node2, node1);
			
			assert.strictEqual(rootNode.children.length, 1);
			assert.strictEqual(rootNode.children[0], node2);
			
			assert.strictEqual(node2.parent, rootNode);
			
			assert.equal(node1.parent, null);
			assert.notInclude(node3.children, node2);
		});
		
		it("root property", function() {
			rootNode.appendChild(node1);
			node1.appendChild(node2);
			
			assert.strictEqual(rootNode.root, rootNode);
			assert.strictEqual(node1.root, rootNode);
			assert.strictEqual(node2.root, rootNode);
			
			rootNode.removeChild(node1);
			assert.strictEqual(node2.root, node1);
			
			assert.throws(function() {
				node2.root = node1;
			});
		});
	});
	
	describe("(3) KNode's setSGFProperty method", function() {
		var node, move1, move2;
		
		beforeEach(function(){
			node = new KNode();
			move1 = {
				s: "fk",
				c: {x:5, y:10}
			};
			move2 = {
				s: "hm",
				c: {x:7, y:12}
			};
		});
		
		it("Set single value property", function() {
			node.setSGFProperty("B", "["+move1.s+"]");
			assert.deepEqual(node.SGFProperties, {B: move1.c});
			
			node.setSGFProperty("SZ", ["19"]);
			assert.deepEqual(node.SGFProperties, {B: move1.c, SZ: 19});
		});
		
		it("Set single value empty property", function() {
			node.setSGFProperty("KO", "[]");
			assert.deepEqual(node.SGFProperties, {KO: true});
			
			node.setSGFProperty("DO", [""]);
			assert.deepEqual(node.SGFProperties, {KO: true, DO: true});
			
			node.setSGFProperty("GC", "[Hello]");
			node.setSGFProperty("CA", ["WGo"]);
			
			assert.deepEqual(node.SGFProperties, {KO: true, DO: true, GC: "Hello", CA: "WGo"});
			
			node.setSGFProperty("GC", "[]");
			node.setSGFProperty("CA", [""]);
			
			assert.deepEqual(node.SGFProperties, {KO: true, DO: true});
			assert.deepEqual(node.SGFProperties, {KO: true, DO: true});
		});
		
		it("Set multiple value property", function() {
			node.setSGFProperty("AB", "["+move1.s+"]["+move2.s+"]");
			assert.deepEqual(node.SGFProperties, {AB: [move1.c, move2.c]});
			
			node.setSGFProperty("VW", [move1.s, move2.s]);
			assert.deepEqual(node.SGFProperties, {AB: [move1.c, move2.c], VW: [move1.c, move2.c]});
		});
		
		it("Set multiple value empty property", function() {
			node.setSGFProperty("AW", "[]");
			assert.deepEqual(node.SGFProperties, {});
			
			node.setSGFProperty("LB", []);
			assert.deepEqual(node.SGFProperties, {});
			
			node.setSGFProperty("VW", [""]);
			assert(node.SGFProperties.VW && !node.SGFProperties.VW[0]);
			
			node.setSGFProperty("DD", "[]");
			assert(node.SGFProperties.DD && !node.SGFProperties.DD[0]);
		});
		
		it("Passes working properly (W[], B[])", function() {
			node.setSGFProperty("B", "[]");
			assert.deepEqual(node.SGFProperties, {B: false});
			
			node.setSGFProperty("W", [""]);
			assert.deepEqual(node.SGFProperties, {B: false, W: false});
		});
		
		it("Comment property(C)", function() {
			node.setSGFProperty("C", ["simple"]);
			assert.deepEqual(node.SGFProperties, {C: "simple"});
			
			node.setSGFProperty("C", "[Hello \\\nWorld! 碁\n][\\[\\]\\:\\\\]");
			assert.deepEqual(node.SGFProperties, {C: "Hello World! 碁\n[]:\\"});
			
			node.setSGFProperty("C", "[]");
			assert.deepEqual(node.SGFProperties, {});
		});
	});
	
	describe("(4) KNode's getSGFProperty() method and innerSGF property getter", function() {
		var node;

		beforeEach(function() {
			node = new KNode();
			node.setSGFProperties({
				"AB": "[hm][fk]",
				"IT": "[]",
				"W": [""],
				"C": "[AB[hm\\][fk\\]]"
			});
		});
		
		it("Basic properties", function() {
			assert.strictEqual(node.getSGFProperty("AB"), "[hm][fk]");
		});
		
		it("Properties with empty value", function() {
			assert.strictEqual(node.getSGFProperty("IT"), "[]");
			assert.strictEqual(node.getSGFProperty("W"), "[]");
		});
		
		it("Correct escaping of values", function() {
			assert.strictEqual(node.getSGFProperty("C"), "[AB[hm\\][fk\\]]");
		});
		
		it("node.innerSGF with no children", function() {
			assert.strictEqual(node.innerSGF, "AB[hm][fk]IT[]W[]C[AB[hm\\][fk\\]]");
		});
		
		it("node.innerSGF with one child", function() {
			var child = new KNode();
			child.setSGFProperty("B", ["fk"]);
			child.appendChild(node);
			assert.strictEqual(child.innerSGF, "B[fk];AB[hm][fk]IT[]W[]C[AB[hm\\][fk\\]]");
		});
		
		it("node.innerSGF with more children", function() {
			var child1 = new KNode();
			var child2 = new KNode();
			
			child1.setSGFProperty("B", ["fk"]);
			node.appendChild(child1);
			
			child2.setSGFProperty("B", "[hm]");
			node.appendChild(child2);
			
			assert.strictEqual(node.innerSGF, "AB[hm][fk]IT[]W[]C[AB[hm\\][fk\\]](;B[fk])(;B[hm])");
		});
	});
	
	describe("(5) KNode's innerSGF property setter", function() {
		var node, move1, move2;

		beforeEach(function() {
			node = new KNode();
			move1 = {
				s: "fk",
				c: {x:5, y:10}
			};
			move2 = {
				s: "hm",
				c: {x:7, y:12}
			};
		});
		
		it("Set only properties", function() {
			node.innerSGF = "AB["+move1.s+"]["+move2.s+"]IT[]C[Hello]";
			assert.deepEqual(node.SGFProperties, {
				AB: [move1.c, move2.c],
				IT: true,
				C: "Hello"
			});
		});
		
		it("Set properties with special characters", function() {
			node.innerSGF = "B["+move1.s+"]C[碁\\\\\\];(\\\n\\n\\\\]";
			assert.deepEqual(node.SGFProperties, {
				B: move1.c,
				C: "碁\\];(n\\"
			});
		});
		
		it("Remove all old properties", function() {
			node.setSGFProperty("SQ", ["hm"]);
			node.appendChild(new KNode());
			
			node.innerSGF = "CR["+move1.s+"]";
			
			assert.deepEqual(node.SGFProperties, {
				CR: [move1.c]
			});

			assert.deepEqual(node.children, []);
		});
		
		it("Set just child nodes", function() {
			node.innerSGF = ";W["+move1.s+"];B["+move2.s+"]";
			
			assert.deepEqual(node.SGFProperties, {});
			
			assert.deepEqual(node.children[0].SGFProperties, {W: move1.c});
			assert.deepEqual(node.children[0].children[0].SGFProperties, {B: move2.c});
		});
		
		it("Set multiple properties and children", function() {
			node.innerSGF = "AW["+move1.s+"]C[Cool!](;W["+move2.s+"]C[)(])(;W[];)";
			
			assert.deepEqual(node.SGFProperties, {
				AW: [move1.c],
				C: "Cool!"
			});
			
			assert.strictEqual(node.children.length, 2);
			
			assert.deepEqual(node.children[0].SGFProperties, {
				W: move2.c,
				C: ")("
			});
			
			assert.deepEqual(node.children[1].SGFProperties, {
				W: false,
			});
			
			assert.strictEqual(node.children[1].children.length, 1);
			
			assert.deepEqual(node.children[1].children[0].SGFProperties, {});
		});
		
		it("Whitespaces in SGF", function() {
			node.innerSGF = "AW\n ["+move1.s+"] \n  C[Co  \nol!] \n ( ; W\n["+move2.s+"]C [)(] ) \n (\n;W[] ; )\n ";
			
			assert.deepEqual(node.SGFProperties, {
				AW: [move1.c],
				C: "Co  \nol!"
			});
			
			assert.strictEqual(node.children.length, 2);
			
			assert.deepEqual(node.children[0].SGFProperties, {
				W: move2.c,
				C: ")("
			});
			
			assert.deepEqual(node.children[1].SGFProperties, {
				W: false,
			});
			
			assert.strictEqual(node.children[1].children.length, 1);
			
			assert.deepEqual(node.children[1].children[0].SGFProperties, {});
		});
		
		it("Invalid SGF throws an error", function() {
			assert.throws(function() {
				node.innerSGF = "AW[fk]C[Cool!];W[hn]C";
			}, SGFSyntaxError);
			
			assert.throws(function() {
				node.innerSGF = "AW[fk]C[Cool!];W[hn]C[)(])(;W[hm];)";
			}, SGFSyntaxError);
			
			assert.throws(function() {
				node.innerSGF = "AW[fk]C[Cool!];W[hn]C[)(](;W[hm]";
			}, SGFSyntaxError);
		});
	});
	
	describe("(6) Static methods KNode.fromSGF() and KNode.toSGF()", function() {
		it("KNode.fromSGF(sgf).toSGF() == sgf", function() {
			assert.strictEqual(KNode.fromSGF("(;FF[4]SZ[19];AB[hm][fk]IT[]W[]C[AB[hm\\][fk\\]](;B[fk])(;B[hm]))").toSGF(), "(;FF[4]SZ[19];AB[hm][fk]IT[]W[]C[AB[hm\\][fk\\]](;B[fk])(;B[hm]))");
		});
	});
	
	/*describe("(2) Kifu specific methods.", function() {
		var node;
		
		beforeEach(function() {
			node = new KNode();
		});
		
		it("addSetup()", function() {
			node.addSetup({x:5, y:10, c: WGo.B});
			assert.strictEqual(node.setup["5:10"], WGo.B);
			assert.deepEqual(node.SGFProperties, {AB: ["fk"]});
			
			node.addSetup([{x:7, y:12, c: WGo.W}, {x:5, y:10, c: WGo.E}]);
			assert.strictEqual(node.setup["7:12"], WGo.W);
			assert.strictEqual(node.setup["5:10"], WGo.E);

			assert.deepEqual(node.SGFProperties, {AW: ["hm"], AE: ["fk"]});
		});
		
		it("removeSetup()", function() {
			node.addSetup([{x:5, y:10, c: WGo.B}, {x:7, y:12, c: WGo.B}]);
			node.removeSetup({x:5, y:10});
			
			assert.equal(node.setup["5:10"], null);
			assert.strictEqual(node.setup["7:12"], WGo.B);
			assert.deepEqual(node.SGFProperties, {AB: ["hm"]});
		});
		
		it("addMarkup()", function() {
			var m1, m2, m3;
			node.addMarkup(m1 = {x:5, y:10, type: "CR"});
			assert.strictEqual(node.markup["5:10"], m1);
			assert.deepEqual(node.SGFProperties.CR, ["fk"]);
			
			node.addMarkup([m2 = {x:7, y:12, type: "MA"}, m3 = {x:5, y:10, type: "LB", text: ":-)"}]);
			assert.strictEqual(node.markup["7:12"], m2);
			assert.strictEqual(node.markup["5:10"], m3);
			
			assert.deepEqual(node.SGFProperties, {MA: ["hm"], LB: ["fk::-)"]});
		});
		
		it("removeMarkup()", function() {
			node.addMarkup([{x:5, y:10, type: "CR"}, {x:7, y:12, type: "CR"}]);
			node.removeMarkup([{x:5, y:10}]);
			
			assert.equal(node.markup["5:10"], null);
			assert.deepEqual(node.markup["7:12"], {x:7, y:12, type: "CR"});
			assert.deepEqual(node.SGFProperties, {CR: ["hm"]});
		});
		
		it("setMove(), setTurn(), getTurn()", function() {
			node.setMove({x:5, y:10, c:WGo.B});
			assert.strictEqual(node.getTurn(), WGo.W);
			node.setTurn(WGo.B);
			assert.strictEqual(node.getTurn(), WGo.B);
			assert.deepEqual(node.SGFProperties, {B: ["fk"], PL: ["B"]});
		});
		
		it("setComment()", function() {
			node.setComment("Hello World!\n[]:\\");
			assert.strictEqual(node.comment, "Hello World!\n[]:\\");
			assert.deepEqual(node.SGFProperties, {C: ["Hello World!\n[]:\\"]});
		});
	});*/
		
	/*describe("(2) SGF -> Kifu, Kifu -> SGF", function() {
		it("KNode's innerSGF property.");
		it("Parse SGF.");
		it("SGF to Kifu object.");
	});
	describe("(3) Kifu -> JGo, JGo -> Kifu.", function() {
		
	});*/
});
