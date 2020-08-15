import SimplePlayer from '../SimplePlayer';
/**
 * Component of Simple Board - can be board, box with comments, control panel, etc...
 */
export default abstract class Component {
    /** Function which is called to create HTML element for component. */
    abstract create(player: SimplePlayer): HTMLElement;
    /** HTML was placed into the DOM */
    didMount(player: SimplePlayer): void;
    /** Clean up */
    abstract destroy(player: SimplePlayer): void;
}
export interface ComponentConstructor<T> {
    new (params: T): Component;
}
