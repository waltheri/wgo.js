import { FieldBoardObject } from '../../BoardBase';
import KifuNode, { Path } from '../../kifu/KifuNode';
import { PropIdent } from '../../SGFParser/sgfTypes';
import { Color, Point } from '../../types';
import makeConfig, { PartialRecursive } from '../../utils/makeConfig';
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

interface GameState {
  rootNode: KifuNode;
  path: Path;
}

const defaultEditModeConfig = {
  enabled: false,
  showVariations: true,
};

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
  readonly config: EditModeConfig;

  private _gameStateStack: GameState[] = [];
  private _boardMouseMoveEvent: Function;
  private _boardMouseOutEvent: Function;
  private _boardClickEvent: Function;
  private _nodeChange: Function;

  player: PlayerBase;

  constructor(config: PartialRecursive<EditModeConfig> = {}) {
    this.config = makeConfig(defaultEditModeConfig, config);
  }

  apply(player: PlayerBase) {
    if (this.player) {
      throw new Error('This plugin instance has already been applied to a player object.');
    }

    this.player = player;
    this.player.on('editMode.change', this._handleChange);

    if (this.config.enabled) {
      this._enable();
    }
  }

  /*public destroy() {
    this.player.off('editMode.change', this.handleChange);
  }*/

  /**
   * Enable/disable edit mode. Event `editMode.change` is triggered.
   *
   * @param value
   */
  setEnabled(value: boolean) {
    if (value !== this.config.enabled) {
      this.player.emit('editMode.change', value);
    }
  }

  /**
   * Play move if edit mode is enabled. This move will be discarded, when edit mode is disabled.
   *
   * @param point
   */
  play(point: Point) {
    if (!this.config.enabled) {
      return;
    }

    // check, whether some of the next node contains this move
    for (let i = 0; i < this.player.currentNode.children.length; i++) {
      const childNode = this.player.currentNode.children[i];
      const move = childNode.getProperty('B') || childNode.getProperty('W');
      if (move && move.x === point.x && move.y === point.y) {
        this.player.next(i);
        return;
      }
    }

    // otherwise play if valid
    if (this.player.game.isValid(point.x, point.y)) {
      this.player.play(point.x, point.y);
    }
  }

  private _handleChange = (value: boolean) => {
    if (value && !this.config.enabled) {
      this._enable();
    } else if (!value && this.config.enabled) {
      this._disable();
    }
  }

  private _enable() {
    this._saveGameState();

    if (this.config.showVariations) {
      this.player.rootNode.setProperty(PropIdent.VariationsStyle, 0);
    } else {
      this.player.rootNode.setProperty(PropIdent.VariationsStyle, 2);
    }

    this.config.enabled = true;

    let lastX = -1;
    let lastY = -1;

    const blackStone = new FieldBoardObject('B');
    blackStone.opacity = 0.35;

    const whiteStone = new FieldBoardObject('W');
    whiteStone.opacity = 0.35;

    let addedStone: FieldBoardObject = null;

    this._boardMouseMoveEvent = (p: Point) => {
      if (lastX !== p.x || lastY !== p.y) {
        if (this.player.game.isValid(p.x, p.y)) {
          const boardObject = this.player.game.turn === Color.BLACK ? blackStone : whiteStone;
          boardObject.setPosition(p.x, p.y);

          if (addedStone) {
            this.player.emit('board.updateTemporaryObject', boardObject);
          } else {
            this.player.emit('board.addTemporaryObject', boardObject);
            addedStone = boardObject;
          }

        } else {
          this._boardMouseOutEvent();
        }
        lastX = p.x;
        lastY = p.y;
      }
    };

    this._boardMouseOutEvent = () => {
      if (addedStone) {
        this.player.emit('board.removeTemporaryObject', addedStone);
        addedStone = null;
      }
      lastX = -1;
      lastY = -1;
    };

    this._boardClickEvent = (p: Point) => {
      this._boardMouseOutEvent();

      if (p == null) {
        return;
      }

      this.play(p);
    };

    this._nodeChange = () => {
      const current = { x: lastX, y: lastY };
      this._boardMouseOutEvent();
      this._boardMouseMoveEvent(current);
    };

    this.player.on('board.mouseMove', this._boardMouseMoveEvent);
    this.player.on('board.mouseOut', this._boardMouseOutEvent);
    this.player.on('board.click', this._boardClickEvent);

    this.player.on('applyNodeChanges', this._nodeChange);
  }

  private _disable() {
    this.player.off('board.mouseMove', this._boardMouseMoveEvent);
    this.player.off('board.mouseOut', this._boardMouseOutEvent);
    this.player.off('board.click', this._boardClickEvent);

    this.player.off('applyNodeChanges', this._nodeChange);

    this.config.enabled = false;
    this._restoreGameState();
  }

  /**
   * Saves current player game state - Kifu and path object.
   */
  private _saveGameState() {
    this._gameStateStack.push({
      rootNode: this.player.rootNode.cloneNode(),
      path: this.player.getCurrentPath(),
    });
  }

  /**
   * Restores player from previously saved state.
   */
  private _restoreGameState() {
    const lastState = this._gameStateStack.pop();
    if (lastState) {
      // revert all node changes
      this.player.first();

      // load stored kifu
      this.player.loadKifu(lastState.rootNode);

      // go to stored path
      this.player.goTo(lastState.path);
    }
  }
}
