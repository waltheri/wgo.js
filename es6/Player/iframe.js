export default function(styles, scripts) {
	return `
		<!DOCTYPE html>
		<html class="wgo-player-iframe-content">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width,initial-scale=1">
				${styles.reduce((prev, current) => prev+`<link rel="stylesheet" href="${current}">`, ``)}
			</head>
			<body>
				<div id="player"></div>
				${scripts.reduce((prev, current) => prev+`<script src="${current}"></script>`, ``)}
			</body>
		</html>
	`;
}
