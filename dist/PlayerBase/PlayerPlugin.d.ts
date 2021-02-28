import PlayerBase from './PlayerBase';
/**
 * Interface of plugins of PlayerBase.
 */
export default interface PlayerPlugin {
    /**
     * During plugin installation this method will be called once. Plugin can register all necessary
     * events here.
     *
     * @param player
     */
    apply(player: PlayerBase): void;
}
