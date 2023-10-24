import { Position, Rules, sgfRulesMap, GameState, GameEvaluator } from '../game';
import { Kifu, KifuInfo, KifuNode, KifuPath, Markup } from '../kifu';
import { BoardSize, Color, Field, Move, Point, Vector } from '../types';
import { EventEmitter } from '../utils/EventEmitter';
import { EditorConfig, defaultEditorConfig } from './EditorConfig';
import { EditorHistoryManager, EditorHistoryOperation } from './EditorHistoryManager';

interface EditorEvents {
  gameLoad: Record<string, never>;
  nodeChange: { node: KifuNode };
  gameInfoChange: { gameInfo: KifuInfo };
  gameStateChange: { gameState: GameState };
}

/**
 * Headless go games editor. It can load game record (SGF), or create a new one. Then it can be used to
 * replay it and edit it. There is no UI, but it contains all information about the game, including current
 * position and many methods for manipulation.
 *
 * Methods for loading Kifu:
 * - newGame
 * - loadKifu
 *
 * Methods for traversing:
 * - next
 * - previous
 * - last
 * - first
 * - nextFork
 * - previousFork
 * - goTo
 * - nextMatch
 * - previousMatch
 *
 * Methods for querying:
 * - isFirst
 * - isLast
 * - isValidMove
 * - getVariations
 *
 * Methods for editing:
 * - play
 * - pass
 * - setPlayer
 * - addNode
 * - removeNode
 * - shiftNode
 * - addSetup
 * - addMarkup
 * - removeMarkupAt
 * - updateCurrentNode
 * - updateGameInfo
 *
 * History:
 * - undo
 * - redo
 * - canUndo
 * - canRedo
 *
 * Events
 * - on
 * - off
 * - emit
 */
export class Editor extends EventEmitter<EditorEvents> {
  /**
   * Configuration of the editor. It is intended to be read-only, its changes may be ignored.
   */
  config: Readonly<EditorConfig>;

  /**
   * Currently loaded kifu. Editor operates on this kifu object and mutates it. However you shouldn't
   * change it manually.
   */
  kifu: Kifu;

  /**
   * Current game state. You can use it to get information about the game like position or current player,
   * but you should not modify it.
   */
  gameState: GameState;

  /**
   * Go game evaluator class. It contains method to check validity of move according to the rules. In future
   * there could be score calculation methods too.
   */
  gameEvaluator: GameEvaluator;

  /**
   * Currently visited node of the kifu (go game record). It shouldn't be modified directly, use editor methods
   * to add properties to it.
   */
  currentNode: KifuNode;

  /**
   * Current path in the kifu. It is used to determine current move number and variations. Together with `kifu`
   * it is the only primary state property of the editor. Other properties are derived or calculated.
   */
  currentPath: KifuPath;

  /**
   * Internal manager of editor history. Each mutating operation is saved here and can be undone later.
   */
  #historyManager: EditorHistoryManager;

  /**
   * History of the game states. It is used to revert previous positions.
   */
  #previousGameStates: GameState[];

  /**
   * Previous nodes. It is used to revert previous nodes.
   */
  #previousNodes: KifuNode[];

  /**
   * Memory of visited variations. When we go to the next node and there is several variations, we select
   * previously visited one.
   */
  #visitedVariations: Map<KifuNode, KifuNode>;

  /**
   * Creates new instance of editor. You can specify configuration object to customize editor. Configuration
   * will be merged with default values and cannot be changed later.
   */
  constructor(config: Partial<EditorConfig> = defaultEditorConfig) {
    super();

    this.config = { ...defaultEditorConfig, ...config };
  }

  /**
   * Creates a new game. If game is already loaded, it will be discarded. You can specify size of the board and
   * game rules. These parameters are optional and cannot be changed later.
   *
   * If you would need for some reason to change board size, manually update `kifu.info.boardSize` property and reload
   * the game.
   */
  newGame(size: BoardSize = this.config.defaultBoardSize, rules: Rules = this.config.defaultRules) {
    const kifu = new Kifu();
    kifu.info.boardSize = size;
    if (rules && rules.name) {
      kifu.info.rules = rules.name;
    }

    this.kifu = kifu;
    this.kifu.info.komi = rules.komi;
    this.#initGame(rules);
  }

  /**
   * Loads game record (kifu). If game is already loaded, it will be discarded. Editor mutates the kifu object, so
   * if you want to keep the original object, clone it first.
   *
   * @example
   * ```javascript
   * import { Editor, Kifu } from 'wgo';
   *
   * const editor = new Editor();
   * editor.loadKifu(Kifu.fromSGF('(;FF[4]SZ[19]AB[ab];B[cd];W[ef])'));
   * ```
   */
  loadKifu(kifu: Kifu) {
    this.kifu = kifu;
    let rules = kifu.info.rules
      ? sgfRulesMap[kifu.info.rules as keyof typeof sgfRulesMap]
      : this.config.defaultRules;

    if (kifu.info.komi != null) {
      rules = { ...rules, komi: kifu.info.komi };
    }

    this.#initGame(rules);
  }

  /**
   * Go to next move (node). Returns true, if operation was successful. If there is no next move,
   * nothing happens and false is returned.
   */
  next(node?: number | KifuNode) {
    const result = this.#executeNextNode(node);

    if (result) {
      this.#emitNodeChangeEvents();
    }

    return result;
  }

  /**
   * Go to previous move (node). If there is no previous move, nothing happens.
   */
  previous() {
    const result = this.#executePreviousNode();

    if (result) {
      this.#emitNodeChangeEvents();
    }

    return result;
  }

  /**
   * Go to last move (node). If there are variations in the kifu, it will go to the last visited variation.
   */
  last() {
    const currentMoveNumber = this.currentPath.moveNumber;

    while (this.#executeNextNode());

    if (currentMoveNumber !== this.currentPath.moveNumber) {
      this.#emitNodeChangeEvents();
      return true;
    }

    return false;
  }

  /**
   * Go to initial position (root node).
   */
  first() {
    const currentMoveNumber = this.currentPath.moveNumber;

    while (this.#executePreviousNode());

    if (currentMoveNumber !== this.currentPath.moveNumber) {
      this.#emitNodeChangeEvents();
      return true;
    }

    return false;
  }

  /**
   * Go to the next fork (node with more than one child). If there is no fork, it is the same as `last()`.
   */
  nextFork() {
    const currentMoveNumber = this.currentPath.moveNumber;

    while (this.#executeNextNode() && this.currentNode.children.length < 2);

    if (currentMoveNumber !== this.currentPath.moveNumber) {
      this.#emitNodeChangeEvents();
      return true;
    }

    return false;
  }

  /**
   * Go to the previous fork (node with more than one child). If there is no fork, it is the same as `first()`.
   */
  previousFork() {
    const currentMoveNumber = this.currentPath.moveNumber;

    while (this.#executePreviousNode() && this.currentNode.children.length < 2);

    if (currentMoveNumber !== this.currentPath.moveNumber) {
      this.#emitNodeChangeEvents();
      return true;
    }

    return false;
  }

  /**
   * Go to move (node) specified by path, move number or node. If variations are not specified, the last visited
   * will be used.
   *
   * @example
   * ```javascript
   * // Go to move 10
   * editor.goTo(10);
   *
   * // Jump by 10 moves
   * editor.goTo(editor.currentPath.moveNumber + 10);
   *
   * // Go to specified variations
   * editor.gotTo({ moveNumber: 10, variations: [1, 0] });
   * ```
   */
  goTo(pathOrMoveNumber: KifuPath | number | KifuNode) {
    while (this.#executePreviousNode()); // this could be improved, we could go back just to the common ancestor

    let path: KifuPath | null;
    if (pathOrMoveNumber instanceof KifuNode) {
      path = this.kifu.getPath(pathOrMoveNumber);
    } else if (typeof pathOrMoveNumber === 'number') {
      path = { moveNumber: pathOrMoveNumber, variations: [] };
    } else {
      path = pathOrMoveNumber;
    }

    if (path == null) {
      return false;
    }

    for (let i = 0, j = 0; i < path.moveNumber; i++) {
      const nodeIndex = this.currentNode.children.length > 1 ? path.variations[j++] : undefined;

      if (!this.#executeNextNode(nodeIndex)) {
        break;
      }
    }

    this.#emitNodeChangeEvents();

    return path.moveNumber === this.currentPath.moveNumber;
  }

  /**
   * Go to the first next node, for which the predicate returns true. If there is no such node, nothing
   * happens (and false is returned). This is similar to `Kifu.find()` method but in this case only
   * currently active sequence is searched.
   *
   * @example
   * ```javascript
   * // Go to next commented node
   * editor.nextMatch(node => !!node.comment);
   * ```
   */
  nextMatch(predicate: (node: KifuNode) => boolean) {
    let node = this.currentNode;
    let path = this.currentPath;

    while (true) {
      const nextNodeIndex = this.#getNextNodeIndex(node);
      path = this.#nextPath(path, node, nextNodeIndex);
      node = node.children[nextNodeIndex];

      if (!node) {
        break;
      } else if (predicate(node)) {
        this.goTo(path);
        return true;
      }
    }

    return false;
  }

  /**
   * Go to the first previously visited node, for which the predicate returns true. If there is no such node,
   * nothing happens (and false is returned).
   *
   * @example
   * ```javascript
   * // Go to move, where specified stone was played
   * editor.perviousMatch(node => node.move.x === 10 && node.move.y === 10);
   * ```
   */
  previousMatch(predicate: (node: KifuNode) => boolean) {
    for (let i = this.#previousNodes.length - 1; i >= 0; i--) {
      if (predicate(this.#previousNodes[i])) {
        this.goTo(this.#previousNodes[i]);
        return true;
      }
    }
    return false;
  }

  /**
   * Returns true, if current node is the root node.
   */
  isFirst() {
    return this.currentNode === this.kifu.root;
  }

  /**
   * Returns true, if current node is the last/leaf node - there are no children nodes.
   */
  isLast() {
    return !this.currentNode.children.length;
  }

  /**
   * Returns true, if specified move can be played in the current position with given rule set.
   */
  isValidMove(x: number, y: number): boolean {
    return this.gameEvaluator.isValidMove(
      this.gameState.position,
      { x, y, c: this.gameState.player },
      this.#previousGameStates,
    );
  }

  /**
   * Returns variations for current node. This method differs from simple `this.currentNode.children` in fact,
   * that returns only nodes with moves. Also it takes into account kifu `variationsStyle` property. If `variationsStyle.currentNode`
   * is true, then siblings of the current node are returned instead of children.
   */
  getVariations(): KifuNode[] {
    const { variationsStyle = {} } = this.kifu.info;
    let variations: KifuNode[];

    if (variationsStyle.currentNode) {
      if (!this.#previousNodes.length) {
        return [];
      }
      variations = this.#previousNodes[this.#previousNodes.length - 1].children;
    } else {
      variations = this.currentNode.children;
    }

    return variations.filter((node) => node.move);
  }

  /**
   * Play specified move. Move will be played by current player and executed even if invalid. Technically new kifu node
   * will be created witch specified move and then editor will move to it.
   */
  play(x: number, y: number) {
    const node = KifuNode.fromJS({ move: { x, y, c: this.gameState.player } });
    const nodeIndex = this.currentNode.children.push(node);
    this.#historyManager.addNodeUpdateOperation(this.currentPath, this.currentNode);
    this.next(nodeIndex - 1);
  }

  /**
   * Pass with current player. This will create new kifu node with pass move and editor will move to it.
   */
  pass() {
    const node = KifuNode.fromJS({ move: { c: this.gameState.player } });
    const nodeIndex = this.currentNode.children.push(node);
    this.#historyManager.addNodeUpdateOperation(this.currentPath, this.currentNode);
    this.next(nodeIndex - 1);
  }

  /**
   * Set move on specified coordinates. Current position will be changed, but no new node is created. This is useful
   * for editing existing move. When adding new move, use `play()` method instead, which creates a new node.
   */
  setMove(x: number, y: number, color: Color.Black | Color.White) {
    this.currentNode.move = { x, y, c: color };
    this.#historyManager.addNodeUpdateOperation(this.currentPath, this.currentNode);
    this.#reExecuteCurrentNode();
  }

  /**
   * Set current player. This will not affect current position, but it will affect next move.
   */
  setPlayer(color: Color.Black | Color.White) {
    this.gameState.player = color;
    this.currentNode.player = color;
    this.#historyManager.addNodeUpdateOperation(this.currentPath, this.currentNode);
    this.emit('gameStateChange', { gameState: this.gameState });
  }

  /**
   * Adds new node to the current node and moves to it. If node is not specified, new empty node is created.
   */
  addNode(node = new KifuNode(), index?: number) {
    if (index != null) {
      this.currentNode.children.splice(index, 0, node);
      this.#historyManager.addNodeUpdateOperation(this.currentPath, this.currentNode);
      this.next(index);
    } else {
      const nodeIndex = this.currentNode.children.push(node);
      this.#historyManager.addNodeUpdateOperation(this.currentPath, this.currentNode);
      this.next(nodeIndex);
    }
  }

  /**
   * Removes node from the kifu. It must be children of the current node.
   */
  removeNode(node: number | KifuNode) {
    const index = this.#getNextNodeIndex(this.currentNode, node);
    this.currentNode.children.splice(index, 1);
    this.#historyManager.addNodeUpdateOperation(this.currentPath, this.currentNode);
    this.emit('nodeChange', { node: this.currentNode });
  }

  /**
   * Shifts node to the specified index within current node children.
   */
  shiftNode(node: KifuNode, index: number) {
    const nodeIndex = this.#getNextNodeIndex(this.currentNode, node);
    this.currentNode.children.splice(nodeIndex, 1);
    this.currentNode.children.splice(index, 0, node);
    this.#historyManager.addNodeUpdateOperation(this.currentPath, this.currentNode);
    this.emit('nodeChange', { node: this.currentNode });
  }

  /**
   * Add setup. If current node contains a move, then new node will be created with the setup and editor will move
   * to it. Otherwise setup will be added to the current node. This aims to prevent invalid node, where setup is mixed
   * with a move. If you want for some reason to create such node, you can use general `updateCurrentNode` method.
   *
   * Editor doesn't contain method for removing setup - with this method you can set black stone, white stone, or empty
   * field. So removing a setup is not strictly necessary, however Kifu node supports it with `removeSetupAt` method.
   * So this is once again possible with `updateCurrentNode` method.
   *
   * @example
   * ```javascript
   * const editor = new Editor();
   * editor.loadKifu(Kifu.fromSGF('(;FF[4]SZ[19];B[cd];W[ef])'));
   *
   * function toggleBlackStone(x, y) {
   *   if (editor.gameState.position.get(x, y) === Color.Black) {
   *     editor.addSetup({ x, y, c: Color.Empty });
   *   } else {
   *     editor.addSetup({ x, y, c: Color.Black });
   *   }
   * }
   *
   * editor.next(); // Go to move 1
   * toggleBlackStone(2, 3); // This will remove black stone from 2, 3
   * toggleBlackStone(2, 3); // This will add it back
   * ```
   */
  addSetup(setup: Field) {
    if (this.currentNode.move) {
      const node = KifuNode.fromJS({ setup: [setup] });
      const nodeIndex = this.currentNode.children.push(node);
      this.#historyManager.addNodeUpdateOperation(this.currentPath, this.currentNode);
      this.next(nodeIndex - 1);
    } else {
      this.currentNode.addSetup(setup);
      this.#historyManager.addNodeUpdateOperation(this.currentPath, this.currentNode);
      this.emit('gameStateChange', { gameState: this.gameState });
    }
  }

  /**
   * Adds markup to the current node. If markup exists on given coordinates, it will be replaced. So this method
   * doesn't support multiple markups on the same coordinates in contrast to `KifuNode.addMarkup` which supports it.
   * If you want to add multiple markups, you can use general `updateCurrentNode` method.
   *
   * This also apply on line markup - in that case if start and end points match, line markup will be replaced.
   *
   * @example
   * ```javascript
   * const editor = new Editor();
   * editor.loadKifu(Kifu.fromSGF('(;FF[4]SZ[19];B[cd];W[ef])'));
   *
   * function toggleMarkup(x, y, type) {
   *   if (editor.currentNode.markup.some(m => x === m.x && y === m.y && m.type === type)) {
   *     editor.removeMarkupAt({ x, y });
   *   } else {
   *     editor.addMarkup({ x, y, type });
   *   }
   * }
   *
   * toggleTriangle(2, 3, Markup.Triangle); // Adds triangle
   * toggleTriangle(2, 3, Markup.Square); // Change it to square
   * toggleTriangle(2, 3, Markup.Square); // Clear markup
   * ```
   */
  addMarkup(markup: Markup) {
    this.currentNode.removeMarkupAt(markup);
    this.currentNode.addMarkup(markup);
    this.#historyManager.addNodeUpdateOperation(this.currentPath, this.currentNode);
    this.emit('nodeChange', { node: this.currentNode });
  }

  /**
   * Removes markup from the current node. Markup object doesn't have to be the same instance as the one added,
   * this method removes markup with the same coordinates and type.
   */
  removeMarkupAt(markup: Point | Vector) {
    this.currentNode.removeMarkupAt(markup);
    this.#historyManager.addNodeUpdateOperation(this.currentPath, this.currentNode);
    this.emit('nodeChange', { node: this.currentNode });
  }

  /**
   * Update current node. This method allow general updates of the current kifu node. You can specify updater function,
   * which can arbitrarily change current node passed in the argument, or you can specify partial kifu node
   * object, whose properties will be assigned to the current node. This creates record in history, so changes can be undone.
   */
  updateCurrentNode(update: ((node: KifuNode) => void) | Partial<KifuNode>) {
    if (typeof update === 'function') {
      update(this.currentNode);
    } else {
      Object.assign(this.currentNode, update);
    }

    this.#historyManager.addNodeUpdateOperation(this.currentPath, this.currentNode);
    this.#reExecuteCurrentNode();
  }

  /**
   * Update game information. This method allow general updates of the kifu info. You can specify updater function,
   * which can arbitrarily change info passed in the argument, or you can specify partial kifu info object, whose
   * properties will be assigned to it. This creates record in history, so changes can be undone.
   *
   * This method cannot be used to change board size or rules, use `newGame` method instead.
   */
  updateGameInfo(update: ((info: KifuInfo) => void) | Partial<KifuInfo>) {
    if (typeof update === 'function') {
      update(this.kifu.info);
    } else {
      Object.assign(this.kifu.info, update);
    }

    this.emit('gameInfoChange', { gameInfo: this.kifu.info });
  }

  /**
   * Undo previous operation. If there is nothing to undo, nothing happens.
   */
  undo() {
    const operation = this.#historyManager.undo();

    if (operation) {
      this.#applyChanges(operation);
    }
  }

  /**
   * Returns true, if there is something to undo.
   */
  canUndo() {
    return this.#historyManager.canUndo();
  }

  /**
   * Redo previously undone operation. If there is nothing to redo, nothing happens.
   */
  redo() {
    const operation = this.#historyManager.redo();

    if (operation) {
      this.#applyChanges(operation);
    }
  }

  /**
   * Returns true, if there is something to redo.
   */
  canRedo() {
    return this.#historyManager.canRedo();
  }

  #initGame(rules?: Rules) {
    this.#previousGameStates = [];
    this.#previousNodes = [];
    this.#historyManager = new EditorHistoryManager(this.kifu);
    this.#visitedVariations = new Map();
    this.gameEvaluator = new GameEvaluator(rules || this.config.defaultRules);

    this.currentNode = this.kifu.root;
    this.currentPath = {
      moveNumber: 0,
      variations: [],
    };

    this.#initGameState();
    this.emit('gameLoad');
    this.#emitNodeChangeEvents();
  }

  #initGameState() {
    const size = this.kifu.info.boardSize;
    this.gameState = new GameState(
      typeof size === 'object' ? new Position(size.cols, size.rows) : new Position(size),
    );

    if (this.kifu.info.handicap && this.kifu.info.handicap > 1) {
      // Special case - if handicap is set and larger than 1, we need to set player to white
      this.gameState.player = Color.White;
    }

    this.#updateGameFromNode();
  }

  #updateGameFromNode() {
    if (this.currentNode.setup.length) {
      this.currentNode.setup.forEach((setup) =>
        this.gameState.position.set(setup.x, setup.y, setup.c),
      );
    }

    if (this.currentNode.move) {
      this.#executeMove(this.currentNode.move);
    }

    if (this.currentNode.player) {
      this.gameState.player = this.currentNode.player;
    }
  }

  #executeMove(move: Move) {
    if ('x' in move) {
      const captures = this.gameState.position.makeMove(move.x, move.y, move.c);
      const capturedColor = captures < 0 ? -move.c : move.c;

      if (capturedColor === Color.Black) {
        this.gameState.blackCaptures += Math.abs(captures);
      } else {
        this.gameState.whiteCaptures += Math.abs(captures);
      }
    }

    this.gameState.player = -move.c;
  }

  /**
   * Apply changes from operation.
   */
  #applyChanges(operation: EditorHistoryOperation) {
    switch (operation.type) {
      case 'init':
        Object.assign(this.kifu.root, operation.node);
        Object.assign(this.kifu.info, operation.gameInfo);
        this.first();
        break;
      case 'node':
        const node = this.kifu.getNode(operation.path);
        if (!node) {
          // Should not happen, but doing nothing is probably better than crash.
          return;
        }
        Object.assign(node, operation.node);
        this.goTo(operation.path);
        break;
      case 'gameInfo':
        Object.assign(this.kifu.info, operation.gameInfo);
        this.emit('gameInfoChange', { gameInfo: this.kifu.info });
      default:
        break;
    }
  }

  #executeNextNode(nodeOrNodeIndex?: number | KifuNode) {
    const nextNodeIndex = this.#getNextNodeIndex(this.currentNode, nodeOrNodeIndex);
    const nextNode = this.currentNode.children[nextNodeIndex];

    if (!nextNode) {
      return false;
    }

    if (nextNodeIndex > 0) {
      this.#visitedVariations.set(this.currentNode, nextNode);
    }

    this.currentPath = this.#nextPath(this.currentPath, this.currentNode, nextNodeIndex);

    this.#previousNodes.push(this.currentNode);
    this.currentNode = nextNode;

    this.#previousGameStates.push(this.gameState);
    this.gameState = this.gameState.clone();

    this.#updateGameFromNode();

    return true;
  }

  #nextPath(path: KifuPath, node: KifuNode, nextNodeIndex: number) {
    return {
      moveNumber: path.moveNumber + 1,
      variations: node.children.length > 1 ? [...path.variations, nextNodeIndex] : path.variations,
    };
  }

  #getNextNodeIndex(currentNode: KifuNode, nodeOrNodeIndex?: number | KifuNode) {
    if (typeof nodeOrNodeIndex === 'object') {
      return currentNode.children.indexOf(nodeOrNodeIndex);
    } else if (!nodeOrNodeIndex) {
      const variation = this.#visitedVariations.get(currentNode);
      if (variation) {
        const variationIndex = currentNode.children.indexOf(variation);
        return variationIndex !== -1 ? variationIndex : 0;
      } else {
        return 0;
      }
    }

    return nodeOrNodeIndex;
  }

  #executePreviousNode() {
    if (!this.#previousNodes.length) {
      return false;
    }

    this.currentNode = this.#previousNodes.pop()!;
    this.gameState = this.#previousGameStates.pop()!;

    this.currentPath = {
      moveNumber: this.currentPath.moveNumber - 1,
      variations: this.currentNode.children.length
        ? this.currentPath.variations.slice(0, -1)
        : this.currentPath.variations,
    };

    return true;
  }

  #reExecuteCurrentNode() {
    if (this.currentNode === this.kifu.root) {
      this.#initGameState();
      this.#emitNodeChangeEvents();
    } else {
      this.#executePreviousNode();
      this.next();
    }
  }

  #emitNodeChangeEvents() {
    this.emit('gameStateChange', { gameState: this.gameState });
    this.emit('nodeChange', { node: this.currentNode });
  }
}
