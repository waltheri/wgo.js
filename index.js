// dummy index.js

var WGo = require("./es6/WGo");

WGo.CanvasBoard = require("./es6/CanvasBoard");
WGo.Position = require("./es6/Position");
WGo.Game = require("./es6/Game");

window.WGo = module.exports = WGo;
