import defaultConfig from "./defaultConfig";
import defaultsDeep from "lodash/defaultsDeep";
import Kifu from "../Kifu";
import template from "./template";
import iframe from "./iframe";
import Board from "./components/Board";

export default class Player {
	constructor(elem, config) {
		// merge user config with default
		this.config = defaultsDeep(config || {}, defaultConfig);
		this.kifu = new Kifu();
		this.dom = {};
		this.domLoaded = null;

		if(this.config.inIframe) {
			this.initIframe(elem);
		}
		else {
			this.initPlayer(elem);
		}

		this.registerKifuEvents = this.registerKifuEvents.bind(this);
		this.updateCaptureCounts = this.updateCaptureCounts.bind(this);

		this.first = this.first.bind(this);
		this.prev10 = this.prev10.bind(this);
		this.prev = this.prev.bind(this);
		this.next = this.next.bind(this);
		this.next10 = this.next10.bind(this);
		this.last = this.last.bind(this);
	}

	loadSGFFromURL(url) {
		return fetch(url).then(sgf => this.loadSGF(sgf));
	}

	loadSGF(sgf) {
		this.kifu = Kifu.fromSGF(sgf);

		if (this.domLoaded) {
			this.domLoaded.then(this.registerKifuEvents);
		} 
		else {
			this.registerKifuEvents();
		}
	}

	initIframe(elem) {
		var iframeElem = document.createElement("iframe");
		iframeElem.setAttribute("srcdoc", iframe(this.config.styles, []));
		iframeElem.className = "wgo-iframe-player";
		elem.appendChild(iframeElem);
		
		this.domLoaded = new Promise((resolve) => {
			iframeElem.addEventListener("load", () => {
				this.initPlayer(iframeElem.contentDocument.getElementById("player"));
				resolve();
			});
		});

		return this.domLoaded;
	}

	initPlayer(elem) {
		elem.innerHTML = template;

		// board
		this.dom.board = elem.querySelector(".wgo-board-container");
		
		// buttons
		this.dom.first = elem.querySelector(".wgo-first");
		this.dom.prev10 = elem.querySelector(".wgo-prev-10");
		this.dom.prev = elem.querySelector(".wgo-prev");
		this.dom.next = elem.querySelector(".wgo-next");
		this.dom.next10 = elem.querySelector(".wgo-next-10");
		this.dom.last = elem.querySelector(".wgo-last");

		// capture stones counts
		this.dom.captureBlack = elem.querySelector(".wgo-capture-black");
		this.dom.captureWhite = elem.querySelector(".wgo-capture-white");

		if(!this.config.boardConfig.width) {
			this.config.boardConfig.width = parseInt(this.dom.board.offsetWidth);
		}

		this.board = new Board(this.config.board, this.dom.board, this.config.boardConfig);
	}

	registerKifuEvents() {
		this.domLoaded = null;
		this.board.registerEvents(this.kifu);

		this.dom.first.addEventListener("click", this.first);
		this.dom.prev10.addEventListener("click", this.prev10);
		this.dom.prev.addEventListener("click", this.prev);
		this.dom.next.addEventListener("click", this.next);
		this.dom.next10.addEventListener("click", this.next10);
		this.dom.last.addEventListener("click", this.last);

		this.kifu.on("update", this.updateCaptureCounts);
	}

	updateCaptureCounts(event) {
		this.dom.captureBlack.textContent = event.game.position.capCount.black;
		this.dom.captureWhite.textContent = event.game.position.capCount.white;
	}

	first() {
		this.kifu.first();
	}

	prev10() {
		//todo
	}

	prev() {
		this.kifu.previous();
	}

	next() {
		this.kifu.next();
	}

	next10() {
		//todo
	}

	last() {
		this.kifu.last();
	}
}
