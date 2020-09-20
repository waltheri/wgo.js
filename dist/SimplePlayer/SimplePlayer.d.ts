import { PartialRecursive } from '../utils/makeConfig';
import { Point } from '../types';
import { PlayerBase } from '../PlayerBase';
import { LayoutItem, SimplePlayerConfig } from './defaultSimplePlayerConfig';
import Component from './components/Component';
export default class SimplePlayer extends PlayerBase {
    element: HTMLElement;
    mainElement: HTMLElement;
    config: SimplePlayerConfig;
    layout: Component;
    editMode: boolean;
    coordinates: boolean;
    components: {
        [key: string]: Component;
    };
    private _mouseWheelEvent;
    private _keyEvent;
    private _resizeEvent;
    private _boardMouseMoveEvent;
    private _boardMouseOutEvent;
    private _boardClickEvent;
    private _nodeChange;
    constructor(element: HTMLElement, config?: PartialRecursive<SimplePlayerConfig>);
    init(): void;
    appendComponents(items: LayoutItem[], stack: HTMLElement): void;
    destroy(): void;
    getVariations(): Point[];
    shouldShowVariations(): boolean;
    shouldShowCurrentVariations(): boolean;
    /**
     * Can be called, when dimension of player changes, to update components or layout.
     * It is called automatically on window resize event.
     */
    resize(): void;
    setEditMode(b: boolean): void;
}
