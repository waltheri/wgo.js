import { PartialRecursive } from '../utils/makeConfig';
import { Point } from '../types';
import { PlayerBase } from '../PlayerBase';
import { SimplePlayerConfig } from './defaultSimplePlayerConfig';
import Component from './components/Component';
import PlayerWrapper from './components/PlayerWrapper';
import Extension, { ExtensionConstructor } from './extensions/Extension';
declare type StateDefinition = any;
export default class SimplePlayer extends PlayerBase {
    static registeredExtensions: {
        [key: string]: ExtensionConstructor<any>;
    };
    static registerExtension(key: string, extension: ExtensionConstructor<any>): void;
    element: HTMLElement;
    config: SimplePlayerConfig;
    wrapperComponent: PlayerWrapper;
    coordinates: boolean;
    components: {
        [key: string]: Component;
    };
    extensions: {
        [key: string]: Extension<any>;
    };
    stateDefinitions: {
        [key: string]: StateDefinition;
    };
    private _resizeEvent;
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
    /**
     * Register new public shared player state variable. It can be then observed and changed by any component/extension.
     */
    registerState(stateDefinition: StateDefinition): void;
}
export {};
