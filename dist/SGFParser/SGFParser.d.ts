import { PropIdent, SGFCollection, SGFGameTree, SGFNode } from './sgfTypes';
/**
 * Class for parsing of sgf files. Can be used for parsing of SGF fragments as well.
 */
export default class SGFParser {
    /** SGF string to be parsed */
    sgfString: string;
    /** Current character position */
    position: number;
    /** Current line number */
    lineNo: number;
    /** Current char number (on the line) */
    charNo: number;
    /**
     * Creates new instance of SGF parser with SGF loaded ready to be parsed.
     * @param sgf string to parse.
     */
    constructor(sgf: string);
    /**
     * Returns current significant character (ignoring whitespace characters).
     * If there is end of string, return undefined.
     */
    protected currentChar(): string;
    /**
     * Move pointer to next character and return it (including whitespace).
     */
    protected nextChar(): string;
    /**
     * Reads current significant character and if it isn't equal with the argument, throws an error.
     * Then move pointer to next character.
     */
    protected processChar(char: string): string;
    /**
     * Parse SGF property value - `"[" CValueType "]"`.
     * @param optional
     */
    parsePropertyValue(optional?: boolean): string;
    /**
     * Reads the property identifiers (One or more UC letters) - `UcLetter { UcLetter }`.
     */
    parsePropertyIdent(): PropIdent;
    /**
     * Parses sequence of property values - `PropValue { PropValue }`.
     */
    parsePropertyValues(): string[];
    /**
     * Parses a SGF property - `PropIdent PropValue { PropValue }`.
     */
    parseProperty(): [PropIdent, string[]];
    /**
     * Parses a SGF node - `";" { Property }`.
     */
    parseNode(): SGFNode;
    /**
     * Parses a SGF Sequence - `Node { Node }`.
     */
    parseSequence(): SGFNode[];
    /**
     * Parses a SGF *GameTree* - `"(" Sequence { GameTree } ")"`.
     */
    parseGameTree(): SGFGameTree;
    /**
     * Parses a SGF *Collection* - `Collection = GameTree { GameTree }`. This is the main method for parsing SGF file.
     */
    parseCollection(): SGFCollection;
}
