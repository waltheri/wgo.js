/* Test of WGo kifu classes and functionality */

import {assert} from "chai";
import WGo from "../src/WGo";
import KNode from "../src/kifu/KNode";
import {SGFSyntaxError} from "../src/kifu/SGFParser";

describe("Kifu", function() {
	describe("(1) KNode's node manipulatiobn methods.", function() {
		var rootNode, node1, node2, node3;

		beforeEach(function(){		
			rootNode = new KNode();
			rootNode.gameInfo = {}; // provisional game info
			rootNode.kifuInfo = {}; // provisional kifu info
			
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
			assert.strictEqual(node1.gameInfo, rootNode.gameInfo);
			assert.strictEqual(node1.kifuInfo, rootNode.kifuInfo);
			assert.throws(function(){rootNode.appendChild(rootNode)}, Error);
			
			node3.appendChild(node1);
			
			assert.strictEqual(rootNode.children.length, 1);
			assert.notInclude(rootNode.children, node1);
			assert.strictEqual(node1.parent, node3);
			assert.strictEqual(node1.gameInfo, node3.gameInfo);
			assert.strictEqual(node1.kifuInfo, node3.kifuInfo);
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
			assert.strictEqual(node2.gameInfo, rootNode.gameInfo);
			assert.strictEqual(node2.kifuInfo, rootNode.kifuInfo);

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
			assert.strictEqual(node2.gameInfo, rootNode.gameInfo);
			assert.strictEqual(node2.kifuInfo, rootNode.kifuInfo);
			
			assert.equal(node1.parent, null);
			assert.notInclude(node3.children, node2);
		});
		
	});
	
	describe("(2) Kifu specific methods.", function() {
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
	});
	
	describe("(3) KNode's setSGFProperty() method", function() {
		var node;
		
		beforeEach(function() {
			node = new KNode();
		});
		
		it("Setup properties AB, AW and AE", function() {
			node.setSGFProperty("AB", ["fk", "hm"]);
			assert.deepEqual(node.setup, {"5:10": WGo.B, "7:12": WGo.B});
			assert.deepEqual(node.SGFProperties, {AB: ["fk", "hm"]});
			
			node.setSGFProperty("AW", ["fk"]);
			node.setSGFProperty("AE", "[hm]");
			assert.deepEqual(node.setup, {"5:10": WGo.W, "7:12": WGo.E});
			assert.deepEqual(node.SGFProperties, {AW: ["fk"], AE: ["hm"]});
			
			node.setSGFProperty("AW", ["hm"]);
			node.setSGFProperty("AW");
			assert.deepEqual(node.setup, {});
			assert.deepEqual(node.SGFProperties, {});
		});
		
		it("Markup properties CR, LB, MA, SL, SQ, TR", function() {
			node.setSGFProperty("CR", "[fk][hm]");
			assert.deepEqual(node.markup, {"5:10": {x:5, y:10, type:"CR"}, "7:12": {x:7, y:12, type:"CR"}});
			assert.deepEqual(node.SGFProperties, {CR: ["fk", "hm"]});
			
			node.setSGFProperty("LB", ["fk::-)"]);
			assert.deepEqual(node.markup, {"5:10": {x:5, y:10, type:"LB", text:":-)"}, "7:12": {x:7, y:12, type:"CR"}});
			assert.deepEqual(node.SGFProperties, {LB: ["fk::-)"], CR: ["hm"]});
			
			node.setSGFProperty("CR");
			assert.deepEqual(node.markup, {"5:10": {x:5, y:10, type:"LB", text:":-)"}});
			assert.deepEqual(node.SGFProperties, {LB: ["fk::-)"]});
		});
		
		it("Move properties A, B and PL", function() {
			node.setSGFProperty("B", ["fk"]);
			node.setSGFProperty("PL", ["W"]);
			assert.deepEqual(node.move, {x:5, y:10, c:WGo.B});
			assert.strictEqual(node.turn, WGo.W);
			assert.deepEqual(node.SGFProperties, {B: ["fk"], PL: ["W"]});
			
			node.setSGFProperty("W", ["hm"]);
			node.setSGFProperty("PL", "[B]");
			assert.deepEqual(node.move, {x:7, y:12, c:WGo.W});
			assert.strictEqual(node.turn, WGo.B);
			assert.deepEqual(node.SGFProperties, {W: ["hm"], PL: ["B"]});
			
			node.setSGFProperty("W");
			node.setSGFProperty("PL");
			
			assert.equal(node.move, null);
			assert.equal(node.turn, null);
			assert.deepEqual(node.SGFProperties, {});
		});
		
		it("Comment property C", function() {
			node.setSGFProperty("C", ["simple"]);
			assert.strictEqual(node.comment,"simple");
			assert.deepEqual(node.SGFProperties, {C: ["simple"]});
			
			node.setSGFProperty("C", "[Hello \\\nWorld! 碁\n][\\[\\]\\:\\\\]");
			assert.strictEqual(node.comment, "Hello World! 碁\n[]:\\");
			assert.deepEqual(node.SGFProperties, {C: ["Hello World! 碁\n[]:\\"]});
			
			node.setSGFProperty("C");
			assert.strictEqual(node.comment, "");
			assert.deepEqual(node.SGFProperties, {});
		});
		
		it("Adding of general properties", function(){
			node.setSGFProperty("TE", "[\\\\\\]]");
			node.setSGFProperty("IT", "[]");
			node.setSGFProperty("AR", "[aa:bb][cc:dd][ee:ff]");
			node.setSGFProperty("V", [5.874]);
			node.setSGFProperty("VW", ["aa:ff", "gg"]);
			assert.deepEqual(node.SGFProperties, {
				TE: ["\\]"],
				IT: [],
				AR: ["aa:bb", "cc:dd", "ee:ff"],
				V: [5.874],
				VW: ["aa:ff", "gg"]
			});
			
			node.setSGFProperty("V");
			node.setSGFProperty("IT");
			node.setSGFProperty("DO", []);
			node.setSGFProperty("VW", "[aa:ff]");
			node.setSGFProperty("TE", ["\\\\\\]"]);
			assert.deepEqual(node.SGFProperties, {
				TE: ["\\\\\\]"],
				DO: [],
				AR: ["aa:bb", "cc:dd", "ee:ff"],
				VW: ["aa:ff"]
			});
		});
	});
	
	describe("(4) KNode's setSGF() method", function() {
		var node;

		beforeEach(function() {
			node = new KNode();
		});
		
		it("Set only properties", function() {
			node.setSGF("AB[fk][hm]IT[]C[Hello]");
			assert.deepEqual(node.SGFProperties, {
				AB: ["fk", "hm"],
				IT: [],
				C: ["Hello"]
			});
		});
		
		it("Set properties with special characters", function() {
			node.setSGF("B[fk]C[碁\\\\\\];(\\\n\\n\\\\]");
			assert.deepEqual(node.SGFProperties, {
				B: ["fk"],
				C: ["碁\\];(n\\"]
			});
		});
		
		it("Remove all old properties", function() {
			node.addMarkup({x:7, y:12, type:"CR"});
			node.addSetup({x:5, y:10, c: WGo.B});
			node.setTurn(WGo.B);
			node.setComment("Hi!");
			node.appendChild(new KNode());
			
			node.setSGF("CR[fk]");
			
			assert.deepEqual(node.SGFProperties, {
				CR: ["fk"]
			});
			assert.deepEqual(node.markup, {
				"5:10": {
					type: "CR",
					x: 5,
					y: 10
				}
			});
			
			assert.deepEqual(node.setup, {});
			assert.deepEqual(node.children, []);
			assert.equal(node.move, null);
			assert.equal(node.turn, null);
			assert.strictEqual(node.comment, "");
		});
		
		it("Set just child nodes", function() {
			node.setSGF(";W[fk];B[hm]");
			
			assert.deepEqual(node.SGFProperties, {});
			
			assert.deepEqual(node.children[0].move, {
				c: WGo.W,
				x:5, 
				y:10
			});
			
			assert.deepEqual(node.children[0].children[0].move, {
				c: WGo.B,
				x:7, 
				y:12
			});

		});
		
		it("Set multiple properties and children", function() {
			node.setSGF("AW[fk]C[Cool!](;W[hn]C[)(])(;W[hm];)");
			
			assert.deepEqual(node.SGFProperties, {
				AW: ["fk"],
				C: ["Cool!"]
			});
			
			assert.strictEqual(node.children.length, 2);
			
			assert.deepEqual(node.children[0].SGFProperties, {
				W: ["hn"],
				C: [")("]
			});
			
			assert.deepEqual(node.children[1].SGFProperties, {
				W: ["hm"],
			});
			
			assert.strictEqual(node.children[1].children.length, 1);
			
			assert.deepEqual(node.children[1].children[0].SGFProperties, {});
		});
		
		it("Whitespaces in SGF", function() {
			node.setSGF("AW\n [fk] \n  C[Co  \nol!] \n ( ; W\n[hn]C [)(] ) \n (\n;W[hm] ; )\n ");
			
			assert.deepEqual(node.SGFProperties, {
				AW: ["fk"],
				C: ["Co  \nol!"]
			});
			
			assert.strictEqual(node.children.length, 2);
			
			assert.deepEqual(node.children[0].SGFProperties, {
				W: ["hn"],
				C: [")("]
			});
			
			assert.deepEqual(node.children[1].SGFProperties, {
				W: ["hm"],
			});
			
			assert.strictEqual(node.children[1].children.length, 1);
			
			assert.deepEqual(node.children[1].children[0].SGFProperties, {});
		});
		
		it("Invalid SGF throws an error", function() {
			assert.throws(function() {
				node.setSGF("AW[fk]C[Cool!];W[hn]C");
			}, SGFSyntaxError);
			
			assert.throws(function() {
				node.setSGF("AW[fk]C[Cool!];W[hn]C[)(])(;W[hm];)");
			}, SGFSyntaxError);
			
			assert.throws(function() {
				node.setSGF("AW[fk]C[Cool!];W[hn]C[)(](;W[hm]");
			}, SGFSyntaxError);
		});
	});
	
	describe("(5) KNode's getSGFProperty() and getSGF() methods", function() {
		var node;

		beforeEach(function() {
			node = new KNode();
			node.setSGFProperty("AB", "[hm]");
			node.setSGFProperty("IT", "[]");
			node.setSGFProperty("DO", []);
			node.addSetup({c:WGo.B, x:5, y:10});
			node.setComment("AB[hm][fk]");
		});
		
		it("Basic properties", function() {
			assert.strictEqual(node.getSGFProperty("AB"), "[hm][fk]");
		});
		
		it("Properties with empty value", function() {
			assert.strictEqual(node.getSGFProperty("IT"), "[]");
			assert.strictEqual(node.getSGFProperty("DO"), "[]");
		});
		
		it("Correct escaping of values", function() {
			assert.strictEqual(node.getSGFProperty("C"), "[AB[hm\\][fk\\]]");
		});
		
		it("getSGF() with no children", function() {
			assert.strictEqual(node.getSGF(), "AB[hm][fk]IT[]DO[]C[AB[hm\\][fk\\]]");
		});
		
		it("getSGF() with one child", function() {
			var child = new KNode();
			child.setMove({c:WGo.B, x:5, y:10});
			child.appendChild(node);
			assert.strictEqual(child.getSGF(), "B[fk];AB[hm][fk]IT[]DO[]C[AB[hm\\][fk\\]]");
		});
		
		it("getSGF() with more children", function() {
			var child1 = new KNode();
			var child2 = new KNode();
			
			child1.setMove({c:WGo.B, x:5, y:10});
			node.appendChild(child1);
			
			child2.setMove({c:WGo.B, x:7, y:12});
			node.appendChild(child2);
			
			assert.strictEqual(node.getSGF(), "AB[hm][fk]IT[]DO[]C[AB[hm\\][fk\\]](;B[fk])(;B[hm])");
		});
	});
	
	describe("(6) Static methods KNode.fromSGF() and KNode.toSGF()", function() {
		it("KNode.fromSGF(sgf).toSGF() == sgf", function() {
			assert.strictEqual(KNode.fromSGF("(;FF[4]SZ[19];AB[hm][fk]IT[]DO[]C[AB[hm\\][fk\\]](;B[fk])(;B[hm]))").toSGF(), "(;FF[4]SZ[19];AB[hm][fk]IT[]DO[]C[AB[hm\\][fk\\]](;B[fk])(;B[hm]))");
		});
	});
	
	/*describe("(2) SGF -> Kifu, Kifu -> SGF", function() {
		it("KNode's innerSGF property.");
		it("Parse SGF.");
		it("SGF to Kifu object.");
	});
	describe("(3) Kifu -> JGo, JGo -> Kifu.", function() {
		
	});*/
});
