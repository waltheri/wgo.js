/**
 * Contains implementation Kifu's node object
 * @module KNode
 */

// helper object to add multiple property values (used for setup and markup properties)
var no_add = function(arr, obj, key) {
	for(var i = 0; i < arr.length; i++) {
		if(arr[i].x == obj.x && arr[i].y == obj.y) {
			arr[i][key] = obj[key];
			return;
		}
	}
	arr.push(obj);
}

// helper function to remove property values (used for setup and markup properties)
var no_remove = function(arr, obj) {
	if(!arr) return;
	for(var i = 0; i < arr.length; i++) {
		if(arr[i].x == obj.x && arr[i].y == obj.y) {
			arr.splice(i,1);
			return;
		}
	}
}

// helper method for cloning of kifu node
var recursive_clone = function(node) {
	var n = new KNode(JSON.parse(JSON.stringify(node.getProperties())));
	for(var ch in node.children) {
		n.appendChild(recursive_clone(node.children[ch]));
	}
	return n;
}


/* ===== SGF writer ========================================================================================= */
var sgf_escape = function(text) {
	if(typeof text == "string") return text.replace(/\\/g, "\\\\").replace(/]/g, "\\]");
	else return text;
}

var a_char = 'a'.charCodeAt(0);

var sgf_coordinates = function(x, y) {
	return String.fromCharCode(a_char+x)+String.fromCharCode(a_char+y);
}

var sgf_write_group = function(prop, values, output) {
	if(!values.length) return;
	
	output.sgf += prop;
	for(var i in values) {
		output.sgf += "["+values[i]+"]";
	}
}

var sgf_write_variantion = function(node, output) {
	output.sgf += "(\n;";
	sgf_write_node(node, output);
	output.sgf += "\n)";
}
/* ===== /SGF writer ========================================================================================= */

/**
 * Node class of kifu game tree. It can contain move, setup, markup or any other properties.
 *
 * @alias WGo.kifu.KNode
 * @class
 * @param {object} properties Map of properties which is appended to the node.
 * @param {KNode} parent (null for root node)
 */

var KNode = function(properties, parent) {
	this.parent = parent || null;
	this.children = [];
	this.properties = {};
	
	// save all properties
	if(properties) {
		for(var key in properties) this.properties[key] = properties[key];
	}
	
	// innerSGF property - from FReq #46
	Object.defineProperty(this, "innerSGF", {
		get: function() {
			return this.nodeToSGF();
		}
	});
}

KNode.prototype = {
	constructor: KNode,

	/**
	 * Gets node's children specified by index. If it doesn't exist, method returns null.
	 * 
	 * @param   {number} ch Child index
	 * @returns {KNode}  Knode's children node
	 */
	
	getChild: function(ch) {
		var i = ch || 0;
		if(this.children[i]) return this.children[i];
		else return null;
	},
	
	/**
	 * Add setup property.
	 * 
	 * @param {object} setup object with structure: {x:<x coordinate>, y:<y coordinate>, c:<color>}
	 */
	
	addSetup: function(setup) {
		this.properties.setup = this.properties.setup || [];
		no_add(this.properties.setup, setup, "c");
		return this;
	},
	
	/**
	 * Remove setup property.
	 * 
	 * @param {object} setup object with structure: {x:<x coordinate>, y:<y coordinate>}
	 */
	
	removeSetup: function(setup) {
		no_remove(this.properties.setup, setup);
		return this;
	},
	
	/**
	 * Add markup property.
	 * 
	 * @param {object} markup object with structure: {x:<x coordinate>, y:<y coordinate>, type:<type>}
	 */
	
	addMarkup: function(markup) {
		this.properties.markup = this.properties.markup || [];
		no_add(this.properties.markup, markup, "type");
		return this;
	},
	
	/**
	 * Remove markup property.
	 * 
	 * @param {object} markup object with structure: {x:<x coordinate>, y:<y coordinate>}
	 */
	
	removeMarkup: function(markup) {
		no_remove(this.properties.markup, markup);
		return this;
	},
	
	/**
	 * Remove this node.
	 * Node is removed from its parent and children are passed to parent.
	 */
	
	remove: function() {
		var p = this.parent;
		if(!p) throw new Exception("Root node cannot be removed");
		for(var i in p.children) {
			if(p.children[i] == this) {
				p.children.splice(i,1);
				break;
			}
		}
		p.children = p.children.concat(this.children);
		this.parent = null;
		return p;
	},
	
	/**
	 * Insert node after this node. All children are passed to new node.
	 */
	
	insertAfter: function(node) {
		for(var child in this.children) {
			this.children[child].parent = node;
		}
		node.children = node.children.concat(this.children);
		node.parent = this;
		this.children = [node];
		return node;
	},
	
	/**
	 * Append child node to this node.
	 */
	
	appendChild: function(node) {
		node.parent = this;
		this.children.push(node);
		return node;
	},
	
	/**
	 * Get properties as object.
	 */
	
	/*getProperties: function() {
		var props = {};
		
		for(var key in this) {
			if(this.hasOwnProperty(key) && key != "children" && key != "parent" && key[0] != "_") props[key] = this[key];
		}
		
		return props;
	},*/
	
	/**
	 * Tries to find property in the node or recursively in its children
	 * 
	 * @param   {string}  prop Property name to be found.
	 * @returns {false|mixed} property value or false, if property is not found. 
	 */
	
	findProperty: function(prop) {
		var res;
		
		if(this.properties[prop] !== undefined) return this.properties[prop];
		
		for(var i = 0; i < this.children.length; i++) {
			res = this.children[i].findProperty(prop);
			if(res) return res;
		}
		
		return false;
	},
	
	clone: function() {
		var node = new KNode();
		
		// deep clone of properties
		node.properties = JSON.parse(JSON.stringify(this.properties));
				
		// recursively add children
		for(var i = 0; i < this.children.length; i++) {
			node.appendChild(this.children[i].clone());
		}
		
		return node;
	},
	
	/**
	 * Returns SGF representation of node.
	 */
	
	nodeToSGF: function() {
		var props = this.properties;
		var output = {sgf: ""};
		
		// move
		if(props.move) {
			var move = "";
			if(!props.move.pass) move = sgf_coordinates(props.move.x, props.move.y);

			if(props.move.c == WGo.B) output.sgf += "B["+move+"]";
			else output.sgf += "W["+move+"]";
		}

		// setup
		if(props.setup) {
			var AB = [];
			var AW = [];
			var AE = [];

			for(var i in props.setup) {
				if(props.setup[i].c == WGo.B) AB.push(sgf_coordinates(props.setup[i].x, props.setup[i].y));
				else if(props.setup[i].c == WGo.W) AW.push(sgf_coordinates(props.setup[i].x, props.setup[i].y));
				else AE.push(sgf_coordinates(props.setup[i].x, props.setup[i].y));
			}

			sgf_write_group("AB", AB, output);
			sgf_write_group("AW", AW, output);
			sgf_write_group("AE", AE, output);
		}

		// markup
		if(props.markup) {
			var markup = {};

			for(var i in props.markup) {
				markup[props.markup[i].type] = markup[props.markup[i].type] || [];
				if(props.markup[i].type == "LB") markup["LB"].push(sgf_coordinates(props.markup[i].x, props.markup[i].y)+":"+sgf_escape(props.markup[i].text));
				else markup[props.markup[i].type].push(sgf_coordinates(props.markup[i].x, props.markup[i].y));
			}

			for(var key in markup) {
				sgf_write_group(key, markup[key], output);
			}
		}

		for(var key in props) {
			if(typeof props[key] == "object") continue;
			
			// TODO make more general
			if(key == "turn") output.sgf += "PL["+(props[key] == WGo.B ? "B" : "W")+"]";
			else if(key == "comment") output.sgf += "C["+sgf_escape(props[key])+"]";
			else output.sgf += key+"["+sgf_escape(props[key])+"]";
		}
		
		return output.sgf;
		
		/*if(node.children.length == 1) {
			output.sgf += "\n;";
			sgf_write_node(node.children[0], output);
		}
		else if(node.children.length > 1) {
			for(var key in node.children) {
				sgf_write_variantion(node.children[key], output);
			}
		}*/
	}
}

module.exports = KNode;
