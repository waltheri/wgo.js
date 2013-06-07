(function(WGo, undefined) {

var compare_widgets = function(a,b) {
	if(a.weight < b.weight) return -1;
	else if(a.weight > b.weight) return 1;
	else return 0;
}

var prepare_dom = function(player) {

	this.iconBar = document.createElement("div");
	this.iconBar.className = "wgo-control-wrapper";
	this.element.appendChild(this.iconBar);

	var widget;
	
	for(var w in Control.widgets) {
		widget = new Control.widgets[w].constructor(player, Control.widgets[w].args);
		widget.appendTo(this.iconBar);
	}
	
	//this.menu.appendChild(this.widgets[0].element);
	//this.menu.appendChild(this.widgets[this.widgets.length-1].element);
}

var Control = WGo.extendClass(WGo.Player.component.Component, function(player) {
	this.super(player);
	
	this.widgets = [];
	this.element.className = "wgo-player-control";

	prepare_dom.call(this, player);
});

var butupd_first = function(e) {
	if(!e.node.parent && !this.disabled) this.disable();
	else if(e.node.parent && this.disabled) this.enable();
}

var butupd_last = function(e) {
	if(!e.node.children.length && !this.disabled) this.disable();
	else if(e.node.children.length && this.disabled) this.enable();
}

/**
 * interface WidgetType {
 *   void appendTo(HTMLDomElement)
 * }
 */
 
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
Control.Group = function(player, args) {
	this.element = document.createElement("div");
	this.element.className = "wgo-ctrlgroup wgo-ctrlgroup-"+args.name;
	
	var widget;
	for(var w in args.widgets) {
		widget = new args.widgets[w].constructor(player, args.widgets[w].args);
		widget.appendTo(this.element);
	}
}

Control.Group.prototype = {
	constructor: Control.Group,
	
	appendTo: function(target) {
		target.appendChild(this.element);
	}
}

Control.Button = function(player, args, menuItem) {
	if(menuItem) {
		var elem = this.element = document.createElement("div");
		elem.className = "wgo-menu-item wgo-menu-item-"+args.name;
	}
	else {
		var elem = this.element = document.createElement("button");
		elem.className = "wgo-button wgo-button-"+args.name;
	}
	
	var title = WGo.t(args.name);
	/*
	if(args.icon) {
		var img = document.createElement("img");
		img.src = WGo.DIR+args.icon;
		img.alt = title;
		elem.appendChild(img);
	}
	else {
		var img = document.createElement("div");
		img.className = "wgo-placeholder";
		elem.appendChild(img);
	}*/
	elem.title = title;
	
	elem.addEventListener("mousedown", function() {
		if(!this.disabled) elem.className += " wgo-button-active";
	});
	
	elem.addEventListener("mouseup", function() {
		if(!this.disabled) elem.className = elem.className.replace(" wgo-button-active","");
	});
	
	elem.addEventListener("mouseout", function() {
		if(!this.disabled) elem.className = elem.className.replace(" wgo-button-active","");
	});
	
	if(args.togglable) {
		elem.addEventListener("click", function(){
			if(args.click.call(this, player)) this.select();
			else this.unselect();
		}.bind(this));
	}
	else {
		elem.addEventListener("click", args.click.bind(this, player));
	}
	
	if(args.disabled) this.disable();
	if(args.selected) this.select();
	
	if(args.init) args.init.call(this, player);
	
	if(menuItem) this.element.innerHTML += "<span>"+WGo.t(args.name)+"</span>";
}

Control.Button.prototype = {
	constructor: Control.Button,
	
	disable: function() {
		if(this.element.className.search("wgo-disabled") == -1) {
			this.element.className += " wgo-disabled";
		}
		this.element.disabled = "disabled";
		this.disabled = true;
	},
	
	enable: function() {
		this.element.className = this.element.className.replace(" wgo-disabled","");
		this.element.disabled = "";
		this.disabled = false;
	},
	
	unselect: function() {
		this.element.className = this.element.className.replace(" wgo-selected","");
	},
	
	select: function() {
		if(this.element.className.search("wgo-selected") == -1) this.element.className += " wgo-selected";
		console.log(this.element.className);
	},
	
	appendTo: function(target) {
		target.appendChild(this.element);
	}
}

Control.MoveNumber = function(player) {
	this.element = document.createElement("form");
	this.element.className = "wgo-player-mn-wrapper";
	
	var move = document.createElement("input");
	move.type = "text";
	move.value = "0";
	move.maxlength = 3;
	move.className = "wgo-player-mn-value";
	move.disabled = "disabled";
	this.element.appendChild(move);
	
	this.element.onsubmit = move.onchange = function(move) { ;
		this.goTo(move.value); 
		return false; 
	}.bind(player, move);
	
	player.addEventListener("update", function(e) {
		this.value = e.path.m;
	}.bind(move));
	
	player.addEventListener("kifuLoaded", function(e) {
		this.disabled = "";
	}.bind(move));
}

Control.MoveNumber.prototype = {
	constructor: Control.MoveNumber,
	
	appendTo: function(target) {
		target.appendChild(this.element);
	}
}

var player_menu = function(player) {
	if(player._menu_tmp) {
		delete player._menu_tmp;
		return;
	}
	if(!player.view.menu) {
		player.view.menu = document.createElement("div");
		player.view.menu.className = "wgo-player-menu";
		player.view.menu.style.position = "absolute";
		player.view.menu.style.display = "none";
		player.view.element.appendChild(player.view.menu);
		
		var widget;
		for(var i in Control.menu) {
			widget = new Control.menu[i].constructor(player, Control.menu[i].args, true);
			widget.appendTo(player.view.menu);
		}
	}
	
	if(player.view.menu.style.display != "none") {
		player.view.menu.style.display = "none";
		
		document.removeEventListener("click", player._menu_ev);
		delete player._menu_ev;
		
		this.unselect();
		return false;
	}
	else {
		player.view.menu.style.display = "block";
		
		// kinda dirty syntax, but working well
		if(this.element.parentElement.parentElement.parentElement.parentElement == player.view.regions.bottom.wrapper) {
			player.view.menu.style.left = this.element.offsetLeft+"px";
			player.view.menu.style.top = (this.element.offsetTop-player.view.menu.clientHeight+1)+"px";
		}
		else {
			player.view.menu.style.left = this.element.offsetLeft+"px";
			player.view.menu.style.top = (this.element.offsetTop+this.element.offsetHeight)+"px";
		}
			
		player._menu_ev = player_menu.bind(this, player)
		player._menu_tmp = true;
		
		document.addEventListener("click", player._menu_ev);

		return true;
	}
}

Control.menu = [{
	constructor: Control.Button,
	args: {
		name: "editmode",
		icon: "modern-edit4.svg",
		togglable: true,
		click: function(player) { 
			return player.toggleEditMode()
		},
	}
}, {
	constructor: Control.Button,
	args: {
		name: "fullscreen",
		icon: "modern-fullscr4.svg",
		togglable: true,
		click: function(player) { 
			player.toggleFullscreen(); 
		},
		init: function(player) {
			if(document.fullscreenEnabled === false) {
				this.disable();
				return;
			}

			player.addEventListener("fullscreenChange", function(e){
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
	constructor: Control.Button,
	args: {
		name: "switch-coo",
		icon: "modern-coo4.svg",
		togglable: true,
		click: function(player) {
			return player.toggleCoordinates();
		},
		init: function(player) {
			if(player.coordinates) this.select();
		}
	}
}, {
	constructor: Control.Button,
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
}, {
	constructor: Control.Button,
	args: {
		name: "permalink",
		icon: "modern-perma4.svg",
		click: function(player) {
			var link = location.href.split("#")[0]+"#"+player.view.element.id+",p,"+player.kifuReader.path.join(",");
			player.showMessage('<h1>'+WGo.t('permalink')+'</h1><p><input class="wgo-permalink" type="text" value="'+link+'" onclick="this.select(); event.stopPropagation()"/></p>');
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
	constructor: Control.Group,
	args: {
		name: "left",
		widgets: [{
			constructor: Control.Button,
			args: {
				name: "menu",
				//icon: "modern-menu4.svg",
				togglable: true,
				click: player_menu,
			}
		}]
	}
}, {
	constructor: Control.Group,
	args: {
		name: "right",
		widgets: [{
			constructor: Control.Button,
			args: {
				name: "about",
				//icon: "modern-info4.svg",
				click: function(player) {
					player.showMessage(WGo.about);
				},
			}
		}]
	}
}, {
	constructor: Control.Group,
	args: {
		name: "control",
		widgets: [{
			constructor: Control.Button,
			args: {
				name: "first",
				//icon: "modern-first4.svg",
				disabled: true,
				init: function(player) {
					player.addEventListener("update", butupd_first.bind(this));
				},
				click: function(player) { 
					player.first();
				},
			}
		}, {
			constructor: Control.Button,
			args: {
				name: "multiprev",
				//icon: "modern-fprev4.svg",
				disabled: true,
				init: function(player) {
					player.addEventListener("update", butupd_first.bind(this));
				},
				click: function(player) { 
					var p = WGo.clone(player.kifuReader.path);
					p.m -= 10; 
					player.goTo(p);
				},
			}
		},{
			constructor: Control.Button,
			args: {
				name: "previous",
				//icon: "modern-prev4.svg",
				disabled: true,
				init: function(player) {
					player.addEventListener("update", butupd_first.bind(this));
				},
				click: function(player) { 
					player.previous();
				},
			}
		}, {
			constructor: Control.MoveNumber,
		}, {
			constructor: Control.Button,
			args: {
				name: "next",
				//icon: "modern-next4.svg",
				disabled: true,
				init: function(player) {
					player.addEventListener("update", butupd_last.bind(this));
				},
				click: function(player) {
					player.next()
				},
			}
		}, {
			constructor: Control.Button,
			args: {
				name: "multinext",
				//icon: "modern-fnext4.svg",
				disabled: true,
				init: function(player) {
					player.addEventListener("update", butupd_last.bind(this));
				},
				click: function(player) { 
					var p = WGo.clone(player.kifuReader.path);
					p.m += 10; 
					player.goTo(p);
				},
			}
		}, {
			constructor: Control.Button,
			args: {
				name: "last",
				//icon: "modern-last4.svg",
				disabled: true,
				init: function(player) {
					player.addEventListener("update", butupd_last.bind(this));
				},
				click: function(player) {
					player.last()
				},
			}
		}]
	}
}];

WGo.Player.layouts["right_top"].top.push("Control");
WGo.Player.layouts["one_column"].top.push("Control");
WGo.Player.layouts["no_comment"].bottom.push("Control");
WGo.Player.layouts["minimal"].bottom.push("Control");

WGo.Player.component.Control = Control;

})(WGo);
