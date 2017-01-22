/* global document, window */

/**
 * @class
 * Implements one layer of the HTML5 canvas
 */

export default class CanvasLayer {
	constructor() {
		this.element = document.createElement('canvas');
		this.context = this.element.getContext('2d');

		// Adjust pixel ratio for HDPI screens (e.g. Retina)
		this.pixelRatio = window.devicePixelRatio || 1;
		//this.context.scale(this.pixelRatio, this.pixelRatio);
		//this.context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
		this.context.scale(this.pixelRatio, this.pixelRatio);
		this.context.save();
	}

	setDimensions(width, height, board) {
		this.element.width = width;
		this.element.style.width = (width / this.pixelRatio) + 'px';
		this.element.height = height;
		this.element.style.height = (height / this.pixelRatio) + 'px';

		this.context.restore();
		this.context.save();
		this.context.transform(1, 0, 0, 1, board.linesShift, board.linesShift);
	}

	appendTo(element, weight) {
		this.element.style.position = 'absolute';
		this.element.style.zIndex = weight;
		element.appendChild(this.element);
	}

	removeFrom(element) {
		element.removeChild(this.element);
	}

	getContext() {
		return this.context;
	}

	initialDraw(/*board*/) {
		// abstract method to be implemented
	}

	draw(drawingFn, args, board) {
		this.context.save();
		drawingFn(this.context, args, board);
		this.context.restore();
	}

	drawField(drawingFn, args, board) {
		const leftOffset = Math.round(board.left + args.x * board.fieldWidth);
		const topOffset = board.top + args.y * board.fieldHeight;

		// create a "sandbox" for drawing function
		this.context.save();

		this.context.transform(1, 0, 0, 1, leftOffset, topOffset);
		this.context.beginPath();
		this.context.rect(-board.fieldWidth / 2, -board.fieldWidth / 2, board.fieldWidth, board.fieldHeight);
		this.context.clip();
		drawingFn(this.context, args, board);

		// restore context
		this.context.restore();
	}

	clear() {
		this.context.clearRect(0, 0, this.element.width, this.element.height);
	}
}
