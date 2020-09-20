import SimplePlayer from '../SimplePlayer';

/**
 * Component of Simple Board - can be board, box with comments, control panel, etc...
 */
export default abstract class Component {
  element: HTMLElement | null;

  constructor(public player: SimplePlayer) {
    this.element = null;
  }

  /**
   * This will register all necessary event handlers, creates HTML elements for the component
   * and returns component's root element.
   */
  abstract create(): HTMLElement;

  /**
   * Called when component's root HTML element was appended to DOM, or if it was moved.
   * In this phase component may change its appearance or behavior based on dimensions etc...
   */
  didMount() {}

  /**
   * This will unregister all event handlers and clean the component.
   */
  destroy() {}
}

export interface ComponentConstructor<T> {
  new (player: SimplePlayer, params: T): Component;
}
