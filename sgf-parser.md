# Parsing SGF

WGo library contains SGF (Smart Game Format) parser with full test coverage. It can be used independently
on other parts. There is low level `SGFParser` class for SGF parsing, and helpful `KifuNode` class for easier
go game record manipulation.

## SGFParser

`SGFParser` class can be used to parse SGF (as string) and also parts of SGF into simple JavaScript object
with similar structure as SGF itself.

For parsing SGF files there is method `parseCollection()` - this may be the only method you will need. It is
called parse collection, because SGF actually consists of collection of game trees (one game tree represents
one game). However in most situation there is only one game tree in collection.

Usage is like this:

<!-- demo:start(type=module) -->
<!-- panels:start -->
<!-- div:left-panel -->
<!-- tabs:start -->

### **JavaScript**
```js index.js
import { SGFParser } from 'wgo';

const sgfParser = new SGFParser('(;PB[black]PW[white];B[ab];W[cd](;B[ef])(;B[gh]))');
const parsed = sgfParser.parseCollection();

document.querySelector('#output').textContent = JSON.stringify(parsed, null, 2);
```

### **HTML**
```html
<pre id="output" style="font-size: 80%;"></div>
```

<!-- tabs:end -->
<!-- div:right-panel -->
<!-- tabs:start -->

### **Result**
<!-- demo:demo(height=300px) -->

<!-- tabs:end -->
<!-- panels:end -->
<!-- demo:end -->

The result is simple low level data structure `SGFCollection` with signature:

```ts
interface SGFNode = {
  [key in PropIdent]?: string[];
};

interface SGFGameTree {
  sequence: SGFNode[];
  children: SGFGameTree[];
}

type SGFCollection = SGFGameTree[];
```

You can then process it into any object you want.

### API

##### `SGFParser#constructor(sgf: string)`

Creates new instance of SGF parser with SGF string loaded ready to be parsed.

##### `SGFParser#parseCollection()`

Parses a SGF *Collection* - `Collection = GameTree { GameTree }`. This is the main method for parsing SGF file.
Returns `SGFCollection`.

##### `SGFParser#parseGameTree()`

Parses a SGF *GameTree* - `"(" Sequence { GameTree } ")"`. Returns `SGFGameTree`.

##### `SGFParser#parseSequence()`

Parses a SGF *Sequence* - `Node { Node }`. Returns `SGFNode[]`.

##### `SGFParser#parseNode()`

Parses a SGF *Node* - `";" { Property }`. Returns `SGFNode`.

##### `SGFParser#parseProperty()`

Parses a SGF property - `PropIdent PropValue { PropValue }`. Returns tuple with identifier and values - `[PropIdent, string[]]`.

##### `SGFParser#parsePropertyValues()`

Parses sequence of property values - `PropValue { PropValue }`. Returns values as array of strings.

##### `SGFParser#parsePropertyIdent()`

Reads the property identifiers (One or more UC letters) - `UcLetter { UcLetter }`. Returns `PropIdent`.

##### `SGFParser#parsePropertyValue()`

Parse SGF property value - `"[" CValueType "]"`. Returns value as string.

## KifuNode

For better go game record (kifu) manipulation. You can use WGo's high level class `KifuNode`.
The idea is to transform SGF into tree-like data structure with nodes - `KifuNode`, which are closely
related to SGF nodes. `KifuNode` API then allows to simply manipulate with properties and children.

SGF property values are transformed based on property identifier. Some values can be numbers, some string
and some even points. So for example `B[aa]` is transformed to `{ B: { x: 0, y: 0 } }`. On the other side
property `AB` (add black stone) can have multiple values so `AB[aa]` will be `{ AB: [{ x: 0, y: 0 }] }`.

Property transformers are defined in `propertyValueTypes` object. You can extended it, if some property
is missing.

### Example

```js
import { KifuNode, PropIdent } from 'wgo';

// creates root KifuNode from SGF
const rootNode = KifuNode.fromSGF('(;PB[black]PW[white];B[ab];W[cd](;B[ef])(;B[gh]))');

// sets property
rootNode.setProperty(PropIdent.BLACK_NAME, 'Joe');

// gets property
rootNode.getProperty(PropIdent.BLACK_NAME); // outputs: Joe

// specific property values are transformer to more handy objects
const childNode = rootNode.children[0];
childNode.getProperty(PropIdent.BLACK_MOVE); // outputs: {x: 0, y: 1}
```

There is ~20 useful manipulation methods, which are described in file `src/kifu/KifuNode.ts`.
