var lang = "en";
var version = "3.0";
var scripts = [];
var styles = [];

var iframeHTML = `
<!DOCTYPE html>
<html lang="${lang}" data-wgo-iframe>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<title>WGo Player ${version}</title>
		${styles.reduce((prev, current) => prev+`<link rel="stylesheet" href="${current}">`, ``)}
	</head>
	<body>
		<div id="player"></div>
		${scripts.reduce((prev, current) => prev+`<script src="${current}"></script>`, ``)}
	</body>
</html>
`;

console.log(iframeHTML);