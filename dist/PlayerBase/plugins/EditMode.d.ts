import { Point } from '../../types';
import { PartialRecursive } from '../../utils/makeConfig';
import PlayerBase from '../PlayerBase';
import PlayerPlugin from '../PlayerPlugin';
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
}
/**
 * Edit mode plugin. It allows to edit game kifu without changing it - when edit mode is disabled
 * all changes are reverted. It provides event `editMode.change` to enable/disable edit mode.
 * It contains integration with board via these events:
 * - board.updateTemporaryObject
 * - board.addTemporaryObject
 * - board.removeTemporaryObject
 * - board.mouseMove
 * - board.mouseOut
 * - board.click
 */
export default class EditMode implements PlayerPlugin {
    config: EditModeConfig;
    player: PlayerBase;
    private gameStateStack;
    private _boardMouseMoveEvent;
    private _boardMouseOutEvent;
    private _boardClickEvent;
    private _nodeChange;
    constructor(config?: PartialRecursive<EditModeConfig>);
    apply(player: PlayerBase): void;
    /**
     * Enable/disable edit mode. Event `editMode.change` is triggered.
     *
     * @param value
     */
    setEnabled(value: boolean): void;
    /**
     * Play move if edit mode is enabled. This move will be discarded, when edit mode is disabled.
     *
     * @param point
     */
    play(point: Point): void;
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
