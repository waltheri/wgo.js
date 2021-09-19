# Basic usage

This section is intended for less experienced users, who just wish to include a sgf viewer into their web pages. If no configuration
is needed, you can just use HTML with special `data-wgo` attribute to auto load the player. For some basic configuration, simple JavaScript
is required. 

## Inserting a player with `data-wgo` attribute

All you need to do, is to include WGo JavaScript and CSS file into your HTML. After that all tags which will have `data-wgo` attribute set
will be turned into a SGF player automatically. Content of the attribute can be either path (URL) to the SGF file, or SGF file itself. Be aware
that if you specify URL, it must be located on your server (or have correct [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) headers set).
This is a security restriction by the browsers. If you will load SGF file programmatically this restriction applies as well.

```html
<!-- Load player with specified SGF from the same folder as current page -->
<div data-wgo="game.sgf"></div>

<!-- Load player with SGF from absolute URL -->
<div data-wgo="https://www.example.com/game.sgf"></div>

<!-- Load player with SGF file as string -->
<div data-wgo="(;GM[1]FF[4];B[qd];W[dp])"></div>
```

Width of the player will be the same as parent element (by default for `<div>` it is 100%). Height will be automatically computed. If you
want to modify dimensions of the player, set it with CSS.

```html
<!-- Set exact width, dynamic height -->
<div data-wgo="game.sgf" style="width: 500px"></div>

<!-- Restrict width, dynamic height -->
<div data-wgo="game.sgf" style="width: 100%; max-width: 500px"></div>

<!-- Exact dimensions -->
<div data-wgo="game.sgf" style="width: 500px; height: 300px"></div>
```

It is not recommended to set exact height - the player is by default responsive and needs certain height to accommodate all component.
If you set height too small, components may overflow.

## Inserting a player programmatically

## Example basic

<!-- demo:start -->
<!-- panels:start -->
<!-- div:left-panel -->
<!-- tabs:start -->

### **index.html**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="//cdn.jsdelivr.net/npm/wgo"></script>
    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/wgo/dist/style.css">
    <title>WGo demo</title>
</head>
<body>
    <div id="player" style="width: 480px; max-width: 100%"></div>
    <script src="index.js"></script>
</body>
</html>
```

### **index.js**
```js index.js
const { SVGBoard, BoardMarkupObject } = WGo; // import { SVGBoard } from 'wgo';

const board = new SVGBoard(document.querySelector('#player'));
board.addObject(new BoardMarkupObject('MA', 0, 0));
```

<!-- tabs:end -->
<!-- div:right-panel -->
<!-- demo:demo(height=500px) -->
<!-- panels:end -->
<!-- demo:end -->

## Example advanced

<!-- demo:start(type=module) -->
<!-- panels:start -->
<!-- div:left-panel -->
<!-- tabs:start -->

### **HTML**
```html
<div id="player" style="width: 480px; max-width: 100%"></div>
```

### **JavaScript**
```js index.js
import { SVGBoard, BoardMarkupObject } from 'wgo';

const board = new SVGBoard(document.querySelector('#player'));
board.addObject(new BoardMarkupObject('MA', 0, 0));
```

<!-- tabs:end -->
<!-- div:right-panel -->
<!-- demo:demo(height=500px) -->
<!-- panels:end -->
<!-- demo:end -->
