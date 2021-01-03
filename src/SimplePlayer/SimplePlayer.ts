import makeConfig, { PartialRecursive } from '../utils/makeConfig';
import { Point } from '../types';
import { PropIdent } from '../SGFParser/sgfTypes';
import { PlayerBase } from '../PlayerBase';
import defaultSimplePlayerConfig, { SimplePlayerConfig } from './defaultSimplePlayerConfig';
import Component from './components/Component';
import PlayerWrapper from './components/PlayerWrapper';
import Extension, { ExtensionConstructor } from './extensions/Extension';
import EditMode from './extensions/EditMode';

type StateDefinition = any; // TODO

export default class SimplePlayer extends PlayerBase {
  static registeredExtensions: { [key: string]: ExtensionConstructor<any> } = {};
  static registerExtension(key: string, extension: ExtensionConstructor<any>) {
    SimplePlayer.registeredExtensions[key] = extension;
  }

  element: HTMLElement;
  config: SimplePlayerConfig;
  wrapperComponent: PlayerWrapper;
  coordinates: boolean;
  components: {
    [key: string]: Component;
  } = {};
  extensions: {
    [key: string]: Extension<any>;
  } = {};
  stateDefinitions: { [key: string]: StateDefinition } = {};

  private _resizeEvent: EventListenerOrEventListenerObject;

  constructor(element: HTMLElement, config: PartialRecursive<SimplePlayerConfig> = {}) {
    super();

    // merge user config with default
    this.element = element;
    this.config = makeConfig(defaultSimplePlayerConfig, config);

    this.init();
  }

  init() {
    window.addEventListener('resize', this._resizeEvent = (e: any) => this.resize());

    Object.keys(this.config.extensions).forEach((extension) => {
      if (this.config.extensions[extension] == null) {
        return;
      }

      const ctor = SimplePlayer.registeredExtensions[extension];

      if (!ctor) {
        // ignoring unknown extension
        return;
      }

      this.extensions[extension] = new ctor(this, this.config.extensions[extension]);
    });

    Object.keys(this.config.components).forEach((componentName) => {
      const declaration = this.config.components[componentName];
      this.components[componentName] = new declaration.component(this, declaration.config);
    });

    Object.keys(this.extensions).forEach((extension) => {
      this.extensions[extension].create();
    });

    this.wrapperComponent = new PlayerWrapper(this);
    this.element.appendChild(this.wrapperComponent.create());
    this.wrapperComponent.didMount();
  }

  destroy() {
    window.removeEventListener('resize', this._resizeEvent);
    this._resizeEvent = null;

    Object.keys(this.extensions).forEach((extension) => {
      this.extensions[extension].destroy();
    });
  }

  getVariations(): Point[] {
    if (this.shouldShowVariations()) {
      if (this.shouldShowCurrentVariations()) {
        if (this.currentNode.parent) {
          return this.currentNode.parent.children.map(node => node.getProperty('B') || node.getProperty('W'));
        }
      } else {
        return this.currentNode.children.map(node => node.getProperty('B') || node.getProperty('W'));
      }
    }
    return [];
  }

  shouldShowVariations() {
    // look in kifu, whether to show variation markup
    const st = this.rootNode.getProperty(PropIdent.VARIATIONS_STYLE);
    if (st != null) {
      return !(st & 2);
    }

    // otherwise use configuration value
    return this.config.showVariations;
  }

  shouldShowCurrentVariations() {
    // in edit mode not possible
    // if (this.editMode) {
    //   return false;
    // }

    // look at variation style in kifu
    const st = this.rootNode.getProperty(PropIdent.VARIATIONS_STYLE);
    if (st != null) {
      return !!(st & 1);
    }

    // or use variation style from configuration
    return this.config.showCurrentVariations;
  }

  /**
   * Can be called, when dimension of player changes, to update components or layout.
   * It is called automatically on window resize event.
   */
  resize() {
    this.emit('resize', this);
  }

  /**
   * Register new public shared player state variable. It can be then observed and changed by any component/extension.
   */
  registerState(stateDefinition: StateDefinition) {
    this.stateDefinitions[stateDefinition.key] = stateDefinition;
  }
}

SimplePlayer.registerExtension('editMode', EditMode);
