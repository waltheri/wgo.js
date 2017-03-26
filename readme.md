# WGo.js #

WGo.js is javascript library for purposes of go game. The basic idea of this library is to help to create go web application easily without laborious programming of game's logic or board graphic interface. It is descendant of WGoApi and we can say WGo.js is second version of this library. I decided to remove word 'Api' from the name and add suffix '.js' as is common for javascript libraries. But in texts I use shortly WGo. 

WGo is written in javascript with help of HTML5 and WGo applications should work fine in all new browsers, even on Androids and iPhones. 
Unfortunately it won't work on Internet Explorer 8 and lower, because of absence of canvas element, which is crucial for drawing of a board.

WGo.js also comes with powerfull go player, or more precisely sgf game viewer, which can be embedded into websites. This player is designed to be unlimitedly extendable.

WGo.js contains two main modules Board and Game.

### Board ###

Graphical go board implemented in HTML5 canvas. It has extensive API for easy manipulation. You can add and remove predefined objects like stones on board, you can create your own objects, or even make cut-outs of board.

### Game ###

Object for storing of game's position and controling game's flow. With method "play" you can play move and create new position with rules applied.

## WGo.js Player ##

It is web viewer of Go games (SGF) built on top of the WGo.js library. You can easily put it into your website.
