import PlayerDOM from '../PlayerDOM';

/**
 *
 */
export default interface PlayerDOMComponent {
  /**
   *
   */
  create(player: PlayerDOM): Node;

  /**
   *
   */
  didMount?(): void;

  /**
   *
   */
  destroy?(): void;
}
