
(function(WGo) {

// board click callback for edit mode
var edit_board_click = function(x,y) {
	if(this.frozen || !this.kifuReader.game.isValid(x, y)) return;
	
	this.kifuReader.node.appendChild(new WGo.KNode({
		move: {
			x: x, 
			y: y, 
			c: this.kifuReader.game.turn
		}, 
		edited: true
	}));
	this.next(this.kifuReader.node.children.length-1);
}

// board mousemove callback for edit move - adds highlighting
var edit_board_mouse_move = function(x,y) {
	if(this.frozen || (this._lastX == x && this._lastY == y)) return;
	
	this._lastX = x;
	this._lastY = y;
	
	if(this._last_mark) {
		this.board.removeObject(this._last_mark);
	}
	
	if(x != -1 && y != -1 && this.kifuReader.game.isValid(x,y)) {
		this._last_mark = {
			type: "outline",
			x: x,
			y: y, 
			c: this.kifuReader.game.turn
		};
		this.board.addObject(this._last_mark);
	}
	else {
		delete this._last_mark;
	}
}

// board mouseout callback for edit move	
var edit_board_mouse_out = function() {
	if(this._last_mark) {
		this.board.removeObject(this._last_mark);
		delete this._last_mark;
		delete this._lastX;
		delete this._lastY;
	}
}

// get differences of two positions as a change object (TODO create a better solution, without need of this function)
var pos_diff = function(old_p, new_p) {
	var size = old_p.size, add = [], remove = [];
	
	for(var i = 0; i < size*size; i++) {
		if(old_p.schema[i] && !new_p.schema[i]) remove.push({x:Math.floor(i/size),y:i%size});
		else if(old_p.schema[i] != new_p.schema[i]) add.push({x:Math.floor(i/size),y:i%size,c:new_p.schema[i]});
	}
	
	return {
		add: add,
		remove: remove
	}
}

/**
 * Toggle edit mode.
 */
	
WGo.Player.prototype.toggleEditMode = function() {
	this.editMode = !this.editMode;
	if(this.editMode) {
		// save original kifu reader
		this._originalReader = this.kifuReader;
		
		// create new reader with cloned kifu
		this.kifuReader = new WGo.KifuReader(this.kifu.clone());
		
		// go to current position
		this.kifuReader.goTo(this._originalReader.path);
		
		// register edit listeners
		this._ev_click = edit_board_click.bind(this);
		this._ev_move = edit_board_mouse_move.bind(this);
		this._ev_out = edit_board_mouse_out.bind(this);
		this.board.addEventListener("click", this._ev_click);
		this.board.addEventListener("mousemove", this._ev_move);
		this.board.addEventListener("mouseout", this._ev_out);
	}
	else {
		// go to the last original position
		this._originalReader.goTo(this.kifuReader.path);
		
		// change object isn't actual - update it, not elegant solution, but simple
		this._originalReader.change = pos_diff(this.kifuReader.getPosition(), this._originalReader.getPosition());
		
		// update kifu reader
		this.kifuReader = this._originalReader;
		this.update(true);
		
		// remove edit listeners
		this.board.removeEventListener("click", this._ev_click);
		this.board.removeEventListener("mousemove", this._ev_move);
		this.board.removeEventListener("mouseout", this._ev_out);
		
		delete this._originalReader;
		delete this._ev_click;
		delete this._ev_move;
		delete this._ev_out;
	}
	return this.editMode;
};

})(WGo);
