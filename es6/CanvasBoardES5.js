/**
 * Contains implementation of go board.
 * @module CanvasBoard
 */

var WGo = require("./WGo");

/**
 * CanvasBoard class constructor - it creates a canvas board.
 *
 * @alias WGo.CanvasBoard
 * @class
 * @implements WGo.Board
 * @param {HTMLElement} elem DOM element to put in
 * @param {Object} config Configuration object. It is object with "key: value" structure. Possible configurations are:
 *
 * * size: number - size of the board (default: 19)
 * * width: number - width of the board (default: 0)
 * * height: number - height of the board (default: 0)
 * * font: string - font of board writings (!deprecated)
 * * lineWidth: number - line width of board drawings (!deprecated)
 * * autoLineWidth: boolean - if set true, line width will be automatically computed accordingly to board size - this option rewrites 'lineWidth' /and it will keep markups sharp/ (!deprecated)
 * * starPoints: Object - star points coordinates, defined for various board sizes. Look at CanvasBoard.default for more info.
 * * stoneHandler: CanvasBoard.DrawHandler - stone drawing handler (default: CanvasBoard.drawHandlers.SHELL)
 * * starSize: number - size of star points (default: 1). Radius of stars is dynamic, however you can modify it by given constant. (!deprecated)
 * * stoneSize: number - size of stone (default: 1). Radius of stone is dynamic, however you can modify it by given constant. (!deprecated)
 * * shadowSize: number - size of stone shadow (default: 1). Radius of shadow is dynamic, however you can modify it by given constant. (!deprecated)
 * * background: string - background of the board, it can be either color (#RRGGBB) or url. Empty string means no background. (default: WGo.DIR+"wood1.jpg")
 * * section: {
 *     top: number,
 *     right: number,
 *     bottom: number,
 *     left: number
 *   }
 *   It defines a section of board to be displayed. You can set a number of rows(or cols) to be skipped on each side.
 *   Numbers can be negative, in that case there will be more empty space. In default all values are zeros.
 * * theme: Object - theme object, which defines all graphical attributes of the board. Default theme object is "WGo.CanvasBoard.themes.default". For old look you may use "WGo.CanvasBoard.themes.old".
 *
 * Note: properties lineWidth, autoLineWidth, starPoints, starSize, stoneSize and shadowSize will be considered only if you set property 'theme' to 'WGo.CanvasBoard.themes.old'.
 */



var CanvasBoard = function(elem, config) {
	var config = config || {};
	
	// set user configuration
	for(var key in config) this[key] = config[key];
	
	// add default configuration
	for(var key in CanvasBoard.default) if(this[key] === undefined) this[key] = CanvasBoard.default[key];
	
	// add default theme variables
	for(var key in CanvasBoard.themes.default) if(this.theme[key] === undefined) this.theme[key] = CanvasBoard.themes.default[key];
	
	// set section if set
	this.tx = this.section.left;
	this.ty = this.section.top;
	this.bx = this.size-1-this.section.right;
	this.by = this.size-1-this.section.bottom;
	
	// init board
	this.init();
	
	// append to element
	elem.appendChild(this.element);
	
	// set initial dimensions

	// set the pixel ratio for HDPI (e.g. Retina) screens
	this.pixelRatio = window.devicePixelRatio || 1;

	if(this.width && this.height) this.setDimensions(this.width, this.height);
	else if(this.width) this.setWidth(this.width);
	else if(this.height) this.setHeight(this.height);
}

// New experimental board theme system - it can be changed in future, if it will appear to be unsuitable.
CanvasBoard.themes = {};

CanvasBoard.themes.old = {
	shadowColor: "rgba(32,32,32,0.5)",	
	shadowTransparentColor: "rgba(32,32,32,0)",
	shadowBlur: 0,
	shadowSize: function(board) {
		return board.shadowSize;
	},
	markupBlackColor: "rgba(255,255,255,0.8)",
	markupWhiteColor: "rgba(0,0,0,0.8)",
	markupNoneColor: "rgba(0,0,0,0.8)",
	markupLinesWidth: function(board) {
		return board.autoLineWidth ? board.stoneRadius/7 : board.lineWidth;
	},
	gridLinesWidth: 1,
	gridLinesColor: function(board) {
		return "rgba(0,0,0,"+Math.min(1, board.stoneRadius/15)+")";
	}, 
	starColor: "#000",
	starSize: function(board) {
		return board.starSize*((board.width/300)+1);
	},
	stoneSize: function(board) {
		return board.stoneSize*Math.min(board.fieldWidth, board.fieldHeight)/2;
	},
	coordinatesColor: "rgba(0,0,0,0.7)",
	font: function(board) {
		return board.font;
	},
	linesShift: 0.5
}

/** 
 * Object containing default graphical properties of a board.
 * A value of all properties can be even static value or function, returning final value.
 * Theme object doesn't set board and stone textures - they are set separately.
 */ 
 
CanvasBoard.themes.default = {
	shadowColor: "rgba(62,32,32,0.5)",
	shadowTransparentColor: "rgba(62,32,32,0)",
	shadowBlur: function(board){
		return board.stoneRadius*0.1;
	},
	shadowSize: 1,
	markupBlackColor: "rgba(255,255,255,0.9)",
	markupWhiteColor: "rgba(0,0,0,0.7)",
	markupNoneColor: "rgba(0,0,0,0.7)",
	markupLinesWidth: function(board) {
		return board.stoneRadius/8;
	},
	gridLinesWidth: function(board) {
		return board.stoneRadius/15;
	},
	gridLinesColor: "#654525",
	starColor: "#531",
	starSize: function(board) {
		return (board.stoneRadius/8)+1;
	},
	stoneSize: function(board) {
		return Math.min(board.fieldWidth, board.fieldHeight)/2;
	},
	coordinatesColor: "#531",
	variationColor: "rgba(0,32,128,0.8)",
	font: "calibri",
	linesShift: 0.25
}

var theme_variable = function(key, board) {
	return typeof board.theme[key] == "function" ? board.theme[key](board) : board.theme[key];
}

var shadow_handler = {
	draw: function(args, board) {
		var xr = board.getX(args.x),
			yr = board.getY(args.y),
			sr = board.stoneRadius;
		
		this.beginPath();
		
		var blur = theme_variable("shadowBlur", board);
		var radius = Math.max(0, sr-0.5);
		var gradient = this.createRadialGradient(xr-board.ls, yr-board.ls, radius-1-blur, xr-board.ls, yr-board.ls, radius+blur);
		
		gradient.addColorStop(0, theme_variable("shadowColor", board));
		gradient.addColorStop(1, theme_variable("shadowTransparentColor", board));
		
		this.fillStyle = gradient;
		
		this.arc(xr-board.ls, yr-board.ls, radius+blur, 0, 2*Math.PI, true);
		this.fill();
	},
	clear: function(args, board) {
		var xr = board.getX(args.x),
			yr = board.getY(args.y),
			sr = board.stoneRadius;
		this.clearRect(xr-1.1*sr-board.ls,yr-1.1*sr-board.ls, 2.2*sr, 2.2*sr);
	}
}

var get_markup_color = function(board, x, y) {
	if(board.obj_arr[x][y][0].c == WGo.B) return theme_variable("markupBlackColor", board);
	else if(board.obj_arr[x][y][0].c == WGo.W) return theme_variable("markupWhiteColor", board);
	return theme_variable("markupNoneColor", board);
}

var is_here_stone = function(board, x, y) {
	return (board.obj_arr[x][y][0] && board.obj_arr[x][y][0].c == WGo.W || board.obj_arr[x][y][0].c == WGo.B);
}

var redraw_layer = function(board, layer) {
	var handler;
	
	board[layer].clear();
	board[layer].draw(board);
	
	for(var x = 0; x < board.size; x++) {
		for(var y = 0; y < board.size; y++) {
			for(var z = 0; z < board.obj_arr[x][y].length; z++) {
				var obj = board.obj_arr[x][y][z];
				if(!obj.type) handler = board.stoneHandler;
				else if(typeof obj.type == "string") handler = CanvasBoard.drawHandlers[obj.type];
				else handler = obj.type;
		
				if(handler[layer]) handler[layer].draw.call(board[layer].getContext(obj), obj, board);
			}
		}
	}
	
	for(var i = 0; i < board.obj_list.length; i++) {
		var obj = board.obj_list[i];
		var handler = obj.handler;
		
		if(handler[layer]) handler[layer].draw.call(board[layer].getContext(obj.args), obj.args, board);
	}
}

// shell stone helping functions

var shell_seed;

var draw_shell_line = function(ctx, x, y, radius, start_angle, end_angle, factor, thickness) {
	ctx.strokeStyle = "rgba(64,64,64,0.2)";

	ctx.lineWidth = (radius/30)*thickness;
	ctx.beginPath();
	
	radius -= Math.max(1, ctx.lineWidth);
	
	var x1 = x + radius*Math.cos(start_angle*Math.PI);
	var y1 = y + radius*Math.sin(start_angle*Math.PI);
	var x2 = x + radius*Math.cos(end_angle*Math.PI);
	var y2 = y + radius*Math.sin(end_angle*Math.PI);
	
	var m, angle, x, diff_x, diff_y;
	if(x2 > x1) {
		m = (y2-y1)/(x2-x1);
		angle = Math.atan(m);
	}
	else if(x2 == x1) {
		angle = Math.PI/2;
	}
	else {
		m = (y2-y1)/(x2-x1);
		angle = Math.atan(m)-Math.PI;
	}

	var c = factor*radius;
	diff_x = Math.sin(angle) * c;
	diff_y = Math.cos(angle) * c;

	var bx1 = x1 + diff_x;
	var by1 = y1 - diff_y;
	
	var bx2 = x2 + diff_x;
	var by2 = y2 - diff_y;
	
	ctx.moveTo(x1,y1);
	ctx.bezierCurveTo(bx1, by1, bx2, by2, x2, y2);
	ctx.stroke();
}

var draw_shell = function(arg) {
	var from_angle = arg.angle;
	var to_angle = arg.angle;
	
	for(var i = 0; i < arg.lines.length; i++) {
		from_angle += arg.lines[i];
		to_angle -= arg.lines[i];
		draw_shell_line(arg.ctx, arg.x, arg.y, arg.radius, from_angle, to_angle, arg.factor, arg.thickness);
	}
}

// drawing handlers

CanvasBoard.drawHandlers = {
	// handler for normal stones
	NORMAL: {
		// draw handler for stone layer
		stone: {
			// drawing function - args object contain info about drawing object, board is main board object
			// this function is called from canvas2D context
			draw: function(args, board) {
				var xr = board.getX(args.x),
					yr = board.getY(args.y),
					sr = board.stoneRadius,
					radgrad;
				
				// set stone texture
				if(args.c == WGo.W) {
					radgrad = this.createRadialGradient(xr-2*sr/5,yr-2*sr/5,sr/3,xr-sr/5,yr-sr/5,5*sr/5);
					radgrad.addColorStop(0, '#fff');
					radgrad.addColorStop(1, '#aaa');
				}
				else {
					radgrad = this.createRadialGradient(xr-2*sr/5,yr-2*sr/5,1,xr-sr/5,yr-sr/5,4*sr/5);
					radgrad.addColorStop(0, '#666');
					radgrad.addColorStop(1, '#000');
				}
				
				// paint stone
				this.beginPath();
				this.fillStyle = radgrad;
				this.arc(xr-board.ls, yr-board.ls, Math.max(0, sr-0.5), 0, 2*Math.PI, true);
				this.fill();
			}
		},
		// adding shadow handler
		shadow: shadow_handler,
	},
	
	PAINTED: {
		stone: {
			draw: function(args, board) {
				var xr = board.getX(args.x),
					yr = board.getY(args.y),
					sr = board.stoneRadius,
					radgrad;
					
				if(args.c == WGo.W) {
					radgrad = this.createRadialGradient(xr-2*sr/5,yr-2*sr/5,2,xr-sr/5,yr-sr/5,4*sr/5);
					radgrad.addColorStop(0, '#fff');
					radgrad.addColorStop(1, '#ddd');
				}
				else {
					radgrad = this.createRadialGradient(xr-2*sr/5,yr-2*sr/5,1,xr-sr/5,yr-sr/5,4*sr/5);
					radgrad.addColorStop(0, '#111');
					radgrad.addColorStop(1, '#000');				
				}
				
				this.beginPath();
				this.fillStyle = radgrad;
				this.arc(xr-board.ls, yr-board.ls, Math.max(0, sr-0.5), 0, 2*Math.PI, true);
				this.fill();
				
				this.beginPath();
				this.lineWidth = sr/6;
				
				if(args.c == WGo.W) {
					this.strokeStyle = '#999';
					this.arc(xr+sr/8, yr+sr/8, sr/2, 0, Math.PI/2, false);
				}
				else {
					this.strokeStyle = '#ccc';
					this.arc(xr-sr/8, yr-sr/8, sr/2, Math.PI, 1.5*Math.PI);
				}
				
				this.stroke();
			}
		},
		shadow: shadow_handler,
	},
	
	GLOW: {
		stone: {
			draw: function(args, board) {
				var xr = board.getX(args.x),
					yr = board.getY(args.y),
					sr = board.stoneRadius;
					
				var radgrad;
				if(args.c == WGo.W) {
					radgrad = this.createRadialGradient(xr-2*sr/5,yr-2*sr/5,sr/3,xr-sr/5,yr-sr/5,8*sr/5);
					radgrad.addColorStop(0, '#fff');
					radgrad.addColorStop(1, '#666');
				}
				else {
					radgrad = this.createRadialGradient(xr-2*sr/5,yr-2*sr/5,1,xr-sr/5,yr-sr/5,3*sr/5);
					radgrad.addColorStop(0, '#555');
					radgrad.addColorStop(1, '#000');
				}
				
				this.beginPath();
				this.fillStyle = radgrad;
				this.arc(xr-board.ls, yr-board.ls, Math.max(0, sr-0.5), 0, 2*Math.PI, true);
				this.fill();
			},
		},
		shadow: shadow_handler,
	},
	
	SHELL: {
		stone: {
			draw: function(args, board) {
				var xr,
					yr,
					sr = board.stoneRadius;
				
				shell_seed = shell_seed || Math.ceil(Math.random()*9999999);
				
				xr = board.getX(args.x);
				yr = board.getY(args.y);
					
				var radgrad;

				if(args.c == WGo.W) {
					radgrad = "#aaa";
				}
				else {
					radgrad = "#000";
				}
				
				this.beginPath();
				this.fillStyle = radgrad;
				this.arc(xr-board.ls, yr-board.ls, Math.max(0, sr-0.5), 0, 2*Math.PI, true);
				this.fill();
				
				// do shell magic here
				if(args.c == WGo.W) {
					// do shell magic here
					var type = shell_seed%(3+args.x*board.size+args.y)%3;
					var z = board.size*board.size+args.x*board.size+args.y;
					var angle = (2/z)*(shell_seed%z);

					if(type == 0) {
						draw_shell({
							ctx: this,
							x: xr,
							y: yr,
							radius: sr,
							angle: angle,
							lines: [0.10, 0.12, 0.11, 0.10, 0.09, 0.09, 0.09, 0.09],
							factor: 0.25,
							thickness: 1.75
						});
					}
					else if(type == 1) {
						draw_shell({
							ctx: this,
							x: xr,
							y: yr,
							radius: sr,
							angle: angle,
							lines: [0.10, 0.09, 0.08, 0.07, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
							factor: 0.2,
							thickness: 1.5
						});
					}
					else {
						draw_shell({
							ctx: this,
							x: xr,
							y: yr,
							radius: sr,
							angle: angle,
							lines: [0.12, 0.14, 0.13, 0.12, 0.12, 0.12],
							factor: 0.3,
							thickness: 2
						});
					}
					radgrad = this.createRadialGradient(xr-2*sr/5,yr-2*sr/5,sr/3,xr-sr/5,yr-sr/5,5*sr/5);
					radgrad.addColorStop(0, 'rgba(255,255,255,0.9)');
					radgrad.addColorStop(1, 'rgba(255,255,255,0)');
					
					// add radial gradient //
					this.beginPath();
					this.fillStyle = radgrad;
					this.arc(xr-board.ls, yr-board.ls, Math.max(0, sr-0.5), 0, 2*Math.PI, true);
					this.fill();
				}
				else {
					radgrad = this.createRadialGradient(xr+0.4*sr, yr+0.4*sr, 0, xr+0.5*sr, yr+0.5*sr, sr);
					radgrad.addColorStop(0, 'rgba(32,32,32,1)');
					radgrad.addColorStop(1, 'rgba(0,0,0,0)');
					
					this.beginPath();
					this.fillStyle = radgrad;
					this.arc(xr-board.ls, yr-board.ls, Math.max(0, sr-0.5), 0, 2*Math.PI, true);
					this.fill();
				
					radgrad = this.createRadialGradient(xr-0.4*sr, yr-0.4*sr, 1, xr-0.5*sr, yr-0.5*sr, 1.5*sr);
					radgrad.addColorStop(0, 'rgba(64,64,64,1)');
					radgrad.addColorStop(1, 'rgba(0,0,0,0)');
					
					this.beginPath();
					this.fillStyle = radgrad;
					this.arc(xr-board.ls, yr-board.ls, Math.max(0, sr-0.5), 0, 2*Math.PI, true);
					this.fill();
				}
			}
		},
		shadow: shadow_handler,
	},
	
	MONO: {
		stone: {
			draw: function(args, board) {
				var xr = board.getX(args.x),
					yr = board.getY(args.y),
					sr = board.stoneRadius,
					lw = theme_variable("markupLinesWidth", board) || 1;
					
				if(args.c == WGo.W) this.fillStyle = "white";
				else this.fillStyle = "black";			
				
				this.beginPath();
				this.arc(xr, yr, Math.max(0, sr-lw), 0, 2*Math.PI, true);
				this.fill();
				
				this.lineWidth = lw;
				this.strokeStyle = "black";
				this.stroke();
			}
		},
	},
	
	CR: {
		stone: {
			draw: function(args, board) {
				var xr = board.getX(args.x),
					yr = board.getY(args.y),
					sr = board.stoneRadius;
					
				this.strokeStyle = args.c || get_markup_color(board, args.x, args.y);
				this.lineWidth = args.lineWidth || theme_variable("markupLinesWidth", board) || 1;
				this.beginPath();
				this.arc(xr-board.ls, yr-board.ls, sr/2, 0, 2*Math.PI, true);
				this.stroke();
			},
		},
	},
	
	// Label drawing handler
	LB: {
		stone: {
			draw: function(args, board) {
				var xr = board.getX(args.x),
					yr = board.getY(args.y),
					sr = board.stoneRadius,
					font = args.font || theme_variable("font", board) || "";
				
				this.fillStyle = args.c || get_markup_color(board, args.x, args.y);
				
				if(args.text.length == 1) this.font = Math.round(sr*1.5)+"px "+font;
				else if(args.text.length == 2) this.font = Math.round(sr*1.2)+"px "+font;
				else this.font = Math.round(sr)+"px "+font;
				
				this.beginPath();
				this.textBaseline="middle";
				this.textAlign="center";
				this.fillText(args.text, xr, yr, 2*sr);
				
			},
		},
		
		// modifies grid layer too
		grid: {
			draw: function(args, board) {
				if(!is_here_stone(board, args.x, args.y) && !args._nodraw) {
					var xr = board.getX(args.x),
						yr = board.getY(args.y),
						sr = board.stoneRadius;
					this.clearRect(xr-sr,yr-sr,2*sr,2*sr);
				}
			},
			clear: function(args, board) {
				if(!is_here_stone(board, args.x, args.y))  {
					args._nodraw = true;
					redraw_layer(board, "grid");
					delete args._nodraw;
				}
			}
		},
	},
	
	SQ: {
		stone: {
			draw: function(args, board) {
				var xr = board.getX(args.x),
					yr = board.getY(args.y),
					sr = Math.round(board.stoneRadius);
					
				this.strokeStyle = args.c || get_markup_color(board, args.x, args.y);
				this.lineWidth = args.lineWidth || theme_variable("markupLinesWidth", board) || 1;
				this.beginPath();
				this.rect(Math.round(xr-sr/2)-board.ls, Math.round(yr-sr/2)-board.ls, sr, sr);
				this.stroke();
			}
		}
	},
	
	TR: {
		stone: {
			draw: function(args, board) {
				var xr = board.getX(args.x),
					yr = board.getY(args.y),
					sr = board.stoneRadius;
					
				this.strokeStyle = args.c || get_markup_color(board, args.x, args.y);
				this.lineWidth = args.lineWidth || theme_variable("markupLinesWidth", board) || 1;
				this.beginPath();
				this.moveTo(xr-board.ls, yr-board.ls-Math.round(sr/2));
				this.lineTo(Math.round(xr-sr/2)-board.ls, Math.round(yr+sr/3)+board.ls);
				this.lineTo(Math.round(xr+sr/2)+board.ls, Math.round(yr+sr/3)+board.ls);
				this.closePath();
				this.stroke();
			}
		}
	},
	
	MA: {
		stone: {
			draw: function(args, board) {
				var xr = board.getX(args.x),
					yr = board.getY(args.y),
					sr = board.stoneRadius;
				
				this.strokeStyle = args.c || get_markup_color(board, args.x, args.y);
				this.lineCap="round";
				this.lineWidth = (args.lineWidth || theme_variable("markupLinesWidth", board) || 1) * 2 - 1;
				this.beginPath();
				this.moveTo(Math.round(xr-sr/2), Math.round(yr-sr/2));
				this.lineTo(Math.round(xr+sr/2), Math.round(yr+sr/2));
				this.moveTo(Math.round(xr+sr/2)-1, Math.round(yr-sr/2));
				this.lineTo(Math.round(xr-sr/2)-1, Math.round(yr+sr/2));
				this.stroke();
				this.lineCap="butt";
			}
		}
	},
	
	SL: {
		stone: {
			draw: function(args, board) {
				var xr = board.getX(args.x),
					yr = board.getY(args.y),
					sr = board.stoneRadius;
					
				this.fillStyle = args.c || get_markup_color(board, args.x, args.y);
				this.beginPath();
				this.rect(xr-sr/2, yr-sr/2, sr, sr);
				this.fill();
			}
		}
	},
	
	SM: {
		stone: {
			draw: function(args, board) {
				var xr = board.getX(args.x),
					yr = board.getY(args.y),
					sr = board.stoneRadius;
					
				this.strokeStyle = args.c || get_markup_color(board, args.x, args.y);
				this.lineWidth = (args.lineWidth || theme_variable("markupLinesWidth", board) || 1)*2;
				this.beginPath();
				this.arc(xr-sr/3, yr-sr/3, sr/6, 0, 2*Math.PI, true);
				this.stroke();
				this.beginPath();
				this.arc(xr+sr/3, yr-sr/3, sr/6, 0, 2*Math.PI, true);
				this.stroke();
				this.beginPath();
				this.moveTo(xr-sr/1.5,yr);
				this.bezierCurveTo(xr-sr/1.5,yr+sr/2,xr+sr/1.5,yr+sr/2,xr+sr/1.5,yr);
				this.stroke();
			}
		}
	},
	
	outline: {
		stone: {
			draw: function(args, board) {
				if(args.alpha) this.globalAlpha = args.alpha;
				else this.globalAlpha = 0.3;
				if(args.stoneStyle) CanvasBoard.drawHandlers[args.stoneStyle].stone.draw.call(this, args, board);
				else board.stoneHandler.stone.draw.call(this, args, board);
				this.globalAlpha = 1;
			}
		}
	},
	
	mini: {
		stone: {
			draw: function(args, board) {
				board.stoneRadius = board.stoneRadius/2;
				if(args.stoneStyle) CanvasBoard.drawHandlers[args.stoneStyle].stone.draw.call(this, args, board);
				else board.stoneHandler.stone.draw.call(this, args, board);
				board.stoneRadius = board.stoneRadius*2;
			}
		}
	},
}

CanvasBoard.coordinates = {
	grid: {
		draw: function(args, board) {
			var ch, t, xright, xleft, ytop, ybottom;
			
			this.fillStyle = theme_variable("coordinatesColor", board);
			this.textBaseline="middle";
			this.textAlign="center";
			this.font = board.stoneRadius+"px "+(board.font || "");
			
			xright = board.getX(-0.75);
			xleft = board.getX(board.size-0.25);
			ytop = board.getY(-0.75);
			ybottom = board.getY(board.size-0.25);
			
			for(var i = 0; i < board.size; i++) {
				ch = i+"A".charCodeAt(0);
				if(ch >= "I".charCodeAt(0)) ch++;
				
				t = board.getY(i);
				this.fillText(board.size-i, xright, t);
				this.fillText(board.size-i, xleft, t);
				
				t = board.getX(i);
				this.fillText(String.fromCharCode(ch), t, ytop);
				this.fillText(String.fromCharCode(ch), t, ybottom);
			}
			
			this.fillStyle = "black";
		}
	}
}

/**
 * @class
 * Implements one layer of the HTML5 canvas
 */
 
CanvasBoard.CanvasLayer = function() {
	this.element = document.createElement('canvas');
	this.context = this.element.getContext('2d');

	// Adjust pixel ratio for HDPI screens (e.g. Retina)
	this.pixelRatio = window.devicePixelRatio || 1;
	if (this.pixelRatio > 1) {
		this.context.scale(this.pixelRatio, this.pixelRatio);
	}
}

CanvasBoard.CanvasLayer.prototype = {
	constructor: CanvasBoard.CanvasLayer,
	
	setDimensions: function(width, height) {
		this.element.width = width;
		this.element.style.width = (width / this.pixelRatio) + 'px';
		this.element.height = height;
		this.element.style.height = (height / this.pixelRatio) + 'px';
	},
	
	appendTo: function(element, weight) {
		this.element.style.position = 'absolute';
		this.element.style.zIndex = weight;
		element.appendChild(this.element);
	},
	
	removeFrom: function(element) {
		element.removeChild(this.element);
	},
	
	getContext: function() {
		return this.context;
	},
	
	draw: function(board) {	},
	
	clear: function() {
		this.context.clearRect(0,0,this.element.width,this.element.height);
	}
}

/**
 * @class
 * @extends WGo.CanvasBoard.CanvasLayer
 * Layer which renders board grid.
 */
 
CanvasBoard.GridLayer = WGo.extendClass(CanvasBoard.CanvasLayer, function() {
	this.super.call(this);
});

CanvasBoard.GridLayer.prototype.draw = function(board) {
	// draw grid
	var tmp;

	this.context.beginPath();
	this.context.lineWidth = theme_variable("gridLinesWidth", board);
	this.context.strokeStyle = theme_variable("gridLinesColor", board);
	
	var tx = Math.round(board.left),
		ty = Math.round(board.top),
		bw = Math.round(board.fieldWidth*(board.size-1)),
		bh = Math.round(board.fieldHeight*(board.size-1));
	
	this.context.strokeRect(tx-board.ls, ty-board.ls, bw, bh);

	for(var i = 1; i < board.size-1; i++) {
		tmp = Math.round(board.getX(i))-board.ls;
		this.context.moveTo(tmp, ty);
		this.context.lineTo(tmp, ty+bh);
		
		tmp = Math.round(board.getY(i))-board.ls;
		this.context.moveTo(tx, tmp);
		this.context.lineTo(tx+bw, tmp);
	}

	this.context.stroke();
	
	// draw stars
	this.context.fillStyle = theme_variable("starColor", board);
	
	if(board.starPoints[board.size]) {
		for(var key in board.starPoints[board.size]) {
			this.context.beginPath();
			this.context.arc(board.getX(board.starPoints[board.size][key].x)-board.ls, board.getY(board.starPoints[board.size][key].y)-board.ls, theme_variable("starSize", board), 0, 2*Math.PI,true);
			this.context.fill();
		}
	}
}

/**
 * @class
 * @extends WGo.CanvasBoard.CanvasLayer
 * Layer that is composed from more canvases. The proper canvas is selected according to drawn object.
 * In default there are 4 canvases and they are used for board objects like stones. This allows overlapping of objects.
 */
CanvasBoard.MultipleCanvasLayer = WGo.extendClass(CanvasBoard.CanvasLayer, function() {
	this.init(4);
});

CanvasBoard.MultipleCanvasLayer.prototype.init = function(n) {
	var tmp, tmpContext;
	
	this.layers = n;
	
	this.elements = [];
	this.contexts = [];

	// Adjust pixel ratio for HDPI screens (e.g. Retina)
	this.pixelRatio = window.devicePixelRatio || 1;
	
	for(var i = 0; i < n; i++) {
		tmp = document.createElement('canvas');
		tmpContext = tmp.getContext('2d');

		if (this.pixelRatio > 1) {
			tmpContext.scale(this.pixelRatio, this.pixelRatio);
		}

		this.elements.push(tmp);
		this.contexts.push(tmpContext);
	}
}

CanvasBoard.MultipleCanvasLayer.prototype.appendTo = function(element, weight) {
	for(var i = 0; i < this.layers; i++) {
		this.elements[i].style.position = 'absolute';
		this.elements[i].style.zIndex = weight;
		element.appendChild(this.elements[i]);
	}
}

CanvasBoard.MultipleCanvasLayer.prototype.removeFrom = function(element) {
	for(var i = 0; i < this.layers; i++) {
		element.removeChild(this.elements[i]);
	}
}

CanvasBoard.MultipleCanvasLayer.prototype.getContext = function(args) {
	if(args.x%2) {
		return (args.y%2) ? this.contexts[0] : this.contexts[1];
	}
	else {
		return (args.y%2) ? this.contexts[2] : this.contexts[3];
	}
	//return ((args.x%2) && (args.y%2) || !(args.x%2) && !(args.y%2)) ? this.context_odd : this.context_even;
}

CanvasBoard.MultipleCanvasLayer.prototype.clear = function(element, weight) {
	for(var i = 0; i < this.layers; i++) {
		this.contexts[i].clearRect(0,0,this.elements[i].width,this.elements[i].height);
	}
}

CanvasBoard.MultipleCanvasLayer.prototype.setDimensions = function(width, height) {
	for(var i = 0; i < this.layers; i++) {
		this.elements[i].width = width;
		this.elements[i].style.width = (width / this.pixelRatio) + 'px';
		this.elements[i].height = height;
		this.elements[i].style.height = (height / this.pixelRatio) + 'px';
	}
}

/**
 * @class
 * @extends WGo.CanvasBoard.MultipleCanvasLayer
 * Layer for shadows.
 */
 
CanvasBoard.ShadowLayer = WGo.extendClass(CanvasBoard.MultipleCanvasLayer, function(board, shadowSize, shadowBlur) {
	this.init(2);
	this.shadowSize = shadowSize === undefined ? 1 : shadowSize;
	this.board = board;
});

CanvasBoard.ShadowLayer.prototype.getContext = function(args) {
	return ((args.x%2) && (args.y%2) || !(args.x%2) && !(args.y%2)) ? this.contexts[0] : this.contexts[1];
}

CanvasBoard.ShadowLayer.prototype.setDimensions = function(width, height) {
	this.super.prototype.setDimensions.call(this, width, height);
	
	for(var i = 0; i < this.layers; i++) {
		this.contexts[i].setTransform(1,0,0,1,Math.round(this.shadowSize*this.board.stoneRadius/7),Math.round(this.shadowSize*this.board.stoneRadius/7));
	}	
}

var default_field_clear = function(args, board) {
	var xr = board.getX(args.x),
		yr = board.getY(args.y),
		sr = board.stoneRadius;
	this.clearRect(xr-2*sr-board.ls,yr-2*sr-board.ls, 4*sr, 4*sr);
}

// Private methods of WGo.CanvasBoard

var calcLeftMargin = function() {
	return (3*this.width)/(4*(this.bx+1-this.tx)+2) - this.fieldWidth*this.tx;
}

var calcTopMargin = function() {
	return (3*this.height)/(4*(this.by+1-this.ty)+2) - this.fieldHeight*this.ty;
}

var calcFieldWidth = function() {
	return (4*this.width)/(4*(this.bx+1-this.tx)+2);
}

var calcFieldHeight = function() {
	return (4*this.height)/(4*(this.by+1-this.ty)+2);
}

var clearField = function(x,y) {
	var handler;
	for(var z = 0; z < this.obj_arr[x][y].length; z++) {
		var obj = this.obj_arr[x][y][z];
		if(!obj.type) handler = this.stoneHandler;
		else if(typeof obj.type == "string") handler = CanvasBoard.drawHandlers[obj.type];
		else handler = obj.type;
		
		for(var layer in handler) {
			if(handler[layer].clear) handler[layer].clear.call(this[layer].getContext(obj), obj, this);
			else default_field_clear.call(this[layer].getContext(obj), obj, this);
		}
	}
}

var drawField = function(x,y) {
	var handler;
	for(var z = 0; z < this.obj_arr[x][y].length; z++) {
		var obj = this.obj_arr[x][y][z];
		if(!obj.type) handler = this.stoneHandler;
		else if(typeof obj.type == "string") handler = CanvasBoard.drawHandlers[obj.type];
		else handler = obj.type;
		
		for(var layer in handler) {
			handler[layer].draw.call(this[layer].getContext(obj), obj, this);
		}
	}
}

var getMousePos = function(e) {
	// new hopefully better translation of coordinates
	
	var x, y;
	
	x = e.layerX * this.pixelRatio;
	x -= this.left;
	x /= this.fieldWidth;
	x = Math.round(x);
	
	y = e.layerY * this.pixelRatio;
	y -= this.top;
	y /= this.fieldHeight;
	y = Math.round(y);
	
	return {
		x: x >= this.size ? -1 : x,
		y: y >= this.size ? -1 : y
	};
}

var updateDim = function() {
	this.element.style.width = (this.width / this.pixelRatio) + "px";
	this.element.style.height = (this.height / this.pixelRatio) + "px";
	
	this.stoneRadius = theme_variable("stoneSize", this);
	//if(this.autoLineWidth) this.lineWidth = this.stoneRadius/7; //< 15 ? 1 : 3;
	this.ls = theme_variable("linesShift", this);
	
	for(var i = 0; i < this.layers.length; i++) {
		this.layers[i].setDimensions(this.width, this.height); 
	}
}

// Public methods are in the prototype:

CanvasBoard.prototype = {
	constructor: CanvasBoard,
	
	/**
     * Initialization method, it is called in constructor. You shouldn't call it, but you can alter it.
	 */
	 
	init: function() {
		
		// placement of objects (in 3D array)
		this.obj_arr = []; 
		for(var i = 0; i < this.size; i++) {
			this.obj_arr[i] = [];
			for(var j = 0; j < this.size; j++) this.obj_arr[i][j] = [];
		}
		
		// other objects, stored in list
		this.obj_list = []; 
		
		// layers
		this.layers = [];
		
		// event listeners, binded to board
		this.listeners = [];
		
		this.element = document.createElement('div');
		this.element.className = 'wgo-board';
		this.element.style.position = 'relative';
		
		if(this.background) {
			if(this.background[0] == "#") this.element.style.backgroundColor = this.background;
			else {
				this.element.style.backgroundImage = "url('"+this.background+"')";
				/*this.element.style.backgroundRepeat = "repeat";*/
			}
		}
		
		this.grid = new CanvasBoard.GridLayer();
		this.shadow = new CanvasBoard.ShadowLayer(this, theme_variable("shadowSize", this));
		this.stone = new CanvasBoard.MultipleCanvasLayer();
		
		this.addLayer(this.grid, 100);
		this.addLayer(this.shadow, 200);
		this.addLayer(this.stone, 300);
	},
	
	setWidth: function(width) {
		this.width = width;
		this.width *= this.pixelRatio;
		this.fieldHeight = this.fieldWidth = calcFieldWidth.call(this);
		this.left = calcLeftMargin.call(this);
		
		this.height = (this.by-this.ty+1.5)*this.fieldHeight;
		this.top = calcTopMargin.call(this);
		
		updateDim.call(this);
		this.redraw();
	},
	
	setHeight: function(height) {
		this.height = height;
		this.height *= this.pixelRatio;
		this.fieldWidth = this.fieldHeight = calcFieldHeight.call(this);
		this.top = calcTopMargin.call(this);
		
		this.width = (this.bx-this.tx+1.5)*this.fieldWidth;
		this.left = calcLeftMargin.call(this);
		
		updateDim.call(this);
		this.redraw();
	},
	
	setDimensions: function(width, height) {
		this.width = width || parseInt(this.element.style.width, 10);
		this.width *= this.pixelRatio;
		this.height = height || parseInt(this.element.style.height, 10);
		this.height *= this.pixelRatio;
		
		this.fieldWidth = calcFieldWidth.call(this);
		this.fieldHeight = calcFieldHeight.call(this);
		this.left = calcLeftMargin.call(this);			
		this.top = calcTopMargin.call(this);
		
		updateDim.call(this);
		this.redraw();
	},
	
	/**
	 * Get currently visible section of the board
	 */
	
	getSection: function() {
		return this.section;
	},
	
	/**
	 * Set section of the board to be displayed
	 */
	
	setSection: function(section_or_top, right, bottom, left) {
		if(typeof section_or_top == "object") {
			this.section = section_or_top;
		}
		else {
			this.section = {
				top: section_or_top,
				right: right,
				bottom: bottom,
				left: left,
			}
		}
		
		this.tx = this.section.left;
		this.ty = this.section.top;
		this.bx = this.size-1-this.section.right;
		this.by = this.size-1-this.section.bottom;
		
		this.setDimensions();
	},
	 
	setSize: function(size) {
		var size = size || 19;
		
		if(size != this.size) {
			this.size = size;
			
			this.obj_arr = [];
			for(var i = 0; i < this.size; i++) {
				this.obj_arr[i] = [];
				for(var j = 0; j < this.size; j++) this.obj_arr[i][j] = [];
			}
		
			this.bx = this.size-1-this.section.right;
			this.by = this.size-1-this.section.bottom;
			this.setDimensions();
		}
	},
	
	/**
	 * Redraw everything.
	 */
	
	redraw: function() {
		try {
			// redraw layers
			for(var i = 0; i < this.layers.length; i++) {
				this.layers[i].clear(this);
				this.layers[i].draw(this);
			}
			
			// redraw field objects
			for(var i = 0; i < this.size; i++) {
				for(var j = 0; j < this.size; j++) {
					drawField.call(this, i, j);
				}
			}
			
			// redraw custom objects
			for(var i = 0; i < this.obj_list.length; i++) {
				var obj = this.obj_list[i];
				var handler = obj.handler;
				
				for(var layer in handler) {
					handler[layer].draw.call(this[layer].getContext(obj.args), obj.args, this);
				}
			}
		}
		catch(err) {
			// If the board is too small some canvas painting function can throw an exception, but we don't want to break our app
			console.log("WGo board failed to render. Error: "+err.message);
		}
	},
	
	/**
	 * Get absolute X coordinate
	 *
	 * @param {number} x relative coordinate
	 */
	
	getX: function(x) {
		return this.left+x*this.fieldWidth;
	},
	
	/**
	 * Get absolute Y coordinate
	 *
	 * @param {number} y relative coordinate
	 */
	
	getY: function(y) {
		return this.top+y*this.fieldHeight;
	},
	
	/**
	 * Add layer to the board. It is meant to be only for canvas layers.
	 *
	 * @param {CanvasBoard.CanvasLayer} layer to add
	 * @param {number} weight layer with biggest weight is on the top 
	 */
	
	addLayer: function(layer, weight) {
		layer.appendTo(this.element, weight);
		layer.setDimensions(this.width, this.height);
		this.layers.push(layer);
	},
	
	/**
	 * Remove layer from the board.
	 *
	 * @param {CanvasBoard.CanvasLayer} layer to remove
	 */
	
	removeLayer: function(layer) {
		var i = this.layers.indexOf(layer);
		if(i >= 0) {
			this.layers.splice(i,1);
			layer.removeFrom(this.element);
		}
	},
	
	update: function(changes) {
		var i;
		if(changes.remove && changes.remove == "all") this.removeAllObjects();
		else if(changes.remove) {
			for(i = 0; i < changes.remove.length; i++) this.removeObject(changes.remove[i]);
		}
		
		if(changes.add) {
			for(i = 0; i < changes.add.length; i++) this.addObject(changes.add[i]);
		}
	},
	
	addObject: function(obj) {
		// handling multiple objects
		if(obj.constructor == Array) {
			for(var i = 0; i < obj.length; i++) this.addObject(obj[i]);
			return;
		}
		
		try {
			// clear all objects on object's coordinates
			clearField.call(this, obj.x, obj.y);
			
			// if object of this type is on the board, replace it
			var layers = this.obj_arr[obj.x][obj.y];
			for(var z = 0; z < layers.length; z++) {
				if(layers[z].type == obj.type) {
					layers[z] = obj;
					drawField.call(this, obj.x, obj.y);
					return;
				}
			}	
			
			// if object is a stone, add it at the beginning, otherwise at the end
			if(!obj.type) layers.unshift(obj);
			else layers.push(obj);
			
			// draw all objects
			drawField.call(this, obj.x, obj.y);
		}
		catch(err) {
			// If the board is too small some canvas painting function can throw an exception, but we don't want to break our app
			console.log("WGo board failed to render. Error: "+err.message);
		}
	},
	
	removeObject: function(obj) {
		// handling multiple objects
		if(obj.constructor == Array) {
			for(var n = 0; n < obj.length; n++) this.removeObject(obj[n]);
			return;
		}
		
		try {
			var i;
			for(var j = 0; j < this.obj_arr[obj.x][obj.y].length; j++) {
				if(this.obj_arr[obj.x][obj.y][j].type == obj.type) {
					i = j;
					break;
				}
			}
			if(i === undefined) return;
			
			// clear all objects on object's coordinates
			clearField.call(this, obj.x, obj.y);
			
			this.obj_arr[obj.x][obj.y].splice(i,1);
			
			drawField.call(this, obj.x, obj.y);
		}
		catch(err) {
			// If the board is too small some canvas painting function can throw an exception, but we don't want to break our app
			console.log("WGo board failed to render. Error: "+err.message);
		}
	},

	removeObjectsAt: function(x, y) {
		if(!this.obj_arr[x][y].length) return;
		
		clearField.call(this, x, y);
		this.obj_arr[x][y] = [];
	},

	removeAllObjects: function() {
		this.obj_arr = []; 
		for(var i = 0; i < this.size; i++) {
			this.obj_arr[i] = [];
			for(var j = 0; j < this.size; j++) this.obj_arr[i][j] = [];
		}
		this.redraw();
	},
	
	addCustomObject: function(handler, args) {
		this.obj_list.push({handler: handler, args: args});
		this.redraw();
	},
	
	removeCustomObject: function(handler, args) {
		for(var i = 0; i < this.obj_list.length; i++) {
			var obj = this.obj_list[i];
			if(obj.handler == handler && obj.args == args) {
				this.obj_list.splice(i, 1);
				this.redraw();
				return true;
			}
		}
		return false;
	},
	
	addEventListener: function(type, callback) {
		var _this = this,
			evListener = {
				type: type,
				callback: callback,
				handleEvent: function(e) {
					var coo = getMousePos.call(_this, e);
					callback(coo.x, coo.y, e);
				}
			};
			
		this.element.addEventListener(type, evListener, true);
		this.listeners.push(evListener);
	},
	
	removeEventListener: function(type, callback) {
		for(var i = 0; i < this.listeners.length; i++) {
			var listener = this.listeners[i];
			if(listener.type == type && listener.callback == callback) {
				this.element.removeEventListener(listener.type, listener, true);
				this.listeners.splice(i, 1);
				return true;
			}
		}
		return false;
	},
	
	getState: function() {
		return {
			objects: WGo.clone(this.obj_arr),
			custom: WGo.clone(this.obj_list)
		};
	},
	
	restoreState: function(state) {
		this.obj_arr = state.objects || this.obj_arr;
		this.obj_list = state.custom || this.obj_list;
		
		this.redraw();
	}
}

CanvasBoard.default = {
	size: 19,
	width: 0,
	height: 0,
	font: "Calibri", // deprecated
	lineWidth: 1, // deprecated
	autoLineWidth: false, // deprecated
	starPoints: {
		19:[{x:3, y:3 },
			{x:9, y:3 },
			{x:15,y:3 },
			{x:3, y:9 },
			{x:9, y:9 },
			{x:15,y:9 },
			{x:3, y:15},
			{x:9, y:15},
			{x:15,y:15}],
		13:[{x:3, y:3},
			{x:9, y:3},
			{x:3, y:9},
			{x:9, y:9}],
		9:[{x:4, y:4}],
	},
	stoneHandler: CanvasBoard.drawHandlers.SHELL,
	starSize: 1, // deprecated
	shadowSize: 1, // deprecated
	stoneSize: 1, // deprecated
	section: {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	//background: WGo.DIR+"wood1.jpg",
	theme: {}
}

// save CanvasBoard
module.exports = CanvasBoard;
