(function() {

var prepare_dom = function() {
	this.element = document.createElement("div");
	
	prepare_dom_box.call(this,"white");
	prepare_dom_box.call(this,"black");
	this.element.appendChild(this.white.box);
	this.element.appendChild(this.black.box);
}

var prepare_dom_box = function(type) {
	this[type] = {};
	var t = this[type];
	t.box = document.createElement("div");
	t.box.className = "wgo-box-wrapper wgo-player-wrapper wgo-"+type;
	
	/*var name_wrapper;
	name_wrapper = document.createElement("div");
	name_wrapper.className = "wgo-player-name-wrapper";
	t.box.appendChild(name_wrapper);
	
	var name_color;
	name_color = document.createElement("div");
	name_color.className = "wgo-player-name-img";
	name_color.innerHTML = "<div></div>";
	
	t.name = document.createElement("div");
	t.name.className = "wgo-player-name-cell";
	
	name_wrapper.appendChild(t.name);
	name_wrapper.appendChild(name_color);*/

	t.name = document.createElement("div");
	t.name.className = "wgo-box-title";
	t.name.innerHTML = type;
	
	var name_color;
	name_color = document.createElement("div");
	name_color.className = "wgo-player-name-img wgo-box-img";
	name_color.innerHTML = "<div></div>";
	
	t.box.appendChild(name_color);
	t.box.appendChild(t.name);
	
	var info_wrapper;
	info_wrapper = document.createElement("div");
	info_wrapper.className = "wgo-player-info";
	t.box.appendChild(info_wrapper);
	
	t.info = {};
	t.info.rank = prepare_dom_info("rank");
	t.info.rank.val.innerHTML = "-";
	t.info.caps = prepare_dom_info("caps");
	t.info.caps.val.innerHTML = "0";
	t.info.time = prepare_dom_info("time");
	t.info.time.val.innerHTML = "--:--";
	info_wrapper.appendChild(t.info.rank.box);
	info_wrapper.appendChild(t.info.caps.box);
	info_wrapper.appendChild(t.info.time.box);
}

var prepare_dom_info = function(type) {
	var res = {};
	res.box = document.createElement("div");
	res.box.className = "wgo-player-info-box";
	
	var title = document.createElement("span");
	title.className = "wgo-player-info-title";
	title.innerHTML = WGo.t(type);
	res.box.appendChild(title);
	
	res.box.innerHTML += "<br/>";
	
	res.val = document.createElement("span");
	res.val.className = "wgo-player-info-value";
	res.box.appendChild(res.val);
	
	return res;
}

var kifu_loaded = function(e) {
	var info = e.kifu.info || {};
	
	if(info.black) {
		this.black.name.innerHTML = info.black.name || WGo.t("Black");
		this.black.info.rank.val.innerHTML = info.black.rank || "-";
	}
	else {
		this.black.name.innerHTML = WGo.t("Black");
		this.black.info.rank.val.innerHTML = "-";
	}
	if(info.white) {
		this.white.name.innerHTML = info.white.name || WGo.t("White");
		this.white.info.rank.val.innerHTML = info.white.rank || "-";
	}
	else {
		this.white.name.innerHTML = WGo.t("White");
		this.white.info.rank.val.innerHTML = "-";
	}
	
	this.black.info.caps.val.innerHTML = "0";
	this.white.info.caps.val.innerHTML = "0";
	
	if(info.TM) {
		this.setPlayerTime("black", info.TM);
		this.setPlayerTime("white", info.TM);
	}
	else {
		this.black.info.time.val.innerHTML = "--:--";
		this.white.info.time.val.innerHTML = "--:--";
	}
}

var update = function(e) {
	if(e.node.BL) this.setPlayerTime("black", e.node.BL);
	if(e.node.WL) this.setPlayerTime("white", e.node.WL);
	if(e.position.capCount.black !== undefined) this.black.info.caps.val.innerHTML = e.position.capCount.black;
	if(e.position.capCount.white !== undefined) this.white.info.caps.val.innerHTML = e.position.capCount.white;
}

var modifyFontSize = function(color) {

}

var InfoBox = function(player) {
	this.player = player;
	
	prepare_dom.call(this);
	
	//this.element.style.backgroundColor = "#bd4";
	this.element.className = "wgo-infobox";
	
	player.addEventListener("kifuLoaded", kifu_loaded.bind(this));
	
	player.addEventListener("update", update.bind(this));
}

InfoBox.prototype = {
	constructor: InfoBox,
	
	appendTo: function(target) {
		target.appendChild(this.element);
	},
	setPlayerTime: function(color, time) {
		var min = Math.floor(time/60);
		var sec = Math.round(time)%60;
		this[color].info.time.val.innerHTML = min+":"+((sec < 10) ? "0"+sec : sec);
	},
	
	updateDimensions: function() {
		modifyFontSize.call(this,"black");
		modifyFontSize.call(this,"white");
	}
}

WGo.Player.widgets.infobox = InfoBox;
WGo.Player.layouts["right_top"].right.push("infobox");
WGo.Player.layouts["one_column"].top.push("infobox");
WGo.Player.layouts["no_comment"].top.push("infobox");

WGo.Player.InfoBox = InfoBox;

})(WGo);
