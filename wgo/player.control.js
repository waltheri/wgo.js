(function(WGo, undefined) {

var compare_widgets = function(a,b) {
	if(a.weight < b.weight) return -1;
	else if(a.weight > b.weight) return 1;
	else return 0;
}

var prepare_dom = function(bp) {

	this.iconBar = document.createElement("div");
	this.iconBar.className = "wgo-control-wrapper";
	this.element.appendChild(this.iconBar);

	var widget;
	
	for(var w in Control.widgets) {
		widget = new Control.widgets[w].constructor(bp, Control.widgets[w].args);
		widget.appendTo(this.iconBar);
		this.widgets.push(widget);
	}
	
	//this.menu.appendChild(this.widgets[0].element);
	//this.menu.appendChild(this.widgets[this.widgets.length-1].element);
}

var Control = WGo.extendClass(WGo.BasicPlayer.component.Component, function(bp) {
	this.super(bp);
	
	this.widgets = [];
	this.element.className = "wgo-player-control";

	prepare_dom.call(this, bp);
});

var control = WGo.control = {};

var butupd_first = function(e) {
	if(!e.node.parent && !this.disabled) this.disable();
	else if(e.node.parent && this.disabled) this.enable();
}

var butupd_last = function(e) {
	if(!e.node.children.length && !this.disabled) this.disable();
	else if(e.node.children.length && this.disabled) this.enable();
}

var but_frozen = function(e) {
	this._disabled = this.disabled;
	if(!this.disabled) this.disable();
}

var but_unfrozen = function(e) {
	if(!this._disabled) this.enable();
	delete this._disabled;
}

/**
 * Control.Widget base class
 * 
 * args = {
 *   name: String, // required
 *	 init: Function, // other initialization code can be here
 *	 disabled: BOOLEAN, // default false
 * }
 */
 
control.Widget = function(bp, args) {
	this.element = this.element || document.createElement(args.type || "div");
	this.element.className = "wgo-widget-"+args.name;
	this.init(bp, args);
}

control.Widget.prototype = {
	constructor: control.Widget,
	
	init: function(bp, args) {
		if(!args) return;
		if(args.disabled) this.disable();
		if(args.init) args.init.call(this, bp);
	},
	
	appendTo: function(target) {
		target.appendChild(this.element);
	},
	
	disable: function() {
		this.disabled = true;
		if(this.element.className.search("wgo-disabled") == -1) {
			this.element.className += " wgo-disabled";
		}
	},
	
	enable: function() {
		this.disabled = false;
		this.element.className = this.element.className.replace(" wgo-disabled","");
		this.element.disabled = "";
	},
	
}

/**
 * Group of widgets
 */

control.Group = WGo.extendClass(control.Widget, function(bp, args) {
	this.element = document.createElement("div");
	this.element.className = "wgo-ctrlgroup wgo-ctrlgroup-"+args.name;
	
	var widget;
	for(var w in args.widgets) {
		widget = new args.widgets[w].constructor(bp, args.widgets[w].args);
		widget.appendTo(this.element);
	}
});

/**
 * args = {
 *   title: String, // required
 *	 init: Function, // other initialization code can be here
 *	 click: Function, // required *** onclick event
 *	 icon: STRING,
 *   togglable: BOOLEAN, // default false
 *	 selected: BOOLEAN, // default false
 *	 disabled: BOOLEAN, // default false
 * }
*/

control.Clickable = WGo.extendClass(control.Widget, function(bp, args) {
	this.super(bp, args);
});

control.Clickable.prototype.init = function(bp, args) {
	var _this = this;
	
	if(args.togglable) {
		this.element.addEventListener("click", function(){
			if(_this.disabled) return;
			
			if(args.click.call(_this, bp)) _this.select();
			else _this.unselect();
		});
	}
	else {
		this.element.addEventListener("click", function() {
			if(_this.disabled) return;
			args.click.call(_this, bp);
		});
	}
	
	if(args.disabled) this.disable();
	if(args.init) args.init.call(this, bp);
};

control.Clickable.prototype.select = function() {
	this.selected = true;
	if(this.element.className.search("wgo-selected") == -1) this.element.className += " wgo-selected";
	console.log(this.element.className);
};

control.Clickable.prototype.unselect = function() {
	this.selected = false;
	this.element.className = this.element.className.replace(" wgo-selected","");
};

control.Button = WGo.extendClass(control.Clickable, function(bp, args) {
	var elem = this.element = document.createElement("button");
	elem.className = "wgo-button wgo-button-"+args.name;
	elem.title = WGo.t(args.name);
	
	elem.addEventListener("mousedown", function() {
		if(!this.disabled) elem.className += " wgo-button-active";
	});
	
	elem.addEventListener("mouseup", function() {
		if(!this.disabled) elem.className = elem.className.replace(" wgo-button-active","");
	});
	
	elem.addEventListener("mouseout", function() {
		if(!this.disabled) elem.className = elem.className.replace(" wgo-button-active","");
	});
	
	this.init(bp, args);
});

control.Button.prototype.disable = function() {
	control.Button.prototype.super.prototype.disable.call(this);
	this.element.disabled = "disabled";
}
	
control.Button.prototype.enable = function() {
	control.Button.prototype.super.prototype.enable.call(this);
	this.element.disabled = "";
}

control.MenuItem = WGo.extendClass(control.Clickable, function(bp, args) {
	var elem = this.element = document.createElement("div");
	elem.className = "wgo-menu-item wgo-menu-item-"+args.name;
	elem.title = WGo.t(args.name);
	elem.innerHTML = elem.title;
	
	this.init(bp, args);
});

control.MoveNumber = WGo.extendClass(control.Widget, function(bp) {
	this.element = document.createElement("form");
	this.element.className = "wgo-player-mn-wrapper";
	
	var move = this.move = document.createElement("input");
	move.type = "text";
	move.value = "0";
	move.maxlength = 3;
	move.className = "wgo-player-mn-value";
	//move.disabled = "disabled";
	this.element.appendChild(move);

	this.element.onsubmit = move.onchange = function(player) {
		player.goTo(this.getValue()); 
		return false; 
	}.bind(this, bp.player);
	
	bp.player.addEventListener("update", function(e) {
		this.setValue(e.path.m);
	}.bind(this));
	
	bp.player.addEventListener("kifuLoaded", this.enable.bind(this));
	bp.player.addEventListener("frozen", this.disable.bind(this));
	bp.player.addEventListener("unfrozen", this.enable.bind(this));
});

control.MoveNumber.prototype.disable = function() {
	control.MoveNumber.prototype.super.prototype.disable.call(this);
	this.move.disabled = "disabled";
};

control.MoveNumber.prototype.enable = function() {
	control.MoveNumber.prototype.super.prototype.enable.call(this);
	this.move.disabled = "";
};

control.MoveNumber.prototype.setValue = function(n) {
	this.move.value = n;
};

control.MoveNumber.prototype.getValue = function(n) {
	return this.move.value;
};

var player_menu = function(bp) {
	if(bp._menu_tmp) {
		delete bp._menu_tmp;
		return;
	}
	if(!bp.menu) {
		bp.menu = document.createElement("div");
		bp.menu.className = "wgo-player-menu";
		bp.menu.style.position = "absolute";
		bp.menu.style.display = "none";
		bp.element.appendChild(bp.menu);
		
		var widget;
		for(var i in Control.menu) {
			widget = new Control.menu[i].constructor(bp, Control.menu[i].args, true);
			widget.appendTo(bp.menu);
		}
	}
	
	if(bp.menu.style.display != "none") {
		bp.menu.style.display = "none";
		
		document.removeEventListener("click", bp._menu_ev);
		delete bp._menu_ev;
		
		this.unselect();
		return false;
	}
	else {
		bp.menu.style.display = "block";
		
		// kinda dirty syntax, but working well
		if(this.element.parentElement.parentElement.parentElement.parentElement == bp.regions.bottom.wrapper) {
			bp.menu.style.left = this.element.offsetLeft+"px";
			bp.menu.style.top = (this.element.offsetTop-bp.menu.clientHeight+1)+"px";
		}
		else {
			bp.menu.style.left = this.element.offsetLeft+"px";
			bp.menu.style.top = (this.element.offsetTop+this.element.offsetHeight)+"px";
		}
			
		bp._menu_ev = player_menu.bind(this, bp)
		bp._menu_tmp = true;
		
		document.addEventListener("click", bp._menu_ev);

		return true;
	}
}

Control.menu = [{
	constructor: control.MenuItem,
	args: {
		name: "editmode",
		icon: "modern-edit4.svg",
		togglable: true,
		click: function(bp) { 
			return bp.player.toggleEditMode()
		},
		init: function(bp) {
			bp.player.addEventListener("frozen", but_frozen.bind(this));
			bp.player.addEventListener("unfrozen", but_unfrozen.bind(this));
		},
	}
}, {
	constructor: control.MenuItem,
	args: {
		name: "fullscreen",
		icon: "modern-fullscr4.svg",
		togglable: true,
		click: function(bp) { 
			bp.player.toggleFullscreen(); 
		},
		init: function(bp) {
			if(document.fullscreenEnabled === false) {
				this.disable();
				return;
			}

			bp.player.addEventListener("fullscreenChange", function(e){
				if(e.on) {
					e.target.view.width = screen.width;
					e.target.view.height = screen.height;
					e.target.view.noresize = true;
					this.select();
				}
				else {
					e.target.view.noresize = false;
					this.unselect();
				}
			}.bind(this));
		}
	}
}, {
	constructor: control.MenuItem,
	args: {
		name: "switch-coo",
		icon: "modern-coo4.svg",
		togglable: true,
		click: function(bp) {
			return bp.toggleCoordinates();
		},
		init: function(bp) {
			if(bp.coordinates) this.select();
		}
	}
}/*, {
	constructor: control.MenuItem,
	args: {
		name: "print",
		icon: "modern-print4.svg",
		disabled: true,
		click: function(player) {
			var nums = new WGo.Position(player.kifuReader.game.size);
			var path = player.kifuReader.path;
			var node = player.kifu.root;
			var j = 1, r;
			
			for(var i = 0; i < path.m; i++) {
				if(node.move) {
					player.board.addObject({type:"LB", x: node.move.x, y: node.move.y, text: i+""});
				}
				
				if(node.children.length > 1) {
					node = node.getChild(path[i] || 0);
				}
				else if(node.children.length) {
					node = node.getChild(0);
				}
				else break;
			}
		},
		init: function(player) {
			
		}
	}
}*/, {
	constructor: control.MenuItem,
	args: {
		name: "permalink",
		icon: "modern-perma4.svg",
		click: function(bp) {
			var link = location.href.split("#")[0]+"#"+bp.element.id+",p,"+bp.player.kifuReader.path.join(",");
			bp.showMessage('<h1>'+WGo.t('permalink')+'</h1><p><input class="wgo-permalink" type="text" value="'+link+'" onclick="this.select(); event.stopPropagation()"/></p>');
		},
	}
}];

/**
 * widget = {
 *	 constructor: Function, // construct a instance of widget
 *	 args: Object,
 * }
*/

Control.widgets = [ {
	constructor: control.Group,
	args: {
		name: "left",
		widgets: [{
			constructor: control.Button,
			args: {
				name: "menu",
				//icon: "modern-menu4.svg",
				togglable: true,
				click: player_menu,
			}
		}]
	}
}, {
	constructor: control.Group,
	args: {
		name: "right",
		widgets: [{
			constructor: control.Button,
			args: {
				name: "about",
				//icon: "modern-info4.svg",
				click: function(bp) {
					bp.showMessage(WGo.about);
				},
			}
		}]
	}
}, {
	constructor: control.Group,
	args: {
		name: "control",
		widgets: [{
			constructor: control.Button,
			args: {
				name: "first",
				//icon: "modern-first4.svg",
				disabled: true,
				init: function(bp) {
					bp.player.addEventListener("update", butupd_first.bind(this));
					bp.player.addEventListener("frozen", but_frozen.bind(this));
					bp.player.addEventListener("unfrozen", but_unfrozen.bind(this));
				},
				click: function(bp) { 
					bp.player.first();
				},
			}
		}, {
			constructor: control.Button,
			args: {
				name: "multiprev",
				//icon: "modern-fprev4.svg",
				disabled: true,
				init: function(bp) {
					bp.player.addEventListener("update", butupd_first.bind(this));
					bp.player.addEventListener("frozen", but_frozen.bind(this));
					bp.player.addEventListener("unfrozen", but_unfrozen.bind(this));
				},
				click: function(bp) { 
					var p = WGo.clone(bp.player.kifuReader.path);
					p.m -= 10; 
					bp.player.goTo(p);
				},
			}
		},{
			constructor: control.Button,
			args: {
				name: "previous",
				//icon: "modern-prev4.svg",
				disabled: true,
				init: function(bp) {
					bp.player.addEventListener("update", butupd_first.bind(this));
					bp.player.addEventListener("frozen", but_frozen.bind(this));
					bp.player.addEventListener("unfrozen", but_unfrozen.bind(this));
				},
				click: function(bp) { 
					bp.player.previous();
				},
			}
		}, {
			constructor: control.MoveNumber,
		}, {
			constructor: control.Button,
			args: {
				name: "next",
				//icon: "modern-next4.svg",
				disabled: true,
				init: function(bp) {
					bp.player.addEventListener("update", butupd_last.bind(this));
					bp.player.addEventListener("frozen", but_frozen.bind(this));
					bp.player.addEventListener("unfrozen", but_unfrozen.bind(this));
				},
				click: function(bp) {
					bp.player.next();
				},
			}
		}, {
			constructor: control.Button,
			args: {
				name: "multinext",
				//icon: "modern-fnext4.svg",
				disabled: true,
				init: function(bp) {
					bp.player.addEventListener("update", butupd_last.bind(this));
					bp.player.addEventListener("frozen", but_frozen.bind(this));
					bp.player.addEventListener("unfrozen", but_unfrozen.bind(this));
				},
				click: function(bp) { 
					var p = WGo.clone(bp.player.kifuReader.path);
					p.m += 10; 
					bp.player.goTo(p);
				},
			}
		}, {
			constructor: control.Button,
			args: {
				name: "last",
				//icon: "modern-last4.svg",
				disabled: true,
				init: function(bp) {
					bp.player.addEventListener("update", butupd_last.bind(this));
					bp.player.addEventListener("frozen", but_frozen.bind(this));
					bp.player.addEventListener("unfrozen", but_unfrozen.bind(this));
				},
				click: function(bp) {
					bp.player.last()
				},
			}
		}]
	}
}];

WGo.BasicPlayer.layouts["right_top"].top.push("Control");
WGo.BasicPlayer.layouts["one_column"].top.push("Control");
WGo.BasicPlayer.layouts["no_comment"].bottom.push("Control");
WGo.BasicPlayer.layouts["minimal"].bottom.push("Control");

WGo.BasicPlayer.component.Control = Control;

})(WGo);
