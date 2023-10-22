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
export enum KoRule {
  /**
   * Position may not be same as the previous one (basic ko rule used in Japanese rules).
   */
  Ko = 'KO',

  /**
   * Position may never occur again - disallows super ko (used in Chinese rules).
   *
   * @see https://senseis.xmp.net/?PositionalSuperko
   */
  PositionalSuperKo = 'POS_SUPER_KO',

  /**
   * Situation may never occur again - situation consist of position and turn. For example
   * if suicide is allowed, playing suicide of one stone would be possible, in `KoRule.PositionalSuperKo`
   * it would not.
   *
   * @see https://senseis.xmp.net/?SituationalSuperko
   */
  SituationalSuperKo = 'SIT_SUPER_KO',

  /**
   * No restrictions - position can repeat arbitrarily (not in any rules, but can be useful
   * in some situations).
   */
  None = 'NONE',
}

/**
 * Specify how score is counted.
 *
 * @see https://senseis.xmp.net/?Scoring
 */
export enum Scoring {
  /**
   * In area scoring, your score is the number of empty points which only your stones surround
   * plus the number of your stones on the board. Used for example in Chinese rules.
   */
  Area = 'AREA',

  /**
   * In territory scoring, your score is the number of points which your stones surround minus
   * your captured stones. This scoring is used by classical Japanese rules.
   */
  Territory = 'TERRITORY',
}

/**
 * Specification of go rules. Currently this is not complete set of rules to compute
 * game result, however it is enough to decide valid/invalid move.
 */
export interface Rules {
  /**
   * What kind of repeating of position is forbidden (ko rule).
   */
  readonly koRule: KoRule;

  /**
   * If set true a move can rewrite existing move (for special applications).
   */
  readonly allowRewrite: boolean;

  /**
   * If set true a suicide will be allowed (and stone will be immediately captured), used in ING rules.
   */
  readonly allowSuicide: boolean;

  /**
   * Size of a komi (white's extra points). Can be used to count result. However it may not be enough.
   * TODO: add some other rule/s needed to count result exactly.
   */
  readonly komi: number;

  /**
   * Rule used for scoring.
   */
  readonly scoring: Scoring;

  /**
   * Name of the rules. Used in SGF or UI.
   */
  readonly name?: string;
}

export const JAPANESE_RULES: Rules = {
  koRule: KoRule.Ko,
  allowRewrite: false,
  allowSuicide: false,
  komi: 6.5,
  scoring: Scoring.Territory,
  name: 'Japanese',
};

export const CHINESE_RULES: Rules = {
  koRule: KoRule.PositionalSuperKo,
  allowRewrite: false,
  allowSuicide: false,
  komi: 7.5,
  scoring: Scoring.Area,
  name: 'Chinese',
};

export const ING_RULES: Rules = {
  koRule: KoRule.SituationalSuperKo,
  allowRewrite: false,
  allowSuicide: true,
  komi: 7.5,
  scoring: Scoring.Area,
  name: 'GOE',
};

export const NO_RULES: Rules = {
  koRule: KoRule.None,
  allowRewrite: true,
  allowSuicide: true,
  komi: 0,
  scoring: Scoring.Territory,
};

export const sgfRulesMap = {
  Japanese: JAPANESE_RULES,
  GOE: ING_RULES,
  NZ: ING_RULES,
  Chinese: CHINESE_RULES,
  AGA: {
    ...CHINESE_RULES,
    name: 'AGA',
  },
};
