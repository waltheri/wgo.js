/**
 * WGo's game engine offers to set 3 rules:
 *
 * - *checkRepeat* - one of `repeat.KO`, `repeat.ALL`, `repeat.NONE` - defines if or when a move can be repeated.
 * - *allowRewrite* - if set true a move can rewrite existing move (for uncommon applications)
 * - *allowSuicide* - if set true a suicide will be allowed (and stone will be immediately captured)
 *
 * In this module there are some common preset rule sets (Japanese, Chinese etc...).
 * Extend object `gameRules` if you wish to add some rule set. Names of the rules should correspond with
 * SGF `RU` property.
 */
export declare enum Repeating {
    KO = "KO",
    ALL = "ALL",
    NONE = "NONE"
}
export interface GoRules {
    repeating: Repeating;
    allowRewrite: boolean;
    allowSuicide: boolean;
    komi: number;
}
export declare const JAPANESE_RULES: GoRules;
export declare const CHINESE_RULES: GoRules;
export declare const ING_RULES: GoRules;
export declare const NO_RULES: GoRules;
declare const _default: {
    Japanese: GoRules;
    GOE: GoRules;
    NZ: GoRules;
    AGA: GoRules;
    Chinese: GoRules;
};
export default _default;
