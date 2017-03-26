/**
 * Groups of propertise with special meaning.
 */

import {
	CIRCLE,
	X_MARK,
	SELECTED,
	SQUARE,
	TRIANGLE,
	LABEL,
	ADD_BLACK,
	ADD_WHITE,
	CLEAR_FIELD,
} from "./properties";
import {
	BLACK,
	WHITE,
	EMPTY,
} from "../core";

export var markupProperties = [
	CIRCLE,
	X_MARK,
	SELECTED,
	SQUARE,
	TRIANGLE,
	LABEL,
];

export var setupProperties = {
	[ADD_BLACK]: BLACK, 
	[ADD_WHITE]: WHITE, 
	[CLEAR_FIELD]: EMPTY,
};

export var setupPropertiesReversed = Object.keys(setupProperties).reduce((obj, key) => {
	obj[setupProperties[key]] = key;
	return obj;
}, {});
