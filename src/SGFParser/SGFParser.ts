import SGFSyntaxError from './SGFSyntaxError';
import SGFTraverser from './SGFTraverser';
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
 * Class for parsing of sgf files. Can be used for parsing of SGF fragments as well.
 */
export default class SGFParser {
  /**
   * Parse SGF property value - `"[" CValueType "]"`.
   * @param optional
   */
  parsePropertyValue(sgfString: string, optional = false, traverser = new SGFTraverser()): string {
    if (optional && traverser.currentNonWhitespaceChar(sgfString) !== '[') {
      return;
    }

    let value = '';

    // process "[" and read first char
    let char = traverser.assertCharAndMoveToNext(sgfString, '[');

    while (char !== ']') {
      if (!char) {
        // char mustn't be undefined
        throw new SGFSyntaxError('End of SGF inside of property', sgfString, traverser);
      } else if (char === '\\') {
        // if there is character '\' save next character
        char = traverser.moveToNextChar(sgfString);

        if (!char) {
          // char have to exist of course
          throw new SGFSyntaxError('End of SGF inside of property', sgfString, traverser);
        } else if (char === '\n') {
          // ignore new line, otherwise save
          continue;
        }
      }

      // save the character
      value += char;

      // and move to next one
      char = traverser.moveToNextChar(sgfString);
    }

    traverser.assertCharAndMoveToNext(sgfString, ']');

    return value;
  }

  /**
   * Reads the property identifiers (One or more UC letters) - `UcLetter { UcLetter }`.
   */
  parsePropertyIdent(sgfString: string, traverser = new SGFTraverser()): PropIdent {
    let ident = '';

    // Read current significant character
    let char = traverser.currentNonWhitespaceChar(sgfString);

    if (!isCharUCLetter(char)) {
      throw new SGFSyntaxError('Property identifier must consists from upper case letters.', sgfString, traverser);
    }

    ident += char;

    while (char = traverser.moveToNextChar(sgfString)) {
      if (!isCharUCLetter(char)) {
        break;
      }

      ident += char;
    }

    return ident as PropIdent;
  }

  /**
   * Parses sequence of property values - `PropValue { PropValue }`.
   */
  parsePropertyValues(sgfString: string, traverser = new SGFTraverser()) {
    const values: string[] = [];
    let value = this.parsePropertyValue(sgfString, false, traverser);

    if (value) {
      values.push(value);
    }

    while (value = this.parsePropertyValue(sgfString, true, traverser)) {
      values.push(value);
    }

    return values;
  }

  /**
   * Parses a SGF property - `PropIdent PropValue { PropValue }`.
   */
  parseProperty(sgfString: string, traverser = new SGFTraverser()): [PropIdent, string[]] {
    if (!isCharUCLetter(traverser.currentNonWhitespaceChar(sgfString))) {
      return;
    }

    return [this.parsePropertyIdent(sgfString, traverser), this.parsePropertyValues(sgfString, traverser)];
  }

  /**
   * Parses a SGF node - `";" { Property }`.
   */
  parseNode(sgfString: string, traverser = new SGFTraverser()): SGFNode {
    traverser.assertCharAndMoveToNext(sgfString, ';');

    const properties: SGFProperties = {};
    let property: [PropIdent, string[]];

    while (property = this.parseProperty(sgfString, traverser)) {
      properties[property[0]] = property[1];
    }

    return properties;
  }

  /**
   * Parses a SGF Sequence - `Node { Node }`.
   */
  parseSequence(sgfString: string, traverser = new SGFTraverser()): SGFNode[] {
    const sequence: SGFNode[] = [];

    sequence.push(this.parseNode(sgfString, traverser));

    while (traverser.currentNonWhitespaceChar(sgfString) === ';') {
      sequence.push(this.parseNode(sgfString, traverser));
    }

    return sequence;
  }

  /**
   * Parses a SGF *GameTree* - `"(" Sequence { GameTree } ")"`.
   */
  parseGameTree(sgfString: string, traverser = new SGFTraverser()): SGFGameTree {
    traverser.assertCharAndMoveToNext(sgfString, '(');

    const sequence = this.parseSequence(sgfString, traverser);
    let children: SGFGameTree[] = [];

    if (traverser.currentNonWhitespaceChar(sgfString) === '(') {
      children = this.parseCollection(sgfString, traverser);
    }

    traverser.assertCharAndMoveToNext(sgfString, ')');

    return { sequence, children };
  }

  /**
   * Parses a SGF *Collection* - `Collection = GameTree { GameTree }`. This is the main method for parsing SGF file.
   */
  parseCollection(sgfString: string, traverser = new SGFTraverser()): SGFCollection {
    const gameTrees: SGFCollection = [];
    gameTrees.push(this.parseGameTree(sgfString, traverser));

    while (traverser.currentNonWhitespaceChar(sgfString) === '(') {
      gameTrees.push(this.parseGameTree(sgfString, traverser));
    }

    return gameTrees;
  }
}
