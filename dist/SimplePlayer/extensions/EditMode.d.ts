import { PartialRecursive } from '../../utils/makeConfig';
import SimplePlayer from '../SimplePlayer';
import Extension from './Extension';
interface EditModeConfig {
    /**
     * Set true, if edit mode should be enabled during player initialization.
     * Default value: `false`
     */
    enabled: boolean;
    /**
     * Set true, to show variation markup during edit mode. This overrides SGF and player config.
     * Default value: `true`
     */
    showVariations: boolean;
    /**
     * Set true if user will be turn on/off edit mode in UI.
     * Default value: `true`
     */
    userCanChange: boolean;
}
export default class EditMode implements Extension<EditModeConfig> {
    static STATE_KEY: string;
    config: EditModeConfig;
    player: SimplePlayer;
    private gameStateStack;
    private _boardMouseMoveEvent;
    private _boardMouseOutEvent;
    private _boardClickEvent;
    private _nodeChange;
    constructor(player: SimplePlayer, config?: PartialRecursive<EditModeConfig>);
    create(): void;
    destroy(): void;
    setEnabled(value: boolean): void;
    private handleChange;
    private enable;
    private disable;
    /**
     * Saves current player game state - Kifu and path object.
     */
    private saveGameState;
    /**
     * Restores player from previously saved state.
     */
    private restoreGameState;
}
export {};
