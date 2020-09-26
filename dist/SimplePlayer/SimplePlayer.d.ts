import { PartialRecursive } from '../utils/makeConfig';
import { Point } from '../types';
import { PlayerBase } from '../PlayerBase';
import { SimplePlayerConfig } from './defaultSimplePlayerConfig';
import Component from './components/Component';
import PlayerWrapper from './components/PlayerWrapper';
export default class SimplePlayer extends PlayerBase {
    element: HTMLElement;
    config: SimplePlayerConfig;
    wrapperComponent: PlayerWrapper;
    editMode: boolean;
    coordinates: boolean;
    components: {
        [key: string]: Component;
    };
    private _resizeEvent;
    private _boardMouseMoveEvent;
    private _boardMouseOutEvent;
    private _boardClickEvent;
    private _nodeChange;
    constructor(element: HTMLElement, config?: PartialRecursive<SimplePlayerConfig>);
    init(): void;
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
