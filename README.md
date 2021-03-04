> **Be aware!** This is a working draft of documentation for new version of **WGo.js 3.0**. Library itself is in development and things may change. It is not yet accurate and you shouldn't follow it.
> You probably want still use old (soon to be gone) version of [WGo](http://wgo.waltheri.net).

# WGo.js

WGo.js is JavaScript library for purposes of go game. The basic idea of this library is to help to create go web applications easily without laborious programming of game's logic or board graphic interface. It also contains SGF viewer, which can be embedded into a website. The player can be used without any configuration by users with only basic knowledge of HTML, however more advanced users can highly customize it for their needs and even extended it by custom plugins.

The library aims to be as lightweight as possible, so there are no dependencies. It is written in TypeScript, so there are nice type definitions by default. Finally some components like SGF parser are DOM independent so, you can use them in Node.JS environment as well.

## Getting started

If you are not experienced web developer, and you just want to simply insert a SGF player into your website with as little work as possible, you can download `dist/wgo.min.js` and `dist/wgo.min.css` files from this repo (*TODO: add links*) and include them preferably into `<head>` tag of your HTML. Then tags with attribute `data-wgo` will be automatically replaced by SGF player with a specified game. Simple example:

```html
<!DOCTYPE HTML>
<html>
  <head>
    <title>My page</title>
    <script type="text/javascript" src="dist/wgo.min.js"></script>
    <link type="text/css" href="dist/wgo.min.css" rel="stylesheet">
  </head>
  <body>
    <div data-wgo="game.sgf" style="width: 700px">
      Sorry, your browser doesn't support WGo.js. Download SGF <a href="game.sgf">directly</a>.
    </div>
  </body>
</html>
```

You will find more basic usage [here](basic-usage.md).

If a SGF viewer isn't enough and you would like to use WGo components (like a board) in your web application, or you just want to create your own player, NPM will be best choice. This will install WGo library into your project:

```
npm i wgo
```

Then you can use any component you need in your code like this:

```javascript
import { SVGBoard } from 'wgo';

const myBoard = new SVGBoard(document.getElementById('board'));
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate. *TODO: more info about styleguide, scripts etc...*

## License
[MIT](https://choosealicense.com/licenses/mit/)
