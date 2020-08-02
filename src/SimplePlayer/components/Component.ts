import SimplePlayer from '../SimplePlayer';

/**
 * Component of Simple Board - can be board, box with comments, control panel, etc...
 */
export default abstract class Component {
  player: SimplePlayer;

  /** HTML element containing the component */
  element: HTMLElement;

  constructor(player: SimplePlayer) {
    this.player = player;
  }

  abstract create(): HTMLElement;
  abstract destroy(): void;
}
