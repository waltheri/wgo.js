(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.WGo = {}));
}(this, function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
    };
    var CHINESE_RULES = {
        repeating: exports.Repeating.NONE,
        allowRewrite: false,
        allowSuicide: false,
    };
    var ING_RULES = {
        repeating: exports.Repeating.NONE,
        allowRewrite: false,
        allowSuicide: true,
    };
    var NO_RULES = {
        repeating: exports.Repeating.ALL,
        allowRewrite: true,
        allowSuicide: true,
    };
    var rules = {
        Japanese: JAPANESE_RULES,
        GOE: ING_RULES,
        NZ: ING_RULES,
        AGA: CHINESE_RULES,
        Chinese: CHINESE_RULES,
    };

    /**
     * Enumeration representing stone color, can be used for representing board position.
     */
    var Color;
    (function (Color) {
        Color[Color["BLACK"] = 1] = "BLACK";
        Color[Color["B"] = 1] = "B";
        Color[Color["WHITE"] = -1] = "WHITE";
        Color[Color["W"] = -1] = "W";
        Color[Color["EMPTY"] = 0] = "EMPTY";
        Color[Color["E"] = 0] = "E";
    })(Color || (Color = {}));

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
            this.turn = Color.BLACK;
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
                this.grid[i] = Color.EMPTY;
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
            if (!(allowRewrite || this.get(x, y) === Color.EMPTY)) {
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
            if (this.get(x, y) === Color.EMPTY) {
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
            if (this.isOnPosition(x, y) && c !== Color.EMPTY && this.get(x, y) === c) {
                this.set(x, y, Color.EMPTY);
                if (c === Color.BLACK) {
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
                    if (color !== Color.EMPTY) {
                        output += color === Color.BLACK ? BS : WS;
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
            this.positionStack = [new Position(size)];
        }
        Object.defineProperty(Game.prototype, "position", {
            get: function () {
                return this.positionStack[this.positionStack.length - 1];
            },
            set: function (pos) {
                this.positionStack[this.positionStack.length - 1] = pos;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "turn", {
            get: function () {
                return this.position.turn;
            },
            set: function (color) {
                this.position.turn = color;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Game.prototype, "capCount", {
            get: function () {
                return this.position.capCount;
            },
            enumerable: true,
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
            if (this.isOnBoard(x, y) && this.position.get(x, y) === Color.EMPTY) {
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
            if (this.isOnBoard(x, y) && this.position.get(x, y) !== Color.EMPTY) {
                this.position.set(x, y, Color.EMPTY);
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

    // All public API is exported here

    exports.CHINESE_RULES = CHINESE_RULES;
    exports.Game = Game;
    exports.ING_RULES = ING_RULES;
    exports.JAPANESE_RULES = JAPANESE_RULES;
    exports.NO_RULES = NO_RULES;
    exports.Position = Position;
    exports.SGFParser = SGFParser;
    exports.SGFSyntaxError = SGFSyntaxError;
    exports.goRules = rules;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.js.map
