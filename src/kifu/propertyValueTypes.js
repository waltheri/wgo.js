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

import {BLACK, WHITE, EMPTY} from "../core";

/// Types definitions -----------------------------------------------------------------------------

export const NONE = {
	read: str => true,
	write: value => ""
}

export const NUMBER = {
	read: str => parseFloat(str),
	write: value => value+""
}

export const TEXT = {
	read: str => str,
	write: value => value
}

export const COLOR = {
	read: str => (str == "w" || str == "W" ? WHITE : BLACK),
	write: value => (value == WHITE ? "W" : "B")
}

export const POINT = {
	read: str => str ? {
		x: str.charCodeAt(0)-97,
		y: str.charCodeAt(1)-97
	} : false,
	write: value => value ? String.fromCharCode(value.x+97) + String.fromCharCode(value.y+97) : ""
}

export const LABEL = {
	read: str => ({
		x: str.charCodeAt(0)-97,
		y: str.charCodeAt(1)-97,
		text: str.substr(3)
	}),
	write: value => String.fromCharCode(value.x+97) + String.fromCharCode(value.y+97) + ":" + value.text
}

export const LINE = {
	read: str => ({
		x1: str.charCodeAt(0)-97,
		y1: str.charCodeAt(1)-97,
		x2: str.charCodeAt(3)-97,
		y2: str.charCodeAt(4)-97
	}),
	write: value => String.fromCharCode(value.x1+97) + String.fromCharCode(value.y1+97) + ":" + String.fromCharCode(value.x2+97) + String.fromCharCode(value.y2+97)
}

/// Property definitions --------------------------------------------------------------------------

var propertyValueTypes = {
	_default: {
		type: TEXT,
		multiple: false,
		notEmpty: true
	}
}

/// Move properties -------------------------------------------------------------------------------

propertyValueTypes.B = propertyValueTypes.W = {
	type: POINT,
	multiple: false,
	notEmpty: false
}

propertyValueTypes.KO = {
	type: NONE,
	multiple: false,
	notEmpty: false
}

propertyValueTypes.MN = {
	type: NUMBER,
	multiple: false,
	notEmpty: true
}

/// Setup properties ------------------------------------------------------------------------------

propertyValueTypes.AB = propertyValueTypes.AW = propertyValueTypes.AE = {
	type: POINT,
	multiple: true,
	notEmpty: true
}

propertyValueTypes.PL= {
	type: COLOR,
	multiple: false,
	notEmpty: true
}

export var setupProperties = {
	"AB": BLACK, 
	"AW": WHITE, 
	"AE": EMPTY
};

/// Node annotation properties --------------------------------------------------------------------

propertyValueTypes.C = propertyValueTypes.N = {
	type: TEXT,
	multiple: false,
	notEmpty: true
}

propertyValueTypes.DM = propertyValueTypes.GB = propertyValueTypes.GW = 
propertyValueTypes.HO = propertyValueTypes.UC = propertyValueTypes.V = {
	type: NUMBER,
	multiple: false,
	notEmpty: true
}

/// Move annotation properties --------------------------------------------------------------------

propertyValueTypes.BM = propertyValueTypes.TE = {
	type: NUMBER,
	multiple: false,
	notEmpty: true
}

propertyValueTypes.DO = propertyValueTypes.IT = {
	type: NONE,
	multiple: false,
	notEmpty: false
}

/// Markup properties -----------------------------------------------------------------------------

propertyValueTypes.CR = propertyValueTypes.MA = propertyValueTypes.SL = propertyValueTypes.SQ = propertyValueTypes.TR = {
	type: POINT,
	multiple: true,
	notEmpty: true
}

propertyValueTypes.LB = {
	type: LABEL,
	multiple: true,
	notEmpty: true
}

propertyValueTypes.AR = propertyValueTypes.LN = {
	type: LINE,
	multiple: true,
	notEmpty: true
}

propertyValueTypes.DD = propertyValueTypes.TB = propertyValueTypes.TW = {
	type: POINT,
	multiple: true,
	notEmpty: false
}

export var markupProperties = ["CR", "MA", "SL", "SQ", "TR", "LB"];

/// Root properties -------------------------------------------------------------------------------

propertyValueTypes.AP = propertyValueTypes.CA = {
	type: TEXT,
	multiple: false,
	notEmpty: true
}

// note: rectangular board is not implemented (in SZ property)
propertyValueTypes.FF = propertyValueTypes.GM = propertyValueTypes.ST = propertyValueTypes.SZ = {
	type: NUMBER,
	multiple: false,
	notEmpty: true
}

/// Game info properties --------------------------------------------------------------------------

propertyValueTypes.AN = propertyValueTypes.BR = propertyValueTypes.BT = 
propertyValueTypes.CP = propertyValueTypes.DT = propertyValueTypes.EV = 
propertyValueTypes.GN = propertyValueTypes.GC = propertyValueTypes.GN = 
propertyValueTypes.ON = propertyValueTypes.OT = propertyValueTypes.PB = 
propertyValueTypes.PC = propertyValueTypes.PW = propertyValueTypes.RE = 
propertyValueTypes.RO = propertyValueTypes.RU = propertyValueTypes.SO = 
propertyValueTypes.US = propertyValueTypes.WR = propertyValueTypes.WT = {
	type: TEXT,
	multiple: false,
	notEmpty: true
}

propertyValueTypes.TM = propertyValueTypes.HA = propertyValueTypes.KM = {
	type: NUMBER,
	multiple: false,
	notEmpty: true
}

/// Timing properties -----------------------------------------------------------------------------

propertyValueTypes.BL = propertyValueTypes.WL = propertyValueTypes.OB = propertyValueTypes.OW = {
	type: NUMBER,
	multiple: false,
	notEmpty: true
}

/// Miscellaneous properties ----------------------------------------------------------------------

propertyValueTypes.PM = {
	type: NUMBER,
	multiple: false,
	notEmpty: true
}

propertyValueTypes.VW = {
	type: POINT,
	multiple: true,
	notEmpty: false
}

export default propertyValueTypes;
