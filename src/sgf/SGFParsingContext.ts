import { SGFSyntaxError } from './SGFSyntaxError';

const CODE_WHITE_CHAR = ' '.charCodeAt(0);

/**
 * SGF parsing context. This is internal class for SGFParser.
 */
export class SGFParsingContext {
  /** Current character position */
  position: number = 0;

  /** Current line number */
  lineNo: number = 1;

  /** Current char number (on the line) */
  charNo: number = 0;

  /**
   * Returns current significant character (ignoring whitespace characters).
   * If there is end of string, return undefined.
   */
  currentNonWhitespaceChar(sgfString: string): string {
    while (sgfString.charCodeAt(this.position) <= CODE_WHITE_CHAR) {
      // While the character is a whitespace, increase position pointer and line and column numbers.
      this.moveToNextChar(sgfString);
    }

    return sgfString[this.position];
  }

  /**
   * Move pointer to next character and return it (including whitespace).
   */
  moveToNextChar(sgfString: string) {
    if (sgfString[this.position] === '\n') {
      this.charNo = 0;
      this.lineNo++;
    } else {
      this.charNo++;
    }
    this.position++;

    return sgfString[this.position];
  }

  /**
   * Reads current significant character and if it isn't equal with the argument, throws an error.
   * Then move pointer to next character.
   */
  assertCharAndMoveToNext(sgfString: string, char: string) {
    if (this.currentNonWhitespaceChar(sgfString) !== char) {
      throw new SGFSyntaxError(
        `Unexpected character ${this.currentNonWhitespaceChar(
          sgfString,
        )}. Character ${char} was expected.`,
        sgfString,
        this,
      );
    }

    return this.moveToNextChar(sgfString);
  }
}
