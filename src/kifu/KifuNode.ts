import { SGFPropertiesBag, SGFPropertyDescriptors, SGFProperties } from '../sgf';
import { Color, Field, Move, Point } from '../types';
import { kifuInfoSGFPropertyDescriptors } from './kifuInfoSGFPropertyDescriptors';
import { kifuNodeSGFPropertyDescriptors } from './kifuNodeSGFPropertyDescriptors';

export enum MarkupType {
  Arrow = 'AR',
  Circle = 'CR',
  Dim = 'DD',
  Label = 'LB',
  Line = 'LN',
  XMark = 'MA',
  Selected = 'SL',
  Square = 'SQ',
  Triangle = 'TR',
}

export interface PointMarkup {
  readonly type:
    | MarkupType.Circle
    | MarkupType.Dim
    | MarkupType.Selected
    | MarkupType.Square
    | MarkupType.Triangle
    | MarkupType.XMark;
  readonly x: number;
  readonly y: number;
}

export interface LineMarkup {
  readonly type: MarkupType.Arrow | MarkupType.Line;
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}

export interface LabelMarkup {
  readonly type: MarkupType.Label;
  readonly x: number;
  readonly y: number;
  readonly text: string;
}

export type Markup = PointMarkup | LineMarkup | LabelMarkup;

export interface KifuNodeCustomProperties {
  [key: string]: unknown;
}

/**
 * Class representing one kifu node. It contains some helpful methods for working with the node. Not all SGF properties are supported,
 * but you can access them through `properties` property.
 */
export class KifuNode extends SGFPropertiesBag {
  /**
   * Children of the node. Usually there is only one child representing next move, but there can be more children,
   * that would mean multiple variations.
   */
  children: KifuNode[] = [];

  /**
   * Contains black's or white's move. Unlike in SGF only one move is allowed per node.
   */
  move?: Move;

  /**
   * Setup black or white stones or clear existing stones. This is taken from SGF properties `AB`, `AW` and `AE`.
   *
   * This shouldn't be mutated directly, you can replace it or use methods `removeSetupAt` or `addSetup`.
   */
  setup: Field[] = [];

  /**
   * Sets player turn - next move should be played with this color.
   *
   * @see https://www.red-bean.com/sgf/properties.html#PL
   */
  player?: Color.Black | Color.White;

  /**
   * Node markup - for example triangles or square marking some stones or empty fields. WGo supports these
   * SGF markup properties: `AR`, `CR`, `DD`, `LN`, `LB`, `MA`, `SL`, `SQ` and `TR`.
   *
   * This shouldn't be mutated directly, you can replace it or use methods `removeMarkup`, `removeMarkupAt` or `addMarkup`.
   */
  markup: Markup[] = [];

  /**
   * View only part of the board.
   *
   * @see https://www.red-bean.com/sgf/properties.html#VW
   */
  boardSection?: {
    readonly x1: number;
    readonly y1: number;
    readonly x2: number;
    readonly y2: number;
  };

  /**
   * Time left for black, after the move was made. Value is given in seconds.
   *
   * @see https://www.red-bean.com/sgf/properties.html#BL
   */
  blackTimeLeft?: number;

  /**
   * Number of black moves left (after the move of this node was played) to play in this byo-yomi period.
   *
   * @see https://www.red-bean.com/sgf/properties.html#OB
   */
  blackStonesLeft?: number;

  /**
   * Time left for white, after the move was made. Value is given in seconds.
   *
   * @see https://www.red-bean.com/sgf/properties.html#WL
   */
  whiteTimeLeft?: number;

  /**
   * Number of white moves left (after the move of this node was played) to play in this byo-yomi period.
   *
   * @see https://www.red-bean.com/sgf/properties.html#OW
   */
  whiteStonesLeft?: number;

  /**
   * Comment for the node. Usually it's used to describe the move however it often contains chat from the online games too.
   *
   * @see https://www.red-bean.com/sgf/properties.html#C
   */
  comment?: string;

  /**
   * Additional custom properties. When creating kifu node from SGF, unknown SGF properties or those which are irrelevant for the WGo
   * will be stored here as `string[]`.
   */
  properties: KifuNodeCustomProperties = {};

  /**
   * Removes setup at given point.
   *
   * @param point
   */
  removeSetupAt(point: Point) {
    this.setup = this.setup.filter((s) => s.x !== point.x || s.y !== point.y);
  }

  /**
   * Adds setup at given point.
   */
  addSetup(point: Point, color: Color) {
    this.removeSetupAt(point);
    this.setup.push({
      ...point,
      c: color,
    }); // Setup is cloned in `this.removeSetupAt`, so this is not mutation.
  }

  /**
   * Removes specified markup. Markup objects are compared shallowly.
   *
   * @param markup
   */
  removeMarkup<T extends Markup>(markup: T) {
    const markupKeys = Object.keys(markup) as Array<keyof T>;
    this.markup = this.markup.filter(
      (m: any) => !markupKeys.every((key) => m[key] === markup[key]),
    );
  }

  /**
   * Removes markup at given point. Line markup is not affected by this method.
   *
   * @param point
   */
  removeMarkupAt(point: Point) {
    this.markup = this.markup.filter((m) => !('x' in m) || m.x !== point.x || m.y !== point.y);
  }

  addMarkup(markup: Markup) {
    this.removeMarkup(markup);
    this.markup.push(markup); // Markup is cloned in `this.removeMarkup`, so this is not mutation.
  }

  override getPropertyDescriptors() {
    return kifuNodeSGFPropertyDescriptors;
  }

  override setUnknownSGFProperty(propIdent: string, propValues: string[]) {
    if (!kifuInfoSGFPropertyDescriptors[propIdent]) {
      this.properties[propIdent] = propValues;
    }
  }

  static fromSGF(sgfProperties: SGFProperties | string) {
    const kifuNode = new KifuNode();
    kifuNode.setSGFProperties(sgfProperties);
    return kifuNode;
  }

  static fromJS(node: Partial<KifuNode>) {
    const kifuNode = new KifuNode();
    Object.assign(kifuNode, node);
    return kifuNode;
  }

  static defineProperties(sgfPropertyDescriptors: SGFPropertyDescriptors<KifuNode>) {
    Object.assign(kifuNodeSGFPropertyDescriptors, sgfPropertyDescriptors);
  }

  static createMoveDescriptor(color: Color.Black | Color.White) {
    return {
      set(node: KifuNode, [value]: string[]) {
        if (value) {
          node.move = {
            ...SGFPropertiesBag.parsePoint(value),
            c: color,
          };
        } else if (value === '') {
          node.move = { c: color };
        } else {
          node.move = undefined;
        }
      },
      get(node: KifuNode) {
        if (node.move && node.move.c === color) {
          return ['x' in node.move ? SGFPropertiesBag.pointToSGFValue(node.move) : ''];
        }
      },
    };
  }

  static createSetupDescriptor(color: Color) {
    return {
      set(node: KifuNode, values: string[]) {
        node.setup = node.setup.filter((s) => s.c !== color);
        values.forEach((value) => {
          node.addSetup(SGFPropertiesBag.parsePoint(value), color);
        });
      },
      get(node: KifuNode) {
        const blackStones = node.setup.filter((s) => s.c === color);
        return blackStones.map((bs) => SGFPropertiesBag.pointToSGFValue(bs));
      },
    };
  }

  static createPointMarkupDescriptor(type: PointMarkup['type']) {
    return {
      set(node: KifuNode, values: string[]) {
        node.markup = node.markup.filter((m) => m.type !== type);
        values.forEach((value) => {
          node.addMarkup({
            type,
            ...SGFPropertiesBag.parsePoint(value),
          });
        });
      },
      get(node: KifuNode) {
        const markup = node.markup.filter((m) => m.type === type) as PointMarkup[];
        return markup.map((m) => SGFPropertiesBag.pointToSGFValue(m));
      },
    };
  }

  static createLineMarkupDescriptor(type: LineMarkup['type']) {
    return {
      set(node: KifuNode, values: string[]) {
        node.markup = node.markup.filter((m) => m.type !== type);
        values.forEach((value) => {
          node.addMarkup({
            type,
            ...SGFPropertiesBag.parseVector(value),
          });
        });
      },
      get(node: KifuNode) {
        const lineMarkup = node.markup.filter((m) => m.type === type) as LineMarkup[];
        return lineMarkup.map((m) => SGFPropertiesBag.vectorToSGFValue(m));
      },
    };
  }

  static createLabelMarkupDescriptor(type: LabelMarkup['type']) {
    return {
      set(node: KifuNode, values: string[]) {
        node.markup = node.markup.filter((m) => m.type !== type);
        values.forEach((value) => {
          node.addMarkup({
            type,
            text: value.substring(3),
            ...SGFPropertiesBag.parsePoint(value),
          });
        });
      },
      get(node: KifuNode) {
        const labelMarkup = node.markup.filter((m) => m.type === type) as LabelMarkup[];
        return labelMarkup.map((m) => `${SGFPropertiesBag.pointToSGFValue(m)}:${m.text}`);
      },
    };
  }
}
