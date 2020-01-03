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
    //# sourceMappingURL=SGFSyntaxError.js.map

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
    //# sourceMappingURL=SGFParser.js.map

    //# sourceMappingURL=index.js.map

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
    //# sourceMappingURL=types.js.map

    /**
     * Utilities methods for Canvas board
     */
    function themeVariable(key, board) {
        var theme = board.config.theme;
        return typeof theme[key] === 'function' ? theme[key](board) : theme[key];
    }
    function getMarkupColor(board, x, y) {
        if (board.fieldObjects[x][y][0].c === Color.BLACK) {
            return themeVariable('markupBlackColor', board);
        }
        if (board.fieldObjects[x][y][0].c === Color.WHITE) {
            return themeVariable('markupWhiteColor', board);
        }
        return themeVariable('markupNoneColor', board);
    }
    function isHereStone(b, x, y) {
        return (b.fieldObjects[x][y][0] && b.fieldObjects[x][y][0].c === Color.W || b.fieldObjects[x][y][0].c === Color.B);
    }
    function defaultFieldClear(canvasCtx, _args, board) {
        canvasCtx.clearRect(-board.fieldWidth / 2, -board.fieldHeight / 2, board.fieldWidth, board.fieldHeight);
    }
    var gridClearField = {
        draw: function (canvasCtx, args, board) {
            if (!isHereStone(board, args.x, args.y) && !args._nodraw) {
                var stoneRadius = board.stoneRadius;
                canvasCtx.clearRect(-stoneRadius, -stoneRadius, 2 * stoneRadius, 2 * stoneRadius);
            }
        },
        clear: function (canvasCtx, args, board) {
            if (!isHereStone(board, args.x, args.y)) {
                args._nodraw = true;
                canvasCtx.restore(); // small hack for now
                board.redrawLayer('grid');
                canvasCtx.save();
                delete args._nodraw;
            }
        },
    };
    //# sourceMappingURL=helpers.js.map

    /* global document, window */
    /**
     * @class
     * Implements one layer of the HTML5 canvas
     */
    var CanvasLayer = /** @class */ (function () {
        function CanvasLayer() {
            this.element = document.createElement('canvas');
            this.context = this.element.getContext('2d');
            // Adjust pixel ratio for HDPI screens (e.g. Retina)
            this.pixelRatio = window.devicePixelRatio || 1;
            // this.context.scale(this.pixelRatio, this.pixelRatio);
            // this.context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
            this.context.scale(this.pixelRatio, this.pixelRatio);
            this.context.save();
        }
        CanvasLayer.prototype.setDimensions = function (width, height, board) {
            var linesShift = themeVariable('linesShift', board);
            this.element.width = width;
            this.element.style.width = width / this.pixelRatio + "px";
            this.element.height = height;
            this.element.style.height = height / this.pixelRatio + "px";
            this.context.restore();
            this.context.save();
            this.context.transform(1, 0, 0, 1, linesShift, linesShift);
        };
        CanvasLayer.prototype.appendTo = function (element, weight) {
            this.element.style.position = 'absolute';
            this.element.style.zIndex = weight.toString(10);
            element.appendChild(this.element);
        };
        CanvasLayer.prototype.removeFrom = function (element) {
            element.removeChild(this.element);
        };
        CanvasLayer.prototype.getContext = function () {
            return this.context;
        };
        CanvasLayer.prototype.initialDraw = function (_board) {
            // no op
        };
        CanvasLayer.prototype.draw = function (drawingFn, args, board) {
            this.context.save();
            drawingFn(this.context, args, board);
            this.context.restore();
        };
        CanvasLayer.prototype.drawField = function (drawingFn, args, board) {
            var leftOffset = Math.round(board.left + args.x * board.fieldWidth);
            var topOffset = board.top + args.y * board.fieldHeight;
            // create a "sandbox" for drawing function
            this.context.save();
            this.context.transform(1, 0, 0, 1, leftOffset, topOffset);
            this.context.beginPath();
            this.context.rect(-board.fieldWidth / 2, -board.fieldWidth / 2, board.fieldWidth, board.fieldHeight);
            this.context.clip();
            drawingFn(this.context, args, board);
            // restore context
            this.context.restore();
        };
        CanvasLayer.prototype.clear = function (_board) {
            this.context.clearRect(0, 0, this.element.width, this.element.height);
        };
        return CanvasLayer;
    }());
    //# sourceMappingURL=CanvasLayer.js.map

    var gridHandler = {
        grid: {
            draw: function (canvasCtx, args, board) {
                // draw grid
                var tmp;
                canvasCtx.beginPath();
                canvasCtx.lineWidth = themeVariable('gridLinesWidth', board);
                canvasCtx.strokeStyle = themeVariable('gridLinesColor', board);
                var tx = Math.round(board.left);
                var ty = Math.round(board.top);
                var bw = Math.round(board.fieldWidth * (board.size - 1));
                var bh = Math.round(board.fieldHeight * (board.size - 1));
                canvasCtx.strokeRect(tx, ty, bw, bh);
                for (var i = 1; i < board.size - 1; i++) {
                    tmp = Math.round(board.getX(i));
                    canvasCtx.moveTo(tmp, ty);
                    canvasCtx.lineTo(tmp, ty + bh);
                    tmp = Math.round(board.getY(i));
                    canvasCtx.moveTo(tx, tmp);
                    canvasCtx.lineTo(tx + bw, tmp);
                }
                canvasCtx.stroke();
                // draw stars
                canvasCtx.fillStyle = themeVariable('starColor', board);
                if (board.config.starPoints[board.size]) {
                    for (var key in board.config.starPoints[board.size]) {
                        canvasCtx.beginPath();
                        canvasCtx.arc(board.getX(board.config.starPoints[board.size][key].x), board.getY(board.config.starPoints[board.size][key].y), themeVariable('starSize', board), 0, 2 * Math.PI, true);
                        canvasCtx.fill();
                    }
                }
            },
        },
    };
    //# sourceMappingURL=grid.js.map

    /**
     * @class
     * @extends WGo.CanvasBoard.CanvasLayer
     * Layer which renders board grid.
     */
    var GridLayer = /** @class */ (function (_super) {
        __extends(GridLayer, _super);
        function GridLayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GridLayer.prototype.initialDraw = function (board) {
            gridHandler.grid.draw(this.context, {}, board);
        };
        return GridLayer;
    }(CanvasLayer));
    //# sourceMappingURL=GridLayer.js.map

    /**
     * @class
     * @extends WGo.CanvasBoard.CanvasLayer
     * Layer for shadows. It is slightly translated.
     */
    var ShadowLayer = /** @class */ (function (_super) {
        __extends(ShadowLayer, _super);
        function ShadowLayer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ShadowLayer.prototype.setDimensions = function (width, height, board) {
            _super.prototype.setDimensions.call(this, width, height, board);
            this.context.transform(1, 0, 0, 1, themeVariable('shadowOffsetX', board), themeVariable('shadowOffsetY', board));
        };
        return ShadowLayer;
    }(CanvasLayer));
    //# sourceMappingURL=ShadowLayer.js.map

    /**
     * Generic shadow draw handler for all stones
     *
     * "shadowBlur" 0-1
     * 0 - no blur - createRadialGradient(0, 0, stoneRadius, 0, 0, stoneRadius)
     * 1 - maximal blur - createRadialGradient(0, 0, 0, 0, 0, 8/7*stoneRadius)
     */
    var shadow = {
        draw: function (canvasCtx, args, board) {
            var stoneRadius = board.stoneRadius;
            var blur = themeVariable('shadowBlur', board) || 0.00001;
            var startRadius = Math.max(stoneRadius - stoneRadius * blur, 0.00001);
            var stopRadius = stoneRadius + (1 / 7 * stoneRadius) * blur;
            var gradient = canvasCtx.createRadialGradient(0, 0, startRadius, 0, 0, stopRadius);
            gradient.addColorStop(0, themeVariable('shadowColor', board));
            gradient.addColorStop(1, themeVariable('shadowTransparentColor', board));
            canvasCtx.beginPath();
            canvasCtx.fillStyle = gradient;
            canvasCtx.arc(0, 0, stopRadius, 0, 2 * Math.PI, true);
            canvasCtx.fill();
            // canvasCtx.beginPath();
            // canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
            // canvasCtx.stroke();
        },
    };
    //# sourceMappingURL=stoneShadow.js.map

    // shell stone helping functions
    var shellSeed = Math.ceil(Math.random() * 9999999);
    // tslint:disable-next-line:max-line-length
    var drawShellLine = function (ctx, x, y, r, startAngle, endAngle, factor, thickness) {
        ctx.strokeStyle = 'rgba(64,64,64,0.2)';
        ctx.lineWidth = (r / 30) * thickness;
        ctx.beginPath();
        var radius = r - Math.max(1, ctx.lineWidth);
        var x1 = x + radius * Math.cos(startAngle * Math.PI);
        var y1 = y + radius * Math.sin(startAngle * Math.PI);
        var x2 = x + radius * Math.cos(endAngle * Math.PI);
        var y2 = y + radius * Math.sin(endAngle * Math.PI);
        var m;
        var angle;
        var diffX;
        var diffY;
        if (x2 > x1) {
            m = (y2 - y1) / (x2 - x1);
            angle = Math.atan(m);
        }
        else if (x2 === x1) {
            angle = Math.PI / 2;
        }
        else {
            m = (y2 - y1) / (x2 - x1);
            angle = Math.atan(m) - Math.PI;
        }
        var c = factor * radius;
        diffX = Math.sin(angle) * c;
        diffY = Math.cos(angle) * c;
        var bx1 = x1 + diffX;
        var by1 = y1 - diffY;
        var bx2 = x2 + diffX;
        var by2 = y2 - diffY;
        ctx.moveTo(x1, y1);
        ctx.bezierCurveTo(bx1, by1, bx2, by2, x2, y2);
        ctx.stroke();
    };
    var drawShell = function (arg) {
        var fromAngle = arg.angle;
        var toAngle = arg.angle;
        for (var i = 0; i < arg.lines.length; i++) {
            fromAngle += arg.lines[i];
            toAngle -= arg.lines[i];
            drawShellLine(arg.ctx, arg.x, arg.y, arg.radius, fromAngle, toAngle, arg.factor, arg.thickness);
        }
    };
    var shellStone = {
        stone: {
            draw: function (canvasCtx, args, board) {
                var stoneRadius = board.stoneRadius;
                var radgrad;
                if (args.c === Color.WHITE) {
                    radgrad = '#aaa';
                }
                else {
                    radgrad = '#000';
                }
                canvasCtx.beginPath();
                canvasCtx.fillStyle = radgrad;
                canvasCtx.arc(0, 0, Math.max(0, stoneRadius - 0.5), 0, 2 * Math.PI, true);
                canvasCtx.fill();
                // do shell magic here
                if (args.c === Color.WHITE) {
                    // do shell magic here
                    var type = shellSeed % (3 + args.x * board.size + args.y) % 3;
                    var z = board.size * board.size + args.x * board.size + args.y;
                    var angle = (2 / z) * (shellSeed % z);
                    if (type === 0) {
                        drawShell({
                            ctx: canvasCtx,
                            x: 0,
                            y: 0,
                            radius: stoneRadius,
                            angle: angle,
                            lines: [0.10, 0.12, 0.11, 0.10, 0.09, 0.09, 0.09, 0.09],
                            factor: 0.25,
                            thickness: 1.75,
                        });
                    }
                    else if (type === 1) {
                        drawShell({
                            ctx: canvasCtx,
                            x: 0,
                            y: 0,
                            radius: stoneRadius,
                            angle: angle,
                            lines: [0.10, 0.09, 0.08, 0.07, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
                            factor: 0.2,
                            thickness: 1.5,
                        });
                    }
                    else {
                        drawShell({
                            ctx: canvasCtx,
                            x: 0,
                            y: 0,
                            radius: stoneRadius,
                            angle: angle,
                            lines: [0.12, 0.14, 0.13, 0.12, 0.12, 0.12],
                            factor: 0.3,
                            thickness: 2,
                        });
                    }
                    radgrad = canvasCtx.createRadialGradient(-2 * stoneRadius / 5, -2 * stoneRadius / 5, stoneRadius / 3, -stoneRadius / 5, -stoneRadius / 5, 5 * stoneRadius / 5);
                    radgrad.addColorStop(0, 'rgba(255,255,255,0.9)');
                    radgrad.addColorStop(1, 'rgba(255,255,255,0)');
                    // add radial gradient //
                    canvasCtx.beginPath();
                    canvasCtx.fillStyle = radgrad;
                    canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
                    canvasCtx.fill();
                }
                else {
                    radgrad = canvasCtx.createRadialGradient(0.4 * stoneRadius, 0.4 * stoneRadius, 0, 0.5 * stoneRadius, 0.5 * stoneRadius, stoneRadius);
                    radgrad.addColorStop(0, 'rgba(32,32,32,1)');
                    radgrad.addColorStop(1, 'rgba(0,0,0,0)');
                    canvasCtx.beginPath();
                    canvasCtx.fillStyle = radgrad;
                    canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
                    canvasCtx.fill();
                    radgrad = canvasCtx.createRadialGradient(-0.4 * stoneRadius, -0.4 * stoneRadius, 1, -0.5 * stoneRadius, -0.5 * stoneRadius, 1.5 * stoneRadius);
                    radgrad.addColorStop(0, 'rgba(64,64,64,1)');
                    radgrad.addColorStop(1, 'rgba(0,0,0,0)');
                    canvasCtx.beginPath();
                    canvasCtx.fillStyle = radgrad;
                    canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
                    canvasCtx.fill();
                }
            },
        },
        shadow: shadow,
    };
    //# sourceMappingURL=shellStone.js.map

    var glassStone = {
        // draw handler for stone layer
        stone: {
            // drawing function - args object contain info about drawing object, board is main board object
            draw: function (canvasCtx, args, board) {
                var stoneRadius = board.stoneRadius;
                var radgrad;
                // set stone texture
                if (args.c === Color.WHITE) {
                    radgrad = canvasCtx.createRadialGradient(-2 * stoneRadius / 5, -2 * stoneRadius / 5, stoneRadius / 3, -stoneRadius / 5, -stoneRadius / 5, 5 * stoneRadius / 5);
                    radgrad.addColorStop(0, '#fff');
                    radgrad.addColorStop(1, '#aaa');
                }
                else {
                    radgrad = canvasCtx.createRadialGradient(-2 * stoneRadius / 5, -2 * stoneRadius / 5, 1, -stoneRadius / 5, -stoneRadius / 5, 4 * stoneRadius / 5);
                    radgrad.addColorStop(0, '#666');
                    radgrad.addColorStop(1, '#000');
                }
                // paint stone
                canvasCtx.beginPath();
                canvasCtx.fillStyle = radgrad;
                canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
                canvasCtx.fill();
            },
        },
        // adding shadow
        shadow: shadow,
    };
    //# sourceMappingURL=glassStone.js.map

    var paintedStone = {
        stone: {
            draw: function (canvasCtx, args, board) {
                var stoneRadius = board.stoneRadius;
                var radgrad;
                if (args.c === Color.WHITE) {
                    radgrad = canvasCtx.createRadialGradient(-2 * stoneRadius / 5, -2 * stoneRadius / 5, 2, -stoneRadius / 5, -stoneRadius / 5, 4 * stoneRadius / 5);
                    radgrad.addColorStop(0, '#fff');
                    radgrad.addColorStop(1, '#ddd');
                }
                else {
                    radgrad = canvasCtx.createRadialGradient(-2 * stoneRadius / 5, -2 * stoneRadius / 5, 1, -stoneRadius / 5, -stoneRadius / 5, 4 * stoneRadius / 5);
                    radgrad.addColorStop(0, '#111');
                    radgrad.addColorStop(1, '#000');
                }
                canvasCtx.beginPath();
                canvasCtx.fillStyle = radgrad;
                canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
                canvasCtx.fill();
                canvasCtx.beginPath();
                canvasCtx.lineWidth = stoneRadius / 6;
                if (args.c === Color.WHITE) {
                    canvasCtx.strokeStyle = '#999';
                    canvasCtx.arc(stoneRadius / 8, stoneRadius / 8, stoneRadius / 2, 0, Math.PI / 2, false);
                }
                else {
                    canvasCtx.strokeStyle = '#ccc';
                    canvasCtx.arc(-stoneRadius / 8, -stoneRadius / 8, stoneRadius / 2, Math.PI, 1.5 * Math.PI);
                }
                canvasCtx.stroke();
            },
        },
        shadow: shadow,
    };
    //# sourceMappingURL=paintedStone.js.map

    // Black and white stone
    var simpleStone = {
        stone: {
            draw: function (canvasCtx, args, board) {
                var stoneRadius = board.stoneRadius;
                var lw = themeVariable('markupLinesWidth', board) || 1;
                if (args.c === Color.WHITE) {
                    canvasCtx.fillStyle = 'white';
                }
                else {
                    canvasCtx.fillStyle = 'black';
                }
                canvasCtx.beginPath();
                canvasCtx.arc(0, 0, Math.max(0, stoneRadius - lw), 0, 2 * Math.PI, true);
                canvasCtx.fill();
                canvasCtx.lineWidth = lw;
                canvasCtx.strokeStyle = 'black';
                canvasCtx.stroke();
            },
        },
    };
    //# sourceMappingURL=simpleStone.js.map

    /* global window */
    // Check if image has been loaded properly
    // see https://stereochro.me/ideas/detecting-broken-images-js
    function isOkay(img) {
        if (typeof img === 'string') {
            return false;
        }
        if (!img.complete) {
            return false;
        }
        if (typeof img.naturalWidth !== 'undefined' && img.naturalWidth === 0) {
            return false;
        }
        return true;
    }
    // Shadow handler for the 'REALISITC' rendering mode
    // handler for image based stones
    function realisticStone (graphics, fallback) {
        var randSeed = Math.ceil(Math.random() * 9999999);
        var redrawRequest;
        return {
            stone: {
                draw: function (canvasCtx, args, board) {
                    var stoneRadius = board.stoneRadius;
                    var graphic = args.c === Color.WHITE ? graphics.whiteStoneGraphic : graphics.blackStoneGraphic;
                    var count = graphic.length;
                    var idx = randSeed % (count + args.x * board.size + args.y) % count;
                    if (typeof graphic[idx] === 'string') {
                        // The image has not been loaded yet
                        var stoneGraphic = new Image();
                        // Redraw the whole board after the image has been loaded.
                        // This prevents 'missing stones' and similar graphical errors
                        // especially on slower internet connections.
                        stoneGraphic.onload = function () {
                            // make sure board will be redraw just once, and after every stone is processed
                            if (redrawRequest != null) {
                                window.clearTimeout(redrawRequest);
                            }
                            redrawRequest = window.setTimeout(function () {
                                board.redraw();
                                redrawRequest = null;
                            }, 1);
                        };
                        stoneGraphic.src = themeVariable('imageFolder', board) + graphic[idx];
                        graphic[idx] = stoneGraphic;
                    }
                    if (isOkay(graphic[idx])) {
                        canvasCtx.drawImage(graphic[idx], -stoneRadius, -stoneRadius, 2 * stoneRadius, 2 * stoneRadius);
                    }
                    else {
                        // Fall back to SHELL handler if there was a problem loading the image
                        fallback.stone.draw(canvasCtx, args, board);
                    }
                },
            },
            shadow: shadow,
        };
    }
    //# sourceMappingURL=realisticStone.js.map

    var circle = {
        stone: {
            draw: function (canvasCtx, args, board) {
                var stoneRadius = board.stoneRadius;
                canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
                canvasCtx.lineWidth = args.lineWidth || themeVariable('markupLinesWidth', board) || 1;
                canvasCtx.beginPath();
                canvasCtx.arc(0, 0, Math.round(stoneRadius / 2), 0, 2 * Math.PI, true);
                canvasCtx.stroke();
            },
        },
        grid: gridClearField,
    };
    //# sourceMappingURL=circle.js.map

    var square = {
        stone: {
            draw: function (canvasCtx, args, board) {
                var stoneRadius = Math.round(board.stoneRadius);
                canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
                canvasCtx.lineWidth = args.lineWidth || themeVariable('markupLinesWidth', board) || 1;
                canvasCtx.beginPath();
                canvasCtx.rect(Math.round(-stoneRadius / 2), Math.round(-stoneRadius / 2), stoneRadius, stoneRadius);
                canvasCtx.stroke();
            },
        },
        grid: gridClearField,
    };
    //# sourceMappingURL=square.js.map

    var triangle = {
        stone: {
            draw: function (canvasCtx, args, board) {
                var stoneRadius = board.stoneRadius;
                canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
                canvasCtx.lineWidth = args.lineWidth || themeVariable('markupLinesWidth', board) || 1;
                canvasCtx.beginPath();
                canvasCtx.moveTo(0, 0 - Math.round(stoneRadius / 2));
                canvasCtx.lineTo(Math.round(-stoneRadius / 2), Math.round(stoneRadius / 3));
                canvasCtx.lineTo(Math.round(+stoneRadius / 2), Math.round(stoneRadius / 3));
                canvasCtx.closePath();
                canvasCtx.stroke();
            },
        },
        grid: gridClearField,
    };
    //# sourceMappingURL=triangle.js.map

    var label = {
        stone: {
            draw: function (canvasCtx, args, board) {
                var stoneRadius = board.stoneRadius;
                var font = args.font || themeVariable('font', board) || '';
                canvasCtx.fillStyle = args.c || getMarkupColor(board, args.x, args.y);
                if (args.text.length === 1) {
                    canvasCtx.font = Math.round(stoneRadius * 1.5) + "px " + font;
                }
                else if (args.text.length === 2) {
                    canvasCtx.font = Math.round(stoneRadius * 1.2) + "px " + font;
                }
                else {
                    canvasCtx.font = Math.round(stoneRadius) + "px " + font;
                }
                canvasCtx.beginPath();
                canvasCtx.textBaseline = 'middle';
                canvasCtx.textAlign = 'center';
                canvasCtx.fillText(args.text, 0, 0, 2 * stoneRadius);
            },
        },
        grid: gridClearField,
    };
    //# sourceMappingURL=label.js.map

    var dot = {
        stone: {
            draw: function (canvasCtx, args, board) {
                var stoneRadius = board.stoneRadius;
                canvasCtx.fillStyle = args.c || getMarkupColor(board, args.x, args.y);
                canvasCtx.beginPath();
                canvasCtx.rect(-stoneRadius / 2, -stoneRadius / 2, stoneRadius, stoneRadius);
                canvasCtx.fill();
            },
        },
        grid: gridClearField,
    };
    //# sourceMappingURL=dot.js.map

    var xMark = {
        stone: {
            draw: function (canvasCtx, args, board) {
                var stoneRadius = board.stoneRadius;
                canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
                canvasCtx.lineCap = 'round';
                canvasCtx.lineWidth = (args.lineWidth || themeVariable('markupLinesWidth', board) || 1) * 2 - 1;
                canvasCtx.beginPath();
                canvasCtx.moveTo(Math.round(-stoneRadius / 2), Math.round(-stoneRadius / 2));
                canvasCtx.lineTo(Math.round(stoneRadius / 2), Math.round(stoneRadius / 2));
                canvasCtx.moveTo(Math.round(stoneRadius / 2) - 1, Math.round(-stoneRadius / 2));
                canvasCtx.lineTo(Math.round(-stoneRadius / 2) - 1, Math.round(stoneRadius / 2));
                canvasCtx.stroke();
                canvasCtx.lineCap = 'butt';
            },
        },
        grid: gridClearField,
    };
    //# sourceMappingURL=xMark.js.map

    var smileyFace = {
        stone: {
            draw: function (canvasCtx, args, board) {
                var stoneRadius = board.stoneRadius;
                canvasCtx.strokeStyle = args.c || getMarkupColor(board, args.x, args.y);
                canvasCtx.lineWidth = (args.lineWidth || themeVariable('markupLinesWidth', board) || 1) * 2;
                canvasCtx.beginPath();
                canvasCtx.arc(-stoneRadius / 3, -stoneRadius / 3, stoneRadius / 6, 0, 2 * Math.PI, true);
                canvasCtx.stroke();
                canvasCtx.beginPath();
                canvasCtx.arc(stoneRadius / 3, -stoneRadius / 3, stoneRadius / 6, 0, 2 * Math.PI, true);
                canvasCtx.stroke();
                canvasCtx.beginPath();
                canvasCtx.moveTo(-stoneRadius / 1.5, 0);
                canvasCtx.bezierCurveTo(-stoneRadius / 1.5, stoneRadius / 2, stoneRadius / 1.5, stoneRadius / 2, stoneRadius / 1.5, 0);
                canvasCtx.stroke();
            },
        },
        grid: gridClearField,
    };
    //# sourceMappingURL=smileyFace.js.map

    //# sourceMappingURL=index.js.map

    var index = /*#__PURE__*/Object.freeze({
        shellStone: shellStone,
        glassStone: glassStone,
        paintedStone: paintedStone,
        simpleStone: simpleStone,
        realisticStone: realisticStone,
        circle: circle,
        square: square,
        triangle: triangle,
        label: label,
        dot: dot,
        xMark: xMark,
        smileyFace: smileyFace
    });

    /**
     * Draws coordinates on the board
     */
    var coordinates = {
        grid: {
            draw: function (canvasCtx, args, board) {
                var t;
                canvasCtx.fillStyle = themeVariable('coordinatesColor', board);
                canvasCtx.textBaseline = 'middle';
                canvasCtx.textAlign = 'center';
                canvasCtx.font = board.stoneRadius + "px " + (board.config.theme.font || '');
                var xright = board.getX(-0.75);
                var xleft = board.getX(board.size - 0.25);
                var ytop = board.getY(-0.75);
                var ybottom = board.getY(board.size - 0.25);
                var coordinatesX = themeVariable('coordinatesX', board);
                var coordinatesY = themeVariable('coordinatesY', board);
                for (var i = 0; i < board.size; i++) {
                    t = board.getY(i);
                    canvasCtx.fillText(coordinatesX[i], xright, t);
                    canvasCtx.fillText(coordinatesX[i], xleft, t);
                    t = board.getX(i);
                    canvasCtx.fillText(coordinatesY[i], t, ytop);
                    canvasCtx.fillText(coordinatesY[i], t, ybottom);
                }
                canvasCtx.fillStyle = 'black';
            },
        },
    };
    //# sourceMappingURL=coordinates.js.map

    /**
     * Object containing default graphical properties of a board.
     * A value of all properties can be even static value or function, returning final value.
     * Theme object doesn't set board and stone textures - they are set separately.
     */
    var realisticTheme = {
        // stones
        stoneHandler: realisticStone({
            whiteStoneGraphic: [
                'stones/white00_128.png',
                'stones/white01_128.png',
                'stones/white02_128.png',
                'stones/white03_128.png',
                'stones/white04_128.png',
                'stones/white05_128.png',
                'stones/white06_128.png',
                'stones/white07_128.png',
                'stones/white08_128.png',
                'stones/white09_128.png',
                'stones/white10_128.png',
            ],
            blackStoneGraphic: [
                'stones/black00_128.png',
                'stones/black01_128.png',
                'stones/black02_128.png',
                'stones/black03_128.png',
            ],
        }, shellStone),
        stoneSize: function (board) {
            var fieldSize = Math.min(board.fieldWidth, board.fieldHeight);
            return /*8/17**/ 0.5 * fieldSize;
        },
        // shadow
        shadowColor: 'rgba(62,32,32,0.5)',
        shadowTransparentColor: 'rgba(62,32,32,0)',
        shadowBlur: 0.5,
        shadowOffsetX: function (board) {
            return Math.round(board.stoneRadius / 7);
        },
        shadowOffsetY: function (board) {
            return Math.round(board.stoneRadius / 3);
        },
        // markup
        markupBlackColor: 'rgba(255,255,255,0.9)',
        markupWhiteColor: 'rgba(0,0,0,0.7)',
        markupNoneColor: 'rgba(0,0,0,0.7)',
        markupLinesWidth: function (board) {
            return board.stoneRadius / 7.5;
        },
        markupHandlers: {
            CR: circle,
            LB: label,
            SQ: square,
            TR: triangle,
            MA: xMark,
            SL: dot,
            SM: smileyFace,
        },
        // grid & star points
        gridLinesWidth: function (board) {
            return board.stoneRadius / 15;
        },
        gridLinesColor: '#654525',
        starColor: '#531',
        starSize: function (board) {
            return (board.stoneRadius / 8) + 1;
        },
        // coordinates
        coordinatesHandler: coordinates,
        coordinatesColor: '#531',
        coordinatesX: 'ABCDEFGHJKLMNOPQRSTUV',
        coordinatesY: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
        // other
        variationColor: 'rgba(0,32,128,0.8)',
        font: 'calibri',
        linesShift: -0.25,
        imageFolder: '../images/',
        backgroundColor: '#CEB053',
        backgroundImage: '',
    };

    /**
     * Object containing default graphical properties of a board.
     * A value of all properties can be even static value or function, returning final value.
     * Theme object doesn't set board and stone textures - they are set separately.
     */
    var modernTheme = {
        // stones
        stoneHandler: shellStone,
        stoneSize: function (board) {
            var fieldSize = Math.min(board.fieldWidth, board.fieldHeight);
            return 8 / 17 * fieldSize;
        },
        // shadow
        shadowColor: 'rgba(62,32,32,0.5)',
        shadowTransparentColor: 'rgba(62,32,32,0)',
        shadowBlur: 0.25,
        shadowOffsetX: function (board) {
            return Math.round(board.stoneRadius / 7);
        },
        shadowOffsetY: function (board) {
            return Math.round(board.stoneRadius / 7);
        },
        // markup
        markupBlackColor: 'rgba(255,255,255,0.9)',
        markupWhiteColor: 'rgba(0,0,0,0.7)',
        markupNoneColor: 'rgba(0,0,0,0.7)',
        markupLinesWidth: function (board) {
            return board.stoneRadius / 7.5;
        },
        markupHandlers: {
            CR: circle,
            LB: label,
            SQ: square,
            TR: triangle,
            MA: xMark,
            SL: dot,
            SM: smileyFace,
        },
        // grid & star points
        gridLinesWidth: function (board) {
            return board.stoneRadius / 15;
        },
        gridLinesColor: '#654525',
        starColor: '#531',
        starSize: function (board) {
            return (board.stoneRadius / 8) + 1;
        },
        // coordinates
        coordinatesHandler: coordinates,
        coordinatesColor: '#531',
        coordinatesX: 'ABCDEFGHJKLMNOPQRSTUV',
        coordinatesY: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
        // other
        variationColor: 'rgba(0,32,128,0.8)',
        font: 'calibri',
        linesShift: -0.25,
        imageFolder: '../images/',
        backgroundColor: '',
        backgroundImage: '',
    };
    //# sourceMappingURL=modernTheme.js.map

    // add here all themes, which should be publicly exposed
    //# sourceMappingURL=index.js.map

    var index$1 = /*#__PURE__*/Object.freeze({
        realisticTheme: realisticTheme,
        modernTheme: modernTheme
    });

    var canvasBoardDefaultConfig = {
        size: 19,
        width: 0,
        height: 0,
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
        viewport: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
        coordinates: false,
        theme: realisticTheme,
    };
    //# sourceMappingURL=defaultConfig.js.map

    /**
     * Helper function for merging default config with provided config.
     *
     * @param defaults
     * @param config
     */
    function makeConfig(defaults, config) {
        var mergedConfig = {};
        Object.keys(defaults).forEach(function (key) {
            if (typeof config[key] === 'object' && !Array.isArray(config[key])) {
                mergedConfig[key] = makeConfig(defaults[key], config[key]);
            }
            else if (config[key] !== undefined) {
                mergedConfig[key] = config[key];
            }
            else {
                mergedConfig[key] = defaults[key];
            }
        });
        return mergedConfig;
    }
    //# sourceMappingURL=makeConfig.js.map

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
                this._events[evName].forEach(function (fn) { return fn.apply(void 0, args); });
            }
        };
        return EventEmitter;
    }());
    //# sourceMappingURL=EventEmitter.js.map

    /* global document, window */
    // Private methods of WGo.CanvasBoard
    var calcLeftMargin = function (b) { return ((3 * b.width) / (4 * (b.bottomRightFieldX + 1 - b.topLeftFieldX) + 2) - b.fieldWidth * b.topLeftFieldX); };
    var calcTopMargin = function (b) { return ((3 * b.height) / (4 * (b.bottomRightFieldY + 1 - b.topLeftFieldY) + 2) - b.fieldHeight * b.topLeftFieldY); };
    var calcFieldWidth = function (b) { return ((4 * b.width) / (4 * (b.bottomRightFieldX + 1 - b.topLeftFieldX) + 2)); };
    var calcFieldHeight = function (b) { return ((4 * b.height) / (4 * (b.bottomRightFieldY + 1 - b.topLeftFieldY) + 2)); };
    var clearField = function (board, x, y) {
        var handler;
        for (var z = 0; z < board.fieldObjects[x][y].length; z++) {
            var obj = board.fieldObjects[x][y][z];
            if (!obj.type) {
                handler = themeVariable('stoneHandler', board);
            }
            else if (typeof obj.type === 'string') {
                handler = themeVariable('markupHandlers', board)[obj.type];
            }
            else {
                handler = obj.type;
            }
            for (var layer in handler) {
                board.layers[layer].drawField(handler[layer].clear ? handler[layer].clear : defaultFieldClear, obj, board);
            }
        }
    };
    // Draws all object on specified field
    var drawField = function (board, x, y) {
        var handler;
        for (var z = 0; z < board.fieldObjects[x][y].length; z++) {
            var obj = board.fieldObjects[x][y][z];
            if (!obj.type) {
                handler = themeVariable('stoneHandler', board);
            }
            else if (typeof obj.type === 'string') {
                handler = themeVariable('markupHandlers', board)[obj.type];
            }
            else {
                handler = obj.type;
            }
            for (var layer in handler) {
                board.layers[layer].drawField(handler[layer].draw, obj, board);
            }
        }
    };
    /*const getMousePos = function (board: CanvasBoard, e: MouseEvent) {
      // new hopefully better translation of coordinates

      let x: number;
      let y: number;

      x = e.layerX * board.pixelRatio;
      x -= board.left;
      x /= board.fieldWidth;
      x = Math.round(x);

      y = e.layerY * board.pixelRatio;
      y -= board.top;
      y /= board.fieldHeight;
      y = Math.round(y);

      return {
        x: x >= board.size ? -1 : x,
        y: y >= board.size ? -1 : y,
      };
    };*/
    var objectMissing = function (objectsArray) {
        return function (object) {
            return !objectsArray.some(function (obj) {
                if (object === obj) {
                    return true;
                }
                return Object.keys(object).every(function (key) { return object[key] === obj[key]; });
            });
        };
    };
    var CanvasBoard = /** @class */ (function (_super) {
        __extends(CanvasBoard, _super);
        /**
           * CanvasBoard class constructor - it creates a canvas board.
           *
           * @alias WGo.CanvasBoard
           * @class
           * @param {HTMLElement} elem DOM element to put in
           * @param {Object} config Configuration object. It is object with "key: value" structure. Possible configurations are:
           *
           * * size: number - size of the board (default: 19)
           * * width: number - width of the board (default: 0)
           * * height: number - height of the board (default: 0)
           * * font: string - font of board writings (!deprecated)
           * * lineWidth: number - line width of board drawings (!deprecated)
           * * autoLineWidth: boolean - if set true, line width will be automatically computed accordingly to board size - this
         *   option rewrites 'lineWidth' /and it will keep markups sharp/ (!deprecated)
           * * starPoints: Object - star points coordinates, defined for various board sizes. Look at CanvasBoard.default for
         *   more info.
           * * stoneHandler: CanvasBoard.DrawHandler - stone drawing handler (default: CanvasBoard.drawHandlers.SHELL)
           * * starSize: number - size of star points (default: 1). Radius of stars is dynamic, however you can modify it by
         *   given constant. (!deprecated)
           * * stoneSize: number - size of stone (default: 1). Radius of stone is dynamic, however you can modify it by given
         *   constant. (!deprecated)
           * * shadowSize: number - size of stone shadow (default: 1). Radius of shadow is dynamic, however you can modify it by
         *   given constant. (!deprecated)
           * * background: string - background of the board, it can be either color (#RRGGBB) or url. Empty string means no
         *   background. (default: WGo.DIR+"wood1.jpg")
           * * section: {
           *     top: number,
           *     right: number,
           *     bottom: number,
           *     left: number
           *   }
           *   It defines a section of board to be displayed. You can set a number of rows(or cols) to be skipped on each side.
           *   Numbers can be negative, in that case there will be more empty space. In default all values are zeros.
           * * theme: Object - theme object, which defines all graphical attributes of the board. Default theme object
         *   is "WGo.CanvasBoard.themes.default". For old look you may use "WGo.CanvasBoard.themes.old".
           *
           * Note: properties lineWidth, autoLineWidth, starPoints, starSize, stoneSize and shadowSize will be considered only
         * if you set property 'theme' to 'WGo.CanvasBoard.themes.old'.
           */
        function CanvasBoard(elem, config) {
            if (config === void 0) { config = {}; }
            var _this = _super.call(this) || this;
            _this.fieldObjects = [];
            _this.customObjects = [];
            // merge user config with default
            _this.config = makeConfig(canvasBoardDefaultConfig, config);
            // create array for field objects (as 3d array)
            for (var x = 0; x < _this.config.size; x++) {
                _this.fieldObjects[x] = [];
                for (var y = 0; y < _this.config.size; y++) {
                    _this.fieldObjects[x][y] = [];
                }
            }
            // init params - TODO: remove - should be computed as needed
            _this.size = _this.config.size;
            _this.viewport = _this.config.viewport;
            _this.topLeftFieldX = _this.config.viewport.left;
            _this.topLeftFieldY = _this.config.viewport.top;
            _this.bottomRightFieldX = _this.size - 1 - _this.config.viewport.right;
            _this.bottomRightFieldY = _this.size - 1 - _this.config.viewport.bottom;
            // init board html
            _this.init(elem);
            // set the pixel ratio for HDPI (e.g. Retina) screens
            _this.pixelRatio = window.devicePixelRatio || 1;
            if (config.width && config.height) {
                _this.setDimensions(config.width, config.height);
            }
            else if (config.width) {
                _this.setWidth(config.width);
            }
            else if (config.height) {
                _this.setHeight(config.height);
            }
            return _this;
        }
        /**
         * Initialization method, it is called in constructor. You shouldn't call it, but you can alter it.
         */
        CanvasBoard.prototype.init = function (elem) {
            this.element = document.createElement('div');
            this.element.className = 'wgo-board';
            this.element.style.position = 'relative';
            this.element.style.backgroundColor = themeVariable('backgroundColor', this);
            if (this.config.theme.backgroundImage) {
                this.element.style.backgroundImage = "url(\"" + themeVariable('backgroundImage', this) + "\")";
            }
            this.layers = {
                grid: new GridLayer(),
                shadow: new ShadowLayer(),
                stone: new CanvasLayer(),
            };
            this.addLayer(this.layers.grid, 100);
            this.addLayer(this.layers.shadow, 200);
            this.addLayer(this.layers.stone, 300);
            // append to element
            elem.appendChild(this.element);
        };
        CanvasBoard.prototype.updateDim = function () {
            var _this = this;
            this.element.style.width = (this.width / this.pixelRatio) + "px";
            this.element.style.height = (this.height / this.pixelRatio) + "px";
            this.stoneRadius = themeVariable('stoneSize', this);
            Object.keys(this.layers).forEach(function (layer) {
                _this.layers[layer].setDimensions(_this.width, _this.height, _this);
            });
        };
        CanvasBoard.prototype.setWidth = function (width) {
            this.width = width * this.pixelRatio;
            this.fieldHeight = this.fieldWidth = calcFieldWidth(this);
            this.left = calcLeftMargin(this);
            this.height = (this.bottomRightFieldY - this.topLeftFieldY + 1.5) * this.fieldHeight;
            this.top = calcTopMargin(this);
            this.updateDim();
            this.redraw();
        };
        CanvasBoard.prototype.setHeight = function (height) {
            this.height = height * this.pixelRatio;
            this.fieldWidth = this.fieldHeight = calcFieldHeight(this);
            this.top = calcTopMargin(this);
            this.width = (this.bottomRightFieldX - this.topLeftFieldX + 1.5) * this.fieldWidth;
            this.left = calcLeftMargin(this);
            this.updateDim();
            this.redraw();
        };
        CanvasBoard.prototype.setDimensions = function (width, height) {
            this.width = (width || parseInt(this.element.style.width, 10)) * this.pixelRatio;
            this.height = (height || parseInt(this.element.style.height, 10)) * this.pixelRatio;
            this.fieldWidth = calcFieldWidth(this);
            this.fieldHeight = calcFieldHeight(this);
            this.left = calcLeftMargin(this);
            this.top = calcTopMargin(this);
            this.updateDim();
            this.redraw();
        };
        /**
           * Get currently visible section of the board
           */
        CanvasBoard.prototype.getViewport = function () {
            return this.viewport;
        };
        /**
           * Set section of the board to be displayed
           */
        CanvasBoard.prototype.setViewport = function (viewport) {
            this.viewport = viewport;
            this.topLeftFieldX = this.viewport.left;
            this.topLeftFieldY = this.viewport.top;
            this.bottomRightFieldX = this.size - 1 - this.viewport.right;
            this.bottomRightFieldY = this.size - 1 - this.viewport.bottom;
            this.setDimensions();
        };
        CanvasBoard.prototype.getSize = function () {
            return this.size;
        };
        CanvasBoard.prototype.setSize = function (size) {
            if (size === void 0) { size = 19; }
            if (size !== this.size) {
                this.size = size;
                this.fieldObjects = [];
                for (var i = 0; i < this.size; i++) {
                    this.fieldObjects[i] = [];
                    for (var j = 0; j < this.size; j++) {
                        this.fieldObjects[i][j] = [];
                    }
                }
                this.bottomRightFieldX = this.size - 1 - this.viewport.right;
                this.bottomRightFieldY = this.size - 1 - this.viewport.bottom;
                this.setDimensions();
            }
        };
        /**
         * Redraw everything.
         */
        CanvasBoard.prototype.redraw = function () {
            var _this = this;
            try {
                // redraw layers
                Object.keys(this.layers).forEach(function (layer) {
                    _this.layers[layer].clear(_this);
                    _this.layers[layer].initialDraw(_this);
                });
                // redraw field objects
                for (var x = 0; x < this.size; x++) {
                    for (var y = 0; y < this.size; y++) {
                        drawField(this, x, y);
                    }
                }
                // redraw custom objects
                for (var i = 0; i < this.customObjects.length; i++) {
                    var obj = this.customObjects[i];
                    var handler = obj.handler;
                    for (var layer in handler) {
                        this.layers[layer].draw(handler[layer].draw, obj, this);
                    }
                }
            }
            catch (err) {
                // If the board is too small some canvas painting function can throw an exception, but we don't
                // want to break our app
                console.error("WGo board failed to render. Error: " + err.message);
            }
        };
        /**
           * Redraw just one layer. Use in special cases, when you know, that only that layer needs to be redrawn.
           * For complete redrawing use method redraw().
           */
        CanvasBoard.prototype.redrawLayer = function (layer) {
            this.layers[layer].clear(this);
            this.layers[layer].initialDraw(this);
            for (var x = 0; x < this.size; x++) {
                for (var y = 0; y < this.size; y++) {
                    for (var z = 0; z < this.fieldObjects[x][y].length; z++) {
                        var obj = this.fieldObjects[x][y][z];
                        var handler = void 0;
                        if (!obj.type) {
                            handler = themeVariable('stoneHandler', this);
                        }
                        else if (typeof obj.type === 'string') {
                            handler = themeVariable('markupHandlers', this)[obj.type];
                        }
                        else {
                            handler = obj.type;
                        }
                        if (handler[layer]) {
                            this.layers[layer].drawField(handler[layer].draw, obj, this);
                        }
                    }
                }
            }
            for (var i = 0; i < this.customObjects.length; i++) {
                var obj = this.customObjects[i];
                var handler = obj.handler;
                if (handler[layer]) {
                    this.layers[layer].draw(handler[layer].draw, obj, this);
                }
            }
        };
        /**
           * Get absolute X coordinate
           *
           * @param {number} x relative coordinate
           */
        CanvasBoard.prototype.getX = function (x) {
            return this.left + x * this.fieldWidth;
        };
        /**
           * Get absolute Y coordinate
           *
           * @param {number} y relative coordinate
           */
        CanvasBoard.prototype.getY = function (y) {
            return this.top + y * this.fieldHeight;
        };
        /**
           * Add layer to the board. It is meant to be only for canvas layers.
           *
           * @param {CanvasBoard.CanvasLayer} layer to add
           * @param {number} weight layer with biggest weight is on the top
           */
        CanvasBoard.prototype.addLayer = function (layer, weight) {
            layer.appendTo(this.element, weight);
        };
        /**
           * Remove layer from the board.
           *
           * @param {CanvasBoard.CanvasLayer} layer to remove
           */
        CanvasBoard.prototype.removeLayer = function (layer) {
            layer.removeFrom(this.element);
        };
        CanvasBoard.prototype.update = function (fieldObjects) {
            var changes = this.getChanges(fieldObjects);
            if (!changes) {
                return;
            }
            for (var i = 0; i < changes.remove.length; i++) {
                this.removeObject(changes.remove[i]);
            }
            for (var i = 0; i < changes.add.length; i++) {
                this.addObject(changes.add[i]);
            }
        };
        CanvasBoard.prototype.getChanges = function (fieldObjects) {
            if (fieldObjects === this.fieldObjects) {
                return null;
            }
            var add = [];
            var remove = [];
            for (var x = 0; x < this.size; x++) {
                if (fieldObjects[x] !== this.fieldObjects[x]) {
                    for (var y = 0; y < this.size; y++) {
                        // tslint:disable-next-line:max-line-length
                        if (fieldObjects[x][y] !== this.fieldObjects[x][y] && (fieldObjects[x][y].length || this.fieldObjects[x][y].length)) {
                            add = add.concat(fieldObjects[x][y].filter(objectMissing(this.fieldObjects[x][y])));
                            remove = remove.concat(this.fieldObjects[x][y].filter(objectMissing(fieldObjects[x][y])));
                        }
                    }
                }
            }
            return { add: add, remove: remove };
        };
        CanvasBoard.prototype.addObject = function (obj) {
            // handling multiple objects
            if (obj.constructor === Array) {
                for (var i = 0; i < obj.length; i++) {
                    this.addObject(obj[i]);
                }
                return;
            }
            // TODO: should be warning or error
            if (obj.x < 0 || obj.y < 0 || obj.x >= this.size || obj.y >= this.size) {
                return;
            }
            try {
                // clear all objects on object's coordinates
                clearField(this, obj.x, obj.y);
                // if object of this type is on the board, replace it
                var layers = this.fieldObjects[obj.x][obj.y];
                for (var z = 0; z < layers.length; z++) {
                    if (layers[z].type === obj.type) {
                        layers[z] = obj;
                        drawField(this, obj.x, obj.y);
                        return;
                    }
                }
                // if object is a stone, add it at the beginning, otherwise at the end
                if (!obj.type) {
                    layers.unshift(obj);
                }
                else {
                    layers.push(obj);
                }
                // draw all objects
                drawField(this, obj.x, obj.y);
            }
            catch (err) {
                // If the board is too small some canvas painting function can throw an exception,
                // but we don't want to break our app
                console.error('WGo board failed to render. Error: ' + err.message);
            }
        };
        CanvasBoard.prototype.removeObject = function (obj) {
            // handling multiple objects
            if (obj.constructor === Array) {
                for (var n = 0; n < obj.length; n++) {
                    this.removeObject(obj[n]);
                }
                return;
            }
            if (obj.x < 0 || obj.y < 0 || obj.x >= this.size || obj.y >= this.size) {
                return;
            }
            try {
                var i = void 0;
                for (var j = 0; j < this.fieldObjects[obj.x][obj.y].length; j++) {
                    if (this.fieldObjects[obj.x][obj.y][j].type === obj.type) {
                        i = j;
                        break;
                    }
                }
                if (i == null) {
                    return;
                }
                // clear all objects on object's coordinates
                clearField(this, obj.x, obj.y);
                this.fieldObjects[obj.x][obj.y].splice(i, 1);
                drawField(this, obj.x, obj.y);
            }
            catch (err) {
                // If the board is too small some canvas painting function can throw an exception,
                // but we don't want to break our app
                console.error('WGo board failed to render. Error: ' + err.message);
            }
        };
        CanvasBoard.prototype.removeObjectsAt = function (x, y) {
            if (!this.fieldObjects[x][y].length) {
                return;
            }
            clearField(this, x, y);
            this.fieldObjects[x][y] = [];
        };
        CanvasBoard.prototype.removeAllObjects = function () {
            this.fieldObjects = [];
            for (var i = 0; i < this.size; i++) {
                this.fieldObjects[i] = [];
                for (var j = 0; j < this.size; j++) {
                    this.fieldObjects[i][j] = [];
                }
            }
            this.redraw();
        };
        CanvasBoard.prototype.addCustomObject = function (handler, args) {
            this.customObjects.push({ handler: handler, args: args });
            this.redraw();
        };
        CanvasBoard.prototype.removeCustomObject = function (handler, args) {
            for (var i = 0; i < this.customObjects.length; i++) {
                var obj = this.customObjects[i];
                if (obj.handler === handler && obj.args === args) {
                    this.customObjects.splice(i, 1);
                    this.redraw();
                    return true;
                }
            }
            return false;
        };
        return CanvasBoard;
    }(EventEmitter));
    //# sourceMappingURL=CanvasBoard.js.map

    //# sourceMappingURL=index.js.map

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
    var rules = {
        Japanese: JAPANESE_RULES,
        GOE: ING_RULES,
        NZ: ING_RULES,
        AGA: CHINESE_RULES,
        Chinese: CHINESE_RULES,
    };
    //# sourceMappingURL=rules.js.map

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
    //# sourceMappingURL=Position.js.map

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
    //# sourceMappingURL=Game.js.map

    //# sourceMappingURL=index.js.map

    // All public API is exported here
    //# sourceMappingURL=index.js.map

    exports.CHINESE_RULES = CHINESE_RULES;
    exports.CanvasBoard = CanvasBoard;
    exports.Game = Game;
    exports.ING_RULES = ING_RULES;
    exports.JAPANESE_RULES = JAPANESE_RULES;
    exports.NO_RULES = NO_RULES;
    exports.Position = Position;
    exports.SGFParser = SGFParser;
    exports.SGFSyntaxError = SGFSyntaxError;
    exports.defaultConfig = canvasBoardDefaultConfig;
    exports.drawHandlers = index;
    exports.goRules = rules;
    exports.themes = index$1;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.js.map
