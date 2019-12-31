import SGFParser from './SGFParser';
/**
 * Class for syntax errors in SGF string.
 * @ extends Error
 */
export declare class SGFSyntaxError extends Error {
    __proto__: Error;
    constructor(message: string, parser?: SGFParser);
}
export default SGFSyntaxError;
