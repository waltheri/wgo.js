import SGFSyntaxError from './SGFSyntaxError';
import { PropIdent, SGFProperties, SGFCollection, SGFGameTree, SGFNode } from './sgfTypes';

/**
 * Contains methods for parsing sgf string.
 * @module SGFParser
 */

const CODE_A = 'A'.charCodeAt(0);
const CODE_Z = 'Z'.charCodeAt(0);
const CODE_WHITE_CHAR = ' '.charCodeAt(0);

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
  /** SGF string to be parsed */
  sgfString: string;

  /** Current character position */
  position: number = 0;

  /** Current line number */
  lineNo: number = 1;

  /** Current char number (on the line) */
  charNo: number = 0;

  /**
   * Creates new instance of SGF parser with SGF loaded ready to be parsed.
   * @param sgf string to parse.
   */
  constructor(sgf: string) {
    this.sgfString = sgf;
  }

  /**
   * Returns current significant character (ignoring whitespace characters).
   * If there is end of string, return undefined.
   */
  protected currentChar(): string {
    while (this.sgfString.charCodeAt(this.position) <= CODE_WHITE_CHAR) {
      // While the character is a whitespace, increase position pointer and line and column numbers.
      this.nextChar();
    }

    return this.sgfString[this.position];
  }

  /**
   * Move pointer to next character and return it (including whitespace).
   */
  protected nextChar() {
    if (this.sgfString[this.position] === '\n') {
      this.charNo = 0;
      this.lineNo++;
    } else {
      this.charNo++;
    }
    this.position++;

    return this.sgfString[this.position];
  }

  /**
   * Reads current significant character and if it isn't equal with the argument, throws an error.
   * Then move pointer to next character.
   */
  protected processChar(char: string) {
    if (this.currentChar() !== char) {
      throw new SGFSyntaxError(`Unexpected character ${this.currentChar()}. Character ${char} was expected.`, this);
    }

    return this.nextChar();
  }

  /**
   * Parse SGF property value - `"[" CValueType "]"`.
   * @param optional
   */
  parsePropertyValue(optional?: boolean): string {
    if (optional && this.currentChar() !== '[') {
      return;
    }

    let value = '';

    // process "[" and read first char
    let char = this.processChar('[');

    while (char !== ']') {
      if (!char) {
        // char mustn't be undefined
        throw new SGFSyntaxError('End of SGF inside of property', this);
      } else if (char === '\\') {
        // if there is character '\' save next character
        char = this.nextChar();

        if (!char) {
          // char have to exist of course
          throw new SGFSyntaxError('End of SGF inside of property', this);
        } else if (char === '\n') {
          // ignore new line, otherwise save
          continue;
        }
      }

      // save the character
      value += char;

      // and move to next one
      char = this.nextChar();
    }

    this.processChar(']');

    return value;
  }

  /**
   * Reads the property identifiers (One or more UC letters) - `UcLetter { UcLetter }`.
   */
  parsePropertyIdent(): PropIdent {
    let ident = '';

    // Read current significant character
    let char = this.currentChar();

    if (!isCharUCLetter(char)) {
      throw new SGFSyntaxError('Property identifier must consists from upper case letters.', this);
    }

    ident += char;

    while (char = this.nextChar()) {
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
  parsePropertyValues() {
    const values: string[] = [];
    let value = this.parsePropertyValue();

    if (value) {
      values.push(value);
    }

    while (value = this.parsePropertyValue(true)) {
      values.push(value);
    }

    return values;
  }

  /**
   * Parses a SGF property - `PropIdent PropValue { PropValue }`.
   */
  parseProperty(): [PropIdent, string[]] {
    if (!isCharUCLetter(this.currentChar())) {
      return;
    }

    return [this.parsePropertyIdent(), this.parsePropertyValues()];
  }

  /**
   * Parses a SGF node - `";" { Property }`.
   */
  parseNode(): SGFNode {
    this.processChar(';');

    const properties: SGFProperties = {};
    let property: [PropIdent, string[]];

    while (property = this.parseProperty()) {
      properties[property[0]] = property[1];
    }

    return properties;
  }

  /**
   * Parses a SGF Sequence - `Node { Node }`.
   */
  parseSequence(): SGFNode[] {
    const sequence: SGFNode[] = [];

    sequence.push(this.parseNode());

    while (this.currentChar() === ';') {
      sequence.push(this.parseNode());
    }

    return sequence;
  }

  /**
   * Parses a SGF *GameTree* - `"(" Sequence { GameTree } ")"`.
   */
  parseGameTree(): SGFGameTree {
    this.processChar('(');

    const sequence = this.parseSequence();
    let children: SGFGameTree[] = [];

    if (this.currentChar() === '(') {
      children = this.parseCollection();
    }

    this.processChar(')');

    return { sequence, children };
  }

  /**
   * Parses a SGF *Collection* - `Collection = GameTree { GameTree }`. This is the main method for parsing SGF file.
   */
  parseCollection(): SGFCollection {
    const gameTrees: SGFCollection = [];
    gameTrees.push(this.parseGameTree());

    while (this.currentChar() === '(') {
      gameTrees.push(this.parseGameTree());
    }

    return gameTrees;
  }
}
