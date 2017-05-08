
export default class Board {
	constructor(BoardRenderer, elem, options) {
		this.boardRenderer = new BoardRenderer(elem, options);
		this.updateBoard = this.updateBoard.bind(this);
	}

	registerEvents(kifu) {
		kifu.on("update", this.updateBoard);
	}

	updateBoard(event) {
		let objects = [];
		let size = event.game.position.size;
		size
		// get stones
		for (let x = 0; x < size; x++) {
			objects[x] = [];
			for (let y = 0; y < size; y++) {
				objects[x][y] = [];
				if (event.game.position.grid[x * size + y]) {
					objects[x][y].push({x, y, c: event.game.position.grid[x * size + y]});
				}
			}
		}

		// get markup
		let move = event.target.getMove();
		if (move) objects[move.x][move.y].push({x: move.x, y: move.y, type: "CR"});

		// render board object
		this.boardRenderer.update(objects);
	}
}
