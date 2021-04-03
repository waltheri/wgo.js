import PlayerDOM from '../PlayerDOM';
/**
 *
 */
export default interface PlayerDOMComponent {
    /**
     *
     */
    element: Node;
    /**
     *
     */
    create(player: PlayerDOM): void;
    /**
     *
     */
    destroy?(): void;
}
