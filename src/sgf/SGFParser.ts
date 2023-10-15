import { SGFSyntaxError } from './SGFSyntaxError';
import { SGFParsingContext } from './SGFParsingContext';
import { PropIdent, SGFProperties, SGFCollection, SGFGameTree, SGFNode } from './sgfTypes';

/**
 * Contains methods for parsing sgf string.
 * @module SGFParser
 */

const CODE_A = 'A'.charCodeAt(0);
const CODE_Z = 'Z'.charCodeAt(0);

function isCharUCLetter(char: string) {
  if (!char) {
    return false;
  }

  const charCode = char.charCodeAt(0);
  return charCode >= CODE_A && charCode <= CODE_Z;
}

/**
 * Parses SGF string into plain JavaScript object. You probably won't need to use this class, if you are using
 * other parts of the library. However this can be useful for example if you want to convert SGF file to other
 * formats or your own data structure. SGF property values in resulting object are stored as strings, so this is
 * not best choice for further processing. For that reason, WGo also contains `Kifu` object, which is higher
 * representation of go game record with methods for its easier manipulation.
 *
 * @example
 * ```javascript
 * // Parse SGF string into array of game records (SGF format actually allows multiple games in one file)
 * import { SGFParser } from 'wgo';
 *
 * const sgfParser = new SGFParser();
 * const parsedGameRecords = sgfParser.parseCollection('(;DT[2100-12-01]KM[7.5];B[aa];W[bb])');
 * console.log(parsedGameRecords[0]); // { sequence: [ { DT: ['2100-12-01'], KM: ['7.5'] }, { B: ['aa'] }, { W: ['bb'] } ], children: [] }
 * ```
 */
export class SGFParser {
  /**
   * Parse SGF property value - `"[" CValueType "]"`.
   *
   * @param sgfString
   * @param optional If true, empty string will be accepted and undefined will be returned.
   * @param context Internal state of the parsing. This should never be set.
   */
  parsePropertyValue(
    sgfString: string,
    optional = false,
    context = new SGFParsingContext(),
  ): string {
    if (optional && context.currentNonWhitespaceChar(sgfString) !== '[') {
      return;
    }

    let value = '';

    // process "[" and read first char
    let char = context.assertCharAndMoveToNext(sgfString, '[');

    while (char !== ']') {
      if (!char) {
        // char mustn't be undefined
        throw new SGFSyntaxError('End of SGF inside of property', sgfString, context);
      } else if (char === '\\') {
        // if there is character '\' save next character
        char = context.moveToNextChar(sgfString);

        if (!char) {
          // char have to exist of course
          throw new SGFSyntaxError('End of SGF inside of property', sgfString, context);
        } else if (char === '\n') {
          // ignore new line, otherwise save
          continue;
        }
      }

      // save the character
      value += char;

      // and move to next one
      char = context.moveToNextChar(sgfString);
    }

    context.assertCharAndMoveToNext(sgfString, ']');

    return value;
  }

  /**
   * Reads the property identifiers (One or more UC letters) - `UcLetter { UcLetter }`.
   *
   * @param sgfString
   * @param context Internal state of the parsing. This should never be set.
   */
  parsePropertyIdent(sgfString: string, context = new SGFParsingContext()): PropIdent {
    let ident = '';

    // Read current significant character
    let char = context.currentNonWhitespaceChar(sgfString);

    if (!isCharUCLetter(char)) {
      throw new SGFSyntaxError(
        'Property identifier must consists from upper case letters.',
        sgfString,
        context,
      );
    }

    ident += char;

    while ((char = context.moveToNextChar(sgfString))) {
      if (!isCharUCLetter(char)) {
        break;
      }

      ident += char;
    }

    return ident as PropIdent;
  }

  /**
   * Parses sequence of property values - `PropValue { PropValue }`.
   *
   * @param sgfString
   * @param context Internal state of the parsing. This should never be set.
   */
  parsePropertyValues(sgfString: string, context = new SGFParsingContext()) {
    const values: string[] = [];
    let value = this.parsePropertyValue(sgfString, false, context);
    values.push(value);

    while ((value = this.parsePropertyValue(sgfString, true, context))) {
      values.push(value);
    }

    return values;
  }

  /**
   * Parses a SGF property - `PropIdent PropValue { PropValue }`.
   *
   * @param sgfString
   * @param context Internal state of the parsing. This should never be set.
   */
  parseProperty(sgfString: string, context = new SGFParsingContext()): [PropIdent, string[]] {
    if (!isCharUCLetter(context.currentNonWhitespaceChar(sgfString))) {
      return;
    }

    return [
      this.parsePropertyIdent(sgfString, context),
      this.parsePropertyValues(sgfString, context),
    ];
  }

  /**
   * Parses a SGF node - `";" { Property }`.
   *
   * @param sgfString
   * @param context Internal state of the parsing. This should never be set.
   */
  parseNode(sgfString: string, context = new SGFParsingContext()): SGFNode {
    context.assertCharAndMoveToNext(sgfString, ';');

    const properties: SGFProperties = {};
    let property: [PropIdent, string[]];

    while ((property = this.parseProperty(sgfString, context))) {
      properties[property[0]] = property[1];
    }

    return properties;
  }

  /**
   * Parses a SGF Sequence - `Node { Node }`.
   *
   * @param sgfString
   * @param context Internal state of the parsing. This should never be set.
   */
  parseSequence(sgfString: string, context = new SGFParsingContext()): SGFNode[] {
    const sequence: SGFNode[] = [];

    sequence.push(this.parseNode(sgfString, context));

    while (context.currentNonWhitespaceChar(sgfString) === ';') {
      sequence.push(this.parseNode(sgfString, context));
    }

    return sequence;
  }

  /**
   * Parses a SGF *GameTree* - `"(" Sequence { GameTree } ")"`.
   *
   * @param sgfString
   * @param context Internal state of the parsing. This should never be set.
   */
  parseGameTree(sgfString: string, context = new SGFParsingContext()): SGFGameTree {
    context.assertCharAndMoveToNext(sgfString, '(');

    const sequence = this.parseSequence(sgfString, context);
    let children: SGFGameTree[] = [];

    if (context.currentNonWhitespaceChar(sgfString) === '(') {
      children = this.parseCollection(sgfString, context);
    }

    context.assertCharAndMoveToNext(sgfString, ')');

    return { sequence, children };
  }

  /**
   * Parses a SGF *Collection* - `Collection = GameTree { GameTree }`. This is the main method for parsing SGF file.
   *
   * @param sgfString
   * @param context Internal state of the parsing. This should never be set.
   */
  parseCollection(sgfString: string, context = new SGFParsingContext()): SGFCollection {
    const gameTrees: SGFCollection = [];
    gameTrees.push(this.parseGameTree(sgfString, context));

    while (context.currentNonWhitespaceChar(sgfString) === '(') {
      gameTrees.push(this.parseGameTree(sgfString, context));
    }

    return gameTrees;
  }
}
