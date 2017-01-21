/* global document, window */

import CanvasLayer from "./CanvasLayer";

/**
 * @class
 * @extends WGo.CanvasBoard.CanvasLayer
 * Layer that is composed from more canvases. The proper canvas is selected according to drawn object.
 * In default there are 4 canvases and they are used for board objects like stones. This allows overlapping of objects.
 */
export default class MultipleCanvasLayer extends CanvasLayer {
	constructor(layers = 4) {
		super();
		this.init(layers);
	}

	init(n) {
		var tmp, tmpContext;

		this.layers = n;

		this.elements = [];
		this.contexts = [];

		// Adjust pixel ratio for HDPI screens (e.g. Retina)
		this.pixelRatio = window.devicePixelRatio || 1;

		for (var i = 0; i < n; i++) {
			tmp = document.createElement('canvas');
			tmpContext = tmp.getContext('2d');

			if (this.pixelRatio > 1) {
				tmpContext.scale(this.pixelRatio, this.pixelRatio);
			}

			this.elements.push(tmp);
			this.contexts.push(tmpContext);
		}
	}

	appendTo(element, weight) {
		for (var i = 0; i < this.layers; i++) {
			this.elements[i].style.position = 'absolute';
			this.elements[i].style.zIndex = weight;
			element.appendChild(this.elements[i]);
		}
	}

	removeFrom(element) {
		for (var i = 0; i < this.layers; i++) {
			element.removeChild(this.elements[i]);
		}
	}

	getContext(args) {
		if (args.x % 2) {
			return (args.y % 2) ? this.contexts[0] : this.contexts[1];
		}
		else {
			return (args.y % 2) ? this.contexts[2] : this.contexts[3];
		}
	}

	clear() {
		for (var i = 0; i < this.layers; i++) {
			this.contexts[i].clearRect(0, 0, this.elements[i].width, this.elements[i].height);
		}
	}

	setDimensions(width, height) {
		for (var i = 0; i < this.layers; i++) {
			this.elements[i].width = width;
			this.elements[i].style.width = (width / this.pixelRatio) + 'px';
			this.elements[i].height = height;
			this.elements[i].style.height = (height / this.pixelRatio) + 'px';
		}
	}
}
