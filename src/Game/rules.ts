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

export enum Repeating {
  KO = 'KO',
  ALL = 'ALL',
  NONE = 'NONE',
}

export interface GoRules {
  repeating: Repeating;
  allowRewrite: boolean;
  allowSuicide: boolean;
  komi: number;
}

export const JAPANESE_RULES: GoRules = {
  repeating: Repeating.KO,
  allowRewrite: false,
  allowSuicide: false,
  komi: 6.5,
};

export const CHINESE_RULES: GoRules = {
  repeating: Repeating.NONE,
  allowRewrite: false,
  allowSuicide: false,
  komi: 7.5,
};

export const ING_RULES: GoRules = {
  repeating: Repeating.NONE,
  allowRewrite: false,
  allowSuicide: true,
  komi: 7.5,
};

export const NO_RULES: GoRules = {
  repeating: Repeating.ALL,
  allowRewrite: true,
  allowSuicide: true,
  komi: 0,
};

export default {
  Japanese: JAPANESE_RULES,
  GOE: ING_RULES,
  NZ: ING_RULES,
  AGA: CHINESE_RULES,
  Chinese: CHINESE_RULES,
};
