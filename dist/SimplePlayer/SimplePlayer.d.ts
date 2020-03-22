import { PartialRecursive } from '../utils/makeConfig';
import { Point } from '../types';
import { PlayerBase } from '../PlayerBase';
import { SimplePlayerConfig } from './defaultSimplePlayerConfig';
import Component from './components/Component';
export default class SimplePlayer extends PlayerBase {
    element: HTMLElement;
    mainElement: HTMLElement;
    config: SimplePlayerConfig;
    layout: Component;
    private _mouseWheelEvent;
    private _keyEvent;
    constructor(element: HTMLElement, config?: PartialRecursive<SimplePlayerConfig>);
    init(): void;
    destroy(): void;
    getVariations(): Point[];
    shouldShowVariations(): boolean;
    shouldShowCurrentVariations(): boolean;
}
