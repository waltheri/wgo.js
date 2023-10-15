# WGo - JavaScript library for game of Go

WGo is a JavaScript library for purposes of game of Go. You can easily embed a board or a SGF editor on your webpage. It also contains lots of utilities like SGF parser.

## Components

### SGF Parser

WGo contains low level `SGFParser` class, which can parse SGF string into JavaScript object. You probably won't need to use this class, if you are using other parts of the library. However this can be useful for example if you want to convert SGF file to other formats or your own data structure. SGF property values in resulting object are stored as strings, so this is not best choice for further processing. For that reason, WGo also contains `Kifu` object, which is higher representation of go game record with methods for its easy manipulation.

#### Basic usage

```javascript
// Parse SGF string into array of game records (SGF format actually allows multiple games in one file)
import { SGFParser } from 'wgo';

const sgfParser = new SGFParser();
const parsedGameRecords = sgfParser.parseCollection('(;DT[2100-12-01]KM[7.5];B[aa];W[bb])');
```

#### Parser's API

##### `new SGFParser()`

Creates an instance of SGF parser, can be used for parsing multiple SGFs.

##### `parseGameTree(sgfString: `*`string`*`): `*`SGFGameTree`*

Parses a SGF *GameTree* - `"(" Sequence { GameTree } ")"`. This method is used internally by `parseCollection` method, but you can use it if you want to parse only one game tree.

##### `parseSequence(sgfString: `*`string`*`): `*`SGFNode[]`*

Parses a SGF *Sequence* - `Node { Node }`. This method is used internally by `parseGameTree` method, you won't need it, unless you want to parse only fragment of the SGF.

##### `parseNode(sgfString: `*`string`*`): `*`SGFNode`*

Parses a SGF *Node* - `";" { Property }`. This method is used internally by `parseSequence` method, you won't need it, unless you want to parse only fragment of the SGF.

##### `parseProperty(sgfString: `*`string`*`): `*`[PropIdent, string[]]`*

Parses a SGF *Property* - `PropIdent PropValue { PropValue }`. This method is used internally by `parseNode` method, you won't need it, unless you want to parse only fragment of the SGF.

##### `parsePropertyIdent(sgfString: `*`string`*`): `*`PropIdent`*

Reads the property identifiers (One or more UC letters) - `UcLetter { UcLetter }`.

##### `parsePropertyValues(sgfString: `*`string`*`): `*`string[]`*

Parses sequence of property values - `PropValue { PropValue }`.

##### `parsePropertyValue(sgfString: `*`string`*`): `*`string`*

Parse SGF property value - `"[" CValueType "]"`.

### Kifu

Kifu is higher representation of go game record. It consists of game info object and root kifu node object. Nodes of the kifu
works in similar manner as in SGF, however instead of having game information in root node, they are in custom entity.

Although Kifu is class, it doesn't contain any state and it is easily serializable into plain JS object (JSON) and back. It only adds some utility methods for
easy manipulation. Basic usage is like this:

```javascript
import { Kifu, KifuNode, MarkupType } from 'wgo';

// Create kifu object from SGF
const kifu = Kifu.fromSGF('(;FF[4]SZ[19]AB[ab];B[cd];W[ef])');

console.log(kifu.info.boardSize); // 19
console.log(kifu.info.properties.FF); // 4
console.log(kifu.info.properties.AB); // undefined - AB is stored in kifu node
console.log(kifu.root.setup); // [{ x: 0, y: 1, c: 1 }] - Color.Black equals to 1
console.log(kifu.root.move); // undefined - no move here

const move1 = kifu.root.children[0];
console.log(move1.move); // { x: 2, y: 3, c: 1 }

const move2 = move1.children[0];
console.log(move2.move); // { x: 4, y: 5, c: -1 } - Color.White equals to -1

// Add variation
const altMove2 = new KifuNode();
altMove2.move = { x: 6, y: 7, c: -1 };
move1.children.push(altMove2);
console.log(kifu.toSGF()); // '(;FF[4]SZ[19]AB[ab];B[cd](;W[ef])(;W[GH]))'

// Set properties (markup) in SGF format
altMove2.setSGFProperties({
  TR: ['aa'],
  SQ: ['bb'],
});
console.log(kifu.toSGF()); // '(;FF[4]SZ[19]AB[ab];B[cd](;W[ef])(;W[GH]TR[aa]SQ[bb]))'

// Add additional markup
altMove2.addMarkup({ type: MarkupType.Square, x: 2, y: 2});
console.log(kifu.toSGF()); // '(;FF[4]SZ[19]AB[ab];B[cd](;W[ef])(;W[GH]TR[aa]SQ[bb][cc]))'
```

#### Kifu methods and properties

##### `new Kifu(info?: `*`KifuInfo`*`, root?: `*`KifuNode`*`)`

Creates an empty kifu object with empty root node.

##### `toSGF(): `*`string`*

Generates full SGF string from this kifu.

##### `toJS(): `*`string`*

Returns this kifu as plain JS object (JSON). This is useful for serialization.

##### `clone(): `*`Kifu`*

Deeply clones this kifu.

##### `getNode(path: `*`KifuPath`*` | `*`number`*`): `*`KifuNode`*

Gets kifu node located at given path. Path can be either simple number representing move number or object in format `{ moveNumber: number, variations: number[] }`, where variations are indexes of children, leading from root node to desired node, if there is more choices than one.

##### `info: `*`KifuInfo`*

Kifu info object

##### `root: `*`KifuNode`*

Root node object

##### `Kifu.fromJS(kifu: `*`Partial<Kifu>`*`)`

Creates Kifu object from plain JS object.

##### `Kifu.fromSGF(kifu: `*`string`*`)`

Creates Kifu object from SGF string.

#### KifuInfo

Contains information about go game record and other generic properties in human friendly format.

| Property | Description | SGF |
| -------- |------------ | --- |
| `boardSize` | Size of the board. Can be `number`, or `{ cols: number; rows: number }` for rectangular boards. | SZ |
| `handicap` | Handicap. This is for information only, handicap stones must be set with `AB` properties. | HA |
| `komi` | Komi. This is used when scoring territory. | KM |
| `variationsStyle.currentNode` | If true variations of current node should be shown (siblings variations). Otherwise successor info variations are shown (children variations). | ST |
| `variationsStyle.noMarkup` | If true, no variation markup should be shown on board. | ST
| `blackName` | Black player's name. | PB |
| `blackRank` | Black player's rank. | BR |
| `blackTeam` | Black's team. | BT |
| `whiteName` | White player's name. | PW |
| `whiteRank` | White player's rank. | WR |
| `whiteTeam` | White's team. | WT |
| `gameName` | Game's name | GN |
| `gameComment` | General comment of the game | GC |
| `date` | Provides the date when the game was played. Should be in ISO format as `string`. | DT |
| `event` | Provides the name of the event (e.g. tournament). | EV |
| `place` | Place where the game was played. | PC |
| `round` | Round in the tournament. | RO |
| `result` | Provides the result of the game. It is mandatory to use [SGF format](https://www.red-bean.com/sgf/properties.html#RE). | RE |
| `timeLimits` | Provides the time limits of the game. The time limit is given in seconds. | TM |
| `overTime` | Describes the method used for overtime (byo-yomi). | OT |
| `rules` | Specified rule set. This is used by game engine. | RU |
| `source` |  | SO |
| `author` |  | US |
| `annotator` |  | AN |
| `copyright` |  | CP |

Unknown SGF properties are set in `properties: { [propIdent: string]: string[] }`. You can use
it for your own properties, but it is also possible to "extend" the object with other fields.

Additionally there are static methods `KifuInfo.fromJS` and `KifuInfo.fromSGF` which work in the same way as in `Kifu` class.
For converting to SGF string (properties), there is method `getSGFProperties()`. For setting properties in SGF format there is
`setSGFProperty(propIdent: `*`string`*`, propValues: `*`string[]`*`)` or shorthand `setSGFProperties(sgfProperties: `*`SGFProperties`*` | `*`string`*`)`
to set multiple properties at once. These methods are also available on `KifuNode`.

#### KifuNode

Represents one "turn" of go game. In most cases it contains just black or white move, however there can be also meta information like comment, player's time left and properties
useful for reviews - board markup and setup of position. Node has property `children: KifuNode[]` which contain next move (or moves) of game. If it is empty, the game has ended,
if there is more than one node, there are multiple variations from this point.

| Property | Description | SGF |
| -------- |------------ | --- |
| `move` | Move in format `{ x: number, y: number, c: Color }`. If move should be pass, `x` and `y` are omitted | B / W |
| `setup` | Array of setup definitions in form `{ x: number, y: number, c: Color }`. To clear field use `Color.Empty`. | AB / AW / AE |
| `turn` | Sets player turn - next move should be played with this color. | PL |
| `markup` | Array of markup definitions (for example circles, triangles or labels). There are three types of markup. Point markup (board marker occupies only one field) - `{type: string, x: number, y: number}`, line markup (board marker has starting end ending point) - `{type: string, x1: number, y1: number, x2: number, y2: number}` and label markup (letters or numbers on the board) - same as point markup, but with additional `text` property. | *many* |
| `boardSection` | Defines visible part of the board. Can be used for diagrams. With shape `{ x1: number, y1: number, x2: number, y2: number }`. | VW |
| `blackTimeLeft` | Time left for black, after the move was made. Value is given in seconds. | BL |
| `blackStonesLeft` |  Number of black moves left (after the move of this node was played) to play in this byo-yomi period. | OB |
| `whiteTimeLeft` | Time left for white, after the move was made. Value is given in seconds. | WL |
| `whiteStonesLeft` | Number of white moves left (after the move of this node was played) to play in this byo-yomi period. | OW |
| `comment` | Comment for the node. Usually it's used to describe the move however it often contains chat from the online games too. | C |

There is also `properties` attribute for unknown SGF properties. Moreover there are several methods for setting position and markup.

##### `addSetup(point: `*`Point`*`, color: `*`Color`*`)`

Add setup. This will override existing setup in the node, so it is guaranteed there won't be more stones on one field. Example:

```javascript
import { Kifu, Color } from 'wgo';

const kifu = new Kifu();

// Set 2 handicap stones
kifu.root.addSetup({ x: 3 y: 3 }, Color.Black);
kifu.root.addSetup({ x: 15 y: 15 }, Color.Black);
```

##### `removeSetupAt(point: `*`Point`*`)`

Removes existing setup on given position.

##### `addMarkup(markup: `*`Markup`*`)`

Adds markup object into the node. Contrary to setup, there can be more markups on one field, but not the same type. Example:

```javascript
import { Kifu, KifuNode, Color, MarkupType } from 'wgo';

const kifu = new Kifu();
const node = new KifuNode();

// Available point markups
node.addMarkup({ type: MarkupType.Triangle, x: 1, y: 1 });
node.addMarkup({ type: MarkupType.Circle, x: 1, y: 2 });
node.addMarkup({ type: MarkupType.Dim, x: 1, y: 3 });
node.addMarkup({ type: MarkupType.XMark, x: 1, y: 4 });
node.addMarkup({ type: MarkupType.Square, x: 1, y: 5 });
node.addMarkup({ type: MarkupType.Selected, x: 1, y: 6 });

// Available line markups
node.addMarkup({ type: MarkupType.Line, x1: 3, y1: 1 x1: 3, y2: 5 });
node.addMarkup({ type: MarkupType.Arrow, x1: 5, y1: 1 x1: 5, y2: 5 });

// Label markup
node.addMarkup({ type: MarkupType.Label, x: 7, y: 1, text: 'A' });
```

##### `removeMarkup(markup: `*`Markup`*`)`

Removes existing markup (same type on same position).

##### `removeMarkupAt(point: Point)`

Removes all markup on given position. Line markups won't be affected.

#### Handling custom SGF properties

Kifu object (info and nodes) can contain custom properties - you can simply do `kifu.info.myCustomProperty = 'value'`. But what if you have custom SGF
property which should be added to Kifu. Luckily there are static methods `KifuInfo.defineProperties` and `KifuNode.defineProperties` which can de 
used to define custom SGF properties. Example:

```javascript
import { Kifu, KifuInfo } from 'wgo';

// FF property is not handled by default, but we can add it
KifuInfo.defineProperties({
  FF: {
    get(info) {
      return info.sgfVersion ? [String(info.sgfVersion)] : undefined;
    },
    set(info, [value]) {
      if (value) {
        info.sgfVersion = value;
      }
    },
  },
});

const kifu = Kifu.fromSGF('(;FF[4]SZ[19]AB[ab];B[cd];W[ef])');
console.log(kifu.info.sgfVersion); // 4
kifu.info.sgfVersion = 5;
console.log(kifu.toSGF()); // (;FF[5]SZ[19]AB[ab];B[cd];W[ef])
```

We can add properties to `KifuNode` too, there are even some additional helpers to add custom markups:

```javascript
import { Kifu, KifuNode } from 'wgo';

KifuNode.defineProperties({
  STAR: KifuNode.createPointMarkupDescriptor('FOO'),
  RECT: KifuNode.createLineMarkupDescriptor('BAR'),
});
const kifu = Kifu.fromSGF('(;STAR[ab];RECT[cd:ef])');

console.log(kifu.root.markup); // [{ x: 0, y: 1, type: 'STAR' }]
console.log(kifu.root.children[0].markup); // [{ x1: 2, y1: 3, x2: 4, y2: 5, type: 'RECT' }]
```

### Game

Go game evaluator, board position, game state...
