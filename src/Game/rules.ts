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

/**
 * Specifies how/if position can be repeated during the game.
 */
export enum Repeating {
  /** Position may not be same as the previous one (basic ko rule used in Japanese rules). */
  KO = 'KO',

  /** Position may never occur again - disallows super ko (used in Chinese rules).  */
  ALL = 'ALL',

  /**
   * No restrictions - position can repeat arbitrarily (not in any rules, but can be useful
   * in some situations).
   */
  NONE = 'NONE',
}

/**
 * Specification of go rules. Currently this is not complete set of rules to compute
 * game result, however it is enough to decide valid/invalid move.
 */
export interface GoRules {
  /**
   * What kind of repeating of position is forbidden (ko rule).
   */
  repeating: Repeating;

  /**
   * If set true a move can rewrite existing move (for special applications).
   */
  allowRewrite: boolean;

  /**
   * If set true a suicide will be allowed (and stone will be immediately captured), used in ING rules.
   */
  allowSuicide: boolean;

  /**
   * Size of a komi (white's extra points). Can be used to count result. However it may not be enough.
   * TODO: add some other rule/s needed to count result exactly.
   */
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
