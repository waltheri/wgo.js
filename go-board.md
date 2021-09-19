# Go board

For rendering go diagrams you can use standalone SVG go board component. You can also use it in your own player or application.
It supports many board objects like stones, squares, triangles and other markup. Because it is implemented as SVG, it is fully responsive.

## Features
* Many builtin board objects and possibility to add custom ones.
* Themeable - you can simply adjust colors, line widths etc.
* Coordinate labels switchable on all sides.
* Responsive - dynamically adjust all objects according to board dimensions.
* Custom viewport - only part of the board can be visible.
* By default no CSS and images dependencies.

## Usage

Usage is straightforward:

```js
const board = new SVGBoard(domElement, configuration);
```

First argument is DOM element, where the board is inserted. Second argument is optional configuration. Returned `SVGBoard` object
can be used for inserting board objects and additional manipulation.

## Board dimensions

You don't need to specify any dimensions. In that case board will take 100% width of the parent element, as it would be a block DOM element.
Height will be automatically computed. Alternatively you can specify exact width, height or both.

### Responsive board

In this example, board doesn't have specified dimensions. It will copy parent's width (which is dynamic according to viewport width).
If you resize window, you will see, that board width automatically adjusts.

<!-- demo:start(type=module) -->
<!-- panels:start -->
<!-- div:left-panel -->
<!-- tabs:start -->

### **JavaScript**
```js index.js
import { SVGBoard } from 'wgo';

const board = new SVGBoard(document.querySelector('#board'));
```

### **HTML**
```html
<div id="board" style="width: 480px; max-width: 100%"></div>
```

<!-- tabs:end -->
<!-- div:right-panel -->
<!-- demo:demo(height=500px) -->
<!-- panels:end -->
<!-- demo:end -->

### Custom width / height

In this example, board will always have specified width / height, height / width will be computed. If parent element will be smaller, board will overflow.
Normally a board is squared, so there is no difference between specifying width or height, however if you specify viewport, it can make difference.

<!-- demo:start(type=module) -->
<!-- panels:start -->
<!-- div:left-panel -->
<!-- tabs:start -->

### **JavaScript**
```js index.js
import { SVGBoard } from 'wgo';

const board1 = new SVGBoard(document.querySelector('#board'), {
    width: 250,
});

const board2 = new SVGBoard(document.querySelector('#board2'), {
    height: 200,
});
```

### **HTML**
```html
<div id="board" style="display: inline-block"></div>
<div id="board2" style="display: inline-block"></div>
```

<!-- tabs:end -->
<!-- div:right-panel -->
<!-- demo:demo(height=320px) -->
<!-- panels:end -->
<!-- demo:end -->

### Specifying both width and height

Dimensions of the board will have exact dimensions. Board content itself will be centered.

<!-- demo:start(type=module) -->
<!-- panels:start -->
<!-- div:left-panel -->
<!-- tabs:start -->

### **JavaScript**
```js index.js
import { SVGBoard } from 'wgo';

const board = new SVGBoard(document.querySelector('#board'), {
    width: 350,
    height: 250,
});
```

### **HTML**
```html
<div id="board"></div>
```

<!-- tabs:end -->
<!-- div:right-panel -->
<!-- demo:demo(height=300px) -->
<!-- panels:end -->
<!-- demo:end -->

## Different board sizes

For different board size than 19x19, use config property `size`. You can specify any number, but currently only squared boards are supported.

<!-- demo:start(type=module) -->
<!-- panels:start -->
<!-- div:left-panel -->
<!-- tabs:start -->

### **JavaScript**
```js index.js
import { SVGBoard } from 'wgo';

const board1 = new SVGBoard(document.querySelector('#board'), {
    size: 9,
    width: 150
});

const board2 = new SVGBoard(document.querySelector('#board2'), {
    size: 13,
    width: 200,
});
```

### **HTML**
```html
<div id="board" style="display: inline-block"></div>
<div id="board2" style="display: inline-block"></div>
```

<!-- tabs:end -->
<!-- div:right-panel -->
<!-- demo:demo(height=340px) -->
<!-- panels:end -->
<!-- demo:end -->

## Board coordinates

<!-- demo:start(type=module) -->
<!-- panels:start -->
<!-- div:left-panel -->
<!-- tabs:start -->

### **JavaScript**
```js index.js
import { SVGBoard } from 'wgo';

const board = new SVGBoard(document.querySelector('#board'), {
    width: 300,
    coordinates: true,
});

document.querySelector('#coordinates').addEventListener('change', (evt) => {
    board.setCoordinates(evt.target.checked);
});
```

### **HTML**
```html
<div style="margin-bottom: 0.5em">
    <label>
        <input type="checkbox" id="coordinates" checked> Display coordinates
    </label>
</div>
<div id="board"></div>
```

<!-- tabs:end -->
<!-- div:right-panel -->
<!-- demo:demo(height=400px) -->
<!-- panels:end -->
<!-- demo:end -->

## Board viewport

When displaying go diagram or tsumego, you may want to display only part of the board. In that case you can specify viewport. It is
object with signature:
```ts
interface BoardViewport {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
```
Where each number means offset from the side - number of fields which should be omitted. You can specify also negative numbers or fractions
for some special circumstances.

<!-- demo:start(type=module) -->
<!-- panels:start -->
<!-- div:left-panel -->
<!-- tabs:start -->

### **JavaScript**
```js index.js
import { SVGBoard } from 'wgo';

const board = new SVGBoard(document.querySelector('#board'), {
    coordinates: true,
    viewport: {
        top: 12,
        right: 8,
    },
});
```

### **HTML**
```html
<div id="board" style="width: 480px; max-width: 100%"></div>
```

<!-- tabs:end -->
<!-- div:right-panel -->
<!-- demo:demo(height=340px) -->
<!-- panels:end -->
<!-- demo:end -->

## Board objects

There are many builtin objects, which can be rendered on the board. There are stones,
markups (which have variations for white and black stones). There are also special object like lines and arrows.

<!-- demo:start(type=module) -->
<!-- panels:start -->
<!-- div:left-panel -->
<!-- tabs:start -->

### **JavaScript**
```js index.js
import { SVGBoard, FieldBoardObject, MarkupBoardObject, LineBoardObject, LabelBoardObject, Color } from 'wgo';

const board = new SVGBoard(document.querySelector('#board'));

function drawMarkup(y, type) {
    board.addObject(new FieldBoardObject('B', 6, y));
    board.addObject(new FieldBoardObject('W', 7, y));
    board.addObject(new MarkupBoardObject(type, 5, y));
    board.addObject(new MarkupBoardObject(type, 6, y, Color.B));
    board.addObject(new MarkupBoardObject(type, 7, y, Color.W));
}

drawMarkup(5, 'MA'); // X mark
drawMarkup(6, 'CR'); // Circle
drawMarkup(7, 'SQ'); // Square
drawMarkup(8, 'TR'); // Triangle
drawMarkup(9, 'SL'); // Dot
drawMarkup(10, 'DD'); // Dim

// Line objects, first argument is type, second start point, third end point
board.addObject(new LineBoardObject('LN', { x: 5, y: 11 }, { x: 7, y: 12 }));
board.addObject(new LineBoardObject('AR', { x: 5, y: 12 }, { x: 7, y: 13 }));

board.addObject(new FieldBoardObject('B', 6, 14));
board.addObject(new FieldBoardObject('W', 7, 14));
board.addObject(new LabelBoardObject('1', 5, 14));
board.addObject(new LabelBoardObject('2', 6, 14, Color.B));
board.addObject(new LabelBoardObject('3', 7, 14, Color.W));
```

### **HTML**
```html
<div id="board" style="width: 480px; max-width: 100%"></div>
```

<!-- tabs:end -->
<!-- div:right-panel -->
<!-- demo:demo(height=500px) -->
<!-- panels:end -->
<!-- demo:end -->

## Configuration

```ts
interface SVGBoardConfig {
  /** Size of the board - common values 9, 13, 19 (default 19). */
  size: number;

  /** Width of the board, if 0, width is automatically computed (default 0). */
  width: number;

  /** Height of the board, if 0, height is automatically computed (default 0). */
  height: number;
  
  /** Visible area of the board (specify offset from each side), default 0 from each side. */
  viewport: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  /** If true, coordinate labels will be visible. */
  coordinates: boolean;

  /** Theme object of the board. */
  theme: SVGBoardTheme;
}
```
