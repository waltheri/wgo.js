import SGFParser from './SGFParser';

/**
 * Class for syntax errors in SGF string.
 * @ extends Error
 */
export class SGFSyntaxError extends Error {
  // tslint:disable-next-line:variable-name
  __proto__: Error;

  constructor(message: string, parser?: SGFParser) {
    super(message);
    this.__proto__ = new.target.prototype;

    // var tempError = Error.apply(this);
    this.name = this.name = 'SGFSyntaxError';
    this.message = message || 'There was an unspecified syntax error in the SGF';

    if (parser) {
      this.message += ` on line ${parser.lineNo}, char ${parser.charNo}:\n`;
      this.message += `\t${parser.sgfString.split('\n')[parser.lineNo - 1]}\n`;
      this.message += `\t${Array(parser.charNo + 1).join(' ')}^`;
    }
  }
}

// a small ES5 hack because currently in ES6 you can't extend Errors
// SGFSyntaxError.prototype = Object.create(Error.prototype);
// SGFSyntaxError.prototype.constructor = SGFSyntaxError;

export default SGFSyntaxError;
