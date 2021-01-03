import { FieldObject } from '../../BoardBase';
import KifuNode, { Path } from '../../kifu/KifuNode';
import { PropIdent } from '../../SGFParser/sgfTypes';
import { Color, Point } from '../../types';
import makeConfig, { PartialRecursive } from '../../utils/makeConfig';
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

interface GameState {
  rootNode: KifuNode;
  path: Path;
}

const defaultEditModeConfig = {
  enabled: false,
  showVariations: true,
  userCanChange: false,
};

export default class EditMode implements Extension<EditModeConfig> {
  static STATE_KEY = 'editMode';

  config: EditModeConfig;
  player: SimplePlayer;

  private gameStateStack: GameState[] = [];

  private _boardMouseMoveEvent: Function;
  private _boardMouseOutEvent: Function;
  private _boardClickEvent: Function;
  private _nodeChange: Function;

  constructor(player: SimplePlayer, config: PartialRecursive<EditModeConfig> = {}) {
    this.player = player;
    this.config = makeConfig(defaultEditModeConfig, config);

    this.player.registerState({
      key: EditMode.STATE_KEY,
      type: Boolean,
      getValue: () => this.config.enabled,
      userCanChange: this.config.userCanChange,
      label: 'Edit mode',
    });
  }

  public create() {
    this.player.on('editMode.change', this.handleChange);

    if (this.config.enabled) {
      this.enable();
    }
  }

  public destroy() {
    this.player.off('editMode.change', this.handleChange);
  }

  public setEnabled(value: boolean) {
    if (value !== this.config.enabled) {
      this.player.emit('editMode.change', value);
    }
  }

  private handleChange = (value: boolean) => {
    if (value && !this.config.enabled) {
      this.enable();
    } else if (!value && this.config.enabled) {
      this.disable();
    }
  }

  private enable() {
    this.saveGameState();
    if (this.config.showVariations) {
      this.player.rootNode.setProperty(PropIdent.VARIATIONS_STYLE, 0);
    } else {
      this.player.rootNode.setProperty(PropIdent.VARIATIONS_STYLE, 2);
    }
    this.config.enabled = true;

    let lastX = -1;
    let lastY = -1;

    const blackStone = new FieldObject('B');
    blackStone.opacity = 0.35;

    const whiteStone = new FieldObject('W');
    whiteStone.opacity = 0.35;

    let addedStone: FieldObject = null;

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

      // check, whether some of the next node contains this move
      for (let i = 0; i < this.player.currentNode.children.length; i++) {
        const childNode = this.player.currentNode.children[i];
        const move = childNode.getProperty('B') || childNode.getProperty('W');
        if (move.x === p.x && move.y === p.y) {
          this.player.next(i);
          return;
        }
      }

      // otherwise play if valid
      if (this.player.game.isValid(p.x, p.y)) {
        this.player.play(p.x, p.y);
      }
    };

    this._nodeChange = () => {
      const current = { x: lastX, y: lastY };
      this._boardMouseOutEvent();
      this._boardMouseMoveEvent(current);
    };

    this.player.on('boardMouseMove', this._boardMouseMoveEvent);
    this.player.on('boardMouseOut', this._boardMouseOutEvent);
    this.player.on('boardClick', this._boardClickEvent);
    this.player.on('applyNodeChanges', this._nodeChange);
  }

  private disable() {
    this.player.off('boardMouseMove', this._boardMouseMoveEvent);
    this.player.off('boardMouseOut', this._boardMouseOutEvent);
    this.player.off('boardClick', this._boardClickEvent);
    this.player.off('applyNodeChanges', this._nodeChange);

    this.config.enabled = false;
    this.restoreGameState();
  }

  /**
   * Saves current player game state - Kifu and path object.
   */
  private saveGameState() {
    this.gameStateStack.push({
      rootNode: this.player.rootNode.cloneNode(),
      path: this.player.getCurrentPath(),
    });
  }

  /**
   * Restores player from previously saved state.
   */
  private restoreGameState() {
    const lastState = this.gameStateStack.pop();
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
