// dummy index.js

var WGo = require("./src/WGo");

WGo.CanvasBoard = require("./src/CanvasBoard");
WGo.Position = require("./src/Position");
WGo.Game = require("./src/Game");

window.WGo = module.exports = WGo;
