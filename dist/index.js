(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.WGo = {}));
}(this, (function (exports) { 'use strict';

  /**
   * Enumeration representing stone color, can be used for representing board position.
   */
  (function (Color) {
      Color[Color["BLACK"] = 1] = "BLACK";
      Color[Color["B"] = 1] = "B";
      Color[Color["WHITE"] = -1] = "WHITE";
      Color[Color["W"] = -1] = "W";
      Color[Color["EMPTY"] = 0] = "EMPTY";
      Color[Color["E"] = 0] = "E";
  })(exports.Color || (exports.Color = {}));

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */
  /* global Reflect, Promise */

  var extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
          function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
      return extendStatics(d, b);
  };

  function __extends(d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }

  var __assign = function() {
      __assign = Object.assign || function __assign(t) {
          for (var s, i = 1, n = arguments.length; i < n; i++) {
              s = arguments[i];
              for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
          return t;
      };
      return __assign.apply(this, arguments);
  };

  function __values(o) {
      var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
      if (m) return m.call(o);
      if (o && typeof o.length === "number") return {
          next: function () {
              if (o && i >= o.length) o = void 0;
              return { value: o && o[i++], done: !o };
          }
      };
      throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }

  function __read(o, n) {
      var m = typeof Symbol === "function" && o[Symbol.iterator];
      if (!m) return o;
      var i = m.call(o), r, ar = [], e;
      try {
          while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
      }
      catch (error) { e = { error: error }; }
      finally {
          try {
              if (r && !r.done && (m = i["return"])) m.call(i);
          }
          finally { if (e) throw e.error; }
      }
      return ar;
  }

  function __spread() {
      for (var ar = [], i = 0; i < arguments.length; i++)
          ar = ar.concat(__read(arguments[i]));
      return ar;
  }

  /**
   * Class for syntax errors in SGF string.
   * @ extends Error
   */
  var SGFSyntaxError = /** @class */ (function (_super) {
      __extends(SGFSyntaxError, _super);
      function SGFSyntaxError(message, parser) {
          var _newTarget = this.constructor;
          var _this = _super.call(this, message) || this;
          _this.__proto__ = _newTarget.prototype;
          // var tempError = Error.apply(this);
          _this.name = _this.name = 'SGFSyntaxError';
          _this.message = message || 'There was an unspecified syntax error in the SGF';
          if (parser) {
              _this.message += " on line " + parser.lineNo + ", char " + parser.charNo + ":\n";
              _this.message += "\t" + parser.sgfString.split('\n')[parser.lineNo - 1] + "\n";
              _this.message += "\t" + Array(parser.charNo + 1).join(' ') + "^";
          }
          return _this;
      }
      return SGFSyntaxError;
  }(Error));

  /**
   * Contains methods for parsing sgf string.
   * @module SGFParser
   */
  var CODE_A = 'A'.charCodeAt(0);
  var CODE_Z = 'Z'.charCodeAt(0);
  var CODE_WHITE_CHAR = ' '.charCodeAt(0);
  function isCharUCLetter(char) {
      if (!char) {
          return false;
      }
      var charCode = char.charCodeAt(0);
      return charCode >= CODE_A && charCode <= CODE_Z;
  }
  /**
   * Class for parsing of sgf files. Can be used for parsing of SGF fragments as well.
   */
  var SGFParser = /** @class */ (function () {
      /**
       * Creates new instance of SGF parser with SGF loaded ready to be parsed.
       * @param sgf string to parse.
       */
      function SGFParser(sgf) {
          /** Current character position */
          this.position = 0;
          /** Current line number */
          this.lineNo = 1;
          /** Current char number (on the line) */
          this.charNo = 0;
          this.sgfString = sgf;
      }
      /**
       * Returns current significant character (ignoring whitespace characters).
       * If there is end of string, return undefined.
       */
      SGFParser.prototype.currentChar = function () {
          while (this.sgfString.charCodeAt(this.position) <= CODE_WHITE_CHAR) {
              // While the character is a whitespace, increase position pointer and line and column numbers.
              this.nextChar();
          }
          return this.sgfString[this.position];
      };
      /**
       * Move pointer to next character and return it (including whitespace).
       */
      SGFParser.prototype.nextChar = function () {
          if (this.sgfString[this.position] === '\n') {
              this.charNo = 0;
              this.lineNo++;
          }
          else {
              this.charNo++;
          }
          this.position++;
          return this.sgfString[this.position];
      };
      /**
       * Reads current significant character and if it isn't equal with the argument, throws an error.
       * Then move pointer to next character.
       */
      SGFParser.prototype.processChar = function (char) {
          if (this.currentChar() !== char) {
              throw new SGFSyntaxError("Unexpected character " + this.currentChar() + ". Character " + char + " was expected.", this);
          }
          return this.nextChar();
      };
      /**
       * Parse SGF property value - `"[" CValueType "]"`.
       * @param optional
       */
      SGFParser.prototype.parsePropertyValue = function (optional) {
          if (optional && this.currentChar() !== '[') {
              return;
          }
          var value = '';
          // process "[" and read first char
          var char = this.processChar('[');
          while (char !== ']') {
              if (!char) {
                  // char mustn't be undefined
                  throw new SGFSyntaxError('End of SGF inside of property', this);
              }
              else if (char === '\\') {
                  // if there is character '\' save next character
                  char = this.nextChar();
                  if (!char) {
                      // char have to exist of course
                      throw new SGFSyntaxError('End of SGF inside of property', this);
                  }
                  else if (char === '\n') {
                      // ignore new line, otherwise save
                      continue;
                  }
              }
              // save the character
              value += char;
              // and move to next one
              char = this.nextChar();
          }
          this.processChar(']');
          return value;
      };
      /**
       * Reads the property identifiers (One or more UC letters) - `UcLetter { UcLetter }`.
       */
      SGFParser.prototype.parsePropertyIdent = function () {
          var ident = '';
          // Read current significant character
          var char = this.currentChar();
          if (!isCharUCLetter(char)) {
              throw new SGFSyntaxError('Property identifier must consists from upper case letters.', this);
          }
          ident += char;
          while (char = this.nextChar()) {
              if (!isCharUCLetter(char)) {
                  break;
              }
              ident += char;
          }
          return ident;
      };
      /**
       * Parses sequence of property values - `PropValue { PropValue }`.
       */
      SGFParser.prototype.parsePropertyValues = function () {
          var values = [];
          var value = this.parsePropertyValue();
          if (value) {
              values.push(value);
          }
          while (value = this.parsePropertyValue(true)) {
              values.push(value);
          }
          return values;
      };
      /**
       * Parses a SGF property - `PropIdent PropValue { PropValue }`.
       */
      SGFParser.prototype.parseProperty = function () {
          if (!isCharUCLetter(this.currentChar())) {
              return;
          }
          return [this.parsePropertyIdent(), this.parsePropertyValues()];
      };
      /**
       * Parses a SGF node - `";" { Property }`.
       */
      SGFParser.prototype.parseNode = function () {
          this.processChar(';');
          var properties = {};
          var property;
          while (property = this.parseProperty()) {
              properties[property[0]] = property[1];
          }
          return properties;
      };
      /**
       * Parses a SGF Sequence - `Node { Node }`.
       */
      SGFParser.prototype.parseSequence = function () {
          var sequence = [];
          sequence.push(this.parseNode());
          while (this.currentChar() === ';') {
              sequence.push(this.parseNode());
          }
          return sequence;
      };
      /**
       * Parses a SGF *GameTree* - `"(" Sequence { GameTree } ")"`.
       */
      SGFParser.prototype.parseGameTree = function () {
          this.processChar('(');
          var sequence = this.parseSequence();
          var children = [];
          if (this.currentChar() === '(') {
              children = this.parseCollection();
          }
          this.processChar(')');
          return { sequence: sequence, children: children };
      };
      /**
       * Parses a SGF *Collection* - `Collection = GameTree { GameTree }`. This is the main method for parsing SGF file.
       */
      SGFParser.prototype.parseCollection = function () {
          var gameTrees = [];
          gameTrees.push(this.parseGameTree());
          while (this.currentChar() === '(') {
              gameTrees.push(this.parseGameTree());
          }
          return gameTrees;
      };
      return SGFParser;
  }());

  /**
   * From SGF specification, there are these types of property values:
   *
   * CValueType = (ValueType | *Compose*)
   * ValueType  = (*None* | *Number* | *Real* | *Double* | *Color* | *SimpleText* | *Text* | *Point*  | *Move* | *Stone*)
   *
   * WGo's kifu node (KNode object) implements similar types with few exceptions:
   *
   * - Types `Number`, `Real` and `Double` are implemented by javascript's `number`.
   * - Types `SimpleText` and `Text` are considered as the same.
   * - Types `Point`, `Move` and `Stone` are all the same, implemented as simple object with `x` and `y` coordinates.
   * - Type `None` is implemented as `true`
   *
   * Each `Compose` type, which is used in SGF, has its own type.
   *
   * - `Point ':' Point` (used in AR property) has special type `Line` - object with two sets of coordinates.
   * - `Point ':' Simpletext` (used in LB property) has special type `Label` - object with coordinates and text property
   * - `Simpletext ":" Simpletext` (used in AP property) - not implemented
   * - `Number ":" SimpleText` (used in FG property) - not implemented
   *
   * Moreover each property value has these settings:
   *
   * - *Single value* / *Array* (more values)
   * - *Not empty* / *Empty* (value or array can be empty)
   *
   * {@link http://www.red-bean.com/sgf/sgf4.html}
   */
  var NONE = {
      read: function (str) { return true; },
      write: function (value) { return ''; },
  };
  var NUMBER = {
      read: function (str) { return parseFloat(str); },
      write: function (value) { return value.toString(10); },
  };
  var TEXT = {
      read: function (str) { return str; },
      write: function (value) { return value; },
  };
  var COLOR = {
      read: function (str) { return (str === 'w' || str === 'W' ? exports.Color.WHITE : exports.Color.BLACK); },
      write: function (value) { return (value === exports.Color.WHITE ? 'W' : 'B'); },
  };
  var POINT = {
      read: function (str) { return str ? {
          x: str.charCodeAt(0) - 97,
          y: str.charCodeAt(1) - 97,
      } : null; },
      write: function (value) { return value ? String.fromCharCode(value.x + 97) + String.fromCharCode(value.y + 97) : ''; },
  };
  var LABEL = {
      read: function (str) { return ({
          x: str.charCodeAt(0) - 97,
          y: str.charCodeAt(1) - 97,
          text: str.substr(3),
      }); },
      write: function (value) { return (String.fromCharCode(value.x + 97) + String.fromCharCode(value.y + 97) + ":" + value.text); },
  };
  var VECTOR = {
      read: function (str) { return str ? [
          {
              x: str.charCodeAt(0) - 97,
              y: str.charCodeAt(1) - 97,
          },
          {
              x: str.charCodeAt(3) - 97,
              y: str.charCodeAt(4) - 97,
          },
      ] : null; },
      write: function (value) { return (
      // tslint:disable-next-line:max-line-length
      value ? String.fromCharCode(value[0].x + 97) + String.fromCharCode(value[0].y + 97) + ":" + (String.fromCharCode(value[1].x + 97) + String.fromCharCode(value[1].y + 97)) : ''); },
  };
  var propertyValueTypes = {
      _default: {
          transformer: TEXT,
          multiple: false,
          notEmpty: true,
      },
  };
  /// Move properties -------------------------------------------------------------------------------
  propertyValueTypes.B = propertyValueTypes.W = {
      transformer: POINT,
      multiple: false,
      notEmpty: false,
  };
  propertyValueTypes.KO = {
      transformer: NONE,
      multiple: false,
      notEmpty: false,
  };
  propertyValueTypes.MN = {
      transformer: NUMBER,
      multiple: false,
      notEmpty: true,
  };
  /// Setup properties ------------------------------------------------------------------------------
  propertyValueTypes.AB = propertyValueTypes.AW = propertyValueTypes.AE = {
      transformer: POINT,
      multiple: true,
      notEmpty: true,
  };
  propertyValueTypes.PL = {
      transformer: COLOR,
      multiple: false,
      notEmpty: true,
  };
  /// Node annotation properties --------------------------------------------------------------------
  propertyValueTypes.C = propertyValueTypes.N = {
      transformer: TEXT,
      multiple: false,
      notEmpty: true,
  };
  // tslint:disable-next-line:max-line-length
  propertyValueTypes.DM = propertyValueTypes.GB = propertyValueTypes.GW = propertyValueTypes.HO = propertyValueTypes.UC = propertyValueTypes.V = {
      transformer: NUMBER,
      multiple: false,
      notEmpty: true,
  };
  /// Move annotation properties --------------------------------------------------------------------
  propertyValueTypes.BM = propertyValueTypes.TE = {
      transformer: NUMBER,
      multiple: false,
      notEmpty: true,
  };
  propertyValueTypes.DO = propertyValueTypes.IT = {
      transformer: NONE,
      multiple: false,
      notEmpty: false,
  };
  /// Markup properties -----------------------------------------------------------------------------
  // tslint:disable-next-line:max-line-length
  propertyValueTypes.CR = propertyValueTypes.MA = propertyValueTypes.SL = propertyValueTypes.SQ = propertyValueTypes.TR = {
      transformer: POINT,
      multiple: true,
      notEmpty: true,
  };
  propertyValueTypes.LB = {
      transformer: LABEL,
      multiple: true,
      notEmpty: true,
  };
  propertyValueTypes.AR = propertyValueTypes.LN = {
      transformer: VECTOR,
      multiple: true,
      notEmpty: true,
  };
  propertyValueTypes.DD = propertyValueTypes.TB = propertyValueTypes.TW = {
      transformer: POINT,
      multiple: true,
      notEmpty: false,
  };
  /// Root properties -------------------------------------------------------------------------------
  propertyValueTypes.AP = propertyValueTypes.CA = {
      transformer: TEXT,
      multiple: false,
      notEmpty: true,
  };
  // note: rectangular board is not implemented (in SZ property)
  propertyValueTypes.FF = propertyValueTypes.GM = propertyValueTypes.ST = propertyValueTypes.SZ = {
      transformer: NUMBER,
      multiple: false,
      notEmpty: true,
  };
  /// Game info properties --------------------------------------------------------------------------
  propertyValueTypes.AN = propertyValueTypes.BR = propertyValueTypes.BT =
      propertyValueTypes.CP = propertyValueTypes.DT = propertyValueTypes.EV =
          propertyValueTypes.GN = propertyValueTypes.GC = propertyValueTypes.GN =
              propertyValueTypes.ON = propertyValueTypes.OT = propertyValueTypes.PB =
                  propertyValueTypes.PC = propertyValueTypes.PW = propertyValueTypes.RE =
                      propertyValueTypes.RO = propertyValueTypes.RU = propertyValueTypes.SO =
                          propertyValueTypes.US = propertyValueTypes.WR = propertyValueTypes.WT = {
                              transformer: TEXT,
                              multiple: false,
                              notEmpty: true,
                          };
  propertyValueTypes.TM = propertyValueTypes.HA = propertyValueTypes.KM = {
      transformer: NUMBER,
      multiple: false,
      notEmpty: true,
  };
  /// Timing properties -----------------------------------------------------------------------------
  propertyValueTypes.BL = propertyValueTypes.WL = propertyValueTypes.OB = propertyValueTypes.OW = {
      transformer: NUMBER,
      multiple: false,
      notEmpty: true,
  };
  /// Miscellaneous properties ----------------------------------------------------------------------
  propertyValueTypes.PM = {
      transformer: NUMBER,
      multiple: false,
      notEmpty: true,
  };
  // VW property must be specified as compressed list (ab:cd) and only one value is allowed
  // empty value [] will reset the viewport. Other options are not supported.
  propertyValueTypes.VW = {
      transformer: VECTOR,
      multiple: false,
      notEmpty: true,
  };

  var processJSGF = function (gameTree, rootNode) {
      rootNode.setSGFProperties(gameTree.sequence[0] || {});
      var lastNode = rootNode;
      for (var i = 1; i < gameTree.sequence.length; i++) {
          var node = new KifuNode();
          node.setSGFProperties(gameTree.sequence[i]);
          lastNode.appendChild(node);
          lastNode = node;
      }
      for (var i = 0; i < gameTree.children.length; i++) {
          lastNode.appendChild(processJSGF(gameTree.children[i], new KifuNode()));
      }
      return rootNode;
  };
  // Characters, which has to be escaped when transforming to SGF
  var escapeCharacters = ['\\\\', '\\]'];
  var escapeSGFValue = function (value) {
      return escapeCharacters.reduce(function (prev, current) { return prev.replace(new RegExp(current, 'g'), current); }, value);
  };
  /**
   * Class representing one kifu node.
   */
  var KifuNode = /** @class */ (function () {
      function KifuNode() {
          this.parent = null;
          this.children = [];
          this.properties = {};
      }
      Object.defineProperty(KifuNode.prototype, "root", {
          get: function () {
              // tslint:disable-next-line:no-this-assignment
              var node = this;
              while (node.parent != null) {
                  node = node.parent;
              }
              return node;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(KifuNode.prototype, "innerSGF", {
          /**
           * Kifu node representation as sgf-like string - will contain `;`, all properties and all children.
           */
          get: function () {
              var output = ';';
              for (var propIdent in this.properties) {
                  if (this.properties.hasOwnProperty(propIdent)) {
                      output += propIdent + "[" + this.getSGFProperty(propIdent).map(escapeSGFValue).join('][') + "]";
                  }
              }
              if (this.children.length === 1) {
                  return "" + output + this.children[0].innerSGF;
              }
              if (this.children.length > 1) {
                  return this.children.reduce(function (prev, current) { return prev + "(" + current.innerSGF + ")"; }, output);
              }
              return output;
          },
          set: function (sgf) {
              // clean up
              this.clean();
              var transformedSgf = sgf;
              // create regular SGF from sgf-like string
              if (transformedSgf[0] !== '(') {
                  if (transformedSgf[0] !== ';') {
                      transformedSgf = ";" + transformedSgf;
                  }
                  transformedSgf = "(" + transformedSgf + ")";
              }
              KifuNode.fromSGF(transformedSgf, 0, this);
          },
          enumerable: false,
          configurable: true
      });
      KifuNode.prototype.getPath = function () {
          var path = { depth: 0, forks: [] };
          // tslint:disable-next-line:no-this-assignment
          var node = this;
          while (node.parent) {
              path.depth++;
              if (node.parent.children.length > 1) {
                  path.forks.unshift(node.parent.children.indexOf(node));
              }
              node = node.parent;
          }
          return path;
      };
      /// GENERAL TREE NODE MANIPULATION METHODS (subset of DOM API's Node)
      /**
       * Insert a KNode as the last child node of this node.
       *
       * @throws  {Error} when argument is invalid.
       * @param   {KifuNode} node to append.
       * @returns {number} position(index) of appended node.
       */
      KifuNode.prototype.appendChild = function (node) {
          if (node == null || !(node instanceof KifuNode) || node === this) {
              throw new Error('Invalid argument passed to `appendChild` method, KNode was expected.');
          }
          if (node.parent) {
              node.parent.removeChild(node);
          }
          node.parent = this;
          return this.children.push(node) - 1;
      };
      /**
       * Returns a Boolean value indicating whether a node is a descendant of a given node or not.
       *
       * @param   {KifuNode}   node to be tested
       * @returns {boolean} true, if this node contains given node.
       */
      KifuNode.prototype.contains = function (node) {
          if (this.children.indexOf(node) >= 0) {
              return true;
          }
          return this.children.some(function (child) { return child.contains(node); });
      };
      /**
       * Inserts the first KNode given in a parameter immediately before the second, child of this KNode.
       *
       * @throws  {Error}   when argument is invalid.
       * @param   {KifuNode}   newNode       node to be inserted
       * @param   {(KifuNode)} referenceNode reference node, if omitted, new node will be inserted at the end.
       * @returns {KifuNode}   this node
       */
      KifuNode.prototype.insertBefore = function (newNode, referenceNode) {
          if (newNode == null || !(newNode instanceof KifuNode) || newNode === this) {
              throw new Error('Invalid argument passed to `insertBefore` method, KNode was expected.');
          }
          if (referenceNode == null) {
              this.appendChild(newNode);
              return this;
          }
          if (newNode.parent) {
              newNode.parent.removeChild(newNode);
          }
          newNode.parent = this;
          this.children.splice(this.children.indexOf(referenceNode), 0, newNode);
          return this;
      };
      /**
       * Removes a child node from the current element, which must be a child of the current node.
       *
       * @param   {KifuNode} child node to be removed
       * @returns {KifuNode}  this node
       */
      KifuNode.prototype.removeChild = function (child) {
          this.children.splice(this.children.indexOf(child), 1);
          child.parent = null;
          return this;
      };
      /**
       * Replaces one child Node of the current one with the second one given in parameter.
       *
       * @throws  {Error} when argument is invalid
       * @param   {KifuNode} newChild node to be inserted
       * @param   {KifuNode} oldChild node to be replaced
       * @returns {KifuNode} this node
       */
      KifuNode.prototype.replaceChild = function (newChild, oldChild) {
          if (newChild == null || !(newChild instanceof KifuNode) || newChild === this) {
              throw new Error('Invalid argument passed to `replaceChild` method, KNode was expected.');
          }
          this.insertBefore(newChild, oldChild);
          this.removeChild(oldChild);
          return this;
      };
      /**
       * Remove all properties and children. Parent will remain.
       */
      KifuNode.prototype.clean = function () {
          for (var i = this.children.length - 1; i >= 0; i--) {
              this.removeChild(this.children[i]);
          }
          this.properties = {};
      };
      /// BASIC PROPERTY GETTER and SETTER
      /**
       * Gets property by SGF property identificator. Returns property value (type depends on property type)
       *
       * @param   {string}   propIdent - SGF property idetificator
       * @returns {any}    property value or values or undefined, if property is missing.
       */
      KifuNode.prototype.getProperty = function (propIdent) {
          return this.properties[propIdent];
      };
      /**
       * Sets property by SGF property identificator.
       *
       * @param   {string}  propIdent - SGF property idetificator
       * @param   {any}     value - property value or values
       */
      KifuNode.prototype.setProperty = function (propIdent, value) {
          if (value === undefined) {
              delete this.properties[propIdent];
          }
          else {
              this.properties[propIdent] = value;
          }
          return this;
      };
      /**
       * Alias for `setProperty` without second parameter.
       * @param propIdent
       */
      KifuNode.prototype.removeProperty = function (propIdent) {
          this.setProperty(propIdent);
      };
      /**
       * Iterates through all properties.
       */
      KifuNode.prototype.forEachProperty = function (callback) {
          var _this = this;
          Object.keys(this.properties).forEach(function (propIdent) { return callback(propIdent, _this.properties[propIdent]); });
      };
      /// SGF RAW METHODS
      /**
       * Gets one SGF property value as string (with brackets `[` and `]`).
       *
       * @param   {string} propIdent SGF property identificator.
       * @returns {string[]} Array of SGF property values or null if there is not such property.
       */
      KifuNode.prototype.getSGFProperty = function (propIdent) {
          if (this.properties[propIdent] !== undefined) {
              var propertyValueType_1 = propertyValueTypes[propIdent] || propertyValueTypes._default;
              if (propertyValueType_1.multiple) {
                  return this.properties[propIdent].map(function (propValue) { return propertyValueType_1.transformer.write(propValue); });
              }
              return [propertyValueType_1.transformer.write(this.properties[propIdent])];
          }
          return null;
      };
      /**
       * Sets one SGF property.
       *
       * @param   {string}   propIdent SGF property identificator
       * @param   {string[]} propValues SGF property values
       * @returns {KifuNode}    this KNode for chaining
       */
      KifuNode.prototype.setSGFProperty = function (propIdent, propValues) {
          var propertyValueType = propertyValueTypes[propIdent] || propertyValueTypes._default;
          if (propValues === undefined) {
              delete this.properties[propIdent];
              return this;
          }
          if (propertyValueType.multiple) {
              this.properties[propIdent] = propValues.map(function (val) { return propertyValueType.transformer.read(val); });
          }
          else {
              this.properties[propIdent] = propertyValueType.transformer.read(propValues[0]);
          }
          return this;
      };
      /**
       * Sets multiple SGF properties.
       *
       * @param   {Object}   properties - map with signature propIdent -> propValues.
       * @returns {KifuNode}    this KNode for chaining
       */
      KifuNode.prototype.setSGFProperties = function (properties) {
          for (var ident in properties) {
              if (properties.hasOwnProperty(ident)) {
                  this.setSGFProperty(ident, properties[ident]);
              }
          }
          return this;
      };
      /**
       * Transforms KNode object to standard SGF string.
       */
      KifuNode.prototype.toSGF = function () {
          return "(" + this.innerSGF + ")";
      };
      /**
       * Deeply clones the node. If node isn't root, its predecessors won't be cloned, and the node becomes root.
       */
      KifuNode.prototype.cloneNode = function (appendToParent) {
          var node = new KifuNode();
          var properties = JSON.parse(JSON.stringify(this.properties));
          node.properties = properties;
          this.children.forEach(function (child) {
              node.appendChild(child.cloneNode());
          });
          if (appendToParent && this.parent) {
              this.parent.appendChild(node);
          }
          return node;
      };
      /**
       * Creates KNode object from SGF transformed to JavaScript object.
       *
       * @param gameTree
       */
      KifuNode.fromJS = function (gameTree, kifuNode) {
          if (kifuNode === void 0) { kifuNode = new KifuNode(); }
          return processJSGF(gameTree, kifuNode);
      };
      /**
       * Creates KNode object from SGF string.
       *
       * @param sgf
       * @param gameNo
       */
      KifuNode.fromSGF = function (sgf, gameNo, kifuNode) {
          if (gameNo === void 0) { gameNo = 0; }
          if (kifuNode === void 0) { kifuNode = new KifuNode(); }
          var parser = new SGFParser(sgf);
          return KifuNode.fromJS(parser.parseCollection()[gameNo], kifuNode);
      };
      return KifuNode;
  }());

  /**
   * WGo's game engine offers to set 3 rules:
   *
   * - *checkRepeat* - one of `repeat.KO`, `repeat.ALL`, `repeat.NONE` - defines if or when a move can be repeated.
   * - *allowRewrite* - if set true a move can rewrite existing move (for uncommon applications)
   * - *allowSuicide* - if set true a suicide will be allowed (and stone will be immediately captured)
   *
   * In this module there are some common preset rule sets (Japanese, Chinese etc...).
   * Extend object `gameRules` if you wish to add some rule set. Names of the rules should correspond with
   * SGF `RU` property.
   */
  (function (Repeating) {
      Repeating["KO"] = "KO";
      Repeating["ALL"] = "ALL";
      Repeating["NONE"] = "NONE";
  })(exports.Repeating || (exports.Repeating = {}));
  var JAPANESE_RULES = {
      repeating: exports.Repeating.KO,
      allowRewrite: false,
      allowSuicide: false,
      komi: 6.5,
  };
  var CHINESE_RULES = {
      repeating: exports.Repeating.NONE,
      allowRewrite: false,
      allowSuicide: false,
      komi: 7.5,
  };
  var ING_RULES = {
      repeating: exports.Repeating.NONE,
      allowRewrite: false,
      allowSuicide: true,
      komi: 7.5,
  };
  var NO_RULES = {
      repeating: exports.Repeating.ALL,
      allowRewrite: true,
      allowSuicide: true,
      komi: 0,
  };
  var goRules = {
      Japanese: JAPANESE_RULES,
      GOE: ING_RULES,
      NZ: ING_RULES,
      AGA: CHINESE_RULES,
      Chinese: CHINESE_RULES,
  };

  /**
   * Contains implementation of go position class.
   * @module Position
   */
  // creates 2-dim array
  function createGrid(size) {
      var grid = [];
      for (var i = 0; i < size; i++) {
          grid.push([]);
      }
      return grid;
  }
  /**
   * Position class represents a state of the go game in one moment in time. It is composed from a grid containing black
   * and white stones, capture counts, and actual turn. It is designed to be mutable.
   */
  var Position = /** @class */ (function () {
      /**
       * Creates instance of position object.
       *
       * @alias WGo.Position
       * @class
       *
       * @param {number} [size = 19] - Size of the board.
       */
      function Position(size) {
          if (size === void 0) { size = 19; }
          /**
           * One dimensional array containing stones of the position.
           */
          this.grid = [];
          /**
           * Contains numbers of stones that both players captured.
           *
           * @property {number} black - Count of white stones captured by **black**.
           * @property {number} white - Count of black stones captured by **white**.
           */
          this.capCount = {
              black: 0,
              white: 0,
          };
          /**
           * Who plays next move.
           */
          this.turn = exports.Color.BLACK;
          this.size = size;
          // init grid
          this.clear();
      }
      Position.prototype.isOnPosition = function (x, y) {
          return x >= 0 && y >= 0 && x < this.size && y < this.size;
      };
      /**
       * Returns stone on the given field.
       *
       * @param {number} x - X coordinate
       * @param {number} y - Y coordinate
       * @return {Color} Color
       */
      Position.prototype.get = function (x, y) {
          if (!this.isOnPosition(x, y)) {
              return undefined;
          }
          return this.grid[x * this.size + y];
      };
      /**
       * Sets stone on the given field.
       *
       * @param {number} x - X coordinate
       * @param {number} y - Y coordinate
       * @param {Color} c - Color
       */
      Position.prototype.set = function (x, y, c) {
          if (!this.isOnPosition(x, y)) {
              throw new TypeError('Attempt to set field outside of position.');
          }
          this.grid[x * this.size + y] = c;
          return this;
      };
      /**
       * Clears the whole position (every value is set to EMPTY).
       */
      Position.prototype.clear = function () {
          for (var i = 0; i < this.size * this.size; i++) {
              this.grid[i] = exports.Color.EMPTY;
          }
          return this;
      };
      /**
       * Clones the whole position.
       *
       * @return {WGo.Position} Copy of the position.
       * @todo Clone turn as well.
       */
      Position.prototype.clone = function () {
          var clone = new Position(this.size);
          clone.grid = this.grid.slice(0);
          clone.capCount.black = this.capCount.black;
          clone.capCount.white = this.capCount.white;
          clone.turn = this.turn;
          return clone;
      };
      /**
       * Compares this position with another position and return object with changes
       *
       * @param {WGo.Position} position - Position to compare to.
       * @return {Field[]} Array of different fields
       */
      Position.prototype.compare = function (position) {
          if (position.size !== this.size) {
              throw new TypeError('Positions of different sizes cannot be compared.');
          }
          var diff = [];
          for (var i = 0; i < this.size * this.size; i++) {
              if (this.grid[i] !== position.grid[i]) {
                  diff.push({
                      x: Math.floor(i / this.size),
                      y: i % this.size,
                      c: position.grid[i],
                  });
              }
          }
          return diff;
      };
      /**
       * Sets stone on given coordinates and capture adjacent stones without liberties if there are any.
       * If move is invalid, false is returned.
       */
      Position.prototype.applyMove = function (x, y, c, allowSuicide, allowRewrite) {
          if (c === void 0) { c = this.turn; }
          if (allowSuicide === void 0) { allowSuicide = false; }
          if (allowRewrite === void 0) { allowRewrite = false; }
          // check if move is on empty field of the board
          if (!(allowRewrite || this.get(x, y) === exports.Color.EMPTY)) {
              return false;
          }
          // clone position and add a stone
          var prevColor = this.get(x, y);
          this.set(x, y, c);
          // check capturing of all surrounding stones
          var capturesAbove = this.get(x, y - 1) === -c && this.captureIfNoLiberties(x, y - 1);
          var capturesRight = this.get(x + 1, y) === -c && this.captureIfNoLiberties(x + 1, y);
          var capturesBelow = this.get(x, y + 1) === -c && this.captureIfNoLiberties(x, y + 1);
          var capturesLeft = this.get(x - 1, y) === -c && this.captureIfNoLiberties(x - 1, y);
          var hasCaptured = capturesAbove || capturesRight || capturesBelow || capturesLeft;
          // check suicide
          if (!hasCaptured) {
              if (!this.hasLiberties(x, y)) {
                  if (allowSuicide) {
                      this.capture(x, y, c);
                  }
                  else {
                      // revert position
                      this.set(x, y, prevColor);
                      return false;
                  }
              }
          }
          this.turn = -c;
          return true;
      };
      /**
       * Validate position. Position is tested from 0:0 to size:size, if there are some moves,
       * that should be captured, they will be removed. Returns a new Position object.
       * This position isn't modified.
       */
      Position.prototype.validatePosition = function () {
          for (var x = 0; x < this.size; x++) {
              for (var y = 0; y < this.size; y++) {
                  this.captureIfNoLiberties(x - 1, y);
              }
          }
          return this;
      };
      /**
       * Returns true if stone or group on the given coordinates has at least one liberty.
       */
      Position.prototype.hasLiberties = function (x, y, alreadyTested, c) {
          if (alreadyTested === void 0) { alreadyTested = createGrid(this.size); }
          if (c === void 0) { c = this.get(x, y); }
          // out of the board there aren't liberties
          if (!this.isOnPosition(x, y)) {
              return false;
          }
          // however empty field means liberty
          if (this.get(x, y) === exports.Color.EMPTY) {
              return true;
          }
          // already tested field or stone of enemy isn't a liberty.
          if (alreadyTested[x][y] || this.get(x, y) === -c) {
              return false;
          }
          // set this field as tested
          alreadyTested[x][y] = true;
          // in this case we are checking our stone, if we get 4 false, it has no liberty
          return (this.hasLiberties(x, y - 1, alreadyTested, c) ||
              this.hasLiberties(x, y + 1, alreadyTested, c) ||
              this.hasLiberties(x - 1, y, alreadyTested, c) ||
              this.hasLiberties(x + 1, y, alreadyTested, c));
      };
      /**
       * Checks if specified stone/group has zero liberties and if so it captures/removes stones from the position.
       */
      Position.prototype.captureIfNoLiberties = function (x, y) {
          // if it has zero liberties capture it
          if (!this.hasLiberties(x, y)) {
              // capture stones from game
              this.capture(x, y);
              return true;
          }
          return false;
      };
      /**
       * Captures/removes stone on specified position and all adjacent and connected stones. This method ignores liberties.
       */
      Position.prototype.capture = function (x, y, c) {
          if (c === void 0) { c = this.get(x, y); }
          if (this.isOnPosition(x, y) && c !== exports.Color.EMPTY && this.get(x, y) === c) {
              this.set(x, y, exports.Color.EMPTY);
              if (c === exports.Color.BLACK) {
                  this.capCount.white = this.capCount.white + 1;
              }
              else {
                  this.capCount.black = this.capCount.black + 1;
              }
              this.capture(x, y - 1, c);
              this.capture(x, y + 1, c);
              this.capture(x - 1, y, c);
              this.capture(x + 1, y, c);
          }
      };
      /**
       * For debug purposes.
       */
      Position.prototype.toString = function () {
          var TL = '┌';
          var TM = '┬';
          var TR = '┐';
          var ML = '├';
          var MM = '┼';
          var MR = '┤';
          var BL = '└';
          var BM = '┴';
          var BR = '┘';
          var BS = '●';
          var WS = '○';
          var HF = '─'; // horizontal fill
          var output = '   ';
          for (var i = 0; i < this.size; i++) {
              output += i < 9 ? i + " " : i;
          }
          output += '\n';
          for (var y = 0; y < this.size; y++) {
              for (var x = 0; x < this.size; x++) {
                  var color = this.grid[x * this.size + y];
                  if (x === 0) {
                      output += (y < 10 ? " " + y : y) + " ";
                  }
                  if (color !== exports.Color.EMPTY) {
                      output += color === exports.Color.BLACK ? BS : WS;
                  }
                  else {
                      var char = void 0;
                      if (y === 0) {
                          // top line
                          if (x === 0) {
                              char = TL;
                          }
                          else if (x < this.size - 1) {
                              char = TM;
                          }
                          else {
                              char = TR;
                          }
                      }
                      else if (y < this.size - 1) {
                          // middle line
                          if (x === 0) {
                              char = ML;
                          }
                          else if (x < this.size - 1) {
                              char = MM;
                          }
                          else {
                              char = MR;
                          }
                      }
                      else {
                          // bottom line
                          if (x === 0) {
                              char = BL;
                          }
                          else if (x < this.size - 1) {
                              char = BM;
                          }
                          else {
                              char = BR;
                          }
                      }
                      output += char;
                  }
                  if (x === this.size - 1) {
                      if (y !== this.size - 1) {
                          output += '\n';
                      }
                  }
                  else {
                      output += HF;
                  }
              }
          }
          return output;
      };
      /**
       * Returns position grid as two dimensional array.
       */
      Position.prototype.toTwoDimensionalArray = function () {
          var arr = [];
          for (var x = 0; x < this.size; x++) {
              arr[x] = [];
              for (var y = 0; y < this.size; y++) {
                  arr[x][y] = this.grid[x * this.size + y];
              }
          }
          return arr;
      };
      return Position;
  }());
  // import { Color, Field, Move } from '../types';
  // /**
  //  * Position of the board (grid) is represented as 2 dimensional array of colors.
  //  */
  // export type Position = Color[][];
  // /**
  //  * Creates empty position (filled with Color.EMPTY) of specified size.
  //  * @param size
  //  */
  // export function createPosition(size: number) {
  //   const position: Color[][] = [];
  //   for (let i = 0; i < size; i++) {
  //     const row: Color[] = [];
  //     for (let j = 0; j < size; j++) {
  //       row.push(Color.EMPTY);
  //     }
  //     position.push(row);
  //   }
  //   return position;
  // }
  // /**
  //  * Deep clones a position.
  //  * @param position
  //  */
  // export function clonePosition(position: Position) {
  //   return position.map(row => row.slice(0));
  // }
  // /**
  //  * Compares position `pos1` with position `pos2` and returns all differences on `pos2`.
  //  * @param pos1
  //  * @param pos2
  //  */
  // export function comparePositions(pos1: Position, pos2: Position): Field[] {
  //   if (pos1.length !== pos2.length) {
  //     throw new TypeError('Positions of different sizes cannot be compared.');
  //   }
  //   const diff: Field[] = [];
  //   for (let x = 0; x < pos1.length; x++) {
  //     for (let y = 0; y < pos2.length; y++) {
  //       if (pos1[x][y] !== pos2[x][y]) {
  //         diff.push({ x, y, c: pos2[x][y] });
  //       }
  //     }
  //   }
  //   return diff;
  // }
  // function isOnBoard(position: Position, x: number, y: number) {
  //   return x >= 0 && x < position.length && y >= 0 && y < position.length;
  // }
  // /**
  //  * Creates new position with specified move (with rules applied - position won't contain captured stones).
  //  * If move is invalid, null is returned.
  //  */
  // export function applyMove(position: Position, x: number, y: number, c: Color.B | Color.W, allowSuicide = false) {
  //   // check if move is on empty field of the board
  //   if (!isOnBoard(position, x, y) || position[x][y] !== Color.EMPTY) {
  //     return null;
  //   }
  //   // clone position and add a stone
  //   const newPosition = clonePosition(position);
  //   newPosition[x][y] = c;
  //   // check capturing of all surrounding stones
  //   const capturesAbove = captureIfNoLiberties(newPosition, x, y - 1, -c);
  //   const capturesRight = captureIfNoLiberties(newPosition, x + 1, y, -c);
  //   const capturesBelow = captureIfNoLiberties(newPosition, x, y + 1, -c);
  //   const capturesLeft = captureIfNoLiberties(newPosition, x - 1, y, -c);
  //   const hasCaptured = capturesAbove || capturesRight || capturesBelow || capturesLeft;
  //   // check suicide
  //   if (!hasCaptured) {
  //     if (!hasLiberties(newPosition, x, y)) {
  //       if (allowSuicide) {
  //         capture(newPosition, x, y, c);
  //       } else {
  //         return null;
  //       }
  //     }
  //   }
  //   return newPosition;
  // }
  // /**
  //  * Validate position. Position is tested from 0:0 to size:size, if there are some moves,
  //  * that should be captured, they will be removed. Returns a new Position object.
  //  */
  // export function getValidatedPosition(position: Position) {
  //   const newPosition = clonePosition(position);
  //   for (let x = 0; x < position.length; x++) {
  //     for (let y = 0; y < position.length; y++) {
  //       captureIfNoLiberties(newPosition, x, y);
  //     }
  //   }
  //   return newPosition;
  // }
  // /**
  //  * Capture stone or group of stones if they are zero liberties. Mutates the given position.
  //  *
  //  * @param position
  //  * @param x
  //  * @param y
  //  * @param c
  //  */
  // function captureIfNoLiberties(position: Position, x: number, y: number, c: Color = position[x][y]) {
  //   let hasCaptured = false;
  //   // is there a stone possible to capture?
  //   if (isOnBoard(position, x, y) && c !== Color.EMPTY && position[x][y] === c) {
  //     // if it has zero liberties capture it
  //     if (!hasLiberties(position, x, y)) {
  //       // capture stones from game
  //       capture(position, x, y, c);
  //       hasCaptured = true;
  //     }
  //   }
  //   return hasCaptured;
  // }
  // function createTestGrid(size: number) {
  //   const grid: boolean[][] = [];
  //   for (let i = 0; i < size; i++) {
  //     grid.push([]);
  //   }
  //   return grid;
  // }
  // /**
  //  * Returns true if stone or group on the given position has at least one liberty.
  //  */
  // function hasLiberties(
  //   position: Position,
  //   x: number,
  //   y: number,
  //   alreadyTested = createTestGrid(position.length),
  //   c = position[x][y],
  // ): boolean {
  //   // out of the board there aren't liberties
  //   if (!isOnBoard(position, x, y)) {
  //     return false;
  //   }
  //   // however empty field means liberty
  //   if (position[x][y] === Color.EMPTY) {
  //     return true;
  //   }
  //   // already tested field or stone of enemy isn't a liberty.
  //   if (alreadyTested[x][y] || position[x][y] === -c) {
  //     return false;
  //   }
  //   // set this field as tested
  //   alreadyTested[x][y] = true;
  //   // in this case we are checking our stone, if we get 4 false, it has no liberty
  //   return (
  //     hasLiberties(position, x, y - 1, alreadyTested, c) ||
  //     hasLiberties(position, x, y + 1, alreadyTested, c) ||
  //     hasLiberties(position, x - 1, y, alreadyTested, c) ||
  //     hasLiberties(position, x + 1, y, alreadyTested, c)
  //   );
  // }
  // /**
  //  * Captures/removes stone on specified position and all adjacent and connected stones. This method ignores liberties.
  //  * Mutates the given position.
  //  */
  // function capture(position: Position, x: number, y: number, c: Color = position[x][y]) {
  //   if (isOnBoard(position, x, y) && position[x][y] !== Color.EMPTY && position[x][y] === c) {
  //     position[x][y] = Color.EMPTY;
  //     capture(position, x, y - 1, c);
  //     capture(position, x, y + 1, c);
  //     capture(position, x - 1, y, c);
  //     capture(position, x + 1, y, c);
  //   }
  // }
  // /**
  //  * For debug purposes.
  //  */
  // export function stringifyPosition(position: Position) {
  //   const TL = '┌';
  //   const TM = '┬';
  //   const TR = '┐';
  //   const ML = '├';
  //   const MM = '┼';
  //   const MR = '┤';
  //   const BL = '└';
  //   const BM = '┴';
  //   const BR = '┘';
  //   const BS = '●';
  //   const WS = '○';
  //   const HF = '─'; // horizontal fill
  //   let output = '   ';
  //   for (let i = 0; i < position.length; i++) {
  //     output += i < 9 ? `${i} ` : i;
  //   }
  //   output += '\n';
  //   for (let y = 0; y < position.length; y++) {
  //     for (let x = 0; x < position.length; x++) {
  //       const color = position[x][y];
  //       if (x === 0) {
  //         output += `${(y < 10 ? ` ${y}` : y)} `;
  //       }
  //       if (color !== Color.EMPTY) {
  //         output += color === Color.BLACK ? BS : WS;
  //       } else {
  //         let char;
  //         if (y === 0) {
  //           // top line
  //           if (x === 0) {
  //             char = TL;
  //           } else if (x < position.length - 1) {
  //             char = TM;
  //           } else {
  //             char = TR;
  //           }
  //         } else if (y < position.length - 1) {
  //           // middle line
  //           if (x === 0) {
  //             char = ML;
  //           } else if (x < position.length - 1) {
  //             char = MM;
  //           } else {
  //             char = MR;
  //           }
  //         } else {
  //           // bottom line
  //           if (x === 0) {
  //             char = BL;
  //           } else if (x < position.length - 1) {
  //             char = BM;
  //           } else {
  //             char = BR;
  //           }
  //         }
  //         output += char;
  //       }
  //       if (x === position.length - 1) {
  //         if (y !== position.length - 1) {
  //           output += '\n';
  //         }
  //       } else {
  //         output += HF;
  //       }
  //     }
  //   }
  //   return output;
  // }

  var Game = /** @class */ (function () {
      /**
       * Creates instance of game class.
       *
       * @class
       * This class implements game logic. It basically analyses given moves and returns capture stones.
       * WGo.Game also stores every position from beginning, so it has ability to check repeating positions
       * and it can effectively restore old positions.
       *
       *
       * @param {number} [size = 19] Size of the board
       * @param {string} [checkRepeat = KO] How to handle repeated position:
       *
       * * KO - ko is properly handled - position cannot be same like previous position
       * * ALL - position cannot be same like any previous position - e.g. it forbids triple ko
       * * NONE - position can be repeated
       *
       * @param {boolean} [allowRewrite = false] Allow to play moves, which were already played
       * @param {boolean} [allowSuicide = false] Allow to play suicides, stones are immediately captured
       */
      function Game(size, rules) {
          if (size === void 0) { size = 19; }
          if (rules === void 0) { rules = JAPANESE_RULES; }
          this.size = size;
          this.rules = rules;
          this.komi = rules.komi;
          this.positionStack = [new Position(size)];
      }
      Object.defineProperty(Game.prototype, "position", {
          get: function () {
              return this.positionStack[this.positionStack.length - 1];
          },
          set: function (pos) {
              this.positionStack[this.positionStack.length - 1] = pos;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "turn", {
          get: function () {
              return this.position.turn;
          },
          set: function (color) {
              this.position.turn = color;
          },
          enumerable: false,
          configurable: true
      });
      Object.defineProperty(Game.prototype, "capCount", {
          get: function () {
              return this.position.capCount;
          },
          enumerable: false,
          configurable: true
      });
      /**
       * Play move. You can specify color.
       */
      Game.prototype.play = function (x, y) {
          var nextPosition = this.tryToPlay(x, y);
          if (nextPosition) {
              this.pushPosition(nextPosition);
          }
          return nextPosition;
      };
      /**
       * Tries to play on given coordinates, returns new position after the play, or error code.
       */
      Game.prototype.tryToPlay = function (x, y) {
          var nextPosition = this.position.clone();
          var success = nextPosition.applyMove(x, y, nextPosition.turn, this.rules.allowSuicide, this.rules.allowRewrite);
          if (success && !this.hasPositionRepeated(nextPosition)) {
              return nextPosition;
          }
          return false;
      };
      /**
       * @param {Position} position to check
       * @return {boolean} Returns true if the position didn't occurred in the past (according to the rule set)
       */
      Game.prototype.hasPositionRepeated = function (position) {
          var depth;
          if (this.rules.repeating === exports.Repeating.KO && this.positionStack.length - 2 >= 0) {
              depth = this.positionStack.length - 2;
          }
          else if (this.rules.repeating === exports.Repeating.NONE) {
              depth = 0;
          }
          else {
              return false;
          }
          for (var i = this.positionStack.length - 1; i >= depth; i--) {
              if (this.positionStack[i].compare(position).length === 0) {
                  return true;
              }
          }
          return false;
      };
      /**
       * Play pass.
       *
       * @param {(BLACK|WHITE)} c color
       */
      Game.prototype.pass = function (c) {
          if (c === void 0) { c = this.turn; }
          var nextPosition = this.position.clone();
          nextPosition.turn = -(c || this.turn);
          this.pushPosition(nextPosition);
      };
      /**
       * Finds out validity of the move.
       *
       * @param {number} x coordinate
       * @param {number} y coordinate
       * @return {boolean} true if move can be played.
       */
      Game.prototype.isValid = function (x, y) {
          return !!this.tryToPlay(x, y);
      };
      /**
       * Controls position of the move.
       *
       * @param {number} x coordinate
       * @param {number} y coordinate
       * @return {boolean} true if move is on board.
       */
      Game.prototype.isOnBoard = function (x, y) {
          return this.position.isOnPosition(x, y);
      };
      /**
       * Inserts move into current position. Use for setting position, for example in handicap game. Field must be empty.
       *
       * @param {number} x coordinate
       * @param {number} y coordinate
       * @param {Color} c color
       * @return {boolean} true if operation is successful.
       */
      Game.prototype.addStone = function (x, y, c) {
          if (this.isOnBoard(x, y) && this.position.get(x, y) === exports.Color.EMPTY) {
              this.position.set(x, y, c);
              return true;
          }
          return false;
      };
      /**
       * Removes move from current position.
       *
       * @param {number} x coordinate
       * @param {number} y coordinate
       * @return {boolean} true if operation is successful.
       */
      Game.prototype.removeStone = function (x, y) {
          if (this.isOnBoard(x, y) && this.position.get(x, y) !== exports.Color.EMPTY) {
              this.position.set(x, y, exports.Color.EMPTY);
              return true;
          }
          return false;
      };
      /**
       * Set or insert move of current position.
       *
       * @param {number} x coordinate
       * @param {number} y coordinate
       * @param {(BLACK|WHITE)} [c] color
       * @return {boolean} true if operation is successful.
       */
      Game.prototype.setStone = function (x, y, c) {
          if (this.isOnBoard(x, y)) {
              this.position.set(x, y, c);
              return true;
          }
          return false;
      };
      /**
       * Get stone on given position.s
       *
       * @param {number} x coordinate
       * @param {number} y coordinate
       * @return {(Color|null)} color
       */
      Game.prototype.getStone = function (x, y) {
          return this.position.get(x, y);
      };
      /**
       * Add position to stack. If position isn't specified current position is cloned and stacked.
       * Pointer of actual position is moved to the new position.
       *
       * @param {WGo.Position} tmp position (optional)
       */
      Game.prototype.pushPosition = function (pos) {
          return this.positionStack.push(pos);
      };
      /**
       * Remove current position from stack. Pointer of actual position is moved to the previous position.
       */
      Game.prototype.popPosition = function () {
          if (this.positionStack.length > 1) {
              return this.positionStack.pop();
          }
          return null;
      };
      /**
       * Removes all positions except the initial.
       */
      Game.prototype.clear = function () {
          this.positionStack = [this.positionStack[0]];
      };
      return Game;
  }());

  /**
   * Represents generic board object specified by type, which can be painted on the board.
   * It contains z-index and opacity.
   */
  var BoardObject = /** @class */ (function () {
      function BoardObject(type) {
          this.zIndex = 0;
          this.opacity = 1;
          this.type = type;
      }
      return BoardObject;
  }());

  /**
   * Represents board object specified by type, which can be painted on the specific field of the board.
   * It can be also transformed.
   */
  var FieldBoardObject = /** @class */ (function (_super) {
      __extends(FieldBoardObject, _super);
      function FieldBoardObject(type, x, y) {
          if (x === void 0) { x = 0; }
          if (y === void 0) { y = 0; }
          var _this = _super.call(this, type) || this;
          _this.scaleX = 1;
          _this.scaleY = 1;
          _this.rotate = 0;
          _this.x = x;
          _this.y = y;
          return _this;
      }
      FieldBoardObject.prototype.setPosition = function (x, y) {
          this.x = x;
          this.y = y;
      };
      FieldBoardObject.prototype.setScale = function (factor) {
          this.scaleX = factor;
          this.scaleY = factor;
      };
      return FieldBoardObject;
  }(BoardObject));

  /**
   * Board markup object is special type of field object, which can have 3 variations - for empty field
   * and for black and white stone.
   */
  var MarkupBoardObject = /** @class */ (function (_super) {
      __extends(MarkupBoardObject, _super);
      function MarkupBoardObject(type, x, y, variation) {
          if (x === void 0) { x = 0; }
          if (y === void 0) { y = 0; }
          if (variation === void 0) { variation = exports.Color.E; }
          var _this = _super.call(this, type, x, y) || this;
          _this.variation = variation;
          return _this;
      }
      return MarkupBoardObject;
  }(FieldBoardObject));

  /**
   * Board label object is special type of markup object, which renders text on the field.
   */
  var LabelBoardObject = /** @class */ (function (_super) {
      __extends(LabelBoardObject, _super);
      function LabelBoardObject(text, x, y, variation) {
          if (x === void 0) { x = 0; }
          if (y === void 0) { y = 0; }
          var _this = _super.call(this, 'LB', x, y, variation) || this;
          _this.text = text;
          return _this;
      }
      return LabelBoardObject;
  }(MarkupBoardObject));

  /**
   * Board line object is special type of object, which consist from start and end point.
   */
  var LineBoardObject = /** @class */ (function (_super) {
      __extends(LineBoardObject, _super);
      function LineBoardObject(type, start, end) {
          var _this = _super.call(this, type) || this;
          _this.start = start;
          _this.end = end;
          return _this;
      }
      return LineBoardObject;
  }(BoardObject));

  /**
   * Simple base class for event handling. It tries to follow Node.js EventEmitter class API,
   * but contains only basic methods.
   */
  var EventEmitter = /** @class */ (function () {
      function EventEmitter() {
          // tslint:disable-next-line:variable-name
          this._events = {};
      }
      EventEmitter.prototype.on = function (evName, callback) {
          this._events[evName] = this._events[evName] || [];
          this._events[evName].push(callback);
      };
      EventEmitter.prototype.off = function (evName, callback) {
          if (this._events[evName]) {
              if (callback == null) {
                  this._events[evName] = [];
              }
              this._events[evName] = this._events[evName].filter(function (fn) { return fn !== callback; });
          }
      };
      EventEmitter.prototype.emit = function (evName) {
          var args = [];
          for (var _i = 1; _i < arguments.length; _i++) {
              args[_i - 1] = arguments[_i];
          }
          if (this._events[evName]) {
              this._events[evName].forEach(function (fn) { return fn.apply(void 0, __spread(args)); });
          }
      };
      return EventEmitter;
  }());

  /**
   * Helper function for merging default config with provided config.
   *
   * @param defaults
   * @param config
   */
  function makeConfig(defaults, config) {
      var mergedConfig = {};
      var defaultKeys = Object.keys(defaults);
      defaultKeys.forEach(function (key) {
          var val = config[key];
          var defVal = defaults[key];
          if (val != null && val.constructor === Object && !Array.isArray(val) && defVal != null) {
              mergedConfig[key] = makeConfig(defVal, val);
          }
          else if (val !== undefined) {
              mergedConfig[key] = val;
          }
          else {
              mergedConfig[key] = defVal;
          }
      });
      Object.keys(config).forEach(function (key) {
          if (defaultKeys.indexOf(key) === -1) {
              mergedConfig[key] = config[key];
          }
      });
      return mergedConfig;
  }

  var defaultBoardBaseTheme = {
      // basic
      stoneSize: 0.47,
      marginSize: 0.25,
      font: 'calibri',
      backgroundColor: '#CEB053',
      backgroundImage: '',
      // markup
      markupBlackColor: 'rgba(255,255,255,0.9)',
      markupWhiteColor: 'rgba(0,0,0,0.7)',
      markupNoneColor: 'rgba(0,0,0,0.7)',
      markupLineWidth: 0.05,
      // shadows
      shadowColor: 'rgba(62,32,32,0.5)',
      shadowTransparentColor: 'rgba(62,32,32,0)',
      shadowBlur: 0.25,
      shadowOffsetX: 0.07,
      shadowOffsetY: 0.13,
      // grid
      grid: {
          linesWidth: 0.03,
          linesColor: '#654525',
          starColor: '#531',
          starSize: 0.07,
      },
      // coordinates
      coordinates: {
          color: '#531',
          bold: false,
          labelsX: 'ABCDEFGHJKLMNOPQRSTUVWXYZ',
          labelsY: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
      },
      starPoints: {
          5: [{ x: 2, y: 2 }],
          7: [{ x: 3, y: 3 }],
          8: [{ x: 2, y: 2 }, { x: 5, y: 2 }, { x: 2, y: 5 }, { x: 5, y: 5 }],
          9: [{ x: 2, y: 2 }, { x: 6, y: 2 }, { x: 4, y: 4 }, { x: 2, y: 6 }, { x: 6, y: 6 }],
          10: [{ x: 2, y: 2 }, { x: 7, y: 2 }, { x: 2, y: 7 }, { x: 7, y: 7 }],
          11: [{ x: 2, y: 2 }, { x: 8, y: 2 }, { x: 5, y: 5 }, { x: 2, y: 8 }, { x: 8, y: 8 }],
          12: [{ x: 3, y: 3 }, { x: 8, y: 3 }, { x: 3, y: 8 }, { x: 8, y: 8 }],
          13: [{ x: 3, y: 3 }, { x: 9, y: 3 }, { x: 6, y: 6 }, { x: 3, y: 9 }, { x: 9, y: 9 }],
          14: [{ x: 3, y: 3 }, { x: 10, y: 3 }, { x: 3, y: 10 }, { x: 10, y: 10 }],
          15: [{ x: 3, y: 3 }, { x: 11, y: 3 }, { x: 7, y: 7 }, { x: 3, y: 11 }, { x: 11, y: 11 }],
          16: [{ x: 3, y: 3 }, { x: 12, y: 3 }, { x: 3, y: 12 }, { x: 12, y: 12 }],
          17: [{ x: 3, y: 3 }, { x: 8, y: 3 }, { x: 13, y: 3 }, { x: 3, y: 8 }, { x: 8, y: 8 },
              { x: 13, y: 8 }, { x: 3, y: 13 }, { x: 8, y: 13 }, { x: 13, y: 13 }],
          18: [{ x: 3, y: 3 }, { x: 14, y: 3 }, { x: 3, y: 14 }, { x: 14, y: 14 }],
          19: [{ x: 3, y: 3 }, { x: 9, y: 3 }, { x: 15, y: 3 }, { x: 3, y: 9 }, { x: 9, y: 9 },
              { x: 15, y: 9 }, { x: 3, y: 15 }, { x: 9, y: 15 }, { x: 15, y: 15 }],
          20: [{ x: 3, y: 3 }, { x: 16, y: 3 }, { x: 3, y: 16 }, { x: 16, y: 16 }],
          21: [{ x: 3, y: 3 }, { x: 10, y: 3 }, { x: 17, y: 3 }, { x: 3, y: 10 }, { x: 10, y: 10 },
              { x: 17, y: 10 }, { x: 3, y: 17 }, { x: 10, y: 17 }, { x: 17, y: 17 }],
      },
  };
  var defaultBoardBaseConfig = {
      size: 19,
      width: 0,
      height: 0,
      viewport: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
      },
      coordinates: false,
      theme: defaultBoardBaseTheme,
  };

  /**
   * Board class with basic functionality which can be used for creating custom boards.
   */
  var BoardBase = /** @class */ (function (_super) {
      __extends(BoardBase, _super);
      function BoardBase(element, config) {
          if (config === void 0) { config = {}; }
          var _this = _super.call(this) || this;
          _this.objects = [];
          // merge user config with default
          _this.element = element;
          _this.config = makeConfig(defaultBoardBaseConfig, config);
          return _this;
      }
      /**
       * Updates dimensions and redraws everything
       */
      BoardBase.prototype.resize = function () {
          // subclass may do resize things here
      };
      /**
       * Redraw everything.
       */
      BoardBase.prototype.redraw = function () {
          // subclass should implement this
      };
      /**
       * Add board object. Main function for adding graphics on the board.
       *
       * @param boardObject
       */
      BoardBase.prototype.addObject = function (boardObject) {
          // handling multiple objects
          if (Array.isArray(boardObject)) {
              for (var i = 0; i < boardObject.length; i++) {
                  this.addObject(boardObject[i]);
              }
              return;
          }
          if (!this.hasObject(boardObject)) {
              this.objects.push(boardObject);
          }
      };
      /**
       * Method to update board object. Can be called, when some params of boardObject changes.
       * It is similar to redraw(), but only boardObject can be redrawn, so performance can/should be better.
       *
       * @param boardObject
       */
      BoardBase.prototype.updateObject = function (boardObject) {
      };
      /**
       * Remove board object. Main function for removing graphics on the board.
       *
       * @param boardObject
       */
      BoardBase.prototype.removeObject = function (boardObject) {
          // handling multiple objects
          if (Array.isArray(boardObject)) {
              for (var i = 0; i < boardObject.length; i++) {
                  this.removeObject(boardObject[i]);
              }
              return;
          }
          var objectPos = this.objects.indexOf(boardObject);
          if (objectPos === -1) {
              // object isn't on the board, ignore it
              return;
          }
          this.objects.splice(objectPos, 1);
      };
      /**
       * Removes all objects on specified field.
       *
       * @param x
       * @param y
       */
      BoardBase.prototype.removeObjectsAt = function (x, y) {
          var _this = this;
          this.objects.forEach(function (obj) {
              if (obj instanceof FieldBoardObject && obj.x === x && obj.y === y) {
                  _this.removeObject(obj);
              }
          });
      };
      /**
       * Removes all objects on the board.
       */
      BoardBase.prototype.removeAllObjects = function () {
          this.objects = [];
      };
      /**
       * Returns true if object is already on the board.
       *
       * @param boardObject
       */
      BoardBase.prototype.hasObject = function (boardObject) {
          return this.objects.indexOf(boardObject) >= 0;
      };
      /**
       * Sets width of the board, height will be automatically computed. Then everything will be redrawn.
       *
       * @param width
       */
      BoardBase.prototype.setWidth = function (width) {
          this.config.width = width;
          this.config.height = 0;
          this.resize();
      };
      /**
       * Sets height of the board, width will be automatically computed. Then everything will be redrawn.
       *
       * @param height
       */
      BoardBase.prototype.setHeight = function (height) {
          this.config.width = 0;
          this.config.height = height;
          this.resize();
      };
      /**
       * Sets exact dimensions of the board. Then everything will be redrawn.
       *
       * @param width
       * @param height
       */
      BoardBase.prototype.setDimensions = function (width, height) {
          this.config.width = width;
          this.config.height = height;
          this.resize();
      };
      /**
         * Get currently visible section of the board.
         */
      BoardBase.prototype.getViewport = function () {
          return this.config.viewport;
      };
      /**
         * Set section of the board to be displayed.
         */
      BoardBase.prototype.setViewport = function (viewport) {
          this.config.viewport = viewport;
      };
      /**
       * Helper to get board size.
       */
      BoardBase.prototype.getSize = function () {
          return this.config.size;
      };
      /**
       * Helper to set board size.
       */
      BoardBase.prototype.setSize = function (size) {
          if (size === void 0) { size = 19; }
          this.config.size = size;
      };
      /**
       * Returns true, if coordinates around board are visible.
       */
      BoardBase.prototype.getCoordinates = function () {
          return this.config.coordinates;
      };
      /**
       * Enable or disable coordinates around board.
       */
      BoardBase.prototype.setCoordinates = function (coordinates) {
          this.config.coordinates = coordinates;
      };
      return BoardBase;
  }(EventEmitter));

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var SVG_OBJECTS = 'objects';
  var SVG_GRID_MASK = 'gridMask';
  var SVG_SHADOWS = 'shadows';

  var Arrow = /** @class */ (function () {
      function Arrow(params) {
          if (params === void 0) { params = {}; }
          this.params = params;
      }
      Arrow.prototype.createElement = function () {
          var _a;
          return _a = {},
              _a[SVG_OBJECTS] = this.createSVGElements(),
              _a[SVG_GRID_MASK] = this.createSVGElements(),
              _a;
      };
      Arrow.prototype.createSVGElements = function () {
          var group = document.createElementNS(SVG_NS, 'g');
          var startCircle = document.createElementNS(SVG_NS, 'circle');
          var line = document.createElementNS(SVG_NS, 'line');
          var endTriangle = document.createElementNS(SVG_NS, 'polygon');
          group.appendChild(startCircle);
          group.appendChild(line);
          group.appendChild(endTriangle);
          return group;
      };
      Arrow.prototype.updateElement = function (elem, boardObject, config) {
          // basic UI definitions
          elem[SVG_OBJECTS].setAttribute('stroke', this.params.color || config.theme.markupNoneColor);
          elem[SVG_OBJECTS].setAttribute('fill', this.params.color || config.theme.markupNoneColor);
          elem[SVG_OBJECTS].setAttribute('stroke-width', this.params.lineWidth || config.theme.markupLineWidth);
          this.updateSVGElements(elem[SVG_OBJECTS], boardObject);
          elem[SVG_GRID_MASK].setAttribute('stroke', "rgba(0,0,0," + config.theme.markupGridMask + ")");
          elem[SVG_GRID_MASK].setAttribute('fill', "rgba(0,0,0," + config.theme.markupGridMask + ")");
          elem[SVG_GRID_MASK].setAttribute('stroke-width', (this.params.lineWidth || config.theme.markupLineWidth) * 3);
          this.updateSVGElements(elem[SVG_GRID_MASK], boardObject);
      };
      Arrow.prototype.updateSVGElements = function (elem, boardObject) {
          // SVG elements of arrow
          var startCircle = elem.children[0];
          var line = elem.children[1];
          var endTriangle = elem.children[2];
          var x1 = boardObject.start.x;
          var y1 = boardObject.start.y;
          var x2 = boardObject.end.x;
          var y2 = boardObject.end.y;
          // length of the main line
          var length = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
          // line parametric functions
          var getLineX = function (t) { return x1 + t * (x2 - x1); };
          var getLineY = function (t) { return y1 + t * (y2 - y1); };
          // triangle base line position on the main line
          var triangleLen = 1 / length / 2.5;
          var tx = getLineX(1 - triangleLen);
          var ty = getLineY(1 - triangleLen);
          // triangle base line parametric functions
          var getBaseLineX = function (t) { return tx + t * (y2 - y1); };
          var getBaseLineY = function (t) { return ty + t * (x1 - x2); };
          // initial circle length
          var circleLen = 0.1;
          // draw initial circle
          startCircle.setAttribute('cx', x1);
          startCircle.setAttribute('cy', y1);
          startCircle.setAttribute('r', circleLen);
          // draw line
          line.setAttribute('x1', getLineX(1 / length * circleLen));
          line.setAttribute('y1', getLineY(1 / length * circleLen));
          line.setAttribute('x2', tx);
          line.setAttribute('y2', ty);
          // draw triangle at the end to make arrow
          endTriangle.setAttribute('points', "\n      " + getBaseLineX(-triangleLen / 1.75) + "," + getBaseLineY(-triangleLen / 1.75) + "\n      " + getBaseLineX(triangleLen / 1.75) + "," + getBaseLineY(triangleLen / 1.75) + "\n      " + x2 + "," + y2 + "\n    ");
      };
      return Arrow;
  }());

  var SVGFieldDrawHandler = /** @class */ (function () {
      function SVGFieldDrawHandler() {
      }
      SVGFieldDrawHandler.prototype.updateElement = function (elem, boardObject, config) {
          var transform = "translate(" + boardObject.x + ", " + boardObject.y + ")";
          var scale = "scale(" + boardObject.scaleX + ", " + boardObject.scaleY + ")";
          var rotate = "rotate(" + boardObject.rotate + ")";
          Object.keys(elem).forEach(function (ctx) {
              elem[ctx].setAttribute('transform', transform + " " + scale + " " + rotate);
              elem[ctx].setAttribute('opacity', boardObject.opacity);
          });
      };
      return SVGFieldDrawHandler;
  }());

  var SVGMarkupDrawHandler = /** @class */ (function (_super) {
      __extends(SVGMarkupDrawHandler, _super);
      function SVGMarkupDrawHandler(params) {
          if (params === void 0) { params = {}; }
          var _this = _super.call(this) || this;
          _this.params = params;
          return _this;
      }
      SVGMarkupDrawHandler.prototype.updateElement = function (elem, boardObject, config) {
          _super.prototype.updateElement.call(this, elem, boardObject, config);
          if (boardObject.variation === exports.Color.B) {
              elem[SVG_OBJECTS].setAttribute('stroke', config.theme.markupBlackColor);
              elem[SVG_OBJECTS].setAttribute('fill', this.params.fillColor || 'rgba(0,0,0,0)');
          }
          else if (boardObject.variation === exports.Color.W) {
              elem[SVG_OBJECTS].setAttribute('stroke', config.theme.markupWhiteColor);
              elem[SVG_OBJECTS].setAttribute('fill', this.params.fillColor || 'rgba(0,0,0,0)');
          }
          else {
              elem[SVG_OBJECTS].setAttribute('stroke', this.params.color || config.theme.markupNoneColor);
              elem[SVG_OBJECTS].setAttribute('fill', this.params.fillColor || 'rgba(0,0,0,0)');
          }
          elem[SVG_OBJECTS].setAttribute('stroke-width', this.params.lineWidth || config.theme.markupLineWidth);
      };
      return SVGMarkupDrawHandler;
  }(SVGFieldDrawHandler));

  var Circle = /** @class */ (function (_super) {
      __extends(Circle, _super);
      function Circle() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Circle.prototype.createElement = function (config) {
          var _a;
          var circle = document.createElementNS(SVG_NS, 'circle');
          circle.setAttribute('cx', '0');
          circle.setAttribute('cy', '0');
          circle.setAttribute('r', '0.25');
          var mask = document.createElementNS(SVG_NS, 'circle');
          mask.setAttribute('cx', '0');
          mask.setAttribute('cy', '0');
          mask.setAttribute('r', '0.35');
          mask.setAttribute('fill', "rgba(0,0,0," + config.theme.markupGridMask + ")");
          return _a = {},
              _a[SVG_OBJECTS] = circle,
              _a[SVG_GRID_MASK] = mask,
              _a;
      };
      return Circle;
  }(SVGMarkupDrawHandler));

  var Dim = /** @class */ (function (_super) {
      __extends(Dim, _super);
      function Dim(params) {
          var _this = _super.call(this) || this;
          _this.params = params;
          return _this;
      }
      Dim.prototype.createElement = function () {
          var rect = document.createElementNS(SVG_NS, 'rect');
          rect.setAttribute('x', '-0.5');
          rect.setAttribute('y', '-0.5');
          rect.setAttribute('width', '1');
          rect.setAttribute('height', '1');
          rect.setAttribute('fill', this.params.color);
          return rect;
      };
      return Dim;
  }(SVGFieldDrawHandler));

  var Dot = /** @class */ (function (_super) {
      __extends(Dot, _super);
      function Dot(params) {
          var _this = _super.call(this) || this;
          _this.params = params;
          return _this;
      }
      Dot.prototype.createElement = function () {
          var circle = document.createElementNS(SVG_NS, 'circle');
          circle.setAttribute('cx', '0');
          circle.setAttribute('cy', '0');
          circle.setAttribute('r', '0.15');
          circle.setAttribute('fill', this.params.color);
          return circle;
      };
      return Dot;
  }(SVGFieldDrawHandler));

  function generateId(prefix) {
      return prefix + "-" + Math.floor(Math.random() * 1000000000).toString(36);
  }

  var SVGStoneDrawHandler = /** @class */ (function (_super) {
      __extends(SVGStoneDrawHandler, _super);
      function SVGStoneDrawHandler() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      SVGStoneDrawHandler.prototype.createElement = function (config, addDef) {
          /*if (!this.shadowFilterElement) {
            this.shadowFilterElement = document.createElementNS(NS, 'filter');
            this.shadowFilterElement.setAttribute('id', generateId('filter'));
            this.shadowFilterElement.innerHTML = `
              <feGaussianBlur in="SourceAlpha" stdDeviation="0.05" />
              <feOffset dx="0.03" dy="0.03" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            `;
      
            addDef(this.shadowFilterElement);
          }*/
          return null;
      };
      SVGStoneDrawHandler.prototype.createShadow = function (config, addDef) {
          var stoneRadius = config.theme.stoneSize;
          if (!this.shadowFilterElement) {
              var shadowFilterElement = document.createElementNS(SVG_NS, 'radialGradient');
              var blur_1 = config.theme.shadowBlur;
              var startRadius = Math.max(stoneRadius - stoneRadius * blur_1, 0.00001);
              var stopRadius = stoneRadius + (1 / 7 * stoneRadius) * blur_1;
              shadowFilterElement.setAttribute('id', generateId('shadowFilter'));
              shadowFilterElement.setAttribute('fr', String(startRadius));
              shadowFilterElement.setAttribute('r', String(stopRadius));
              shadowFilterElement.innerHTML = "\n        <stop offset=\"0%\" stop-color=\"" + config.theme.shadowColor + "\" />\n        <stop offset=\"100%\" stop-color=\"" + config.theme.shadowTransparentColor + "\" />\n      ";
              addDef(shadowFilterElement);
              this.shadowFilterElement = shadowFilterElement;
          }
          var shadow = document.createElementNS(SVG_NS, 'circle');
          shadow.setAttribute('cx', String(config.theme.shadowOffsetX));
          shadow.setAttribute('cy', String(config.theme.shadowOffsetY));
          shadow.setAttribute('r', String(stoneRadius));
          shadow.setAttribute('fill', "url(#" + this.shadowFilterElement.id + ")");
          return shadow;
      };
      return SVGStoneDrawHandler;
  }(SVGFieldDrawHandler));

  var GlassStoneBlack = /** @class */ (function (_super) {
      __extends(GlassStoneBlack, _super);
      function GlassStoneBlack() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      GlassStoneBlack.prototype.createElement = function (config, addDef) {
          var _a;
          _super.prototype.createElement.call(this, config, addDef);
          if (!this.filterElement) {
              var filter = document.createElementNS(SVG_NS, 'filter');
              filter.setAttribute('id', generateId('filter'));
              filter.setAttribute('x', '-300%');
              filter.setAttribute('y', '-300%');
              filter.setAttribute('width', '600%');
              filter.setAttribute('height', '600%');
              var blur_1 = document.createElementNS(SVG_NS, 'feGaussianBlur');
              blur_1.setAttribute('in', 'SourceGraphic');
              blur_1.setAttribute('stdDeviation', 0.3 * config.theme.stoneSize);
              filter.appendChild(blur_1);
              this.filterElement = filter;
              addDef(filter);
          }
          var stoneGroup = document.createElementNS(SVG_NS, 'g');
          var stone = document.createElementNS(SVG_NS, 'circle');
          stone.setAttribute('cx', '0');
          stone.setAttribute('cy', '0');
          stone.setAttribute('fill', '#000');
          stone.setAttribute('r', config.theme.stoneSize);
          stoneGroup.appendChild(stone);
          var glow1 = document.createElementNS(SVG_NS, 'circle');
          glow1.setAttribute('cx', -0.4 * config.theme.stoneSize);
          glow1.setAttribute('cy', -0.4 * config.theme.stoneSize);
          glow1.setAttribute('r', 0.25 * config.theme.stoneSize);
          glow1.setAttribute('fill', '#fff');
          glow1.setAttribute('filter', "url(#" + this.filterElement.id + ")");
          stoneGroup.appendChild(glow1);
          var glow2 = document.createElementNS(SVG_NS, 'circle');
          glow2.setAttribute('cx', 0.4 * config.theme.stoneSize);
          glow2.setAttribute('cy', 0.4 * config.theme.stoneSize);
          glow2.setAttribute('r', 0.15 * config.theme.stoneSize);
          glow2.setAttribute('fill', '#fff');
          glow2.setAttribute('filter', "url(#" + this.filterElement.id + ")");
          stoneGroup.appendChild(glow2);
          return _a = {},
              _a[SVG_OBJECTS] = stoneGroup,
              _a[SVG_SHADOWS] = this.createShadow(config, addDef),
              _a;
      };
      return GlassStoneBlack;
  }(SVGStoneDrawHandler));

  var GlassStoneWhite = /** @class */ (function (_super) {
      __extends(GlassStoneWhite, _super);
      function GlassStoneWhite() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      GlassStoneWhite.prototype.createElement = function (config, addDef) {
          var _a;
          _super.prototype.createElement.call(this, config, addDef);
          if (!this.filterElement1) {
              var filter1 = document.createElementNS(SVG_NS, 'radialGradient');
              filter1.setAttribute('id', generateId('filter'));
              filter1.setAttribute('fx', '30%');
              filter1.setAttribute('fy', '30%');
              filter1.innerHTML = "\n        <stop offset=\"10%\" stop-color=\"rgba(255,255,255,0.9)\" />\n        <stop offset=\"100%\" stop-color=\"rgba(255,255,255,0)\" />\n      ";
              addDef(filter1);
              this.filterElement1 = filter1;
              var filter2 = document.createElementNS(SVG_NS, 'radialGradient');
              filter2.setAttribute('id', generateId('filter'));
              filter2.setAttribute('fx', '70%');
              filter2.setAttribute('fy', '70%');
              filter2.innerHTML = "\n        <stop offset=\"10%\" stop-color=\"rgba(255,255,255,0.7)\" />\n        <stop offset=\"100%\" stop-color=\"rgba(255,255,255,0)\" />\n      ";
              addDef(filter2);
              this.filterElement2 = filter2;
          }
          var stoneGroup = document.createElementNS(SVG_NS, 'g');
          var stone = document.createElementNS(SVG_NS, 'circle');
          stone.setAttribute('cx', '0');
          stone.setAttribute('cy', '0');
          stone.setAttribute('fill', '#ccc');
          stone.setAttribute('r', config.theme.stoneSize);
          stoneGroup.appendChild(stone);
          var glow1 = document.createElementNS(SVG_NS, 'circle');
          glow1.setAttribute('cx', '0');
          glow1.setAttribute('cy', '0');
          glow1.setAttribute('r', config.theme.stoneSize);
          glow1.setAttribute('fill', "url(#" + this.filterElement1.id + ")");
          stoneGroup.appendChild(glow1);
          var glow2 = document.createElementNS(SVG_NS, 'circle');
          glow2.setAttribute('cx', '0');
          glow2.setAttribute('cy', '0');
          glow2.setAttribute('r', config.theme.stoneSize);
          glow2.setAttribute('fill', "url(#" + this.filterElement2.id + ")");
          stoneGroup.appendChild(glow2);
          return _a = {},
              _a[SVG_OBJECTS] = stoneGroup,
              _a[SVG_SHADOWS] = this.createShadow(config, addDef),
              _a;
      };
      return GlassStoneWhite;
  }(SVGStoneDrawHandler));

  var Label = /** @class */ (function (_super) {
      __extends(Label, _super);
      function Label(params) {
          if (params === void 0) { params = {}; }
          var _this = _super.call(this, params) || this;
          if (!params.maxWidth && params.maxWidth !== 0) {
              params.maxWidth = 0.95;
          }
          return _this;
      }
      Label.prototype.createElement = function (config) {
          var _a;
          var text = document.createElementNS(SVG_NS, 'text');
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('dominant-baseline', 'middle');
          text.setAttribute('lengthAdjust', 'spacingAndGlyphs');
          var mask = document.createElementNS(SVG_NS, 'text');
          mask.setAttribute('text-anchor', 'middle');
          mask.setAttribute('dominant-baseline', 'middle');
          mask.setAttribute('stroke-width', '0.2');
          mask.setAttribute('stroke', "rgba(0,0,0," + config.theme.markupGridMask + ")");
          mask.setAttribute('lengthAdjust', 'spacingAndGlyphs');
          return _a = {},
              _a[SVG_OBJECTS] = text,
              _a[SVG_GRID_MASK] = mask,
              _a;
      };
      Label.prototype.updateElement = function (elem, boardObject, config) {
          _super.prototype.updateElement.call(this, elem, boardObject, config);
          var fontSize = 0.5;
          if (boardObject.text.length === 1) {
              fontSize = 0.7;
          }
          else if (boardObject.text.length === 2) {
              fontSize = 0.6;
          }
          if (this.params.color) {
              elem[SVG_OBJECTS].setAttribute('fill', this.params.color);
          }
          else {
              if (boardObject.variation === exports.Color.B) {
                  elem[SVG_OBJECTS].setAttribute('fill', config.theme.markupBlackColor);
              }
              else if (boardObject.variation === exports.Color.W) {
                  elem[SVG_OBJECTS].setAttribute('fill', config.theme.markupWhiteColor);
              }
              else {
                  elem[SVG_OBJECTS].setAttribute('fill', config.theme.markupNoneColor);
              }
          }
          elem[SVG_OBJECTS].removeAttribute('stroke');
          elem[SVG_OBJECTS].setAttribute('font-family', this.params.font || config.theme.font);
          elem[SVG_OBJECTS].setAttribute('stroke-width', '0');
          elem[SVG_OBJECTS].setAttribute('font-size', fontSize);
          elem[SVG_OBJECTS].textContent = boardObject.text;
          elem[SVG_GRID_MASK].setAttribute('font-size', fontSize);
          elem[SVG_GRID_MASK].textContent = boardObject.text;
          if (this.params.maxWidth > 0) {
              if (elem[SVG_OBJECTS].getComputedTextLength() > this.params.maxWidth) {
                  elem[SVG_OBJECTS].setAttribute('textLength', "" + this.params.maxWidth);
                  elem[SVG_GRID_MASK].setAttribute('textLength', "" + this.params.maxWidth);
              }
              else {
                  elem[SVG_OBJECTS].removeAttribute('textLength');
                  elem[SVG_GRID_MASK].removeAttribute('textLength');
              }
          }
      };
      return Label;
  }(SVGMarkupDrawHandler));

  var Line = /** @class */ (function () {
      function Line(params) {
          if (params === void 0) { params = {}; }
          this.params = params;
      }
      Line.prototype.createElement = function () {
          var _a;
          var line = document.createElementNS(SVG_NS, 'line');
          var mask = document.createElementNS(SVG_NS, 'line');
          return _a = {},
              _a[SVG_OBJECTS] = line,
              _a[SVG_GRID_MASK] = mask,
              _a;
      };
      Line.prototype.updateElement = function (elem, boardObject, config) {
          elem[SVG_OBJECTS].setAttribute('stroke', this.params.color || config.theme.markupNoneColor);
          elem[SVG_OBJECTS].setAttribute('stroke-width', this.params.lineWidth || config.theme.markupLineWidth);
          elem[SVG_OBJECTS].setAttribute('x1', boardObject.start.x);
          elem[SVG_OBJECTS].setAttribute('y1', boardObject.start.y);
          elem[SVG_OBJECTS].setAttribute('x2', boardObject.end.x);
          elem[SVG_OBJECTS].setAttribute('y2', boardObject.end.y);
          elem[SVG_GRID_MASK].setAttribute('stroke', "rgba(0,0,0," + config.theme.markupGridMask + ")");
          elem[SVG_GRID_MASK].setAttribute('stroke-width', (this.params.lineWidth || config.theme.markupLineWidth) * 2);
          elem[SVG_GRID_MASK].setAttribute('x1', boardObject.start.x);
          elem[SVG_GRID_MASK].setAttribute('y1', boardObject.start.y);
          elem[SVG_GRID_MASK].setAttribute('x2', boardObject.end.x);
          elem[SVG_GRID_MASK].setAttribute('y2', boardObject.end.y);
      };
      return Line;
  }());

  var GlassStoneWhite$1 = /** @class */ (function (_super) {
      __extends(GlassStoneWhite, _super);
      function GlassStoneWhite() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      GlassStoneWhite.prototype.createElement = function (config, addDef) {
          var _a;
          _super.prototype.createElement.call(this, config, addDef);
          if (!this.filterElement1) {
              var filter1 = document.createElementNS(SVG_NS, 'radialGradient');
              filter1.setAttribute('id', generateId('filter'));
              filter1.setAttribute('cx', '45%');
              filter1.setAttribute('cy', '45%');
              filter1.setAttribute('fx', '20%');
              filter1.setAttribute('fy', '20%');
              filter1.setAttribute('r', '60%');
              filter1.innerHTML = "\n        <stop offset=\"0%\" stop-color=\"rgba(48,48,48,1)\" />\n        <stop offset=\"80%\" stop-color=\"rgba(16,16,16,1)\" />\n        <stop offset=\"100%\" stop-color=\"rgba(0,0,0,1)\" />\n      ";
              addDef(filter1);
              this.filterElement1 = filter1;
          }
          var stoneGroup = document.createElementNS(SVG_NS, 'g');
          var stone = document.createElementNS(SVG_NS, 'circle');
          stone.setAttribute('cx', '0');
          stone.setAttribute('cy', '0');
          stone.setAttribute('fill', "url(#" + this.filterElement1.id + ")");
          stone.setAttribute('r', config.theme.stoneSize);
          stoneGroup.appendChild(stone);
          return _a = {},
              _a[SVG_OBJECTS] = stoneGroup,
              _a[SVG_SHADOWS] = this.createShadow(config, addDef),
              _a;
      };
      return GlassStoneWhite;
  }(SVGStoneDrawHandler));

  var GlassStoneWhite$2 = /** @class */ (function (_super) {
      __extends(GlassStoneWhite, _super);
      function GlassStoneWhite() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      GlassStoneWhite.prototype.createElement = function (config, addDef) {
          var _a;
          _super.prototype.createElement.call(this, config, addDef);
          if (!this.filterElement1) {
              var filter1 = document.createElementNS(SVG_NS, 'radialGradient');
              filter1.setAttribute('id', generateId('filter'));
              filter1.setAttribute('cx', '45%');
              filter1.setAttribute('cy', '45%');
              filter1.setAttribute('fx', '20%');
              filter1.setAttribute('fy', '20%');
              filter1.setAttribute('r', '60%');
              filter1.innerHTML = "\n        <stop offset=\"0%\" stop-color=\"rgba(255,255,255,1)\" />\n        <stop offset=\"80%\" stop-color=\"rgba(215,215,215,1)\" />\n        <stop offset=\"100%\" stop-color=\"rgba(170,170,170,1)\" />\n      ";
              addDef(filter1);
              this.filterElement1 = filter1;
          }
          var stoneGroup = document.createElementNS(SVG_NS, 'g');
          var stone = document.createElementNS(SVG_NS, 'circle');
          stone.setAttribute('cx', '0');
          stone.setAttribute('cy', '0');
          stone.setAttribute('fill', "url(#" + this.filterElement1.id + ")");
          stone.setAttribute('r', config.theme.stoneSize);
          stoneGroup.appendChild(stone);
          return _a = {},
              _a[SVG_OBJECTS] = stoneGroup,
              _a[SVG_SHADOWS] = this.createShadow(config, addDef),
              _a;
      };
      return GlassStoneWhite;
  }(SVGStoneDrawHandler));

  var RealisticStone = /** @class */ (function (_super) {
      __extends(RealisticStone, _super);
      function RealisticStone(paths, fallback) {
          var _this = _super.call(this) || this;
          _this.fallback = fallback;
          _this.randSeed = Math.ceil(Math.random() * 9999999);
          _this.paths = paths;
          _this.loadedPaths = {};
          return _this;
      }
      RealisticStone.prototype.createElement = function (config, addDef) {
          var _this = this;
          _super.prototype.createElement.call(this, config, addDef);
          var id = Math.floor(Math.random() * this.paths.length);
          var group = document.createElementNS(SVG_NS, 'g');
          var fallbackElement;
          if (!this.loadedPaths[id]) {
              fallbackElement = this.fallback.createElement(config, addDef);
              if (!(fallbackElement instanceof SVGElement)) {
                  fallbackElement = fallbackElement[SVG_OBJECTS];
              }
              group.appendChild(fallbackElement);
          }
          var image = document.createElementNS(SVG_NS, 'image');
          image.setAttribute('href', this.paths[id]);
          image.setAttribute('width', config.theme.stoneSize * 2);
          image.setAttribute('height', config.theme.stoneSize * 2);
          image.setAttribute('x', -config.theme.stoneSize);
          image.setAttribute('y', -config.theme.stoneSize);
          if (!this.loadedPaths[id]) {
              image.setAttribute('opacity', '0');
          }
          image.addEventListener('load', function () {
              if (fallbackElement) {
                  image.setAttribute('opacity', '1');
                  group.removeChild(fallbackElement);
                  _this.loadedPaths[id] = true;
              }
          });
          group.appendChild(image);
          return group;
      };
      return RealisticStone;
  }(SVGStoneDrawHandler));

  var SimpleStone = /** @class */ (function (_super) {
      __extends(SimpleStone, _super);
      function SimpleStone(color) {
          var _this = _super.call(this) || this;
          _this.color = color;
          return _this;
      }
      SimpleStone.prototype.createElement = function (config) {
          var stone = document.createElementNS(SVG_NS, 'circle');
          stone.setAttribute('cx', '0');
          stone.setAttribute('cy', '0');
          stone.setAttribute('r', config.theme.stoneSize);
          stone.setAttribute('fill', this.color);
          return stone;
      };
      return SimpleStone;
  }(SVGFieldDrawHandler));

  var Square = /** @class */ (function (_super) {
      __extends(Square, _super);
      function Square() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Square.prototype.createElement = function (config) {
          var _a;
          var square = document.createElementNS(SVG_NS, 'rect');
          square.setAttribute('x', '-0.25');
          square.setAttribute('y', '-0.25');
          square.setAttribute('width', '0.50');
          square.setAttribute('height', '0.50');
          var mask = document.createElementNS(SVG_NS, 'rect');
          mask.setAttribute('x', '-0.35');
          mask.setAttribute('y', '-0.35');
          mask.setAttribute('width', '0.70');
          mask.setAttribute('height', '0.70');
          mask.setAttribute('fill', "rgba(0,0,0," + config.theme.markupGridMask + ")");
          return _a = {},
              _a[SVG_OBJECTS] = square,
              _a[SVG_GRID_MASK] = mask,
              _a;
      };
      return Square;
  }(SVGMarkupDrawHandler));

  var Triangle = /** @class */ (function (_super) {
      __extends(Triangle, _super);
      function Triangle() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      Triangle.prototype.createElement = function (config) {
          var _a;
          var triangle = document.createElementNS(SVG_NS, 'polygon');
          triangle.setAttribute('points', '0,-0.25 -0.25,0.166666 0.25,0.166666');
          var mask = document.createElementNS(SVG_NS, 'polygon');
          mask.setAttribute('points', '0,-0.35 -0.35,0.2333333 0.35,0.2333333');
          mask.setAttribute('fill', "rgba(0,0,0," + config.theme.markupGridMask + ")");
          return _a = {},
              _a[SVG_OBJECTS] = triangle,
              _a[SVG_GRID_MASK] = mask,
              _a;
      };
      return Triangle;
  }(SVGMarkupDrawHandler));

  var XMark = /** @class */ (function (_super) {
      __extends(XMark, _super);
      function XMark() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      XMark.prototype.createElement = function (config) {
          var _a;
          var path = document.createElementNS(SVG_NS, 'path');
          path.setAttribute('d', 'M -0.20,-0.20 L 0.20,0.20 M 0.20,-0.20 L -0.20,0.20');
          var mask = document.createElementNS(SVG_NS, 'circle');
          mask.setAttribute('cx', '0');
          mask.setAttribute('cy', '0');
          mask.setAttribute('r', '0.15');
          mask.setAttribute('fill', "rgba(0,0,0," + config.theme.markupGridMask + ")");
          return _a = {},
              _a[SVG_OBJECTS] = path,
              _a[SVG_GRID_MASK] = mask,
              _a;
      };
      return XMark;
  }(SVGMarkupDrawHandler));

  var index = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Arrow: Arrow,
    Circle: Circle,
    Dim: Dim,
    Dot: Dot,
    GlassStoneBlack: GlassStoneBlack,
    GlassStoneWhite: GlassStoneWhite,
    Label: Label,
    Line: Line,
    ModernStoneBlack: GlassStoneWhite$1,
    ModernStoneWhite: GlassStoneWhite$2,
    RealisticStone: RealisticStone,
    SimpleStone: SimpleStone,
    Square: Square,
    Triangle: Triangle,
    XMark: XMark
  });

  function line(fromX, fromY, toX, toY) {
      var line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', fromX);
      line.setAttribute('y1', fromY);
      line.setAttribute('x2', toX);
      line.setAttribute('y2', toY);
      return line;
  }
  function star(x, y, starSize) {
      var star = document.createElementNS(SVG_NS, 'circle');
      star.setAttribute('cx', x);
      star.setAttribute('cy', y);
      star.setAttribute('r', starSize);
      star.setAttribute('fill', '#553310');
      star.setAttribute('stroke-width', '0');
      return star;
  }
  function createGrid$1(config) {
      var linesWidth = config.theme.grid.linesWidth;
      var grid = document.createElementNS(SVG_NS, 'g');
      grid.setAttribute('stroke', config.theme.grid.linesColor);
      grid.setAttribute('stroke-width', linesWidth.toString());
      grid.setAttribute('fill', config.theme.grid.starColor);
      for (var i = 0; i < config.size; i++) {
          grid.appendChild(line(i, 0 - linesWidth / 2, i, config.size - 1 + linesWidth / 2));
          grid.appendChild(line(0 - linesWidth / 2, i, config.size - 1 + linesWidth / 2, i));
      }
      var starPoints = config.theme.starPoints[config.size];
      if (starPoints) {
          starPoints.forEach(function (starPoint) {
              grid.appendChild(star(starPoint.x, starPoint.y, config.theme.grid.starSize));
          });
      }
      return grid;
  }

  function letter(x, y, str) {
      var text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', x);
      text.setAttribute('y', y);
      text.textContent = str;
      return text;
  }
  function createCoordinates(config) {
      var coordinates = document.createElementNS(SVG_NS, 'g');
      coordinates.style.userSelect = 'none';
      var size = config.size;
      var _a = config.theme.coordinates, fontSize = _a.fontSize, color = _a.color, labelsX = _a.labelsX, labelsY = _a.labelsY, top = _a.top, bottom = _a.bottom, right = _a.right, left = _a.left;
      coordinates.setAttribute('font-family', config.theme.font);
      coordinates.setAttribute('font-size', fontSize);
      coordinates.setAttribute('text-anchor', 'middle');
      coordinates.setAttribute('dominant-baseline', 'middle');
      if (config.theme.coordinates.bold) {
          coordinates.setAttribute('font-weight', 'bold');
      }
      coordinates.setAttribute('fill', color);
      for (var i = 0; i < size; i++) {
          if (top) {
              coordinates.appendChild(letter(i, -0.75, labelsX[i]));
          }
          if (bottom) {
              coordinates.appendChild(letter(i, size - 0.25, labelsX[i]));
          }
          if (left) {
              coordinates.appendChild(letter(-0.75, size - i - 1, labelsY[i]));
          }
          if (right) {
              coordinates.appendChild(letter(size - 0.25, size - i - 1, labelsY[i]));
          }
      }
      return coordinates;
  }

  var defaultSVGTheme = __assign(__assign({}, defaultBoardBaseTheme), { 
      // backgroundImage: 'images/wood1.jpg',
      markupGridMask: 0.8, stoneSize: 0.48, coordinates: __assign(__assign({}, defaultBoardBaseTheme.coordinates), { fontSize: 0.5, top: true, right: true, bottom: true, left: true }), grid: __assign(__assign({}, defaultBoardBaseTheme.grid), { linesWidth: 0.03, starSize: 0.09 }), drawHandlers: {
          CR: new Circle(),
          SQ: new Square(),
          LB: new Label(),
          TR: new Triangle(),
          MA: new XMark({ lineWidth: 0.075 }),
          SL: new Dot({ color: 'rgba(32, 32, 192, 0.75)' }),
          LN: new Line(),
          AR: new Arrow(),
          DD: new Dim({ color: 'rgba(0, 0, 0, 0.5)' }),
          // B: new drawHandlers.GlassStoneBlack(),
          // W: new drawHandlers.GlassStoneWhite(),
          W: new GlassStoneWhite$2(),
          B: new GlassStoneWhite$1(),
      } });

  var svgBoardDefaultConfig = __assign(__assign({}, defaultBoardBaseConfig), { theme: defaultSVGTheme });
  var SVGBoard = /** @class */ (function (_super) {
      __extends(SVGBoard, _super);
      function SVGBoard(elem, config) {
          if (config === void 0) { config = {}; }
          var _this = _super.call(this, elem, makeConfig(svgBoardDefaultConfig, config)) || this;
          _this.objects = [];
          /** Drawing contexts - elements to put additional board objects. Similar to layers. */
          _this.contexts = {};
          _this.boardElement = document.createElement('div');
          _this.boardElement.style.display = 'inline-block';
          _this.boardElement.style.position = 'relative';
          _this.boardElement.style.verticalAlign = 'middle';
          _this.boardElement.style.userSelect = 'none';
          _this.element.appendChild(_this.boardElement);
          _this.touchArea = document.createElement('div');
          _this.touchArea.style.position = 'absolute';
          _this.touchArea.style.top = '0';
          _this.touchArea.style.left = '0';
          _this.touchArea.style.bottom = '0';
          _this.touchArea.style.right = '0';
          _this.touchArea.style.zIndex = '1';
          _this.touchArea.style.borderTop = '#F0E7A7 solid 1px';
          _this.touchArea.style.borderRight = '#D1A974 solid 1px';
          _this.touchArea.style.borderLeft = '#CCB467 solid 1px';
          _this.touchArea.style.borderBottom = '#665926 solid 1px';
          _this.boardElement.appendChild(_this.touchArea);
          _this.svgElement = document.createElementNS(SVG_NS, 'svg');
          _this.svgElement.style.display = 'block';
          _this.boardElement.appendChild(_this.svgElement);
          _this.defsElement = document.createElementNS(SVG_NS, 'defs');
          _this.svgElement.appendChild(_this.defsElement);
          _this.setViewport();
          _this.resize();
          _this.redraw();
          return _this;
      }
      SVGBoard.prototype.resize = function () {
          if (this.config.width && this.config.height) {
              this.boardElement.style.width = '';
              this.svgElement.style.width = this.config.width + "px";
              this.svgElement.style.height = this.config.height + "px";
          }
          else if (this.config.width) {
              this.boardElement.style.width = '';
              this.svgElement.style.width = this.config.width + "px";
              this.svgElement.style.height = 'auto';
          }
          else if (this.config.height) {
              this.boardElement.style.width = '';
              this.svgElement.style.width = 'auto';
              this.svgElement.style.height = this.config.height + "px";
          }
          else {
              this.boardElement.style.width = '100%';
              this.svgElement.style.width = '100%';
              this.svgElement.style.height = 'auto';
          }
      };
      SVGBoard.prototype.redraw = function () {
          this.svgElement.style.backgroundColor = this.config.theme.backgroundColor;
          if (this.config.theme.backgroundImage) {
              this.svgElement.style.backgroundImage = "url('" + this.config.theme.backgroundImage + "')";
          }
          else {
              this.svgElement.style.backgroundImage = '';
          }
          this.drawGrid();
          this.drawCoordinates();
          this.drawObjects();
      };
      SVGBoard.prototype.drawGrid = function () {
          if (this.contexts[SVG_GRID_MASK]) {
              this.svgElement.removeChild(this.contexts[SVG_GRID_MASK]);
          }
          if (this.contexts.gridElement) {
              this.svgElement.removeChild(this.contexts.gridElement);
          }
          // create grid mask
          var size = this.config.size;
          this.contexts[SVG_GRID_MASK] = document.createElementNS(SVG_NS, 'mask');
          this.contexts[SVG_GRID_MASK].id = generateId('mask');
          this.contexts[SVG_GRID_MASK].innerHTML = "<rect x=\"-0.5\" y=\"-0.5\" width=\"" + size + "\" height=\"" + size + "\" fill=\"white\" />";
          this.svgElement.appendChild(this.contexts[SVG_GRID_MASK]);
          // create grid
          this.contexts.gridElement = createGrid$1(this.config);
          this.contexts.gridElement.setAttribute('mask', "url(#" + this.contexts[SVG_GRID_MASK].id + ")");
          this.svgElement.appendChild(this.contexts.gridElement);
      };
      SVGBoard.prototype.drawCoordinates = function () {
          if (this.contexts.coordinatesElement) {
              this.svgElement.removeChild(this.contexts.coordinatesElement);
          }
          this.contexts.coordinatesElement = createCoordinates(this.config);
          this.contexts.coordinatesElement.style.opacity = this.config.coordinates ? '' : '0';
          this.svgElement.appendChild(this.contexts.coordinatesElement);
      };
      SVGBoard.prototype.drawObjects = function () {
          var _this = this;
          // remove old shadows layer
          if (this.contexts[SVG_SHADOWS]) {
              this.svgElement.removeChild(this.contexts[SVG_SHADOWS]);
          }
          // remove old objects layer
          if (this.contexts[SVG_OBJECTS]) {
              this.svgElement.removeChild(this.contexts[SVG_OBJECTS]);
          }
          // append new shadows layer
          this.contexts[SVG_SHADOWS] = document.createElementNS(SVG_NS, 'g');
          this.svgElement.appendChild(this.contexts[SVG_SHADOWS]);
          // append new object layer
          this.contexts[SVG_OBJECTS] = document.createElementNS(SVG_NS, 'g');
          this.svgElement.appendChild(this.contexts[SVG_OBJECTS]);
          // prepare map for objects and add all objects
          this.objectsElementMap = new Map();
          this.objects.forEach(function (boardObject) { return _this.createObjectElements(boardObject); });
      };
      SVGBoard.prototype.addObject = function (boardObject) {
          _super.prototype.addObject.call(this, boardObject);
          if (!Array.isArray(boardObject)) {
              if (this.objectsElementMap.get(boardObject)) {
                  // already added - just redraw it
                  this.updateObject(boardObject);
                  return;
              }
              this.createObjectElements(boardObject);
          }
      };
      SVGBoard.prototype.createObjectElements = function (boardObject) {
          var _a;
          var _this = this;
          var handler = this.getObjectHandler(boardObject);
          // create element or elements and add them to the svg
          var elem = handler.createElement(this.config, function (def) { return _this.defsElement.appendChild(def); });
          var elements;
          if (elem instanceof SVGElement) {
              elements = (_a = {}, _a[SVG_OBJECTS] = elem, _a);
          }
          else {
              elements = elem;
          }
          this.objectsElementMap.set(boardObject, elements);
          Object.keys(elements).forEach(function (key) { return _this.contexts[key].appendChild(elements[key]); });
          handler.updateElement(elements, boardObject, this.config);
      };
      SVGBoard.prototype.getObjectHandler = function (boardObject) {
          return 'handler' in boardObject ? boardObject.handler : this.config.theme.drawHandlers[boardObject.type];
      };
      SVGBoard.prototype.removeObject = function (boardObject) {
          var _this = this;
          _super.prototype.removeObject.call(this, boardObject);
          if (!Array.isArray(boardObject)) {
              var elements_1 = this.objectsElementMap.get(boardObject);
              if (elements_1) {
                  this.objectsElementMap.delete(boardObject);
                  Object.keys(elements_1).forEach(function (key) { return _this.contexts[key].removeChild(elements_1[key]); });
              }
          }
      };
      SVGBoard.prototype.updateObject = function (boardObject) {
          // handling multiple objects
          if (Array.isArray(boardObject)) {
              for (var i = 0; i < boardObject.length; i++) {
                  this.updateObject(boardObject[i]);
              }
              return;
          }
          var elements = this.objectsElementMap.get(boardObject);
          if (!elements) {
              // updated object isn't on board - ignore, add or warning?
              return;
          }
          var handler = this.getObjectHandler(boardObject);
          handler.updateElement(elements, boardObject, this.config);
      };
      SVGBoard.prototype.setViewport = function (viewport) {
          if (viewport === void 0) { viewport = this.config.viewport; }
          _super.prototype.setViewport.call(this, viewport);
          var _a = this.config, coordinates = _a.coordinates, theme = _a.theme, size = _a.size;
          var marginSize = theme.marginSize, _b = theme.coordinates, fontSize = _b.fontSize, coordinatesTop = _b.top, coordinatesLeft = _b.left, coordinatesBottom = _b.bottom, coordinatesRight = _b.right;
          this.top = viewport.top - 0.5 - (coordinates && coordinatesTop && !viewport.top ? fontSize : 0) - marginSize;
          this.left = viewport.left - 0.5 - (coordinates && coordinatesLeft && !viewport.left ? fontSize : 0) - marginSize;
          // tslint:disable-next-line:max-line-length
          this.bottom = size - 0.5 - this.top - viewport.bottom + (coordinates && coordinatesBottom && !viewport.bottom ? fontSize : 0) + marginSize;
          // tslint:disable-next-line:max-line-length
          this.right = size - 0.5 - this.left - viewport.right + (coordinates && coordinatesRight && !viewport.right ? fontSize : 0) + marginSize;
          this.svgElement.setAttribute('viewBox', this.left + " " + this.top + " " + this.right + " " + this.bottom);
      };
      SVGBoard.prototype.setSize = function (size) {
          if (size === void 0) { size = 19; }
          _super.prototype.setSize.call(this, size);
          this.drawGrid();
          this.drawCoordinates();
          this.setViewport();
      };
      SVGBoard.prototype.setCoordinates = function (coordinates) {
          _super.prototype.setCoordinates.call(this, coordinates);
          this.contexts.coordinatesElement.style.opacity = this.config.coordinates ? '' : '0';
          this.setViewport();
      };
      SVGBoard.prototype.on = function (type, callback) {
          _super.prototype.on.call(this, type, callback);
          this.registerBoardListener(type);
      };
      SVGBoard.prototype.registerBoardListener = function (type) {
          var _this = this;
          this.touchArea.addEventListener(type, function (evt) {
              if (evt.layerX != null) {
                  var pos = _this.getRelativeCoordinates(evt.layerX, evt.layerY);
                  _this.emit(type, evt, pos);
              }
              else {
                  _this.emit(type, evt);
              }
          });
      };
      SVGBoard.prototype.getRelativeCoordinates = function (absoluteX, absoluteY) {
          // new hopefully better translation of coordinates
          var fieldWidth = this.touchArea.offsetWidth / (this.right);
          var fieldHeight = this.touchArea.offsetHeight / (this.bottom);
          var x = Math.round((absoluteX / fieldWidth + this.left));
          var y = Math.round((absoluteY / fieldHeight + this.top));
          if (x < 0 || x >= this.config.size || y < 0 || y >= this.config.size) {
              return null;
          }
          return { x: x, y: y };
      };
      return SVGBoard;
  }(BoardBase));

  var PropIdent;
  (function (PropIdent) {
      // Move Properties
      PropIdent["BLACK_MOVE"] = "B";
      PropIdent["EXECUTE_ILLEGAL"] = "KO";
      PropIdent["MOVE_NUMBER"] = "MN";
      PropIdent["WHITE_MOVE"] = "W";
      // Setup Properties
      PropIdent["ADD_BLACK"] = "AB";
      PropIdent["CLEAR_FIELD"] = "AE";
      PropIdent["ADD_WHITE"] = "AW";
      PropIdent["SET_TURN"] = "PL";
      // Node Annotation Properties
      PropIdent["COMMENT"] = "C";
      PropIdent["EVEN_POSITION"] = "DM";
      PropIdent["GOOD_FOR_BLACK"] = "GB";
      PropIdent["GOOD_FOR_WHITE"] = "GW";
      PropIdent["HOTSPOT"] = "HO";
      PropIdent["NODE_NAME"] = "N";
      PropIdent["UNCLEAR_POSITION"] = "UC";
      PropIdent["NODE_VALUE"] = "V";
      // Move Annotation Properties
      PropIdent["BAD_MOVE"] = "BM";
      PropIdent["DOUBTFUL_MOVE"] = "DM";
      PropIdent["INTERESTING_MOVE"] = "IT";
      PropIdent["GOOD_MOVE"] = "TE";
      // Markup Properties
      PropIdent["ARROW"] = "AR";
      PropIdent["CIRCLE"] = "CR";
      PropIdent["DIM"] = "DD";
      PropIdent["LABEL"] = "LB";
      PropIdent["LINE"] = "LN";
      PropIdent["X_MARK"] = "MA";
      PropIdent["SELECTED"] = "SL";
      PropIdent["SQUARE"] = "SQ";
      PropIdent["TRIANGLE"] = "TR";
      // Root Properties
      PropIdent["APPLICATION"] = "AP";
      PropIdent["CHARSET"] = "CA";
      PropIdent["SGF_VERSION"] = "FF";
      PropIdent["GAME_TYPE"] = "GM";
      PropIdent["VARIATIONS_STYLE"] = "ST";
      PropIdent["BOARD_SIZE"] = "SZ";
      // Game Info Properties
      PropIdent["ANNOTATOR"] = "AN";
      PropIdent["BLACK_RANK"] = "BR";
      PropIdent["BLACK_TEAM"] = "BT";
      PropIdent["COPYRIGHT"] = "CP";
      PropIdent["DATE"] = "DT";
      PropIdent["EVENT"] = "EV";
      PropIdent["GAME_NAME"] = "GN";
      PropIdent["GAME_COMMENT"] = "GC";
      PropIdent["OPENING_INFO"] = "ON";
      PropIdent["OVER_TIME"] = "OT";
      PropIdent["BLACK_NAME"] = "BN";
      PropIdent["PLACE"] = "PC";
      PropIdent["WHITE_NAME"] = "PW";
      PropIdent["RESULT"] = "RE";
      PropIdent["ROUND"] = "RO";
      PropIdent["RULES"] = "RU";
      PropIdent["SOURCE"] = "SO";
      PropIdent["TIME_LIMITS"] = "TM";
      PropIdent["AUTHOR"] = "US";
      PropIdent["WHITE_RANK"] = "WR";
      PropIdent["WHITE_TEAM"] = "WT";
      // Timing Properties
      PropIdent["BLACK_TIME_LEFT"] = "BL";
      PropIdent["BLACK_STONES_LEFT"] = "OB";
      PropIdent["WHITE_STONES_LEFT"] = "OW";
      PropIdent["WHITE_TIME_LEFT"] = "WL";
      // Miscellaneous Properties
      PropIdent["FIGURE"] = "FG";
      PropIdent["PRINT_MOVE_NUMBERS"] = "PM";
      PropIdent["BOARD_SECTION"] = "VW";
      PropIdent["HANDICAP"] = "HA";
      // GO specific Properties
      PropIdent["KOMI"] = "KM";
      PropIdent["BLACK_TERRITORY"] = "TB";
      PropIdent["WHITE_TERRITORY"] = "TW";
  })(PropIdent || (PropIdent = {}));

  function beforeInitSZ(event) {
      event.target.params.size = event.value;
  }
  function beforeInitRU(event) {
      if (goRules[event.value]) {
          event.target.params.rules = goRules[event.value];
      }
  }
  function applyGameChangesHA(event) {
      if (event.value > 1 &&
          event.target.currentNode === event.target.rootNode &&
          !event.target.getProperty(PropIdent.SET_TURN)) {
          event.target.game.position.turn = exports.Color.WHITE;
      }
  }
  function applyGameChangesMove(event) {
      var color = event.propIdent === 'B' ? exports.Color.B : exports.Color.W;
      // if this is false, move is pass
      if (event.value) {
          event.target.game.position.applyMove(event.value.x, event.value.y, color, true, true);
      }
      event.target.game.position.turn = -color;
  }
  function applyGameChangesPL(event) {
      event.target.game.turn = event.value;
  }
  function applyGameChangesSetup(event) {
      var color;
      switch (event.propIdent) {
          case 'AB':
              color = exports.Color.B;
              break;
          case 'AW':
              color = exports.Color.W;
              break;
          case 'AE':
              color = exports.Color.E;
              break;
      }
      event.value.forEach(function (value) {
          // add stone
          event.target.game.setStone(value.x, value.y, color);
      });
  }

  var PlayerBase = /** @class */ (function (_super) {
      __extends(PlayerBase, _super);
      function PlayerBase() {
          var _this = _super.call(this) || this;
          _this.loadKifu(new KifuNode());
          _this.plugins = [];
          _this.on('beforeInit.SZ', beforeInitSZ);
          _this.on('beforeInit.RU', beforeInitRU);
          _this.on('applyGameChanges.HA', applyGameChangesHA);
          _this.on('applyGameChanges.B', applyGameChangesMove);
          _this.on('applyGameChanges.W', applyGameChangesMove);
          _this.on('applyGameChanges.PL', applyGameChangesPL);
          _this.on('applyGameChanges.AB', applyGameChangesSetup);
          _this.on('applyGameChanges.AW', applyGameChangesSetup);
          _this.on('applyGameChanges.AE', applyGameChangesSetup);
          return _this;
      }
      /**
       * Load game (kifu) from KifuNode.
       */
      PlayerBase.prototype.loadKifu = function (rootNode) {
          this.rootNode = rootNode;
          this.currentNode = rootNode;
          this.emit('loadKifu', {
              name: 'loadKifu',
              kifuNode: rootNode,
              target: this,
          });
          this.executeRoot();
      };
      /**
       * Create new game (kifu) and init player with it.
       */
      PlayerBase.prototype.newGame = function (size, rules) {
          var rootNode = new KifuNode();
          if (size) {
              rootNode.setProperty('SZ', size);
          }
          if (rules) {
              // TODO: handle rules more correctly
              var rulesName = Object.keys(goRules).find(function (name) { return goRules[name] === rules; });
              if (rulesName) {
                  rootNode.setProperty('RU', rulesName);
              }
          }
          this.loadKifu(rootNode);
      };
      /**
       * Executes root properties during initialization. If some properties change, call this to re-init player.
       */
      PlayerBase.prototype.executeRoot = function () {
          this.params = {
              size: 19,
              rules: JAPANESE_RULES,
          };
          this.emitNodeLifeCycleEvent('beforeInit');
          this.game = new Game(this.params.size, this.params.rules);
          this.executeNode();
      };
      PlayerBase.prototype.executeNode = function () {
          this.emitNodeLifeCycleEvent('applyGameChanges');
          this.emitNodeLifeCycleEvent('applyNodeChanges');
      };
      /**
       * Change current node to specified next node and executes its properties.
       */
      PlayerBase.prototype.executeNext = function (i) {
          this.emitNodeLifeCycleEvent('clearNodeChanges');
          this.game.pushPosition(this.game.position.clone());
          this.currentNode = this.currentNode.children[i];
          this.executeNode();
      };
      /**
       * Change current node to previous/parent next node and executes its properties.
       */
      PlayerBase.prototype.executePrevious = function () {
          this.emitNodeLifeCycleEvent('clearNodeChanges');
          this.emitNodeLifeCycleEvent('clearGameChanges');
          this.game.popPosition();
          this.currentNode = this.currentNode.parent;
          this.emitNodeLifeCycleEvent('applyNodeChanges');
      };
      /**
       * Emits node life cycle method (for every property)
       */
      PlayerBase.prototype.emitNodeLifeCycleEvent = function (name) {
          var _this = this;
          this.emit(name, {
              name: name,
              target: this,
          });
          this.currentNode.forEachProperty(function (propIdent, value) {
              _this.emit(name + "." + propIdent, {
                  name: name,
                  target: _this,
                  propIdent: propIdent,
                  value: value,
              });
          });
      };
      PlayerBase.prototype.getPropertyHandler = function (propIdent) {
          return this.constructor.propertyHandlers[propIdent];
      };
      /**
       * Gets property of current node.
       */
      PlayerBase.prototype.getProperty = function (propIdent) {
          return this.currentNode.getProperty(propIdent);
      };
      /**
       * Sets property of current node and execute changes.
       */
      PlayerBase.prototype.setProperty = function (propIdent, value) {
          this.emitNodeLifeCycleEvent('clearNodeChanges');
          this.emitNodeLifeCycleEvent('clearGameChanges');
          this.currentNode.setProperty(propIdent, value);
          this.executeNode();
      };
      /**
       * Gets property of root node.
       */
      PlayerBase.prototype.getRootProperty = function (propIdent) {
          return this.rootNode.getProperty(propIdent);
      };
      /**
       * Returns array of next nodes (children).
       */
      PlayerBase.prototype.getNextNodes = function () {
          return this.currentNode.children;
      };
      /**
       * Go to (specified) next node and execute it.
       */
      PlayerBase.prototype.next = function (node) {
          if (node === void 0) { node = 0; }
          if (this.currentNode.children.length) {
              var i = void 0;
              if (typeof node === 'number') {
                  i = node;
              }
              else {
                  i = this.currentNode.children.indexOf(node);
              }
              if (this.currentNode.children[i]) {
                  this.executeNext(i);
                  return true;
              }
          }
          return false;
      };
      /**
       * Go to the previous node.
       */
      PlayerBase.prototype.previous = function () {
          if (this.currentNode.parent) {
              this.executePrevious();
              return true;
          }
          return false;
      };
      /**
       * Go to the first position - root node.
       */
      PlayerBase.prototype.first = function () {
          // not sure if effective - TODO: check if there is a better way to do this
          while (this.previous()) { }
      };
      /**
       * Go to the last position.
       */
      PlayerBase.prototype.last = function () {
          while (this.next()) { }
      };
      /**
       * Go to a node specified by path or move number.
       */
      PlayerBase.prototype.goTo = function (pathOrMoveNumber) {
          // TODO: check if there is a better way to do this
          var path = typeof pathOrMoveNumber === 'number' ? { depth: pathOrMoveNumber, forks: [] } : pathOrMoveNumber;
          this.first();
          for (var i = 0, j = 0; i < path.depth; i++) {
              if (this.currentNode.children.length > 1) {
                  this.next(path.forks[j++]);
              }
              else {
                  this.next();
              }
          }
      };
      /**
       * Get path to current node
       */
      PlayerBase.prototype.getCurrentPath = function () {
          var path = { depth: 0, forks: [] };
          if (this.currentNode) {
              var node = this.currentNode;
              while (node.parent) {
                  path.depth++;
                  if (node.parent.children.length > 1) {
                      path.forks.push(node.parent.children.indexOf(node));
                  }
                  node = node.parent;
              }
          }
          return path;
      };
      /**
         * Go to previous fork (a node with more than one child).
         */
      PlayerBase.prototype.previousFork = function () {
          while (this.previous()) {
              if (this.currentNode.children.length > 1) {
                  return;
              }
          }
      };
      /**
       * Play a move. New kifu node will be created and move to it
       */
      PlayerBase.prototype.play = function (x, y) {
          var node = new KifuNode();
          if (this.game.turn === exports.Color.W) {
              node.setProperty(PropIdent.WHITE_MOVE, { x: x, y: y });
          }
          else {
              node.setProperty(PropIdent.BLACK_MOVE, { x: x, y: y });
          }
          var i = this.currentNode.appendChild(node);
          this.next(i);
      };
      /**
       * Register player's plugin.
       *
       * @param plugin
       */
      PlayerBase.prototype.use = function (plugin) {
          if (!plugin || typeof plugin.apply !== 'function') {
              throw new TypeError('Plugin must implement an `apply` method.');
          }
          plugin.apply(this);
          this.plugins.push(plugin);
      };
      return PlayerBase;
  }(EventEmitter));

  var defaultEditModeConfig = {
      enabled: false,
      showVariations: true,
  };
  /**
   * Edit mode plugin. It allows to edit game kifu without changing it - when edit mode is disabled
   * all changes are reverted. It provides event `editMode.change` to enable/disable edit mode.
   * It contains integration with board via these events:
   * - board.updateTemporaryObject
   * - board.addTemporaryObject
   * - board.removeTemporaryObject
   * - board.mouseMove
   * - board.mouseOut
   * - board.click
   */
  var EditMode = /** @class */ (function () {
      function EditMode(config) {
          var _this = this;
          if (config === void 0) { config = {}; }
          this.gameStateStack = [];
          this.handleChange = function (value) {
              if (value && !_this.config.enabled) {
                  _this.enable();
              }
              else if (!value && _this.config.enabled) {
                  _this.disable();
              }
          };
          this.config = makeConfig(defaultEditModeConfig, config);
      }
      EditMode.prototype.apply = function (player) {
          if (this.player) {
              throw new Error('This plugin instance has already been applied to a player object.');
          }
          this.player = player;
          this.player.on('editMode.change', this.handleChange);
          if (this.config.enabled) {
              this.enable();
          }
      };
      /*public destroy() {
        this.player.off('editMode.change', this.handleChange);
      }*/
      /**
       * Enable/disable edit mode. Event `editMode.change` is triggered.
       *
       * @param value
       */
      EditMode.prototype.setEnabled = function (value) {
          if (value !== this.config.enabled) {
              this.player.emit('editMode.change', value);
          }
      };
      /**
       * Play move if edit mode is enabled. This move will be discarded, when edit mode is disabled.
       *
       * @param point
       */
      EditMode.prototype.play = function (point) {
          if (!this.config.enabled) {
              return;
          }
          // check, whether some of the next node contains this move
          for (var i = 0; i < this.player.currentNode.children.length; i++) {
              var childNode = this.player.currentNode.children[i];
              var move = childNode.getProperty('B') || childNode.getProperty('W');
              if (move.x === point.x && move.y === point.y) {
                  this.player.next(i);
                  return;
              }
          }
          // otherwise play if valid
          if (this.player.game.isValid(point.x, point.y)) {
              this.player.play(point.x, point.y);
          }
      };
      EditMode.prototype.enable = function () {
          var _this = this;
          this.saveGameState();
          if (this.config.showVariations) {
              this.player.rootNode.setProperty(PropIdent.VARIATIONS_STYLE, 0);
          }
          else {
              this.player.rootNode.setProperty(PropIdent.VARIATIONS_STYLE, 2);
          }
          this.config.enabled = true;
          var lastX = -1;
          var lastY = -1;
          var blackStone = new FieldBoardObject('B');
          blackStone.opacity = 0.35;
          var whiteStone = new FieldBoardObject('W');
          whiteStone.opacity = 0.35;
          var addedStone = null;
          this._boardMouseMoveEvent = function (p) {
              if (lastX !== p.x || lastY !== p.y) {
                  if (_this.player.game.isValid(p.x, p.y)) {
                      var boardObject = _this.player.game.turn === exports.Color.BLACK ? blackStone : whiteStone;
                      boardObject.setPosition(p.x, p.y);
                      if (addedStone) {
                          _this.player.emit('board.updateTemporaryObject', boardObject);
                      }
                      else {
                          _this.player.emit('board.addTemporaryObject', boardObject);
                          addedStone = boardObject;
                      }
                  }
                  else {
                      _this._boardMouseOutEvent();
                  }
                  lastX = p.x;
                  lastY = p.y;
              }
          };
          this._boardMouseOutEvent = function () {
              if (addedStone) {
                  _this.player.emit('board.removeTemporaryObject', addedStone);
                  addedStone = null;
              }
              lastX = -1;
              lastY = -1;
          };
          this._boardClickEvent = function (p) {
              _this._boardMouseOutEvent();
              if (p == null) {
                  return;
              }
              _this.play(p);
          };
          this._nodeChange = function () {
              var current = { x: lastX, y: lastY };
              _this._boardMouseOutEvent();
              _this._boardMouseMoveEvent(current);
          };
          this.player.on('board.mouseMove', this._boardMouseMoveEvent);
          this.player.on('board.mouseOut', this._boardMouseOutEvent);
          this.player.on('board.click', this._boardClickEvent);
          this.player.on('applyNodeChanges', this._nodeChange);
      };
      EditMode.prototype.disable = function () {
          this.player.off('board.mouseMove', this._boardMouseMoveEvent);
          this.player.off('board.mouseOut', this._boardMouseOutEvent);
          this.player.off('board.click', this._boardClickEvent);
          this.player.off('applyNodeChanges', this._nodeChange);
          this.config.enabled = false;
          this.restoreGameState();
      };
      /**
       * Saves current player game state - Kifu and path object.
       */
      EditMode.prototype.saveGameState = function () {
          this.gameStateStack.push({
              rootNode: this.player.rootNode.cloneNode(),
              path: this.player.getCurrentPath(),
          });
      };
      /**
       * Restores player from previously saved state.
       */
      EditMode.prototype.restoreGameState = function () {
          var lastState = this.gameStateStack.pop();
          if (lastState) {
              // revert all node changes
              this.player.first();
              // load stored kifu
              this.player.loadKifu(lastState.rootNode);
              // go to stored path
              this.player.goTo(lastState.path);
          }
      };
      return EditMode;
  }());

  var playerDOMDefaultConfig = {
      enableMouseWheel: true,
      enableKeys: true,
      fastReplay: 2000,
  };
  /**
   * Player with support to render visual elements into the DOM.
   */
  var PlayerDOM = /** @class */ (function (_super) {
      __extends(PlayerDOM, _super);
      function PlayerDOM(config) {
          if (config === void 0) { config = {}; }
          var _this = _super.call(this) || this;
          _this.components = new Map();
          _this.fastReplayEnabled = false;
          _this.handleResize = function () {
              _this.emit('resize');
          };
          _this.handleMouseWheel = function (e) {
              if (_this.config.enableMouseWheel) {
                  if (e.deltaY > 0) {
                      _this.next();
                  }
                  else if (e.deltaY < 0) {
                      _this.previous();
                  }
                  e.preventDefault();
              }
          };
          _this.handleKeydown = function (e) {
              if (_this.config.enableKeys && _this.hasFocus()) {
                  if (_this.config.fastReplay >= 0 && !_this.fastReplayTimeout) {
                      _this.fastReplayTimeout = window.setTimeout(function () {
                          _this.fastReplayEnabled = true;
                      }, _this.config.fastReplay);
                  }
                  if (e.key === 'ArrowRight') {
                      _this.next();
                      if (_this.fastReplayEnabled) {
                          _this.next();
                          _this.next();
                      }
                  }
                  else if (e.key === 'ArrowLeft') {
                      _this.previous();
                      if (_this.fastReplayEnabled) {
                          _this.previous();
                          _this.previous();
                      }
                  }
                  return false;
              }
          };
          _this.handleKeyup = function () {
              window.clearTimeout(_this.fastReplayTimeout);
              _this.fastReplayTimeout = null;
              _this.fastReplayEnabled = false;
          };
          _this.config = makeConfig(playerDOMDefaultConfig, config);
          window.addEventListener('resize', _this.handleResize);
          document.addEventListener('keydown', _this.handleKeydown);
          document.addEventListener('keyup', _this.handleKeyup);
          return _this;
      }
      /**
       * Renders PlayerDOM component into specified HTML element. If there is content inside that element
       * it will be removed. Render method can be called multiple times - this allows to have player's component
       * anywhere you want.
       *
       * @param component
       * @param container
       */
      PlayerDOM.prototype.render = function (component, container) {
          // clear content of the container
          container.innerHTML = '';
          // creates wrapper
          var wrapper = this.createWrapper();
          container.appendChild(wrapper);
          // creates the component HTML element
          wrapper.appendChild(component.element);
          component.create(this);
          this.components.set(container, component);
      };
      /**
       * Removes component rendered via `render` method. Call this to clean event listeners of the component.
       *
       * @param container
       */
      PlayerDOM.prototype.clear = function (container) {
          var component = this.components.get(container);
          if (component && typeof component.destroy === 'function') {
              component.destroy();
          }
          var wrapper = container.firstChild;
          wrapper.removeEventListener('wheel', this.handleMouseWheel);
          container.removeChild(wrapper);
          this.components.delete(container);
      };
      PlayerDOM.prototype.createWrapper = function () {
          var element = document.createElement('div');
          element.className = 'wgo-player';
          element.tabIndex = 1;
          element.addEventListener('wheel', this.handleMouseWheel);
          return element;
      };
      PlayerDOM.prototype.hasFocus = function () {
          var e_1, _a;
          try {
              for (var _b = __values(this.components.keys()), _c = _b.next(); !_c.done; _c = _b.next()) {
                  var elem = _c.value;
                  if (elem.firstChild === document.activeElement) {
                      return true;
                  }
              }
          }
          catch (e_1_1) { e_1 = { error: e_1_1 }; }
          finally {
              try {
                  if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
              }
              finally { if (e_1) throw e_1.error; }
          }
          return false;
      };
      return PlayerDOM;
  }(PlayerBase));

  var Container = /** @class */ (function () {
      function Container(direction, children) {
          var _this = this;
          if (children === void 0) { children = []; }
          this.direction = direction;
          this.children = children;
          // create HTML
          this.element = document.createElement('div');
          this.element.className = "wgo-player__container wgo-player__container--" + this.direction;
          this.children.forEach(function (child) { return _this.element.appendChild(child.element); });
      }
      Container.prototype.create = function (player) {
          this.children.forEach(function (child) { return child.create(player); });
      };
      Container.prototype.destroy = function () {
          this.children.forEach(function (child) { return typeof child.destroy === 'function' && child.destroy(); });
      };
      return Container;
  }());

  var gameInfoBoxDefaultConfig = {
      gameInfoProperties: {
          DT: 'Date',
          KM: 'Komi',
          HA: 'Handicap',
          AN: 'Annotations',
          CP: 'Copyright',
          GC: 'Game comments',
          GN: 'Game name',
          ON: 'Fuseki',
          OT: 'Overtime',
          TM: 'Basic time',
          RE: 'Result',
          RO: 'Round',
          RU: 'Rules',
          US: 'Recorder',
          PC: 'Place',
          EV: 'Event',
          SO: 'Source',
      },
      hideResult: true,
  };
  var GameInfoBox = /** @class */ (function () {
      function GameInfoBox(config) {
          if (config === void 0) { config = {}; }
          this.config = makeConfig(gameInfoBoxDefaultConfig, config);
          this.printInfo = this.printInfo.bind(this);
          this.element = document.createElement('div');
          this.element.className = 'wgo-player__box wgo-player__box--content';
          var title = document.createElement('div');
          title.innerHTML = 'Game information';
          title.className = 'wgo-player__box__title';
          this.element.appendChild(title);
          var tableWrapper = document.createElement('div');
          tableWrapper.className = 'wgo-player__box__content';
          this.element.appendChild(tableWrapper);
          this.infoTable = document.createElement('table');
          this.infoTable.className = 'wgo-player__box__game-info';
          tableWrapper.appendChild(this.infoTable);
      }
      GameInfoBox.prototype.create = function (player) {
          this.player = player;
          this.player.on('beforeInit', this.printInfo);
          this.printInfo();
      };
      GameInfoBox.prototype.destroy = function () {
          this.player.off('beforeInit', this.printInfo);
          this.player = null;
      };
      GameInfoBox.prototype.addInfo = function (propIdent, value, hide) {
          var row = document.createElement('tr');
          row.dataset.propIdent = propIdent;
          this.infoTable.appendChild(row);
          var label = document.createElement('th');
          label.textContent = this.config.gameInfoProperties[propIdent];
          row.appendChild(label);
          var valueElement = document.createElement('td');
          if (hide) {
              var link = document.createElement('a');
              link.href = '#';
              link.addEventListener('click', function (e) {
                  e.preventDefault();
                  valueElement.textContent = value;
              });
              link.textContent = 'show';
              valueElement.appendChild(link);
          }
          else {
              valueElement.textContent = value;
          }
          row.appendChild(valueElement);
      };
      GameInfoBox.prototype.removeInfo = function (propIdent) {
          var elem = this.infoTable.querySelector("[data-id='" + propIdent + "']");
          this.infoTable.removeChild(elem);
      };
      GameInfoBox.prototype.printInfo = function () {
          var _this = this;
          this.infoTable.innerHTML = '';
          if (this.player.rootNode) {
              this.player.rootNode.forEachProperty(function (propIdent, value) {
                  if (_this.config.gameInfoProperties[propIdent]) {
                      _this.addInfo(propIdent, value, _this.config.hideResult && propIdent === PropIdent.RESULT);
                  }
              });
          }
      };
      return GameInfoBox;
  }());

  var defaultConfig = {
      menuItems: [],
  };
  var ControlPanel = /** @class */ (function () {
      function ControlPanel(config) {
          if (config === void 0) { config = {}; }
          this.config = makeConfig(defaultConfig, config);
          this.update = this.update.bind(this);
          this.createDOM();
      }
      ControlPanel.prototype.createDOM = function () {
          var _this = this;
          this.element = document.createElement('div');
          this.element.className = 'wgo-player__control-panel';
          var buttonGroup = document.createElement('form');
          buttonGroup.className = 'wgo-player__button-group';
          this.element.appendChild(buttonGroup);
          buttonGroup.addEventListener('submit', function (e) {
              e.preventDefault();
              _this.player.goTo(parseInt(_this.moveNumber.value, 10));
          });
          this.first = document.createElement('button');
          this.first.type = 'button';
          this.first.className = 'wgo-player__button';
          this.first.innerHTML = '<span class="wgo-player__icon-to-end wgo-player__icon--reverse"></span>';
          this.first.addEventListener('click', function () { return _this.player.first(); });
          buttonGroup.appendChild(this.first);
          this.previous = document.createElement('button');
          this.previous.type = 'button';
          this.previous.className = 'wgo-player__button';
          this.previous.innerHTML = '<span class="wgo-player__icon-play wgo-player__icon--reverse"></span>';
          this.previous.addEventListener('click', function () { return _this.player.previous(); });
          buttonGroup.appendChild(this.previous);
          this.moveNumber = document.createElement('input');
          this.moveNumber.className = 'wgo-player__button wgo-player__move-number';
          this.moveNumber.value = '0';
          this.moveNumber.addEventListener('blur', function (e) {
              _this.player.goTo(parseInt(_this.moveNumber.value, 10));
          });
          buttonGroup.appendChild(this.moveNumber);
          this.next = document.createElement('button');
          this.next.type = 'button';
          this.next.className = 'wgo-player__button';
          this.next.innerHTML = '<span class="wgo-player__icon-play"></span>';
          this.next.addEventListener('click', function () { return _this.player.next(); });
          buttonGroup.appendChild(this.next);
          this.last = document.createElement('button');
          this.last.type = 'button';
          this.last.className = 'wgo-player__button';
          this.last.innerHTML = '<span class="wgo-player__icon-to-end"></span>';
          this.last.addEventListener('click', function () { return _this.player.last(); });
          buttonGroup.appendChild(this.last);
          if (this.config.menuItems.length) {
              var menuWrapper = document.createElement('div');
              menuWrapper.className = 'wgo-player__menu-wrapper';
              this.element.appendChild(menuWrapper);
              var menuButton = document.createElement('button');
              menuButton.type = 'button';
              menuButton.className = 'wgo-player__button wgo-player__button--menu';
              menuButton.innerHTML = '<span class="wgo-player__icon-menu"></span>';
              menuWrapper.appendChild(menuButton);
              var menu = document.createElement('div');
              menu.className = 'wgo-player__menu';
              this.createMenuItems(menu);
              menuWrapper.appendChild(menu);
          }
      };
      ControlPanel.prototype.create = function (player) {
          this.player = player;
          this.player.on('applyNodeChanges', this.update);
          if (this.player.currentNode) {
              this.update();
          }
      };
      ControlPanel.prototype.destroy = function () {
          this.player.off('applyNodeChanges', this.update);
          this.player = null;
      };
      ControlPanel.prototype.update = function () {
          this.moveNumber.value = String(this.player.getCurrentPath().depth);
          if (!this.player.currentNode.parent) {
              this.first.disabled = true;
              this.previous.disabled = true;
          }
          else {
              this.first.disabled = false;
              this.previous.disabled = false;
          }
          if (this.player.currentNode.children.length === 0) {
              this.next.disabled = true;
              this.last.disabled = true;
          }
          else {
              this.next.disabled = false;
              this.last.disabled = false;
          }
      };
      ControlPanel.prototype.createMenuItems = function (menu) {
          this.config.menuItems.forEach(function (menuItem) {
              var menuItemElement = document.createElement('a');
              menuItemElement.className = 'wgo-player__menu-item';
              menuItemElement.tabIndex = 0;
              menuItemElement.textContent = menuItem.name;
              menuItemElement.href = 'javascript: void(0)';
              if (menuItem.defaultChecked && menuItem.defaultChecked()) {
                  menuItemElement.classList.add('wgo-player__menu-item--checked');
              }
              menuItemElement.addEventListener('click', function (e) {
                  e.preventDefault();
                  var res = menuItem.handleClick();
                  if (menuItem.checkable) {
                      if (!res) {
                          menuItemElement.classList.remove('wgo-player__menu-item--checked');
                      }
                      else {
                          menuItemElement.classList.add('wgo-player__menu-item--checked');
                      }
                  }
                  menuItemElement.blur();
              });
              menu.appendChild(menuItemElement);
          });
      };
      /**
       * Some common menu items, probably just temporary.
       */
      ControlPanel.menuItems = {
          /** Renders menu item with SGF download link */
          download: function (player) { return ({
              name: 'Download SGF',
              handleClick: function () {
                  var name = player.rootNode.getProperty(PropIdent.GAME_NAME) || 'game';
                  var sgf = player.rootNode.toSGF();
                  var element = document.createElement('a');
                  element.setAttribute('href', "data:application/x-go-sgf;charset=utf-8," + encodeURIComponent(sgf));
                  element.setAttribute('download', name + ".sgf");
                  element.style.display = 'none';
                  document.body.appendChild(element);
                  element.click();
                  document.body.removeChild(element);
              },
          }); },
          /** Renders menu item to toggle coordinates of SVGBoardComponent */
          displayCoordinates: function (boardComponent) { return ({
              name: 'Display coordinates',
              checkable: true,
              handleClick: function () {
                  boardComponent.setCoordinates(!boardComponent.config.coordinates);
                  return boardComponent.config.coordinates;
              },
              defaultChecked: function () { return boardComponent.config.coordinates; },
          }); },
          /** Renders menu item to toggle edit mode (using EditMode plugin) */
          editMode: function (editMode) { return ({
              name: 'Edit mode',
              checkable: true,
              handleClick: function () {
                  editMode.setEnabled(!editMode.config.enabled);
                  return editMode.config.enabled;
              },
              defaultChecked: function () { return editMode.config.enabled; },
          }); },
          gameInfo: function (player, callback) { return ({
              name: 'Game info',
              handleClick: function () {
                  var overlay = document.createElement('div');
                  overlay.className = 'wgo-player__overlay';
                  var overlayClose = document.createElement('div');
                  overlayClose.className = 'wgo-player__overlay__close';
                  overlayClose.addEventListener('click', function () {
                      overlay.parentElement.removeChild(overlay);
                      gameInfo.destroy();
                  });
                  overlay.appendChild(overlayClose);
                  var modal = document.createElement('div');
                  modal.className = 'wgo-player__modal';
                  overlay.appendChild(modal);
                  var modalContent = document.createElement('div');
                  modalContent.className = 'wgo-player__modal__content';
                  modal.appendChild(modalContent);
                  var gameInfo = new GameInfoBox({
                      hideResult: false,
                  });
                  gameInfo.create(player);
                  modalContent.appendChild(gameInfo.element);
                  var wgoInfo = document.createElement('div');
                  wgoInfo.className = 'wgo-player__wgo-info';
                  // tslint:disable-next-line:max-line-length
                  wgoInfo.innerHTML = 'Game viewed in open source JS player <a href="https://github.com/waltheri/wgo.js" target="_blank">WGo</a>.';
                  modalContent.appendChild(wgoInfo);
                  callback(overlay);
              },
          }); },
      };
      return ControlPanel;
  }());

  var SVGCustomFieldBoardObject = /** @class */ (function (_super) {
      __extends(SVGCustomFieldBoardObject, _super);
      function SVGCustomFieldBoardObject(handler, x, y) {
          if (x === void 0) { x = 0; }
          if (y === void 0) { y = 0; }
          var _this = _super.call(this, 'custom', x, y) || this;
          _this.handler = handler;
          return _this;
      }
      return SVGCustomFieldBoardObject;
  }(FieldBoardObject));

  var SVGCustomLabelBoardObject = /** @class */ (function (_super) {
      __extends(SVGCustomLabelBoardObject, _super);
      function SVGCustomLabelBoardObject() {
          return _super !== null && _super.apply(this, arguments) || this;
      }
      return SVGCustomLabelBoardObject;
  }(LabelBoardObject));

  var colorsMap = {
      B: exports.Color.BLACK,
      W: exports.Color.WHITE,
  };
  var defaultSVGBoardComponentConfig = {
      coordinates: true,
      currentMoveBlackMark: new Circle({ color: 'rgba(255,255,255,0.8)', fillColor: 'rgba(0,0,0,0)' }),
      currentMoveWhiteMark: new Circle({ color: 'rgba(0,0,0,0.8)', fillColor: 'rgba(0,0,0,0)' }),
      variationDrawHandler: new Label({ color: '#33f' }),
      highlightCurrentMove: true,
      showVariations: true,
      showCurrentVariations: false,
  };
  var SVGBoardComponent = /** @class */ (function () {
      function SVGBoardComponent(config) {
          if (config === void 0) { config = {}; }
          this.config = makeConfig(defaultSVGBoardComponentConfig, config);
          this.viewportStack = [];
          this.applyNodeChanges = this.applyNodeChanges.bind(this);
          this.clearNodeChanges = this.clearNodeChanges.bind(this);
          this.applyMarkupProperty = this.applyMarkupProperty.bind(this);
          this.applyLabelMarkupProperty = this.applyLabelMarkupProperty.bind(this);
          this.applyLineMarkupProperty = this.applyLineMarkupProperty.bind(this);
          this.applyViewportProperty = this.applyViewportProperty.bind(this);
          this.clearViewportProperty = this.clearViewportProperty.bind(this);
          this.applyMoveProperty = this.applyMoveProperty.bind(this);
          this.addTemporaryBoardObject = this.addTemporaryBoardObject.bind(this);
          this.removeTemporaryBoardObject = this.removeTemporaryBoardObject.bind(this);
          this.updateTemporaryBoardObject = this.updateTemporaryBoardObject.bind(this);
          this.setCoordinates = this.setCoordinates.bind(this);
          this.createDOM();
      }
      SVGBoardComponent.prototype.createDOM = function () {
          var _this = this;
          this.element = document.createElement('div');
          this.element.className = 'wgo-player__board';
          this.stoneBoardsObjects = [];
          this.temporaryBoardObjects = [];
          this.board = new SVGBoard(this.element, {
              coordinates: this.config.coordinates,
              theme: this.config.theme,
          });
          this.board.on('click', function (event, point) {
              _this.handleBoardClick(point);
          });
          this.board.on('mousemove', function (event, point) {
              if (!point) {
                  if (_this.boardMouseX != null) {
                      _this.boardMouseX = null;
                      _this.boardMouseY = null;
                      _this.handleBoardMouseOut();
                  }
                  return;
              }
              if (point.x !== _this.boardMouseX || point.y !== _this.boardMouseY) {
                  _this.boardMouseX = point.x;
                  _this.boardMouseY = point.y;
                  _this.handleBoardMouseMove(point);
              }
          });
          this.board.on('mouseout', function (event, point) {
              if (!point && _this.boardMouseX != null) {
                  _this.boardMouseX = null;
                  _this.boardMouseY = null;
                  _this.handleBoardMouseOut();
                  return;
              }
          });
      };
      SVGBoardComponent.prototype.create = function (player) {
          this.player = player;
          // add general node listeners - for setting stones on board based on position
          this.player.on('applyNodeChanges', this.applyNodeChanges);
          this.player.on('clearNodeChanges', this.clearNodeChanges);
          // temporary board markup listeners - add
          this.player.on('applyNodeChanges.CR', this.applyMarkupProperty);
          this.player.on('applyNodeChanges.TR', this.applyMarkupProperty);
          this.player.on('applyNodeChanges.SQ', this.applyMarkupProperty);
          this.player.on('applyNodeChanges.SL', this.applyMarkupProperty);
          this.player.on('applyNodeChanges.MA', this.applyMarkupProperty);
          this.player.on('applyNodeChanges.DD', this.applyMarkupProperty);
          this.player.on('applyNodeChanges.LB', this.applyLabelMarkupProperty);
          this.player.on('applyNodeChanges.LN', this.applyLineMarkupProperty);
          this.player.on('applyNodeChanges.AR', this.applyLineMarkupProperty);
          // viewport SGF property listeners
          this.player.on('applyGameChanges.VW', this.applyViewportProperty);
          this.player.on('clearGameChanges.VW', this.clearViewportProperty);
          // add current move marker
          this.player.on('applyNodeChanges.B', this.applyMoveProperty);
          this.player.on('applyNodeChanges.W', this.applyMoveProperty);
          this.player.on('board.addTemporaryObject', this.addTemporaryBoardObject);
          this.player.on('board.removeTemporaryObject', this.removeTemporaryBoardObject);
          this.player.on('board.updateTemporaryObject', this.updateTemporaryBoardObject);
          this.player.on('board.setCoordinates', this.setCoordinates);
      };
      SVGBoardComponent.prototype.destroy = function () {
          this.player.off('applyNodeChanges', this.applyNodeChanges);
          this.player.off('clearNodeChanges', this.clearNodeChanges);
          this.player.off('applyNodeChanges', this.applyNodeChanges);
          this.player.off('clearNodeChanges', this.clearNodeChanges);
          this.player.off('applyNodeChanges.CR', this.applyMarkupProperty);
          this.player.off('applyNodeChanges.TR', this.applyMarkupProperty);
          this.player.off('applyNodeChanges.SQ', this.applyMarkupProperty);
          this.player.off('applyNodeChanges.SL', this.applyMarkupProperty);
          this.player.off('applyNodeChanges.MA', this.applyMarkupProperty);
          this.player.off('applyNodeChanges.DD', this.applyMarkupProperty);
          this.player.off('applyNodeChanges.LB', this.applyLabelMarkupProperty);
          this.player.off('applyNodeChanges.LN', this.applyLineMarkupProperty);
          this.player.off('applyNodeChanges.AR', this.applyLineMarkupProperty);
          this.player.off('applyGameChanges.VW', this.applyViewportProperty);
          this.player.off('clearGameChanges.VW', this.clearViewportProperty);
          this.player.off('applyNodeChanges.B', this.applyMoveProperty);
          this.player.off('applyNodeChanges.W', this.applyMoveProperty);
          this.player.off('board.addTemporaryObject', this.addTemporaryBoardObject);
          this.player.off('board.removeTemporaryObject', this.removeTemporaryBoardObject);
          this.player.off('board.updateTemporaryObject', this.updateTemporaryBoardObject);
          this.player.off('board.setCoordinates', this.setCoordinates);
          this.player = null;
      };
      SVGBoardComponent.prototype.updateStones = function () {
          var _this = this;
          // Remove missing stones in current position
          this.stoneBoardsObjects = this.stoneBoardsObjects.filter(function (boardObject) {
              if (_this.player.game.getStone(boardObject.x, boardObject.y) !== colorsMap[boardObject.type]) {
                  _this.board.removeObject(boardObject);
                  return false;
              }
              return true;
          });
          // Add new stones from current position
          var position = this.player.game.position;
          var _loop_1 = function (x) {
              var _loop_2 = function (y) {
                  var c = position.get(x, y);
                  if (c && !this_1.stoneBoardsObjects.some(function (boardObject) { return boardObject.x === x && boardObject.y === y && c === colorsMap[boardObject.type]; })) {
                      var boardObject = new FieldBoardObject(c === exports.Color.B ? 'B' : 'W', x, y);
                      this_1.board.addObject(boardObject);
                      this_1.stoneBoardsObjects.push(boardObject);
                  }
              };
              for (var y = 0; y < position.size; y++) {
                  _loop_2(y);
              }
          };
          var this_1 = this;
          for (var x = 0; x < position.size; x++) {
              _loop_1(x);
          }
      };
      SVGBoardComponent.prototype.addVariationMarkup = function () {
          var _this = this;
          var moves = this.getVariations();
          if (moves.length > 1) {
              moves.forEach(function (move, i) {
                  if (move) {
                      var obj = new SVGCustomLabelBoardObject(String.fromCodePoint(65 + i), move.x, move.y);
                      obj.handler = _this.config.variationDrawHandler;
                      _this.addTemporaryBoardObject(obj);
                  }
              });
              if (this.boardMouseX != null) {
                  this.handleVariationCursor(this.boardMouseX, this.boardMouseY, moves);
              }
          }
      };
      SVGBoardComponent.prototype.clearTemporaryBoardObjects = function () {
          if (this.temporaryBoardObjects.length) {
              this.board.removeObject(this.temporaryBoardObjects);
              this.temporaryBoardObjects = [];
          }
      };
      SVGBoardComponent.prototype.handleBoardClick = function (point) {
          this.player.emit('board.click', point);
          var moves = this.getVariations();
          if (moves.length > 1) {
              var ind = moves.findIndex(function (move) { return move && move.x === point.x && move.y === point.y; });
              if (ind >= 0) {
                  if (this.shouldShowCurrentVariations()) {
                      this.player.previous();
                      this.player.next(ind);
                  }
                  else {
                      this.player.next(ind);
                  }
              }
          }
      };
      SVGBoardComponent.prototype.handleBoardMouseMove = function (point) {
          this.player.emit('board.mouseMove', point);
          this.handleVariationCursor(point.x, point.y, this.getVariations());
      };
      SVGBoardComponent.prototype.handleBoardMouseOut = function () {
          this.player.emit('board.mouseOut');
          this.removeVariationCursor();
      };
      SVGBoardComponent.prototype.handleVariationCursor = function (x, y, moves) {
          if (moves.length > 1) {
              var ind = moves.findIndex(function (move) { return move && move.x === x && move.y === y; });
              if (ind >= 0) {
                  this.element.style.cursor = 'pointer';
                  return;
              }
          }
          this.removeVariationCursor();
      };
      SVGBoardComponent.prototype.removeVariationCursor = function () {
          if (this.element.style.cursor) {
              this.element.style.cursor = '';
          }
      };
      SVGBoardComponent.prototype.applyNodeChanges = function () {
          this.updateStones();
          this.addVariationMarkup();
      };
      SVGBoardComponent.prototype.clearNodeChanges = function () {
          this.clearTemporaryBoardObjects();
          this.removeVariationCursor();
      };
      SVGBoardComponent.prototype.applyMarkupProperty = function (event) {
          var _this = this;
          event.value.forEach(function (value) {
              // add markup
              var boardMarkup = new MarkupBoardObject(event.propIdent, value.x, value.y, _this.player.game.getStone(value.x, value.y));
              boardMarkup.zIndex = 10;
              _this.addTemporaryBoardObject(boardMarkup);
          });
      };
      SVGBoardComponent.prototype.applyLabelMarkupProperty = function (event) {
          var _this = this;
          event.value.forEach(function (value) {
              // add markup
              var boardMarkup = new LabelBoardObject(value.text, value.x, value.y, _this.player.game.getStone(value.x, value.y));
              boardMarkup.zIndex = 10;
              _this.addTemporaryBoardObject(boardMarkup);
          });
      };
      SVGBoardComponent.prototype.applyLineMarkupProperty = function (event) {
          var _this = this;
          event.value.forEach(function (value) {
              // add markup
              var boardMarkup = new LineBoardObject(event.propIdent, value[0], value[1]);
              boardMarkup.zIndex = 10;
              _this.addTemporaryBoardObject(boardMarkup);
          });
      };
      SVGBoardComponent.prototype.applyViewportProperty = function (event) {
          var currentViewport = this.board.getViewport();
          this.viewportStack.push(currentViewport);
          if (event.value) {
              var minX = Math.min(event.value[0].x, event.value[1].x);
              var minY = Math.min(event.value[0].y, event.value[1].y);
              var maxX = Math.max(event.value[0].x, event.value[1].x);
              var maxY = Math.max(event.value[0].y, event.value[1].y);
              this.board.setViewport({
                  left: minX,
                  top: minY,
                  right: this.board.getSize() - maxX - 1,
                  bottom: this.board.getSize() - maxY - 1,
              });
          }
          else {
              this.board.setViewport({
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
              });
          }
      };
      SVGBoardComponent.prototype.clearViewportProperty = function () {
          var previousViewport = this.viewportStack.pop();
          if (previousViewport) {
              this.board.setViewport(previousViewport);
          }
      };
      SVGBoardComponent.prototype.applyMoveProperty = function (event) {
          if (this.config.highlightCurrentMove) {
              if (!event.value) {
                  // no markup when pass
                  return;
              }
              if (isThereMarkup(event.value, this.player.currentNode.properties)) {
                  // don't show current move markup, when there is markup in kifu node
                  return;
              }
              if (this.getVariations().length > 1 && this.shouldShowCurrentVariations()) {
                  // don't show current move markup, if there is multiple variations and "show current variations" style set
                  return;
              }
              // add current move mark
              var boardMarkup = new SVGCustomFieldBoardObject(event.propIdent === 'B' ? this.config.currentMoveBlackMark : this.config.currentMoveWhiteMark, event.value.x, event.value.y);
              boardMarkup.zIndex = 10;
              this.addTemporaryBoardObject(boardMarkup);
          }
      };
      SVGBoardComponent.prototype.addTemporaryBoardObject = function (obj) {
          this.temporaryBoardObjects.push(obj);
          this.board.addObject(obj);
      };
      SVGBoardComponent.prototype.removeTemporaryBoardObject = function (obj) {
          this.temporaryBoardObjects = this.temporaryBoardObjects.filter(function (o) { return o !== obj; });
          this.board.removeObject(obj);
      };
      SVGBoardComponent.prototype.updateTemporaryBoardObject = function (obj) {
          this.board.updateObject(obj);
      };
      SVGBoardComponent.prototype.setCoordinates = function (b) {
          this.config.coordinates = b;
          this.board.setCoordinates(b);
      };
      SVGBoardComponent.prototype.getVariations = function () {
          if (this.shouldShowVariations()) {
              if (this.shouldShowCurrentVariations()) {
                  if (this.player.currentNode.parent) {
                      return this.player.currentNode.parent.children.map(function (node) { return node.getProperty('B') || node.getProperty('W'); });
                  }
              }
              else {
                  return this.player.currentNode.children.map(function (node) { return node.getProperty('B') || node.getProperty('W'); });
              }
          }
          return [];
      };
      SVGBoardComponent.prototype.shouldShowVariations = function () {
          // look in kifu, whether to show variation markup
          var st = this.player.rootNode.getProperty(PropIdent.VARIATIONS_STYLE);
          if (st != null) {
              return !(st & 2);
          }
          // otherwise use configuration value
          return this.config.showVariations;
      };
      SVGBoardComponent.prototype.shouldShowCurrentVariations = function () {
          // in edit mode not possible
          // if (this.editMode) {
          //   return false;
          // }
          // look at variation style in kifu
          var st = this.player.rootNode.getProperty(PropIdent.VARIATIONS_STYLE);
          if (st != null) {
              return !!(st & 1);
          }
          // or use variation style from configuration
          return this.config.showCurrentVariations;
      };
      return SVGBoardComponent;
  }());
  function samePoint(p1, p2) {
      return p2 && p1.x === p2.x && p1.y === p2.y;
  }
  function isThereMarkup(field, properties) {
      var propIdents = Object.keys(properties);
      for (var i = 0; i < propIdents.length; i++) {
          if (propIdents[i] === 'B' || propIdents[i] === 'W') {
              continue;
          }
          var value = properties[propIdents[i]];
          if (Array.isArray(value)) {
              for (var j = 0; j < value.length; j++) {
                  if (samePoint(field, value[j])) {
                      return true;
                  }
              }
          }
          else if (samePoint(field, value)) {
              return true;
          }
      }
      return false;
  }

  var ResponsiveComponent = /** @class */ (function () {
      function ResponsiveComponent(params, component) {
          this.params = params;
          this.component = component;
          this.resize = this.resize.bind(this);
          this.visible = true;
          this.element = this.component.element;
      }
      ResponsiveComponent.prototype.create = function (player) {
          this.player = player;
          this.player.on('resize', this.resize);
          this.component.create(this.player);
          this.resize();
      };
      ResponsiveComponent.prototype.resize = function () {
          var shouldRenderComponent = this.shouldRenderComponent();
          if (this.visible && !shouldRenderComponent) {
              // replace component element by placeholder
              var placeholder = this.createPlaceholder();
              this.element.parentElement.replaceChild(placeholder, this.element);
              this.element = placeholder;
              this.visible = false;
          }
          else if (!this.visible && shouldRenderComponent) {
              // replaces placeholder by component element
              var componentElement = this.component.element;
              this.element.parentElement.replaceChild(componentElement, this.element);
              this.element = componentElement;
              this.visible = true;
          }
      };
      ResponsiveComponent.prototype.destroy = function () {
          this.player.off('resize', this.resize);
          this.player = null;
          if (typeof this.component.destroy === 'function') {
              this.component.destroy();
          }
      };
      ResponsiveComponent.prototype.shouldRenderComponent = function () {
          var width = this.element.parentElement.offsetWidth;
          var height = this.element.parentElement.offsetHeight;
          if (this.params.minWidth != null && this.params.minWidth > width) {
              return false;
          }
          if (this.params.minHeight != null && this.params.minHeight > height) {
              return false;
          }
          if (this.params.maxWidth != null && this.params.maxWidth < width) {
              return false;
          }
          if (this.params.maxHeight != null && this.params.maxHeight < height) {
              return false;
          }
          if (this.params.orientation === 'portrait' && width < height) {
              return false;
          }
          return true;
      };
      ResponsiveComponent.prototype.createPlaceholder = function () {
          // tslint:disable-next-line:max-line-length
          return document.createComment(" WGo component placeholder for " + (this.component.constructor ? this.component.constructor.name : 'unknown') + " " + JSON.stringify(this.params) + " ");
      };
      return ResponsiveComponent;
  }());

  var commentBoxDefaultConfig = {
      formatMoves: true,
      formatNicks: true,
  };
  var CommentsBox = /** @class */ (function () {
      function CommentsBox(config) {
          if (config === void 0) { config = {}; }
          this.config = makeConfig(commentBoxDefaultConfig, config);
          this.setComments = this.setComments.bind(this);
          this.clearComments = this.clearComments.bind(this);
          // create HTML
          this.element = document.createElement('div');
          this.element.className = 'wgo-player__box wgo-player__box--content';
          var title = document.createElement('div');
          title.innerHTML = 'Comments';
          title.className = 'wgo-player__box__title';
          this.element.appendChild(title);
          this.commentsElement = document.createElement('div');
          this.commentsElement.className = 'wgo-player__box__content';
          this.element.appendChild(this.commentsElement);
      }
      CommentsBox.prototype.create = function (player) {
          this.player = player;
          this.player.on('applyNodeChanges.C', this.setComments);
          this.player.on('clearNodeChanges.C', this.clearComments);
          if (this.player.currentNode) {
              var comment = this.player.currentNode.getProperty('C');
              if (comment) {
                  this.setComments({ value: comment });
              }
          }
      };
      CommentsBox.prototype.destroy = function () {
          this.player.off('applyNodeChanges.C', this.setComments);
          this.player.off('clearNodeChanges.C', this.clearComments);
          this.player = null;
      };
      CommentsBox.prototype.setComments = function (event) {
          var _this = this;
          this.commentsElement.innerHTML = this.formatComment(event.value);
          if (this.config.formatMoves) {
              [].forEach.call(this.commentsElement.querySelectorAll('.wgo-player__move-link'), function (link) {
                  var point = coordinatesToPoint(link.textContent, _this.player.game.size);
                  var boardObject = new MarkupBoardObject('MA', point.x, point.y, _this.player.game.getStone(point.x, point.y));
                  boardObject.zIndex = 20;
                  link.addEventListener('mouseenter', function () {
                      _this.player.emit('board.addTemporaryObject', boardObject);
                  });
                  link.addEventListener('mouseleave', function () {
                      _this.player.emit('board.removeTemporaryObject', boardObject);
                  });
              });
          }
      };
      CommentsBox.prototype.clearComments = function () {
          this.commentsElement.textContent = '';
      };
      CommentsBox.prototype.formatComment = function (text) {
          // remove HTML tags from text
          var formattedText = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
          // divide text into paragraphs
          formattedText = "<p>" + formattedText.replace(/\n/g, '</p><p>') + "</p>";
          if (this.config.formatNicks) {
              formattedText = formattedText.replace(/(<p>)([^:]{3,}:)\s/g, '<p><span class="wgo-player__nick">$2</span> ');
          }
          if (this.config.formatMoves) {
              // tslint:disable-next-line:max-line-length
              formattedText = formattedText.replace(/\b[a-zA-Z]1?\d\b/g, '<a href="javascript:void(0)" class="wgo-player__move-link">$&</a>');
          }
          return formattedText;
      };
      return CommentsBox;
  }());
  function coordinatesToPoint(coordinates, boardSize) {
      var x = coordinates.toLowerCase().charCodeAt(0) - 97; // char code of "a"
      var y = parseInt(coordinates.substr(1), 10) - 1;
      return { x: x, y: boardSize - 1 - y };
  }

  var PlayerTag = /** @class */ (function () {
      function PlayerTag(color) {
          this.color = color;
          this.colorChar = color === exports.Color.B ? 'B' : 'W';
          this.colorName = color === exports.Color.B ? 'black' : 'white';
          this.setName = this.setName.bind(this);
          this.setRank = this.setRank.bind(this);
          this.setTeam = this.setTeam.bind(this);
          this.setCaps = this.setCaps.bind(this);
          // create HTML
          this.element = document.createElement('div');
          this.element.className = 'wgo-player__box wgo-player__player-tag';
          var playerElement = document.createElement('div');
          playerElement.className = 'wgo-player__player-tag__name';
          this.element.appendChild(playerElement);
          this.playerNameElement = document.createElement('span');
          playerElement.appendChild(this.playerNameElement);
          this.playerRankElement = document.createElement('small');
          this.playerRankElement.className = 'wgo-player__player-tag__name__rank';
          playerElement.appendChild(this.playerRankElement);
          this.playerCapsElement = document.createElement('div');
          this.playerCapsElement.className = "wgo-player__player-tag__color wgo-player__player-tag__color--" + this.colorName;
          this.playerCapsElement.textContent = '0';
          this.element.appendChild(this.playerCapsElement);
          // todo team
          this.playerTeamElement = document.createElement('div');
      }
      PlayerTag.prototype.create = function (player) {
          this.player = player;
          // attach Kifu listeners
          this.player.on("beforeInit.P" + this.colorChar, this.setName); // property PB or PW
          this.player.on("beforeInit." + this.colorChar + "R", this.setRank); // property BR or WR
          this.player.on("beforeInit." + this.colorChar + "T", this.setTeam); // property BT or WT
          this.player.on('applyNodeChanges', this.setCaps);
          // set current (probably initial) values
          this.initialSet();
      };
      PlayerTag.prototype.destroy = function () {
          this.player.off("beforeInit.P" + this.colorChar, this.setName);
          this.player.off("beforeInit." + this.colorChar + "R", this.setRank);
          this.player.off("beforeInit." + this.colorChar + "T", this.setTeam);
          this.player.off('applyNodeChanges', this.setCaps);
          this.player = null;
      };
      PlayerTag.prototype.setName = function (event) {
          this.playerNameElement.textContent = event.value || this.colorName;
      };
      PlayerTag.prototype.setRank = function (event) {
          this.playerRankElement.textContent = event.value;
      };
      PlayerTag.prototype.setTeam = function (event) {
          this.playerTeamElement.textContent = event.value;
      };
      PlayerTag.prototype.setCaps = function () {
          this.playerCapsElement.textContent = this.player.game.position.capCount[this.colorName].toString();
      };
      PlayerTag.prototype.initialSet = function () {
          if (this.player.rootNode) {
              this.playerNameElement.textContent = this.player.rootNode.getProperty("P" + this.colorChar) || this.colorName;
              this.playerRankElement.textContent = this.player.rootNode.getProperty(this.colorChar + "R") || '';
              this.playerTeamElement.textContent = this.player.rootNode.getProperty(this.colorChar + "T") || '';
          }
          if (this.player.game) {
              this.setCaps();
          }
      };
      return PlayerTag;
  }());

  var defaultConfig$1 = __assign(__assign({}, playerDOMDefaultConfig), { board: defaultSVGBoardComponentConfig, comments: __assign({ enabled: true }, commentBoxDefaultConfig), gameInfo: __assign({ enabled: true }, gameInfoBoxDefaultConfig), sgfFile: null, sgf: null });
  var SimplePlayer = /** @class */ (function (_super) {
      __extends(SimplePlayer, _super);
      function SimplePlayer(elem, config) {
          if (config === void 0) { config = {}; }
          var _this = _super.call(this) || this;
          // TODO - already partially done in PlayerDOM
          _this.config = makeConfig(defaultConfig$1, config);
          _this.element = elem;
          _this.init();
          return _this;
      }
      SimplePlayer.prototype.init = function () {
          var _this = this;
          var editMode = new EditMode();
          this.use(editMode);
          var svgBoardComponent = new SVGBoardComponent(this.config.board);
          var controlPanelConfig = {
              menuItems: [
                  ControlPanel.menuItems.editMode(editMode),
                  ControlPanel.menuItems.displayCoordinates(svgBoardComponent),
                  ControlPanel.menuItems.download(this),
                  ControlPanel.menuItems.gameInfo(this, function (elem) { return _this.element.firstChild.appendChild(elem); }),
              ],
          };
          var rightColumn = [];
          var bottom = [];
          if (this.config.gameInfo.enabled) {
              rightColumn.push(new GameInfoBox(this.config.gameInfo));
          }
          if (this.config.comments.enabled) {
              rightColumn.push(new CommentsBox(this.config.comments));
              bottom.push(new ResponsiveComponent({ maxWidth: 649 }, new CommentsBox(this.config.comments)));
          }
          var component = new Container('column', __spread([
              new ResponsiveComponent({ maxWidth: 749 }, new Container('row', [
                  new PlayerTag(exports.Color.B),
                  new PlayerTag(exports.Color.W),
              ])),
              new Container('row', [
                  svgBoardComponent,
                  new ResponsiveComponent({ minWidth: 650 }, new Container('column', __spread([
                      new ResponsiveComponent({ minWidth: 250 }, new PlayerTag(exports.Color.B)),
                      new ResponsiveComponent({ minWidth: 250 }, new PlayerTag(exports.Color.W)),
                      new ResponsiveComponent({ minWidth: 250 }, new ControlPanel(controlPanelConfig))
                  ], rightColumn))),
              ]),
              new ResponsiveComponent({ maxWidth: 749 }, new ControlPanel(controlPanelConfig))
          ], bottom));
          this.render(component, this.element);
          if (this.config.sgf) {
              this.loadKifu(KifuNode.fromSGF(this.config.sgf));
          }
          else if (this.config.sgfFile) {
              // TODO add some loading overlay and error state
              fetch(this.config.sgfFile).then(function (response) { return response.text(); }).then(function (value) { return _this.loadKifu(KifuNode.fromSGF(value)); });
          }
      };
      return SimplePlayer;
  }(PlayerDOM));

  exports.BoardBase = BoardBase;
  exports.BoardObject = BoardObject;
  exports.CHINESE_RULES = CHINESE_RULES;
  exports.CommentsBox = CommentsBox;
  exports.Container = Container;
  exports.ControlPanel = ControlPanel;
  exports.EditMode = EditMode;
  exports.FieldBoardObject = FieldBoardObject;
  exports.Game = Game;
  exports.GameInfoBox = GameInfoBox;
  exports.ING_RULES = ING_RULES;
  exports.JAPANESE_RULES = JAPANESE_RULES;
  exports.KifuNode = KifuNode;
  exports.LabelBoardObject = LabelBoardObject;
  exports.LineBoardObject = LineBoardObject;
  exports.MarkupBoardObject = MarkupBoardObject;
  exports.NO_RULES = NO_RULES;
  exports.PlayerBase = PlayerBase;
  exports.PlayerDOM = PlayerDOM;
  exports.PlayerTag = PlayerTag;
  exports.Position = Position;
  exports.ResponsiveComponent = ResponsiveComponent;
  exports.SGFParser = SGFParser;
  exports.SGFSyntaxError = SGFSyntaxError;
  exports.SVGBoard = SVGBoard;
  exports.SVGBoardComponent = SVGBoardComponent;
  exports.SVGFieldDrawHandler = SVGFieldDrawHandler;
  exports.SVGMarkupDrawHandler = SVGMarkupDrawHandler;
  exports.SVGStoneDrawHandler = SVGStoneDrawHandler;
  exports.SVG_GRID_MASK = SVG_GRID_MASK;
  exports.SVG_NS = SVG_NS;
  exports.SVG_OBJECTS = SVG_OBJECTS;
  exports.SVG_SHADOWS = SVG_SHADOWS;
  exports.SimplePlayer = SimplePlayer;
  exports.goRules = goRules;
  exports.propertyValueTypes = propertyValueTypes;
  exports.svgDrawHandlers = index;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
