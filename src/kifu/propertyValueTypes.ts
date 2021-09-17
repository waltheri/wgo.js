/**
 * From SGF specification, there are these types of property values:
 *
 * CValueType = (ValueType | *Compose*)
 * ValueType  = (*None* | *Number* | *Real* | *Double* | *Color* | *SimpleText* | *Text* | *Point*  | *Move* | *Stone*)
 *
 * WGo's kifu node (KNode object) implements similar types with few exceptions:
 *
 * - Types `Number`, `Real` and `Double` are implemented by javascript's `number`.
 * - Types `SimpleText` and `Text` are considered as the same.
 * - Types `Point`, `Move` and `Stone` are all the same, implemented as simple object with `x` and `y` coordinates.
 * - Type `None` is implemented as `true`
 *
 * Each `Compose` type, which is used in SGF, has its own type.
 *
 * - `Point ':' Point` (used in AR property) has special type `Line` - object with two sets of coordinates.
 * - `Point ':' Simpletext` (used in LB property) has special type `Label` - object with coordinates and text property
 * - `Simpletext ":" Simpletext` (used in AP property) - not implemented
 * - `Number ":" SimpleText` (used in FG property) - not implemented
 *
 * Moreover each property value has these settings:
 *
 * - *Single value* / *Array* (more values)
 * - *Not empty* / *Empty* (value or array can be empty)
 *
 * {@link http://www.red-bean.com/sgf/sgf4.html}
 */

import { Color, Point, Label, Vector } from '../types';

interface PropertyValueTransformer<T = any> {
  read(str: string): T;
  write(value: T): string;
}

export const NONE = {
  read: (str: string) => true,
  write: (value: boolean) => '',
};

export const NUMBER = {
  read: (str: string) => parseFloat(str),
  write: (value: number) => value.toString(10),
};

export const TEXT = {
  read: (str: string) => str,
  write: (value: string) => value,
};

export const COLOR = {
  read: (str: string) => (str === 'w' || str === 'W' ? Color.WHITE : Color.BLACK),
  write: (value: Color) => (value === Color.WHITE ? 'W' : 'B'),
};

export const POINT = {
  read: (str: string): Point => str ? {
    x: str.charCodeAt(0) - 97,
    y: str.charCodeAt(1) - 97,
  } : null,
  write: (value?: Point) => value ? String.fromCharCode(value.x + 97) + String.fromCharCode(value.y + 97) : '',
};

export const LABEL = {
  read: (str: string): Label => ({
    x: str.charCodeAt(0) - 97,
    y: str.charCodeAt(1) - 97,
    text: str.substr(3),
  }),
  write: (value: Label) => (
    `${String.fromCharCode(value.x + 97) + String.fromCharCode(value.y + 97)}:${value.text}`
  ),
};

export const VECTOR = {
  read: (str: string): Vector => str ? [
    {
      x: str.charCodeAt(0) - 97,
      y: str.charCodeAt(1) - 97,
    },
    {
      x: str.charCodeAt(3) - 97,
      y: str.charCodeAt(4) - 97,
    },
  ] : null,
  write: (value?: Vector) => (
    // tslint:disable-next-line:max-line-length
    value ? `${String.fromCharCode(value[0].x + 97) + String.fromCharCode(value[0].y + 97)}:${String.fromCharCode(value[1].x + 97) + String.fromCharCode(value[1].y + 97)}` : ''
  ),
};

export const COMPOSED_NUMBER = {
  read: (str: string): number[] => str.split(':').map(num => parseFloat(num)),
  write: (value: number[]) => value.join(':'),
};

/// Property definitions --------------------------------------------------------------------------

interface PropertyValueDefinition<T> {
  transformer: PropertyValueTransformer<T>;
  multiple: boolean;
  notEmpty: boolean;
}

const propertyValueTypes: {[propIdent: string]: PropertyValueDefinition<any>} = {
  _default: {
    transformer: TEXT,
    multiple: false,
    notEmpty: true,
  },
};

/// Move properties -------------------------------------------------------------------------------

propertyValueTypes.B = propertyValueTypes.W = {
  transformer: POINT,
  multiple: false,
  notEmpty: false,
};

propertyValueTypes.KO = {
  transformer: NONE,
  multiple: false,
  notEmpty: false,
};

propertyValueTypes.MN = {
  transformer: NUMBER,
  multiple: false,
  notEmpty: true,
};

/// Setup properties ------------------------------------------------------------------------------

propertyValueTypes.AB = propertyValueTypes.AW = propertyValueTypes.AE = {
  transformer: POINT,
  multiple: true,
  notEmpty: true,
};

propertyValueTypes.PL = {
  transformer: COLOR,
  multiple: false,
  notEmpty: true,
};

/// Node annotation properties --------------------------------------------------------------------

propertyValueTypes.C = propertyValueTypes.N = {
  transformer: TEXT,
  multiple: false,
  notEmpty: true,
};

// tslint:disable-next-line:max-line-length
propertyValueTypes.DM = propertyValueTypes.GB = propertyValueTypes.GW = propertyValueTypes.HO = propertyValueTypes.UC = propertyValueTypes.V = {
  transformer: NUMBER,
  multiple: false,
  notEmpty: true,
};

/// Move annotation properties --------------------------------------------------------------------

propertyValueTypes.BM = propertyValueTypes.TE = {
  transformer: NUMBER,
  multiple: false,
  notEmpty: true,
};

propertyValueTypes.DO = propertyValueTypes.IT = {
  transformer: NONE,
  multiple: false,
  notEmpty: false,
};

/// Markup properties -----------------------------------------------------------------------------

// tslint:disable-next-line:max-line-length
propertyValueTypes.CR = propertyValueTypes.MA = propertyValueTypes.SL = propertyValueTypes.SQ = propertyValueTypes.TR = {
  transformer: POINT,
  multiple: true,
  notEmpty: true,
};

propertyValueTypes.LB = {
  transformer: LABEL,
  multiple: true,
  notEmpty: true,
};

propertyValueTypes.AR = propertyValueTypes.LN = {
  transformer: VECTOR,
  multiple: true,
  notEmpty: true,
};

propertyValueTypes.DD = propertyValueTypes.TB = propertyValueTypes.TW = {
  transformer: POINT,
  multiple: true,
  notEmpty: false,
};

/// Root properties -------------------------------------------------------------------------------

propertyValueTypes.AP = propertyValueTypes.CA = {
  transformer: TEXT,
  multiple: false,
  notEmpty: true,
};

propertyValueTypes.FF = propertyValueTypes.GM = propertyValueTypes.ST = {
  transformer: NUMBER,
  multiple: false,
  notEmpty: true,
};

propertyValueTypes.SZ = {
  transformer: COMPOSED_NUMBER,
  multiple: false,
  notEmpty: true,
};

/// Game info properties --------------------------------------------------------------------------

propertyValueTypes.AN = propertyValueTypes.BR = propertyValueTypes.BT =
propertyValueTypes.CP = propertyValueTypes.DT = propertyValueTypes.EV =
propertyValueTypes.GN = propertyValueTypes.GC = propertyValueTypes.GN =
propertyValueTypes.ON = propertyValueTypes.OT = propertyValueTypes.PB =
propertyValueTypes.PC = propertyValueTypes.PW = propertyValueTypes.RE =
propertyValueTypes.RO = propertyValueTypes.RU = propertyValueTypes.SO =
propertyValueTypes.US = propertyValueTypes.WR = propertyValueTypes.WT = {
  transformer: TEXT,
  multiple: false,
  notEmpty: true,
};

propertyValueTypes.TM = propertyValueTypes.HA = propertyValueTypes.KM = {
  transformer: NUMBER,
  multiple: false,
  notEmpty: true,
};

/// Timing properties -----------------------------------------------------------------------------

propertyValueTypes.BL = propertyValueTypes.WL = propertyValueTypes.OB = propertyValueTypes.OW = {
  transformer: NUMBER,
  multiple: false,
  notEmpty: true,
};

/// Miscellaneous properties ----------------------------------------------------------------------

propertyValueTypes.PM = {
  transformer: NUMBER,
  multiple: false,
  notEmpty: true,
};

// VW property must be specified as compressed list (ab:cd) and only one value is allowed
// empty value [] will reset the viewport. Other options are not supported.
propertyValueTypes.VW = {
  transformer: VECTOR,
  multiple: false,
  notEmpty: true,
};

export default propertyValueTypes;
