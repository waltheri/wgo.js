export default `
	<div class="wgo-player">
		<div class="wgo-board-wrapper">
			<div class="wgo-board-container"></div>
		</div>
		<div class="wgo-bottom">
			<div class="wgo-capture-info">
				<div class="wgo-capture-box wgo-capture-black">2</div>
				<div class="wgo-capture-box wgo-capture-white">5</div>
			</div>
			<button class="wgo-button wgo-menu">
				<span class="wgo-dot"></span>
				<span class="wgo-dot"></span>
				<span class="wgo-dot"></span>
			</button>
			<div class="wgo-control">
				<button class="wgo-button wgo-first"></button>
				<button class="wgo-button wgo-prev-10"></button>
				<button class="wgo-button wgo-prev"></button>
				<input type="text" class="wgo-move" maxlength="3" value="0">
				<button class="wgo-button wgo-next"></button>
				<button class="wgo-button wgo-next-10"></button>
				<button class="wgo-button wgo-last"></button>
			</div>
		</div>
	</div>
`;
