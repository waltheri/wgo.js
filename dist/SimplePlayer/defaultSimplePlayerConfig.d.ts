import { ComponentConstructor } from './components/Component';
export interface SimplePlayerBoardConfig {
}
export interface ComponentDeclaration<T> {
    component: ComponentConstructor<T>;
    config?: T;
}
export interface Condition {
    (container: any): boolean;
}
export interface ConditionalItem {
    if?: Condition;
}
export interface ConditionalComponent extends ConditionalItem {
    component: string;
}
export declare type LayoutItem = ColumnStack | RowStack | ComponentPlaceholder;
export interface ColumnStack extends ConditionalItem {
    column: LayoutItem[];
}
export interface RowStack extends ConditionalItem {
    row: LayoutItem[];
}
export declare type ComponentPlaceholder = string | ConditionalComponent;
export interface SimplePlayerConfig {
    highlightCurrentMove: boolean;
    enableMouseWheel: boolean;
    enableKeys: boolean;
    showVariations: boolean;
    showCurrentVariations: boolean;
    formatNicks: boolean;
    formatMoves: boolean;
    components: {
        [key: string]: ComponentDeclaration<any>;
    };
    layout: LayoutItem[];
}
declare const defaultSimplePlayerConfig: SimplePlayerConfig;
export default defaultSimplePlayerConfig;
