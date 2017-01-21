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
		<script>
		var globalFn = function() {
			alert("iframe alert");
		}
		</script>
	</head>
	<body>
		<div id="player"></div>
		${scripts.reduce((prev, current) => prev+`<script src="${current}"></script>`, ``)}
	</body>
</html>
`;

var iframe = document.createElement("iframe");
iframe.setAttribute("srcdoc", iframeHTML);

document.addEventListener("DOMContentLoaded", () => {
	document.querySelector("div").appendChild(iframe);
	window.iframe = iframe;
});
