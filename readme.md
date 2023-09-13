# WGo - JavaScript library for game of Go

WGo is a JavaScript library for purposes of game of Go. You can easily embed a board or a SGF editor on your webpage. It also contains lots of utilities like SGF parser.

## Components

### SGF Parser

WGo contains low level `SGFParser` class, which can parse SGF string into JavaScript object. You probably won't need to use this class, if you are using other parts of the library. However this can be useful for example if you want to convert SGF file to other formats or your own data structure.

#### Basic usage

```typescript
// Parse SGF string into array of game records (SGF format actually allows multiple games in one file)
import { SGFParser } from 'wgo';

const sgfParser = new SGFParser();
const parsedGameRecords = sgfParser.parseCollection('(;DT[2100-12-01]KM[7.5];B[aa];W[bb])');
```

#### Parser's API

##### `parseCollection(sgfString: `*`string`*`): `*`SGFCollection`*

Parses a SGF *Collection* - `Collection = GameTree { GameTree }`. This is the main method for parsing SGF files and most the time this is only method you will need. It returns `SGFCollection`, which is just alias for `SGFGameTree[]`. And `SGFGameTree` is plain object with this structure:

```typescript
interface SGFGameTree {
  sequence: SGFNode[];
  children: SGFGameTree[];
}
```

Where `SGFNode` represents one node of the SGF:

```typescript
type SGFNode = SGFProperties = {
  [key in PropIdent]?: string[];
}
```

And `PropIdent` is enumeration of all possible SGF property identifiers.

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
