import { SGFProperties, SGFPropertiesBag, SGFPropertyDescriptors } from '../sgf';
import { kifuInfoSGFPropertyDescriptors } from './kifuInfoSGFPropertyDescriptors';
import { kifuNodeSGFPropertyDescriptors } from './kifuNodeSGFPropertyDescriptors';

export enum KnownGoRule {
  AGA = 'AGA',
  GOE = 'GOE',
  Japanese = 'Japanese',
  NZ = 'NZ',
  Chinese = 'Chinese',
}

export interface KifuInfoCustomProperties {
  [key: string]: unknown;
}

/**
 * Information about the game. Listed fields are recognized by WGo and will rendered for example by the player if provided.
 * However, any other properties can be stored in `properties` object.
 */
export class KifuInfo extends SGFPropertiesBag {
  /**
   * Size of the board.
   *
   * @see https://www.red-bean.com/sgf/properties.html#SZ
   */
  boardSize?: number | { cols: number; rows: number };

  /**
   * Handicap. This is for information only, handicap stones must be set with `AB` properties.
   *
   * @see https://www.red-bean.com/sgf/go.html#HA
   */
  handicap?: number;

  /**
   * Komi. This is used when scoring territory.
   *
   * @see https://www.red-bean.com/sgf/go.html#KM
   */
  komi?: number;

  /**
   * @see https://www.red-bean.com/sgf/properties.html#ST
   */
  variationsStyle?: {
    /**
     * If true variations of current node should be shown (siblings variations). Otherwise successor info
     * variations are shown (children variations).
     */
    currentNode?: boolean;

    /**
     * If true, no variation markup should be shown on board.
     */
    noMarkup?: boolean;
  };

  /**
   * Black player's name.
   *
   * @see https://www.red-bean.com/sgf/properties.html#PB
   */
  blackName?: string;

  /**
   * Black player's rank.
   *
   * @see https://www.red-bean.com/sgf/properties.html#BR
   */
  blackRank?: string;

  /**
   * @see https://www.red-bean.com/sgf/properties.html#BT
   */
  blackTeam?: string;

  /**
   * White player's name.
   *
   * @see https://www.red-bean.com/sgf/properties.html#PW
   */
  whiteName?: string;

  /**
   * White player's rank.
   *
   * @see https://www.red-bean.com/sgf/properties.html#WR
   */
  whiteRank?: string;

  /**
   * @see https://www.red-bean.com/sgf/properties.html#WT
   */
  whiteTeam?: string;

  /**
   * @see https://www.red-bean.com/sgf/properties.html#GN
   */
  gameName?: string;

  /**
   * @see https://www.red-bean.com/sgf/properties.html#GC
   */
  gameComment?: string;

  /**
   * Provides the date when the game was played. Should be in ISO format.
   *
   * @see https://www.red-bean.com/sgf/properties.html#DT
   */
  date?: string;

  /**
   * Provides the name of the event (e.g. tournament).
   *
   * @see https://www.red-bean.com/sgf/properties.html#EV
   */
  event?: string;

  /**
   * @see https://www.red-bean.com/sgf/properties.html#PC
   */
  place?: string;

  /**
   * @see https://www.red-bean.com/sgf/properties.html#RO
   */
  round?: string;

  /**
   * Provides the result of the game. It is MANDATORY to use specified format.
   *
   * @see https://www.red-bean.com/sgf/properties.html#RE
   */
  result?:
    | '0'
    | 'Draw'
    | 'Void'
    | '?'
    | `B+${number}`
    | 'B+R'
    | 'B+Resign'
    | 'B+T'
    | 'B+Time'
    | 'B+F'
    | 'B+Forfeit'
    | `W+${number}`
    | 'W+R'
    | 'W+Resign'
    | 'W+T'
    | 'W+Time'
    | 'W+F'
    | 'W+Forfeit';

  /**
   * Provides the time limits of the game. The time limit is given in seconds.
   *
   * @see https://www.red-bean.com/sgf/properties.html#TM
   */
  timeLimits?: number;

  /**
   * Describes the method used for overtime (byo-yomi).
   *
   * @see https://www.red-bean.com/sgf/properties.html#OT
   */
  overTime?: string;

  /**
   * Specified rule set. This is used by game engine.
   *
   * @see https://www.red-bean.com/sgf/properties.html#RU
   */
  rules?: KnownGoRule | string;

  /**
   * @see https://www.red-bean.com/sgf/properties.html#SO
   */
  source?: string;

  /**
   * @see https://www.red-bean.com/sgf/properties.html#US
   */
  author?: string;

  /**
   * @see https://www.red-bean.com/sgf/properties.html#AN
   */
  annotator?: string;

  /**
   * @see https://www.red-bean.com/sgf/properties.html#CP
   */
  copyright?: string;

  /**
   * Additional properties. Usually SGF properties which doesn't have relevant meaning for the WGo. For example
   * charset (CA) or SGF version (FF). Unsupported or custom properties can be stored here too.
   */
  properties: KifuInfoCustomProperties = {};

  override getPropertyDescriptors() {
    return kifuInfoSGFPropertyDescriptors;
  }

  override setUnknownSGFProperty(propIdent: string, propValues: string[]) {
    if (!kifuNodeSGFPropertyDescriptors[propIdent]) {
      this.properties[propIdent] = propValues;
    }
  }

  static fromSGF(sgfProperties: SGFProperties | string) {
    const kifuInfo = new KifuInfo();
    kifuInfo.setSGFProperties(sgfProperties);
    return kifuInfo;
  }

  static fromJS(info: Partial<KifuInfo>) {
    const kifuInfo = new KifuInfo();
    Object.assign(kifuInfo, info);
    return kifuInfo;
  }

  static defineProperties(sgfPropertyDescriptors: SGFPropertyDescriptors<KifuInfo>) {
    Object.assign(kifuInfoSGFPropertyDescriptors, sgfPropertyDescriptors);
  }
}
