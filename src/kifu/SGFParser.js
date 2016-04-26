/**
 * Contains methods for parsing sgf string
 * @module SGFParser
 */

// Matches sgf sequence, e.g.: "(;SZ[19];B[jj];W[kk])" => ["(", ";SZ[19]", ";B[jj]", ";W[kk]", ")"]
var reg_seq = /\(|\)|(;(\s*[A-Z]+(\s*((\[\])|(\[(.|\s)*?([^\\]\]))))+)*)/g;

// Matches sgf node, e.g.: ";AB[jj][kk]C[Hello]" => ["AB[jj][kk]", "C[Hello]"]
var reg_node = /[A-Z]+(\s*((\[\])|(\[(.|\s)*?([^\\]\]))))+/g;

// Matches sgf identificator, e.g.: "AB[jj][kk]" => "AB"
var reg_ident = /[A-Z]+/;

// Matches sgf property/-ies, e.g.: "AB[jj][kk]" => ["[jj]", "[kk]"]
var reg_props = /(\[\])|(\[(.|\s)*?([^\\]\]))/g;

// helper function for translating letters to numbers (a => 0, b => 1, ...)
var to_num = function(str, i) {
	return str.charCodeAt(i)-97;
}

var SGFParser = {
	/**
	 * Matches first SGf node in sequence, e.g.: `"AB[jj][kk]C[Hello];W[ll]" => "AB[jj][kk]C[Hello]"`.
	 */
	REG_NODE: /([A-Z]+((\[\])|(\[(.|\s)*?([^\\](\\\\)*\])))+)*/,
	
	/**
	 * Matches proeprties in node, e.g.: `"AB[jj][kk]C[Cool!]" => ["AB[jj][kk]", "C[Cool!]"]`.
	 */
	REG_PROPS: /[A-Z]+((\[\])|(\[(.|\s)*?([^\\](\\\\)*\])))+/g,
	
	/**
	 * Matches SGF property identificator, e.g.: `"AB[jj][kk]" => "AB"`.
	 */
	REG_PROP_IDENT: /[A-Z]+/,
	
	/**
	 * Matches property values from SGF property. e.g.: `"AB[jj][kk]" => ["[jj]", "[kk]"]`. Usage:
	 * 
	 * ```
	 * string.match(SGFParser.REG_PROPS); // returns array with property values (characters [ and ] are not removed)
	 * ```
	 */
	REG_PROP_VALS: /(\[\])|(\[(.|\s)*?([^\\](\\\\)*\]))/g,
	
	/**
	 * Regexp used for escaping characters. Usage:
	 * 
	 * ```
	 * string.replace(SGFParser.REG_ESCAPE, "$2");
	 * ```
	 */
	REG_ESCAPE: /\\((.)|(\n))/g
}

module.exports = SGFParser;
