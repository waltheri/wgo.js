# Tsumego extension

This extension allows you to insert a tsumego block into the website. However for now it is just a draft, so it could be buggy.

![Tsumego block screenshot](/extensions/tsumego/screenshot.png?raw=true)

## Installation

You need import all WGo javascript files (or minified versions) and files `tsumego.js` and `tsumego.css`.

```html
<script type="text/javascript" src="wgo/wgo.min.js"></script>
<script type="text/javascript" src="wgo/wgo.player.min.js"></script>
<script type="text/javascript" src="tsumego.js"></script>
<link rel="stylesheet" type="text/css" href="tsumego.css">
```

## Usage

Tsumego block can be created with the following code:

```javascript
new WGo.Tsumego(targetElement, options);
```

The first argument `targetElement` is a DOM element, where the tsumego block will be inserted. Don't forget, that this element must exist in the time of calling the constructor. Second argument is a configuration object.

### Options

Class `WGo.Tsumego` is a descendant of class `Wgo.Player` so configurable options are the same. However there are some new options, related to tsumegos.

* `movePlayed` - callback, which is called after every user's move
* `endOfVariation` - callback, which is called at the end of a variation (it can be either solution or incorrect variation)
* `answerDelay` - delay in milliseconds before computer plays its move (default `500`)
* `displayHintButton` - if true, a hint button will be displayed in the user interface (default `true`)
* `debug` - if true, variations will be highlighted on the board (default `false`)

### Tsumego

Tsumego can be any SGF or `WGo.Kifu` object and can be provided with one of these parameters: `sgf`, `sgfFile`, `json` of the configuration object. It also has to meet some conditions. 

In the first node of the SGF you need to setup a position of the tsumego. This can be done with any SGF editor. Then you can define unlimited number of variations - good or bad. However the last node (move) of correct variations has to contain `TE` property. This will indicate, the variation is a solution.

Moreover you can set a viewport of the tsumego with `VW` property. See [SGF specification](http://www.red-bean.com/sgf/properties.html#VW) for more info about this property.

### Example

```javascript
var tsumego = new WGo.Tsumego(document.getElementById("tsumego_wrapper"), {
	sgf: "(;FF[4]GM[1]VW[aa:jg]SZ[19]ST[2]EV[N° 1 .|. Level #2]AB[bb][cb][db][fb]AW[ea][eb][bc][cc][dc]C[Black to play]FG[1](;B[ec];W[fc];B[ed];W[gb](;B[fd];W[gc](;B[ab];W[ba](;B[bd];W[cd];B[ce];W[be](;B[dd];W[ad];B[ac]C[Correct!]TE[1])(;B[ac];W[ad];B[dd]C[Correct!]TE[1]))(;B[ce];W[ac]C[Fail!]))(;B[da];W[fa];B[ab];W[ba]C[Fail!]))(;B[ab];W[ba];B[fd];W[gc](;B[bd];W[cd];B[ce];W[be](;B[dd];W[ad];B[ac]C[Correct!]TE[1])(;B[ac];W[ad];B[dd]C[Correct!]TE[1]))(;B[ce];W[ac]C[Fail!]))(;B[da];W[fa];B[ab];W[ba]C[Fail!]))(;B[da];W[fc];B[ab];W[ba]C[Fail!]))",
	debug: true,
});
tsumego.setCoordinates(true);
```

File test.html also contains a working example.
