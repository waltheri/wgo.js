import { PartialRecursive } from '../utils/makeConfig';
import { Point } from '../types';
import { PlayerBase } from '../PlayerBase';
import { SimplePlayerConfig } from './defaultSimplePlayerConfig';
export default class SimplePlayer extends PlayerBase {
    element: HTMLElement;
    config: SimplePlayerConfig;
    private _mouseWheelEvent;
    private _keyEvent;
    constructor(element: HTMLElement, config?: PartialRecursive<SimplePlayerConfig>);
    init(): void;
    destroy(): void;
    getVariations(): Point[];
    shouldShowVariations(): boolean;
    shouldShowCurrentVariations(): boolean;
}
