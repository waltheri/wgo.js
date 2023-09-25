import { SGFProperties } from '../SGFParser';
import { SGFPropertiesBag, SGFPropertyDescriptors } from '../sgf';
import { Color, Field, Move, Point } from '../types';
import kifuInfoSGFPropertyDescriptors from './kifuInfoSGFPropertyDescriptors';
import kifuNodeSGFPropertyDescriptors, {
  createLabelMarkupDescriptor,
  createLineMarkupDescriptor,
  createMoveDescriptor,
  createPointMarkupDescriptor,
  createSetupDescriptor,
} from './kifuNodeSGFPropertyDescriptors';

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
  type:
    | MarkupType.Circle
    | MarkupType.Dim
    | MarkupType.Selected
    | MarkupType.Square
    | MarkupType.Triangle
    | MarkupType.XMark;
  x: number;
  y: number;
}

export interface LineMarkup {
  type: MarkupType.Arrow | MarkupType.Line;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface LabelMarkup {
  type: MarkupType.Label;
  x: number;
  y: number;
  text: string;
}

export type Markup = PointMarkup | LineMarkup | LabelMarkup;

export interface KifuNodeCustomProperties {
  [key: string]: unknown;
}

/**
 * Class representing one kifu node. It contains some helpful methods for working with the node. Not all SGF properties are supported,
 * but you can access them through `properties` property.
 */
export default class KifuNode extends SGFPropertiesBag {
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
   */
  setup: Field[] = [];

  /**
   * Sets player turn - next move should be played with this color.
   *
   * @see https://www.red-bean.com/sgf/properties.html#PL
   */
  turn?: Color.Black | Color.White;

  /**
   * Node markup - for example triangles or square marking some stones or empty fields. WGo supports these
   * SGF markup properties: `AR`, `CR`, `DD`, `LN`, `LB`, `MA`, `SL`, `SQ` and `TR`.
   */
  markup: Markup[] = [];

  /**
   * View only part of the board.
   *
   * @see https://www.red-bean.com/sgf/properties.html#VW
   */
  boardSection?: { x1: number; y1: number; x2: number; y2: number };

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
    });
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
    this.markup.push(markup);
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

  static createMoveDescriptor = createMoveDescriptor;
  static createSetupDescriptor = createSetupDescriptor;
  static createPointMarkupDescriptor = createPointMarkupDescriptor;
  static createLineMarkupDescriptor = createLineMarkupDescriptor;
  static createLabelMarkupDescriptor = createLabelMarkupDescriptor;
}
