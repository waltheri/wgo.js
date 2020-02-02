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
     * @class
     * Implements one layer of the HTML5 canvas
     */
    var CanvasLayer = /** @class */ (function () {
        function CanvasLayer(board) {
            this.board = board;
            this.init();
        }
        CanvasLayer.prototype.init = function () {
            this.element = document.createElement('canvas');
            this.element.style.position = 'absolute';
            // this.element.style.zIndex = weight.toString(10);
            this.element.style.width = '100%';
            this.element.style.height = '100%';
            this.context = this.element.getContext('2d');
            this.context.scale(this.board.pixelRatio, this.board.pixelRatio);
            this.context.save();
            this.board.boardElement.appendChild(this.element);
        };
        CanvasLayer.prototype.resize = function (width, height) {
            var linesShift = this.board.config.theme.linesShift;
            this.element.width = width;
            this.element.height = height;
            this.context.transform(1, 0, 0, 1, linesShift, linesShift);
        };
        CanvasLayer.prototype.draw = function (drawingFn, args) {
            try {
                this.context.save();
                drawingFn(this.context, args, this.board);
                this.context.restore();
            }
            catch (err) {
                // If the board is too small some canvas painting function can throw an exception, but we don't
                // want to break our app
                // tslint:disable-next-line:no-console
                console.error("Object couldn't be rendered. Error: " + err.message, args);
            }
        };
        CanvasLayer.prototype.drawField = function (drawingFn, args) {
            try {
                var leftOffset = this.board.getX(args.field.x);
                var topOffset = this.board.getY(args.field.y);
                // create a "sandbox" for drawing function
                this.context.save();
                this.context.transform(this.board.fieldSize - 1, 0, 0, this.board.fieldSize - 1, leftOffset, topOffset);
                this.context.beginPath();
                this.context.rect(-0.5, -0.5, 1, 1);
                this.context.clip();
                drawingFn(this.context, args, this.board);
                // restore context
                this.context.restore();
            }
            catch (err) {
                // If the board is too small some canvas painting function can throw an exception, but we don't
                // want to break our app
                // tslint:disable-next-line:no-console
                console.error("Object couldn't be rendered. Error: " + err.message, args);
            }
        };
        CanvasLayer.prototype.clear = function () {
            this.context.clearRect(0, 0, this.element.width, this.element.height);
        };
        CanvasLayer.prototype.clearField = function (field) {
            var leftOffset = this.board.getX(field.x);
            var topOffset = this.board.getY(field.y);
            this.context.clearRect(leftOffset - this.board.fieldSize / 2, topOffset - this.board.fieldSize / 2, this.board.fieldSize, this.board.fieldSize);
        };
        return CanvasLayer;
    }());
    //# sourceMappingURL=CanvasLayer.js.map

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
        ShadowLayer.prototype.resize = function (width, height) {
            _super.prototype.resize.call(this, width, height);
            this.context.transform(1, 0, 0, 1, this.board.config.theme.shadowOffsetX * this.board.fieldSize, this.board.config.theme.shadowOffsetY * this.board.fieldSize);
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
    function shadow (canvasCtx, args, board) {
        var stoneRadius = board.config.theme.stoneSize;
        var blur = board.config.theme.shadowBlur;
        var startRadius = Math.max(stoneRadius - stoneRadius * blur, 0.00001);
        var stopRadius = stoneRadius + (1 / 7 * stoneRadius) * blur;
        var gradient = canvasCtx.createRadialGradient(0, 0, startRadius, 0, 0, stopRadius);
        gradient.addColorStop(0, board.config.theme.shadowColor);
        gradient.addColorStop(1, board.config.theme.shadowTransparentColor);
        canvasCtx.beginPath();
        canvasCtx.fillStyle = gradient;
        canvasCtx.arc(0, 0, stopRadius, 0, 2 * Math.PI, true);
        canvasCtx.fill();
    }
    //# sourceMappingURL=stoneShadow.js.map

    var shellStoneBlack = {
        drawField: {
            stone: function (canvasCtx, args, board) {
                var stoneRadius = board.config.theme.stoneSize;
                canvasCtx.beginPath();
                canvasCtx.fillStyle = '#000';
                canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
                canvasCtx.fill();
                var radGrad = canvasCtx.createRadialGradient(0.4 * stoneRadius, 0.4 * stoneRadius, 0, 0.5 * stoneRadius, 0.5 * stoneRadius, stoneRadius);
                radGrad.addColorStop(0, 'rgba(32,32,32,1)');
                radGrad.addColorStop(1, 'rgba(0,0,0,0)');
                canvasCtx.beginPath();
                canvasCtx.fillStyle = radGrad;
                canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
                canvasCtx.fill();
                radGrad = canvasCtx.createRadialGradient(-0.4 * stoneRadius, -0.4 * stoneRadius, 0.05 * stoneRadius, -0.5 * stoneRadius, -0.5 * stoneRadius, 1.5 * stoneRadius);
                radGrad.addColorStop(0, 'rgba(64,64,64,1)');
                radGrad.addColorStop(1, 'rgba(0,0,0,0)');
                canvasCtx.beginPath();
                canvasCtx.fillStyle = radGrad;
                canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
                canvasCtx.fill();
            },
            shadow: shadow,
        },
    };
    //# sourceMappingURL=shellStoneBlack.js.map

    // shell stone helping functions
    var shellSeed = Math.ceil(Math.random() * 9999999);
    // tslint:disable-next-line:max-line-length
    var drawShellLine = function (ctx, x, y, r, startAngle, endAngle, factor, thickness) {
        ctx.strokeStyle = 'rgba(64,64,64,0.2)';
        ctx.lineWidth = (r / 30) * thickness;
        ctx.beginPath();
        var radius = r * 0.9;
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
    var shellStoneWhite = {
        drawField: {
            stone: function (canvasCtx, args, board) {
                var stoneRadius = board.config.theme.stoneSize;
                canvasCtx.beginPath();
                canvasCtx.fillStyle = '#aaa';
                canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
                canvasCtx.fill();
                // do shell magic here
                var type = shellSeed % (3 + args.field.x * board.config.size + args.field.y) % 3;
                var z = board.config.size * board.config.size + args.field.x * board.config.size + args.field.y;
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
                var radGrad = canvasCtx.createRadialGradient(-2 * stoneRadius / 5, -2 * stoneRadius / 5, stoneRadius / 3, -stoneRadius / 5, -stoneRadius / 5, 5 * stoneRadius / 5);
                radGrad.addColorStop(0, 'rgba(255,255,255,0.9)');
                radGrad.addColorStop(1, 'rgba(255,255,255,0)');
                // add radial gradient //
                canvasCtx.beginPath();
                canvasCtx.fillStyle = radGrad;
                canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
                canvasCtx.fill();
            },
            shadow: shadow,
        },
    };
    //# sourceMappingURL=shellStoneWhite.js.map

    var glassStoneBlack = {
        // draw handler for stone layer
        drawField: {
            // drawing function - args object contain info about drawing object, board is main board object
            stone: function (canvasCtx, args, board) {
                var stoneRadius = board.config.theme.stoneSize;
                var radgrad = canvasCtx.createRadialGradient(-2 * stoneRadius / 5, -2 * stoneRadius / 5, 1, -stoneRadius / 5, -stoneRadius / 5, 4 * stoneRadius / 5);
                radgrad.addColorStop(0, '#666');
                radgrad.addColorStop(1, '#000');
                canvasCtx.beginPath();
                canvasCtx.fillStyle = radgrad;
                canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
                canvasCtx.fill();
            },
            shadow: shadow,
        },
    };
    //# sourceMappingURL=glassStoneBlack.js.map

    var glassStoneWhite = {
        // draw handler for stone layer
        drawField: {
            // drawing function - args object contain info about drawing object, board is main board object
            stone: function (canvasCtx, args, board) {
                var stoneRadius = board.config.theme.stoneSize;
                var radgrad = canvasCtx.createRadialGradient(-2 * stoneRadius / 5, -2 * stoneRadius / 5, stoneRadius / 3, -stoneRadius / 5, -stoneRadius / 5, 5 * stoneRadius / 5);
                radgrad.addColorStop(0, '#fff');
                radgrad.addColorStop(1, '#aaa');
                canvasCtx.beginPath();
                canvasCtx.fillStyle = radgrad;
                canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
                canvasCtx.fill();
            },
            shadow: shadow,
        },
    };
    //# sourceMappingURL=glassStoneWhite.js.map

    var paintedStoneBlack = {
        drawField: {
            stone: function (canvasCtx, args, board) {
                var stoneRadius = board.config.theme.stoneSize;
                var radGrad = canvasCtx.createRadialGradient(-2 * stoneRadius / 5, -2 * stoneRadius / 5, 1 * stoneRadius / 5, -stoneRadius / 5, -stoneRadius / 5, 4 * stoneRadius / 5);
                radGrad.addColorStop(0, '#111');
                radGrad.addColorStop(1, '#000');
                canvasCtx.beginPath();
                canvasCtx.fillStyle = radGrad;
                canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
                canvasCtx.fill();
                canvasCtx.beginPath();
                canvasCtx.lineWidth = stoneRadius / 6;
                canvasCtx.strokeStyle = '#ccc';
                canvasCtx.arc(-stoneRadius / 8, -stoneRadius / 8, stoneRadius / 2, Math.PI, 1.5 * Math.PI);
                canvasCtx.stroke();
            },
            shadow: shadow,
        },
    };
    //# sourceMappingURL=paintedStoneBlack.js.map

    var paintedStoneWhite = {
        drawField: {
            stone: function (canvasCtx, args, board) {
                var stoneRadius = board.config.theme.stoneSize;
                var radGrad = canvasCtx.createRadialGradient(-2 * stoneRadius / 5, -2 * stoneRadius / 5, 2 * stoneRadius / 5, -stoneRadius / 5, -stoneRadius / 5, 4 * stoneRadius / 5);
                radGrad.addColorStop(0, '#fff');
                radGrad.addColorStop(1, '#ddd');
                canvasCtx.beginPath();
                canvasCtx.fillStyle = radGrad;
                canvasCtx.arc(0, 0, stoneRadius, 0, 2 * Math.PI, true);
                canvasCtx.fill();
                canvasCtx.beginPath();
                canvasCtx.lineWidth = stoneRadius / 6;
                canvasCtx.strokeStyle = '#999';
                canvasCtx.arc(stoneRadius / 8, stoneRadius / 8, stoneRadius / 2, 0, Math.PI / 2, false);
                canvasCtx.stroke();
            },
            shadow: shadow,
        },
    };
    //# sourceMappingURL=paintedStoneWhite.js.map

    function simpleStone (color) {
        return {
            drawField: {
                stone: function (canvasCtx, args, board) {
                    var stoneSize = board.config.theme.stoneSize;
                    var lw = board.config.theme.markupLinesWidth;
                    canvasCtx.fillStyle = color;
                    canvasCtx.beginPath();
                    canvasCtx.arc(0, 0, stoneSize - lw / 2, 0, 2 * Math.PI, true);
                    canvasCtx.fill();
                    canvasCtx.lineWidth = lw;
                    canvasCtx.strokeStyle = 'black';
                    canvasCtx.stroke();
                },
            },
        };
    }
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
    // Shadow handler for the 'REALISTIC' rendering mode
    // handler for image based stones
    function realisticStone (graphic, fallback) {
        var randSeed = Math.ceil(Math.random() * 9999999);
        var redrawRequest;
        return {
            drawField: {
                stone: function (canvasCtx, args, board) {
                    var stoneRadius = board.config.theme.stoneSize;
                    var count = graphic.length;
                    var idx = randSeed % (count + args.field.x * board.config.size + args.field.y) % count;
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
                        stoneGraphic.src = graphic[idx];
                        graphic[idx] = stoneGraphic;
                    }
                    if (isOkay(graphic[idx])) {
                        canvasCtx.drawImage(graphic[idx], -stoneRadius, -stoneRadius, 2 * stoneRadius, 2 * stoneRadius);
                    }
                    else {
                        // Fall back to SHELL handler if there was a problem loading the image
                        fallback.drawField.stone(canvasCtx, args, board);
                    }
                },
            },
            shadow: shadow,
        };
    }
    //# sourceMappingURL=realisticStone.js.map

    var circle = {
        drawField: {
            stone: function (canvasCtx, args, board) {
                var params = args.params || {};
                canvasCtx.strokeStyle = params.color || board.config.theme.markupNoneColor;
                canvasCtx.lineWidth = params.lineWidth || board.config.theme.markupLinesWidth;
                canvasCtx.beginPath();
                canvasCtx.arc(0, 0, 0.25, 0, 2 * Math.PI, true);
                canvasCtx.stroke();
                if (params.fillColor) {
                    canvasCtx.fillStyle = params.fillColor;
                    canvasCtx.fill();
                }
            },
        },
    };
    //# sourceMappingURL=circle.js.map

    var square = {
        drawField: {
            stone: function (canvasCtx, args, board) {
                var params = args.params || {};
                canvasCtx.strokeStyle = params.color || board.config.theme.markupNoneColor;
                canvasCtx.lineWidth = params.lineWidth || board.config.theme.markupLinesWidth;
                canvasCtx.beginPath();
                canvasCtx.rect(-0.25, -0.25, 0.5, 0.5);
                canvasCtx.stroke();
                if (params.fillColor) {
                    canvasCtx.fillStyle = params.fillColor;
                    canvasCtx.fill();
                }
            },
        },
    };
    //# sourceMappingURL=square.js.map

    var triangle = {
        drawField: {
            stone: function (canvasCtx, args, board) {
                var params = args.params || {};
                canvasCtx.strokeStyle = params.color || board.config.theme.markupNoneColor;
                canvasCtx.lineWidth = params.lineWidth || board.config.theme.markupLinesWidth;
                canvasCtx.beginPath();
                canvasCtx.moveTo(0, 0 - 0.25);
                canvasCtx.lineTo(-0.25, 0.166666);
                canvasCtx.lineTo(0.25, 0.166666);
                canvasCtx.closePath();
                canvasCtx.stroke();
                if (params.fillColor) {
                    canvasCtx.fillStyle = params.fillColor;
                    canvasCtx.fill();
                }
            },
        },
    };
    //# sourceMappingURL=triangle.js.map

    var label = {
        drawField: {
            stone: function (canvasCtx, args, board) {
                var params = args.params || {};
                var font = params.font || board.config.theme.font || '';
                canvasCtx.fillStyle = params.color || board.config.theme.markupNoneColor;
                var fontSize = 0.5;
                if (params.text.length === 1) {
                    fontSize = 0.75;
                }
                else if (params.text.length === 2) {
                    fontSize = 0.6;
                }
                canvasCtx.beginPath();
                canvasCtx.textBaseline = 'middle';
                canvasCtx.textAlign = 'center';
                canvasCtx.font = fontSize + "px " + font;
                canvasCtx.fillText(params.text, 0, 0.02 + (fontSize - 0.5) * 0.08, 1);
            },
        },
    };
    //# sourceMappingURL=label.js.map

    var dot = {
        drawField: {
            stone: function (canvasCtx, args, board) {
                var params = args.params || {};
                canvasCtx.fillStyle = params.color || board.config.theme.markupNoneColor;
                canvasCtx.beginPath();
                canvasCtx.rect(-0.5, -0.5, 1, 1);
                canvasCtx.fill();
            },
        },
    };
    //# sourceMappingURL=dot.js.map

    var xMark = {
        drawField: {
            stone: function (canvasCtx, args, board) {
                var params = args.params || {};
                canvasCtx.strokeStyle = params.color || board.config.theme.markupNoneColor;
                canvasCtx.lineWidth = params.lineWidth || board.config.theme.markupLinesWidth * 1.5;
                canvasCtx.lineCap = 'round';
                canvasCtx.beginPath();
                canvasCtx.moveTo(-0.20, -0.20);
                canvasCtx.lineTo(0.20, 0.20);
                canvasCtx.moveTo(0.20, -0.20);
                canvasCtx.lineTo(-0.20, 0.20);
                canvasCtx.stroke();
                canvasCtx.lineCap = 'butt';
            },
        },
    };
    //# sourceMappingURL=xMark.js.map

    var smileyFace = {
        drawField: {
            stone: function (canvasCtx, args, board) {
                var params = args.params || {};
                canvasCtx.strokeStyle = params.color || board.config.theme.markupNoneColor;
                canvasCtx.lineWidth = (params.lineWidth || board.config.theme.markupLinesWidth) * 2;
                canvasCtx.beginPath();
                canvasCtx.arc(-0.5 / 3, -0.5 / 3, 0.5 / 6, 0, 2 * Math.PI, true);
                canvasCtx.stroke();
                canvasCtx.beginPath();
                canvasCtx.arc(0.5 / 3, -0.5 / 3, 0.5 / 6, 0, 2 * Math.PI, true);
                canvasCtx.stroke();
                canvasCtx.beginPath();
                canvasCtx.moveTo(-0.5 / 1.5, 0);
                canvasCtx.bezierCurveTo(-0.5 / 1.5, 0.5 / 2, 0.5 / 1.5, 0.5 / 2, 0.5 / 1.5, 0);
                canvasCtx.stroke();
            },
        },
    };
    //# sourceMappingURL=smileyFace.js.map

    // transparent modificator
    function transparent (drawHandler) {
        return {
            drawField: {
                stone: function (canvasCtx, args, board) {
                    var params = args.params || {};
                    if (params.alpha) {
                        canvasCtx.globalAlpha = params.alpha;
                    }
                    else {
                        canvasCtx.globalAlpha = 0.3;
                    }
                    drawHandler.drawField.stone.call(null, canvasCtx, args, board);
                    canvasCtx.globalAlpha = 1;
                },
            },
        };
    }
    //# sourceMappingURL=transparent.js.map

    // size reducing modifier
    function reduced (drawHandler) {
        return {
            drawField: {
                stone: function (canvasCtx, args, board) {
                    canvasCtx.scale(0.5, 0.5);
                    drawHandler.drawField.stone.call(null, canvasCtx, args, board);
                    canvasCtx.scale(2, 2);
                },
            },
        };
    }
    //# sourceMappingURL=reduced.js.map

    var gridFieldClear = {
        drawField: {
            grid: function (canvasCtx, args, board) {
                var stoneRadius = board.config.theme.stoneSize;
                canvasCtx.clearRect(-stoneRadius, -stoneRadius, 2 * stoneRadius, 2 * stoneRadius);
            },
        },
    };
    //# sourceMappingURL=gridFieldClear.js.map

    //# sourceMappingURL=index.js.map

    var index = /*#__PURE__*/Object.freeze({
        shellStoneBlack: shellStoneBlack,
        shellStoneWhite: shellStoneWhite,
        glassStoneBlack: glassStoneBlack,
        glassStoneWhite: glassStoneWhite,
        paintedStoneBlack: paintedStoneBlack,
        paintedStoneWhite: paintedStoneWhite,
        simpleStone: simpleStone,
        realisticStone: realisticStone,
        circle: circle,
        square: square,
        triangle: triangle,
        label: label,
        dot: dot,
        xMark: xMark,
        smileyFace: smileyFace,
        transparent: transparent,
        reduced: reduced,
        gridFieldClear: gridFieldClear
    });

    /**
     * Draws coordinates on the board
     */
    var coordinatesHandler = {
        drawFree: {
            grid: function (canvasCtx, args, board) {
                var t;
                var params = args.params;
                canvasCtx.fillStyle = params.color;
                canvasCtx.textBaseline = 'middle';
                canvasCtx.textAlign = 'center';
                canvasCtx.font = "" + (params.bold ? 'bold ' : '') + board.fieldSize / 2 + "px " + (board.config.theme.font || '');
                var xright = board.getX(-0.75);
                var xleft = board.getX(board.config.size - 0.25);
                var ytop = board.getY(-0.75);
                var ybottom = board.getY(board.config.size - 0.25);
                var coordinatesX = params.x;
                var coordinatesY = params.y;
                for (var i = 0; i < board.config.size; i++) {
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

    var gridHandler = {
        drawFree: {
            grid: function (canvasCtx, args, board) {
                // draw grid
                var tmp;
                var params = args.params;
                canvasCtx.beginPath();
                canvasCtx.lineWidth = params.linesWidth * board.fieldSize;
                canvasCtx.strokeStyle = params.linesColor;
                var tx = Math.round(board.getX(0));
                var ty = Math.round(board.getY(0));
                var bw = Math.round((board.config.size - 1) * board.fieldSize);
                var bh = Math.round((board.config.size - 1) * board.fieldSize);
                canvasCtx.strokeRect(tx, ty, bw, bh);
                for (var i = 1; i < board.config.size - 1; i++) {
                    tmp = Math.round(board.getX(i));
                    canvasCtx.moveTo(tmp, ty);
                    canvasCtx.lineTo(tmp, ty + bh);
                    tmp = Math.round(board.getY(i));
                    canvasCtx.moveTo(tx, tmp);
                    canvasCtx.lineTo(tx + bw, tmp);
                }
                canvasCtx.stroke();
                // draw stars
                canvasCtx.fillStyle = params.starColor;
                if (board.config.starPoints[board.config.size]) {
                    for (var key in board.config.starPoints[board.config.size]) {
                        canvasCtx.beginPath();
                        canvasCtx.arc(board.getX(board.config.starPoints[board.config.size][key].x), board.getY(board.config.starPoints[board.config.size][key].y), params.starSize * board.fieldSize, 0, 2 * Math.PI, true);
                        canvasCtx.fill();
                    }
                }
            },
        },
    };
    //# sourceMappingURL=grid.js.map

    var baseTheme = {
        // basic
        stoneSize: 0.47,
        // markup
        markupBlackColor: 'rgba(255,255,255,0.9)',
        markupWhiteColor: 'rgba(0,0,0,0.7)',
        markupNoneColor: 'rgba(0,0,0,0.7)',
        markupLinesWidth: 0.05,
        // shadows
        shadowColor: 'rgba(62,32,32,0.5)',
        shadowTransparentColor: 'rgba(62,32,32,0)',
        shadowBlur: 0.25,
        shadowOffsetX: 0.08,
        shadowOffsetY: 0.16,
        // other
        font: 'calibri',
        linesShift: -0.5,
        backgroundColor: '#CEB053',
        backgroundImage: '',
        // grid
        grid: {
            handler: gridHandler,
            params: {
                linesWidth: 0.03,
                linesColor: '#654525',
                starColor: '#531',
                starSize: 0.07,
            },
        },
        // coordinates
        coordinates: {
            handler: coordinatesHandler,
            params: {
                color: '#531',
                bold: false,
                x: 'ABCDEFGHJKLMNOPQRSTUVWXYZ',
                y: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
            },
        },
        drawHandlers: {
            B: simpleStone('#222'),
            W: simpleStone('#eee'),
            CR: circle,
            LB: label,
            SQ: square,
            TR: triangle,
            MA: xMark,
            SL: dot,
            SM: smileyFace,
            gridFieldClear: gridFieldClear,
        },
    };

    var realisticTheme = __assign({}, baseTheme, { font: 'calibri', backgroundImage: '', drawHandlers: __assign({}, baseTheme.drawHandlers, { B: realisticStone([
                'stones/black00_128.png',
                'stones/black01_128.png',
                'stones/black02_128.png',
                'stones/black03_128.png',
            ], shellStoneBlack), W: realisticStone([
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
            ], shellStoneWhite) }) });
    //# sourceMappingURL=realisticTheme.js.map

    var modernTheme = __assign({}, baseTheme, { font: 'calibri', backgroundImage: '', drawHandlers: __assign({}, baseTheme.drawHandlers, { B: shellStoneBlack, W: shellStoneWhite }) });
    //# sourceMappingURL=modernTheme.js.map

    // add here all themes, which should be publicly exposed
    //# sourceMappingURL=index.js.map

    var index$1 = /*#__PURE__*/Object.freeze({
        baseTheme: baseTheme,
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
        theme: baseTheme,
        marginSize: 0.25,
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
    function isSameField(field1, field2) {
        return field1.x === field2.x && field1.y === field2.y;
    }
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
            _this.objects = [];
            // merge user config with default
            _this.config = makeConfig(canvasBoardDefaultConfig, config);
            // init board html
            _this.init(elem);
            // set the pixel ratio for HDPI (e.g. Retina) screens
            _this.pixelRatio = window.devicePixelRatio || 1;
            _this.resize();
            return _this;
        }
        /**
         * Initialization method, it is called in constructor. You shouldn't call it, but you can alter it.
         */
        CanvasBoard.prototype.init = function (elem) {
            this.element = document.createElement('div');
            this.element.className = 'wgo-board';
            this.element.style.position = 'relative';
            elem.appendChild(this.element);
            this.boardElement = document.createElement('div');
            this.boardElement.style.position = 'absolute';
            this.boardElement.style.left = '0';
            this.boardElement.style.top = '0';
            this.boardElement.style.right = '0';
            this.boardElement.style.bottom = '0';
            this.boardElement.style.margin = 'auto';
            this.element.appendChild(this.boardElement);
            this.layers = {
                grid: new CanvasLayer(this),
                shadow: new ShadowLayer(this),
                stone: new CanvasLayer(this),
            };
        };
        /**
         * Updates dimensions and redraws everything
         */
        CanvasBoard.prototype.resize = function () {
            var _this = this;
            var countX = this.config.size - this.config.viewport.left - this.config.viewport.right;
            var countY = this.config.size - this.config.viewport.top - this.config.viewport.bottom;
            var topOffset = this.config.marginSize + (this.config.coordinates && !this.config.viewport.top ? 0.5 : 0);
            var rightOffset = this.config.marginSize + (this.config.coordinates && !this.config.viewport.right ? 0.5 : 0);
            var bottomOffset = this.config.marginSize + (this.config.coordinates && !this.config.viewport.bottom ? 0.5 : 0);
            var leftOffset = this.config.marginSize + (this.config.coordinates && !this.config.viewport.left ? 0.5 : 0);
            if (this.config.width && this.config.height) {
                // exact dimensions
                this.width = this.config.width * this.pixelRatio;
                this.height = this.config.height * this.pixelRatio;
                this.fieldSize = Math.min(this.width / (countX + leftOffset + rightOffset), this.height / (countY + topOffset + bottomOffset));
                if (this.resizeCallback) {
                    window.removeEventListener('resize', this.resizeCallback);
                }
            }
            else if (this.config.width) {
                this.width = this.config.width * this.pixelRatio;
                this.fieldSize = this.width / (countX + leftOffset + rightOffset);
                this.height = this.fieldSize * (countY + topOffset + bottomOffset);
                if (this.resizeCallback) {
                    window.removeEventListener('resize', this.resizeCallback);
                }
            }
            else if (this.config.height) {
                this.height = this.config.height * this.pixelRatio;
                this.fieldSize = this.height / (countY + topOffset + bottomOffset);
                this.width = this.fieldSize * (countX + leftOffset + rightOffset);
                if (this.resizeCallback) {
                    window.removeEventListener('resize', this.resizeCallback);
                }
            }
            else {
                this.element.style.width = 'auto';
                this.width = this.element.offsetWidth * this.pixelRatio;
                this.fieldSize = this.width / (countX + leftOffset + rightOffset);
                this.height = this.fieldSize * (countY + topOffset + bottomOffset);
                if (!this.resizeCallback) {
                    this.resizeCallback = function () {
                        _this.resize();
                    };
                    window.addEventListener('resize', this.resizeCallback);
                }
            }
            this.leftOffset = this.fieldSize * (leftOffset + 0.5 - this.config.viewport.left);
            this.topOffset = this.fieldSize * (topOffset + 0.5 - this.config.viewport.top);
            this.element.style.width = (this.width / this.pixelRatio) + "px";
            this.element.style.height = (this.height / this.pixelRatio) + "px";
            var boardWidth = (countX + leftOffset + rightOffset) * this.fieldSize;
            var boardHeight = (countY + topOffset + bottomOffset) * this.fieldSize;
            this.boardElement.style.width = (boardWidth / this.pixelRatio) + "px";
            this.boardElement.style.height = (boardHeight / this.pixelRatio) + "px";
            Object.keys(this.layers).forEach(function (layer) {
                _this.layers[layer].resize(boardWidth, boardHeight);
            });
            this.redraw();
        };
        /**
           * Get absolute X coordinate
           *
           * @param {number} x relative coordinate
           */
        CanvasBoard.prototype.getX = function (x) {
            return this.leftOffset + x * this.fieldSize;
        };
        /**
           * Get absolute Y coordinate
           *
           * @param {number} y relative coordinate
           */
        CanvasBoard.prototype.getY = function (y) {
            return this.topOffset + y * this.fieldSize;
        };
        /**
         * Sets width of the board, height will be automatically computed. Then everything will be redrawn.
         *
         * @param width
         */
        CanvasBoard.prototype.setWidth = function (width) {
            this.config.width = width;
            this.config.height = 0;
            this.resize();
        };
        /**
         * Sets height of the board, width will be automatically computed. Then everything will be redrawn.
         *
         * @param height
         */
        CanvasBoard.prototype.setHeight = function (height) {
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
        CanvasBoard.prototype.setDimensions = function (width, height) {
            this.config.width = width;
            this.config.height = height;
            this.resize();
        };
        /**
           * Get currently visible section of the board
           */
        CanvasBoard.prototype.getViewport = function () {
            return this.config.viewport;
        };
        /**
           * Set section of the board to be displayed
           */
        CanvasBoard.prototype.setViewport = function (viewport) {
            this.config.viewport = viewport;
            this.resize();
        };
        CanvasBoard.prototype.getSize = function () {
            return this.config.size;
        };
        CanvasBoard.prototype.setSize = function (size) {
            if (size === void 0) { size = 19; }
            if (size !== this.config.size) {
                this.config.size = size;
                this.resize();
            }
        };
        CanvasBoard.prototype.getCoordinates = function () {
            return this.config.coordinates;
        };
        CanvasBoard.prototype.setCoordinates = function (coordinates) {
            if (this.config.coordinates !== coordinates) {
                this.config.coordinates = coordinates;
                this.resize();
            }
        };
        CanvasBoard.prototype.getObjectHandler = function (boardObject) {
            return boardObject.type ? this.config.theme.drawHandlers[boardObject.type] : boardObject.handler;
        };
        /**
         * Redraw everything.
         */
        CanvasBoard.prototype.redraw = function () {
            var _this = this;
            // set correct background
            this.boardElement.style.backgroundColor = this.config.theme.backgroundColor;
            if (this.config.theme.backgroundImage) {
                this.boardElement.style.backgroundImage = "url(\"" + this.config.theme.backgroundImage + "\")";
            }
            // redraw all layers
            Object.keys(this.layers).forEach(function (layer) {
                _this.redrawLayer(layer);
            });
        };
        /**
           * Redraw just one layer. Use in special cases, when you know, that only that layer needs to be redrawn.
           * For complete redrawing use method redraw().
           */
        CanvasBoard.prototype.redrawLayer = function (layer) {
            var _this = this;
            this.layers[layer].clear();
            this.getObjectsToDraw().forEach(function (boardObject) {
                var handler = _this.getObjectHandler(boardObject);
                if ('drawField' in handler && handler.drawField[layer]) {
                    _this.layers[layer].drawField(handler.drawField[layer], boardObject);
                }
                if ('drawFree' in handler && handler.drawFree[layer]) {
                    _this.layers[layer].draw(handler.drawFree[layer], boardObject);
                }
            });
        };
        /**
         * Add board object. Main function for adding graphics on the board.
         *
         * @param boardObject
         */
        CanvasBoard.prototype.addObject = function (boardObject) {
            var _this = this;
            // handling multiple objects
            if (Array.isArray(boardObject)) {
                for (var i = 0; i < boardObject.length; i++) {
                    this.addObject(boardObject[i]);
                }
                return;
            }
            var handler = this.getObjectHandler(boardObject);
            if (!handler) {
                throw new TypeError('Board object has invalid or missing `handler` draw function and cannot be added.');
            }
            if ('drawField' in handler) {
                if (!('field' in boardObject)) {
                    throw new TypeError('Board object has field draw `handler` but `field` property is missing.');
                }
                this.objects.push(boardObject);
                Object.keys(this.layers).forEach(function (layer) {
                    if (handler.drawField[layer]) {
                        _this.layers[layer].drawField(handler.drawField[layer], boardObject);
                    }
                });
            }
            if ('drawFree' in handler) {
                this.objects.push(boardObject);
                Object.keys(this.layers).forEach(function (layer) {
                    if (handler.drawFree[layer]) {
                        _this.layers[layer].draw(handler.drawFree[layer], boardObject);
                    }
                });
            }
        };
        /**
         * Shortcut method to add field object.
         */
        CanvasBoard.prototype.addFieldObject = function (x, y, handler, params) {
            var object = {
                field: { x: x, y: y },
                params: params,
            };
            if (typeof handler === 'string') {
                object.type = handler;
            }
            else {
                object.handler = handler;
            }
            this.addObject(object);
        };
        /**
         * Remove board object. Main function for removing graphics on the board.
         *
         * @param boardObject
         */
        CanvasBoard.prototype.removeObject = function (boardObject) {
            var _this = this;
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
            var objects = this.getObjectsToDraw();
            var objectHandler = this.getObjectHandler(boardObject);
            var handlers = objects.map(function (obj) { return _this.getObjectHandler(obj); });
            Object.keys(this.layers).forEach(function (layer) {
                // if there is a free object affecting the layer, we must redraw layer completely
                _this.redrawLayer(layer);
                /*const affectsCurrentLayer = affectsLayer(layer);
                if (affectsCurrentLayer(objectHandler) || handlers.some(affectsCurrentLayer)) {
                  this.redrawLayer(layer);
                  return;
                }
          
                this.layers[layer].clearField((boardObject as BoardFieldObject).field);
          
                for (let i = 0; i < objects.length; i++) {
                  const obj = objects[i];
                  if ('field' in obj && isSameField(obj.field, (boardObject as BoardFieldObject).field)) {
                    const handler = handlers[i];
                    if ('drawField' in handler && handler.drawField[layer]) {
                      this.layers[layer].drawField(handler.drawField[layer], obj);
                    }
                  }
                }*/
            });
        };
        /**
         * Shortcut method to remove field object.
         */
        CanvasBoard.prototype.removeFieldObject = function (x, y, handler) {
            var toRemove = [];
            var field = { x: x, y: y };
            this.objects.forEach(function (obj) {
                if ('field' in obj && isSameField(obj.field, field) && (obj.handler === handler || obj.type === handler)) {
                    toRemove.push(obj);
                }
            });
            this.removeObject(toRemove);
        };
        CanvasBoard.prototype.removeObjectsAt = function (x, y) {
            var toRemove = [];
            var field = { x: x, y: y };
            this.objects.forEach(function (obj) {
                if ('field' in obj && isSameField(obj.field, field)) {
                    toRemove.push(obj);
                }
            });
            this.removeObject(toRemove);
        };
        CanvasBoard.prototype.removeAllObjects = function () {
            this.objects = [];
            this.redraw();
        };
        CanvasBoard.prototype.getObjectsToDraw = function () {
            // add grid
            var fixedObjects = [this.config.theme.grid];
            // add coordinates
            if (this.config.coordinates) {
                fixedObjects.push(this.config.theme.coordinates);
            }
            return fixedObjects.concat(this.objects);
        };
        CanvasBoard.prototype.on = function (type, callback) {
            _super.prototype.on.call(this, type, callback);
            this.registerBoardListener(type);
        };
        CanvasBoard.prototype.registerBoardListener = function (type) {
            var _this = this;
            this.boardElement.addEventListener(type, function (evt) {
                if (evt.layerX != null) {
                    var pos = _this.getRelativeCoordinates(evt.layerX, evt.layerY);
                    _this.emit(type, evt, pos);
                }
                else {
                    _this.emit(type, evt);
                }
            });
        };
        CanvasBoard.prototype.getRelativeCoordinates = function (absoluteX, absoluteY) {
            // new hopefully better translation of coordinates
            var x = Math.round((absoluteX * this.pixelRatio - this.leftOffset) / this.fieldSize);
            var y = Math.round((absoluteY * this.pixelRatio - this.topOffset) / this.fieldSize);
            if (x < 0 || x >= this.config.size || y < 0 || y >= this.config.size) {
                return null;
            }
            return { x: x, y: y };
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
    var goRules = {
        Japanese: JAPANESE_RULES,
        GOE: ING_RULES,
        NZ: ING_RULES,
        AGA: CHINESE_RULES,
        Chinese: CHINESE_RULES,
    };
    //# sourceMappingURL=rules.js.map

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

    var playerDefaultConfig = {
        boardTheme: canvasBoardDefaultConfig.theme,
        sgf: null,
    };
    //# sourceMappingURL=defaultConfig.js.map

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
        read: function (str) { return (str === 'w' || str === 'W' ? Color.WHITE : Color.BLACK); },
        write: function (value) { return (value === Color.WHITE ? 'W' : 'B'); },
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
    var LINE_SEGMENT = {
        read: function (str) { return ({
            point1: {
                x: str.charCodeAt(0) - 97,
                y: str.charCodeAt(1) - 97,
            },
            point2: {
                x: str.charCodeAt(3) - 97,
                y: str.charCodeAt(4) - 97,
            },
        }); },
        write: function (value) { return (
        // tslint:disable-next-line:max-line-length
        String.fromCharCode(value.point1.x + 97) + String.fromCharCode(value.point1.y + 97) + ":" + (String.fromCharCode(value.point2.x + 97) + String.fromCharCode(value.point2.y + 97))); },
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
        transformer: LINE_SEGMENT,
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
    propertyValueTypes.VW = {
        transformer: POINT,
        multiple: true,
        notEmpty: false,
    };
    //# sourceMappingURL=propertyValueTypes.js.map

    var processJSGF = function (gameTree) {
        var rootNode = new KifuNode();
        rootNode.setSGFProperties(gameTree.sequence[0] || {});
        var lastNode = rootNode;
        for (var i = 1; i < gameTree.sequence.length; i++) {
            var node = new KifuNode();
            node.setSGFProperties(gameTree.sequence[i]);
            lastNode.appendChild(node);
            lastNode = node;
        }
        for (var i = 0; i < gameTree.children.length; i++) {
            lastNode.appendChild(processJSGF(gameTree.children[i]));
        }
        return rootNode;
    };
    /**
     * Class representing one kifu node.
     */
    var KifuNode = /** @class */ (function () {
        function KifuNode() {
            this.parent = null;
            this.children = [];
            this.SGFProperties = {};
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
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(KifuNode.prototype, "innerSGF", {
            /*set innerSGF(sgf: string) {
              this.setFromSGF(sgf);
            }*/
            get: function () {
                var output = ';';
                for (var propIdent in this.SGFProperties) {
                    if (this.SGFProperties.hasOwnProperty(propIdent)) {
                        output += propIdent + this.getSGFProperty(propIdent);
                    }
                }
                if (this.children.length === 1) {
                    return output + ";" + this.children[0].innerSGF;
                }
                if (this.children.length > 1) {
                    return this.children.reduce(function (prev, current) { return prev + "(;" + current.innerSGF + ")"; }, output);
                }
                return output;
            },
            enumerable: true,
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
         * Hard clones a KNode and all of its contents.
         *
         * @param {boolean}  appendToParent if set true, cloned node will be appended to this parent.
         * @returns {KifuNode}  cloned node
         */
        /*cloneNode(appendToParent?: boolean): KNode {
          const node = new KNode();
          node.innerSGF = this.innerSGF;
      
          if (appendToParent && this.parent) {
            this.parent.appendChild(node);
          }
      
          return node;
        }*/
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
        /// BASIC PROPERTY GETTER and SETTER
        /**
         * Gets property by SGF property identificator. Returns property value (type depends on property type)
         *
         * @param   {string}   propIdent - SGF property idetificator
         * @returns {any}    property value or values or undefined, if property is missing.
         */
        KifuNode.prototype.getProperty = function (propIdent) {
            return this.SGFProperties[propIdent];
        };
        /**
         * Sets property by SGF property identificator.
         *
         * @param   {string}  propIdent - SGF property idetificator
         * @param   {any}     value - property value or values
         */
        KifuNode.prototype.setProperty = function (propIdent, value) {
            if (value == null) {
                delete this.SGFProperties[propIdent];
            }
            else {
                this.SGFProperties[propIdent] = value;
            }
            return this;
        };
        /// SGF RAW METHODS
        /**
         * Gets one SGF property value as string (with brackets `[` and `]`).
         *
         * @param   {string} propIdent SGF property identificator.
         * @returns {string[]} Array of SGF property values or null if there is not such property.
         */
        KifuNode.prototype.getSGFProperty = function (propIdent) {
            if (this.SGFProperties[propIdent] != null) {
                var propertyValueType_1 = propertyValueTypes[propIdent] || propertyValueTypes._default;
                if (Array.isArray(this.SGFProperties[propIdent])) {
                    return this.SGFProperties[propIdent].map(function (propValue) { return propertyValueType_1.transformer.write(propValue).replace(/\]/g, '\\]'); });
                }
                return [propertyValueType_1.transformer.write(this.SGFProperties[propIdent]).replace(/\]/g, '\\]')];
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
            if (propValues == null) {
                delete this.SGFProperties[propIdent];
                return this;
            }
            if (propertyValueType.multiple) {
                this.SGFProperties[propIdent] = propValues.map(function (val) { return propertyValueType.transformer.read(val); });
            }
            else {
                this.SGFProperties[propIdent] = propertyValueType.transformer.read(propValues[0]);
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
         * Sets properties of Kifu node based on the sgf string. Usually you won't use this method directly,
         * but use innerSGF property instead.
         *
         * Basically it parsers the sgf, takes properties from it and adds them to the node.
         * Then if there are other nodes in the string, they will be appended to the node as well.
         *
         * @param {string} sgf SGF text for current node. It must be without trailing `;`,
         *                     however it can contain following nodes.
         * @throws {SGFSyntaxError} throws exception, if sgf string contains invalid SGF.
         */
        /*setFromSGF(sgf: string) {
          // clean up
          for (let i = this.children.length - 1; i >= 0; i--) {
            this.removeChild(this.children[i]);
          }
          this.SGFProperties = {};
      
          // sgf sequence to parse must start with ;
          const sgfSequence = sgf[0] === ';' ? sgf : `;${sgf}`;
      
          const parser = new SGFParser(sgfSequence);
      
          const sequence = parser.parseSequence();
        }*/
        /**
         * Transforms KNode object to standard SGF string.
         */
        KifuNode.prototype.toSGF = function () {
            return "(" + this.innerSGF + ")";
        };
        /**
         * Creates KNode object from SGF transformed to JavaScript object.
         * @param gameTree
         */
        KifuNode.fromJS = function (gameTree) {
            return processJSGF(gameTree);
        };
        /**
         * Creates KNode object from SGF string.
         *
         * @param sgf
         * @param gameNo
         */
        KifuNode.fromSGF = function (sgf, gameNo) {
            if (gameNo === void 0) { gameNo = 0; }
            var parser = new SGFParser(sgf);
            return KifuNode.fromJS(parser.parseCollection()[gameNo]);
        };
        return KifuNode;
    }());
    //# sourceMappingURL=KifuNode.js.map

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
    //# sourceMappingURL=sgfTypes.js.map

    /**
     * Contains functionality to create, edit and manipulate go game record. It is basically virtual player
     * with API without board and any UI.
     */
    var KifuReader = /** @class */ (function (_super) {
        __extends(KifuReader, _super);
        function KifuReader(rootNode) {
            if (rootNode === void 0) { rootNode = new KifuNode(); }
            var _this = _super.call(this) || this;
            _this.rootNode = rootNode;
            _this.currentNode = rootNode;
            _this.executeRootNode();
            _this.executeNode();
            return _this;
        }
        /**
         * This will execute root node (root properties) once and initialize Game object
         */
        KifuReader.prototype.executeRootNode = function () {
            var size = this.getRootProperty(PropIdent.BOARD_SIZE) || 19;
            var rules = goRules[this.getRootProperty(PropIdent.RULES)] || JAPANESE_RULES;
            var handicap = this.getRootProperty(PropIdent.HANDICAP) || 0;
            this.game = new Game(size, rules);
            if (handicap > 1) {
                this.game.turn = Color.WHITE;
            }
        };
        /**
         * Executes node. It will go through its properties and make changes in game object.
         */
        KifuReader.prototype.executeNode = function () {
            var _this = this;
            // first process setup
            var addBlack = this.getProperty(PropIdent.ADD_BLACK) || [];
            var addWhite = this.getProperty(PropIdent.ADD_WHITE) || [];
            var clear = this.getProperty(PropIdent.CLEAR_FIELD) || [];
            addBlack.forEach(function (p) { return _this.game.setStone(p.x, p.y, Color.BLACK); });
            addWhite.forEach(function (p) { return _this.game.setStone(p.x, p.y, Color.WHITE); });
            clear.forEach(function (p) { return _this.game.setStone(p.x, p.y, Color.EMPTY); });
            // then play a move
            var blackMove = this.getProperty(PropIdent.BLACK_MOVE);
            var whiteMove = this.getProperty(PropIdent.WHITE_MOVE);
            if (blackMove !== undefined && whiteMove !== undefined) {
                throw 'Some error';
            }
            if (blackMove !== undefined) {
                if (blackMove) {
                    this.game.position.applyMove(blackMove.x, blackMove.y, Color.BLACK, true, true);
                }
                else {
                    // pass
                    this.game.position.turn = Color.WHITE;
                }
            }
            else if (whiteMove !== undefined) {
                if (whiteMove) {
                    this.game.position.applyMove(whiteMove.x, whiteMove.y, Color.WHITE, true, true);
                }
                else {
                    // pass
                    this.game.position.turn = Color.BLACK;
                }
            }
            // set turn
            var turn = this.getProperty(PropIdent.SET_TURN);
            if (turn) {
                this.game.turn = turn;
            }
        };
        /**
         * This will revert game changes of current node and re-execute it. Use this, after KifuNode properties are updated.
         */
        KifuReader.prototype.resetNode = function () {
            if (this.currentNode.parent) {
                // update normal node
                this.game.popPosition();
                this.game.pushPosition(this.game.position.clone());
                this.executeNode();
            }
            else {
                // update root node
                this.executeRootNode();
                this.executeNode();
            }
        };
        /**
         * Gets property of current node.
         *
         * @param propIdent
         */
        KifuReader.prototype.getProperty = function (propIdent) {
            return this.currentNode.getProperty(propIdent);
        };
        /**
         * Gets property of root node.
         *
         * @param propIdent
         */
        KifuReader.prototype.getRootProperty = function (propIdent) {
            return this.rootNode.getProperty(propIdent);
        };
        /**
         * Returns array of next nodes (children).
         */
        KifuReader.prototype.getNextNodes = function () {
            return this.currentNode.children;
        };
        /**
         * Go to a next node and executes it (updates game object).
         * @param node
         */
        KifuReader.prototype.next = function (node) {
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
                    this.game.pushPosition(this.game.position.clone());
                    this.currentNode = this.currentNode.children[i];
                    this.executeNode();
                    return true;
                }
            }
            return false;
        };
        /**
         * Go to the previous node.
         */
        KifuReader.prototype.previous = function () {
            if (this.currentNode.parent) {
                this.game.popPosition();
                this.currentNode = this.currentNode.parent;
                return true;
            }
            return false;
        };
        /**
         * Go to the first position - root node.
         */
        KifuReader.prototype.first = function () {
            this.game.clear();
            this.currentNode = this.rootNode;
        };
        /**
         * Go to the last position.
         */
        KifuReader.prototype.last = function () {
            while (this.next()) { }
        };
        /**
         * Go to specified path.
         */
        KifuReader.prototype.goTo = function (pathOrMoveNumber) {
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
           * Go to previous fork (a node with more than one child).
           */
        KifuReader.prototype.previousFork = function () {
            while (this.previous()) {
                if (this.currentNode.children.length > 1) {
                    return;
                }
            }
        };
        return KifuReader;
    }(EventEmitter));
    //# sourceMappingURL=KifuReader.js.map

    var colorsMap = {
        B: Color.BLACK,
        W: Color.WHITE,
    };
    var Player = /** @class */ (function (_super) {
        __extends(Player, _super);
        // handleBoardClick(event: UIEvent, point: Point): void;
        function Player(element, config) {
            if (config === void 0) { config = {}; }
            var _this = _super.call(this) || this;
            // merge user config with default
            _this.element = element;
            _this.config = makeConfig(playerDefaultConfig, config);
            _this.init();
            return _this;
        }
        Player.prototype.init = function () {
            this.board = new CanvasBoard(this.element, {
                theme: this.config.boardTheme,
            });
            this.stoneBoardsObjects = [];
            if (this.config.sgf) {
                this.kifuReader = new KifuReader(KifuNode.fromSGF(this.config.sgf));
            }
            else {
                this.kifuReader = new KifuReader();
            }
            this.updateBoard();
            // this.handleBoardClick = (_e, point) => {
            //
            // };
            // this.board.on('click', )
        };
        Player.prototype.updateBoard = function () {
            var _this = this;
            // Remove missing stones in current position
            this.stoneBoardsObjects = this.stoneBoardsObjects.filter(function (boardObject) {
                if (_this.kifuReader.game.getStone(boardObject.field.x, boardObject.field.y) !== colorsMap[boardObject.type]) {
                    _this.board.removeObject(boardObject);
                    return false;
                }
                return true;
            });
            // Add new stones from current position
            var position = this.kifuReader.game.position;
            var _loop_1 = function (x) {
                var _loop_2 = function (y) {
                    var c = position.get(x, y);
                    if (c && !this_1.stoneBoardsObjects.some(function (boardObject) { return boardObject.field.x === x && boardObject.field.y === y && c === colorsMap[boardObject.type]; })) {
                        var boardObject = { type: c === Color.B ? 'B' : 'W', field: { x: x, y: y } };
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
        Player.prototype.next = function () {
            this.kifuReader.next();
            this.updateBoard();
        };
        Player.prototype.previous = function () {
            this.kifuReader.previous();
            this.updateBoard();
        };
        return Player;
    }(EventEmitter));
    //# sourceMappingURL=Player.js.map

    //# sourceMappingURL=index.js.map

    // All public API is exported here
    //# sourceMappingURL=index.js.map

    exports.CHINESE_RULES = CHINESE_RULES;
    exports.CanvasBoard = CanvasBoard;
    exports.Game = Game;
    exports.ING_RULES = ING_RULES;
    exports.JAPANESE_RULES = JAPANESE_RULES;
    exports.NO_RULES = NO_RULES;
    exports.Player = Player;
    exports.Position = Position;
    exports.SGFParser = SGFParser;
    exports.SGFSyntaxError = SGFSyntaxError;
    exports.defaultBoardConfig = canvasBoardDefaultConfig;
    exports.drawHandlers = index;
    exports.goRules = goRules;
    exports.themes = index$1;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.js.map
