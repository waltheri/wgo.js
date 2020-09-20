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
export declare const NONE: {
    read: (str: string) => boolean;
    write: (value: boolean) => string;
};
export declare const NUMBER: {
    read: (str: string) => number;
    write: (value: number) => string;
};
export declare const TEXT: {
    read: (str: string) => string;
    write: (value: string) => string;
};
export declare const COLOR: {
    read: (str: string) => Color.BLACK | Color.WHITE;
    write: (value: Color) => "W" | "B";
};
export declare const POINT: {
    read: (str: string) => Point;
    write: (value?: Point) => string;
};
export declare const LABEL: {
    read: (str: string) => Label;
    write: (value: Label) => string;
};
export declare const VECTOR: {
    read: (str: string) => Vector;
    write: (value?: Vector) => string;
};
interface PropertyValueDefinition<T> {
    transformer: PropertyValueTransformer<T>;
    multiple: boolean;
    notEmpty: boolean;
}
declare const propertyValueTypes: {
    [propIdent: string]: PropertyValueDefinition<any>;
};
export default propertyValueTypes;
