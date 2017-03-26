import SGFParser, {SGFSyntaxError} from "../SGFParser";
import propertyValueTypes from "./propertyValueTypes";
import KifuError from "./KifuError";

// jsgf helper
var processJsgf = function(parent, jsgf, pos) {
	if(jsgf[pos]) {
		if(jsgf[pos].constructor == Array) {
			// more children (fork)
			jsgf[pos].forEach(function(jsgf2) {
				processJsgf(parent, jsgf2, 0);
			});
		}
		else {
			// one child
			var node = new KNode();
			node.setSGFProperties(jsgf[pos]);
			parent.appendChild(node);
			processJsgf(node, jsgf, pos+1);
		}
	}
}

/**
 * Class representing one kifu node.
 */
export default class KNode {

	static fromJS(jsgf) {
		var root = new KNode();

		root.setSGFProperties(jsgf[0]);
		processJsgf(root, jsgf, 1);

		return root;
	}
	
	static fromSGF(sgf, ind) {
		var parser = new SGFParser(sgf);
		return KNode.fromJS(parser.parseCollection()[ind || 0]);
	}
	
	constructor() {
		// parent node (readonly) 
		this.parent = null; 

		// array of child nodes (readonly)
		this.children = [];

		// map of SGF properties (readonly) - {<PropIdent>: Array<PropValue>}
		this.SGFProperties = {};
	}
	
	get root() {
		var node = this;
		while(node.parent != null) node = node.parent;
		return node;
	}
	
	set innerSGF(sgf) {
		// prepare parser
		this.setFromSGF(new SGFParser(sgf));
	}

	get innerSGF() {
		var output = "";
		
		for(let propIdent in this.SGFProperties) {
			if(this.SGFProperties.hasOwnProperty(propIdent)) {
				output += propIdent+this.getSGFProperty(propIdent);
			}
		}
		if(this.children.length == 1) {
			return output+";"+this.children[0].innerSGF;
		}
		else if(this.children.length > 1) {
			return this.children.reduce((prev, current) => prev+"(;"+current.innerSGF+")", output);
		}
		else {
			return output;
		}
	}
	
	/// GENERAL TREE NODE MANIPULATION METHODS (subset of DOM API's Node)
	
	/**
	 * Insert a KNode as the last child node of this node.
	 * 
	 * @throws  {KifuError} when argument is invalid.
	 * @param   {KNode} node to append.
	 * @returns {number} position(index) of appended node.
	 */
	
	appendChild(node) {
		if(node == null || !(node instanceof KNode) || node == this) throw new KifuError("Invalid argument passed to `appendChild` method, KNode was expected.");
		
		if(node.parent) node.parent.removeChild(node);
		
		node.parent = this;
		
		return this.children.push(node)-1;
	}
	
	/**
	 * Hard clones a KNode and all of its contents.
	 * 
	 * @param {boolean}	appendToParent if set true, cloned node will be appended to this parent.
	 * @returns {KNode}	cloned node                              
	 */

	cloneNode(appendToParent) {
		var node = new KNode();
		node.innerSGF = this.innerSGF;
		
		if(appendToParent && this.parent) this.parent.appendChild(node);
		
		return node;
	}
	
	/**
	 * Returns a Boolean value indicating whether a node is a descendant of a given node or not.
	 * 
	 * @param   {KNode}   node to be tested
	 * @returns {boolean} true, if this node contains given node.
	 */
	
	contains(node) {
		if(this.children.indexOf(node) >= 0) return true;
		
		return this.children.some(child => child.contains(node));
	}
	
	/**
	 * Inserts the first KNode given in a parameter immediately before the second, child of this KNode.
	 * 
	 * @throws  {KifuError}   when argument is invalid.
	 * @param   {KNode}   newNode       node to be inserted
	 * @param   {(KNode)} referenceNode reference node, if omitted, new node will be inserted at the end. 
	 * @returns {KNode}   this node
	 */
	
	insertBefore(newNode, referenceNode) {
		if(newNode == null || !(newNode instanceof KNode) || newNode == this) throw new KifuError("Invalid argument passed to `insertBefore` method, KNode was expected.");
		else if(referenceNode == null) return this.appendChild(newNode);
		
		if(newNode.parent) newNode.parent.removeChild(newNode);
		
		newNode.parent = this;
		
		this.children.splice(this.children.indexOf(referenceNode), 0, newNode);
		return this;
	}
	
	/**
	 * Removes a child node from the current element, which must be a child of the current node.
	 * 
	 * @param   {object} child node to be removed
	 * @returns {KNode}  this node
	 */
	
	removeChild(child) {
		var childPosition = this.children.indexOf(child);
	
		if(childPosition == -1) {
			throw new KifuError("Argument passed to `removeChild` method is not child node of the node.");
		}

		this.children.splice(childPosition, 1);

		child.parent = null;
		
		return this;
	}
	
	/**
	 * Replaces one child Node of the current one with the second one given in parameter.
	 * 
	 * @throws  {KifuError} when argument is invalid
	 * @param   {KNode} newChild node to be inserted
	 * @param   {KNode} oldChild node to be replaced
	 * @returns {KNode} this node
	 */
	
	replaceChild(newChild, oldChild) {
		if(newChild == null || !(newChild instanceof KNode) || newChild == this) throw new KifuError("Invalid argument passed to `replaceChild` method, KNode was expected.");
		
		this.insertBefore(newChild, oldChild);
		this.removeChild(oldChild);
		
		return this;
	}
	
	/// BASIC PROPERTY GETTER and SETTER
	
	/**
	 * Gets property by SGF property identificator. Returns property value (type depends on property type)
	 * 
	 * @param   {string} 	propIdent - SGF property idetificator
	 * @returns {any}		property value or values or undefined, if property is missing. 
	 */

	getProperty(propIdent) {
		return this.SGFProperties[propIdent];
	}
	
	/**
	 * Sets property by SGF property identificator.
	 * 
	 * @param   {string}          propIdent - SGF property idetificator
	 * @param   {string|string[]} value - property value or values
	 */

	setProperty(propIdent, value) {
		if(value == null) delete this.SGFProperties[propIdent];
		else this.SGFProperties[propIdent] = value;
		
		return this;
	}
	
	/// SGF RAW METHODS
	
	/**
	 * Gets one SGF property value as string (with brackets `[` and `]`).
	 * 
	 * @param   {string} propIdent SGF property identificator.
	 * @returns {string} SGF property values or empty string, if node doesn't containg this property.
	 */

	getSGFProperty(propIdent) {
		if(this.SGFProperties[propIdent] != null) {
			let propertyValueType = propertyValueTypes[propIdent] || propertyValueTypes._default;
			
			if(propertyValueType.multiple) {
				if(!propertyValueType.notEmpty || this.SGFProperties[propIdent].length) {
					return "["+this.SGFProperties[propIdent].map(propValue => propertyValueType.type.write(propValue).replace(/\]/g, "\\]")).join("][")+"]";
				}
			}
			else if(!propertyValueType.notEmpty || this.SGFProperties[propIdent]) {
				return "["+propertyValueType.type.write(this.SGFProperties[propIdent]).replace(/\]/g, "\\]")+"]";
			}
		}
		
		return "";
	}
	
	/**
	 * Sets one SGF property.
	 * 
	 * @param   {string}   propIdent SGF property idetificator
	 * @param   {string[]} propValue SGF property value
	 * @returns {KNode}    this KNode for chaining
	 */

	setSGFProperty(propIdent, propValue) {
		if(typeof propValue == "string") {
			let parser = new SGFParser(propValue);
			propValue = parser.parsePropertyValues();
		}
		
		let propertyValueType = propertyValueTypes[propIdent] || propertyValueTypes._default;
		
		if(propertyValueType.multiple) {
			if(!propertyValueType.notEmpty || propValue.length) {
				this.SGFProperties[propIdent] = propValue.map(val => propertyValueType.type.read(val));
			}
		}
		else if(!propertyValueType.notEmpty || propValue[0]) {
			this.SGFProperties[propIdent] = propertyValueType.type.read(propValue.join(""));
		}
		else {
			delete this.SGFProperties[propIdent];
		}

		return this;
	}
	
	/**
	 * Sets multiple SGF properties.
	 * 
	 * @param   {Object}   properties - map with signature propIdent -> propValues.
	 * @returns {KNode}    this KNode for chaining
	 */
	
	setSGFProperties(properties) {
		for(let ident in properties) {
			if(properties.hasOwnProperty(ident)) {
				this.setSGFProperty(ident, properties[ident]);
			}
		}
		
		return this;
	}
	
	/**
	 * Sets properties of Kifu node based on the sgf string. Usually you won't use this method directly, but use innerSGF property instead.
	 * 
	 * Basically it parsers the sgf, takes properties from it and adds them to the node. 
	 * Then if there are other nodes in the string, they will be appended to the node as well.
	 * 
	 * @param {string} sgf SGF text for current node. It must be without trailing `;`, however it can contain following nodes.
	 * @throws {SGFSyntaxError} throws exception, if sgf string contains invalid SGF.
	 */

	setFromSGF(parser) {
		// clean up
		for(let i = this.children.length-1; i >= 0; i--) {
			this.removeChild(this.children[i]);
		}
		this.SGFProperties = {};
		
		// and parse properties
		this.setSGFProperties(parser.parseProperties());
		
		// then we parse the rest of sgf
		if(parser.currentChar == ";") {
			// single kifu node child
			let childNode = new KNode();
			this.appendChild(childNode);
			parser.next();
			childNode.setFromSGF(parser);
		}
		else if(parser.currentChar == "(") {
			// two or more children
			parser.parseCollection().forEach((function(jsgf) {
				this.appendChild(KNode.fromJS(jsgf));
			}).bind(this));
		}
		else if(parser.currentChar) {
			// syntax error
			throw new SGFSyntaxError("Illegal character in SGF node", parser);
		}
	}
	
	toSGF() {
		return "(;"+this.innerSGF+")";
	}
}
