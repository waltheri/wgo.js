(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var lang = "en";
var version = "3.0";
var scripts = [];
var styles = [];

var iframeHTML = "\n<!DOCTYPE html>\n<html lang=\"" + lang + "\" data-wgo-iframe>\n\t<head>\n\t\t<meta charset=\"UTF-8\">\n\t\t<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n\t\t<title>WGo Player " + version + "</title>\n\t\t" + styles.reduce(function (prev, current) {
	return prev + ("<link rel=\"stylesheet\" href=\"" + current + "\">");
}, "") + "\n\t</head>\n\t<body>\n\t\t<div id=\"player\"></div>\n\t\t" + scripts.reduce(function (prev, current) {
	return prev + ("<script src=\"" + current + "\"></script>");
}, "") + "\n\t</body>\n</html>\n";

console.log(iframeHTML);

},{}]},{},[1]);
