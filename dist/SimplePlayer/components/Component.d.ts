import SimplePlayer from '../SimplePlayer';
/**
 * Component of Simple Board - can be board, box with comments, control panel, etc...
 */
export default abstract class Component {
    player: SimplePlayer;
    element: HTMLElement | null;
    constructor(player: SimplePlayer);
    /**
     * This will register all necessary event handlers, creates HTML elements for the component
     * and returns component's root element.
     */
    abstract create(): HTMLElement;
    /**
     * Called when component's root HTML element was appended to DOM, or if it was moved.
     * In this phase component may change its appearance or behavior based on dimensions etc...
     */
    didMount(): void;
    /**
     * This will unregister all event handlers and clean the component.
     */
    destroy(): void;
}
export interface ComponentConstructor<T> {
    new (player: SimplePlayer, params: T): Component;
}
