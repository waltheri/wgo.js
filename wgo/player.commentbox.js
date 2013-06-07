(function(WGo, undefined){

var prepare_dom = function() {
	this.box = document.createElement("div");
	this.box.className = "wgo-box-wrapper wgo-comments-wrapper";
	this.element.appendChild(this.box);
	
	this.comments_title = document.createElement("div");
	this.comments_title.className = "wgo-box-title";
	this.comments_title.innerHTML = WGo.t("comments");
	
	/*
	var name_color;
	name_color = document.createElement("div");
	name_color.className = "wgo-comment-img wgo-box-img";
	name_color.innerHTML = "<div></div>";
	
	this.box.appendChild(name_color);*/
	this.box.appendChild(this.comments_title);
	
	this.comments = document.createElement("div");
	this.comments.className = "wgo-comments-content";
	this.box.appendChild(this.comments);		 
}

var mark = function(move) {
	var x,y;
	
	x = move.charCodeAt(0)-'a'.charCodeAt(0);
	if(x < 0) x += 'a'.charCodeAt(0)-'A'.charCodeAt(0);
	if(x > 7) x--;
	y = (move.charCodeAt(1)-'0'.charCodeAt(0));
	if(move.length > 2) y = y*10+(move.charCodeAt(2)-'0'.charCodeAt(0));
	y = this.kifuReader.game.size-y;

	this._tmp_mark = {type:'MA', x:x, y:y};
	this.board.addObject(this._tmp_mark);
}
var unmark = function() {
	this.board.removeObject(this._tmp_mark);
	delete this._tmp_mark;
}

var search_nodes = function(nodes, player) {
	for(var i in nodes) {
		if(nodes[i].className && nodes[i].className == "wgo-move-link") {
			nodes[i].addEventListener("mouseover", mark.bind(player, nodes[i].innerHTML));
			nodes[i].addEventListener("mouseout", unmark.bind(player));
		}
		else if(nodes[i].childNodes && nodes[i].childNodes.length) search_nodes(nodes[i].childNodes, player);
	}
}	

var format_info = function(info, title) {
	var ret = '<div class="wgo-info-list">';
	if(title) ret += '<div class="wgo-info-title">'+WGo.t("gameinfo")+'</div>';
	for(var key in info) {
		ret += '<div class="wgo-info-item"><span class="wgo-info-label">'+key+'</span><span class="wgo-info-value">'+info[key]+'</span></div>';
	}
	ret += '</div>';
	return ret;
}

var CommentBox = WGo.extendClass(WGo.Player.component.Component, function(player) {
	this.super(player);

	this.element.className = "wgo-commentbox";
	
	prepare_dom.call(this);
	
	player.addEventListener("kifuLoaded", function(e) {
		if(e.kifu.hasComments()) {
			this.comments_title.innerHTML = WGo.t("comments");
			this.element.className = "wgo-commentbox";
			
			this._update = function(e) {
				this.setComments(e);
			}.bind(this);
			
			this.player.addEventListener("update", this._update);
		}
		else {
			this.comments_title.innerHTML = WGo.t("gameinfo");
			this.element.className = "wgo-commentbox wgo-gameinfo";
			
			if(this._update) {
				this.player.removeEventListener("update", this._update);
				delete this._update;
			}
			this.comments.innerHTML = format_info(e.target.getGameInfo());
		}
	}.bind(this));

});

CommentBox.prototype.setComments = function(e) {
	var msg = "";
	if(!e.node.parent) {
		msg = format_info(e.target.getGameInfo(), true);
	}
	
	this.comments.innerHTML = msg+this.getCommentText(e.node.comment, e.target.config.formatNicks, e.target.config.formatMoves);
	
	if(e.target.config.formatMoves) {
		if(this.comments.childNodes && this.comments.childNodes.length) search_nodes(this.comments.childNodes, e.target);
	}
};

CommentBox.prototype.getCommentText = function(comment, formatNicks, formatMoves) {
	// to avoid XSS we must transform < and > to entities, it is highly recomanded not to change it
	//.replace(/</g,"&lt;").replace(/>/g,"&gt;") : "";
	if(comment) {
		var comm =  "<p>"+WGo.filterHTML(comment).replace(/\n/g, "</p><p>")+"</p>";
		if(formatNicks) comm = comm.replace(/(<p>)([^:]{3,}:)\s/g, '<p><span class="wgo-comments-nick">$2</span> ');
		if(formatMoves) comm = comm.replace(/\b[a-zA-Z]1?\d\b/g, '<a href="javascript:void(0)" class="wgo-move-link">$&</a>');
		return comm;
	}
	return "";
};

//CommentBox.comment_transform = CommentBox.addAround("getCommentText", comment_transform, CommentBox.prototype.getCommentText);

WGo.Player.layouts["right_top"].right.push("CommentBox");
WGo.Player.layouts["one_column"].bottom.push("CommentBox");

WGo.Player.component.CommentBox = CommentBox

})(WGo);
