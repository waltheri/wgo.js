import { Kifu, KifuInfo, KifuNode, KifuPath } from '../kifu';

/**
 * This contains initial state of the kifu (root node and game info). It is used as first entry of the editor history.
 */
interface InitialOperation {
  type: 'init';
  node: Partial<KifuNode>;
  gameInfo: Partial<KifuInfo>;
}

/**
 * Represents an operation executed on the kifu node. When editor want to execute this operation,
 * it must go to node specified by `path` and update it with `node` property.
 */
interface NodeUpdateOperation {
  type: 'node';
  path: KifuPath;
  node: Partial<KifuNode>;
}

/**
 * Represents an operation executed on the game info.
 */
interface GameInfoUpdateOperation {
  type: 'gameInfo';
  gameInfo: Partial<KifuInfo>;
}

export type EditorHistoryOperation =
  | InitialOperation
  | NodeUpdateOperation
  | GameInfoUpdateOperation;

/**
 * Node of the editor history linked list.
 */
interface EditorHistoryEntry {
  prev: EditorHistoryEntry | null;
  next: EditorHistoryEntry | null;
  value: EditorHistoryOperation;
}

/**
 * Class representing editor history. It is implemented as a linked list with pointer. Currently all operations
 * are saved, in future we should add configurable limit.
 */
export class EditorHistoryManager {
  current: EditorHistoryEntry;

  constructor(kifu: Kifu) {
    this.current = {
      prev: null,
      value: {
        type: 'init',
        node: this.#cloneNode(kifu.root),
        gameInfo: this.#cloneGameInfo(kifu.info),
      },
      next: null,
    };
  }

  undo(): EditorHistoryOperation | null {
    if (this.current.prev) {
      this.current = this.current.prev;
      return this.current.value;
    }

    return null;
  }

  canUndo(): boolean {
    return this.current.prev !== null;
  }

  redo(): EditorHistoryOperation | null {
    if (this.current.next) {
      this.current = this.current.next;
      return this.current.value;
    }

    return null;
  }

  canRedo(): boolean {
    return this.current.next !== null;
  }

  /**
   * Adds new node update operation. This will clone the node and add it to the history.
   */
  addNodeUpdateOperation(path: KifuPath, node: KifuNode) {
    const newEntry: EditorHistoryEntry = {
      prev: this.current,
      value: {
        type: 'node' as const,
        path,
        node: this.#cloneNode(node),
      },
      next: null,
    };

    this.current.next = newEntry;
    this.current = newEntry;
  }

  addGameInfoUpdateOperation(gameInfo: KifuInfo) {
    const newEntry: EditorHistoryEntry = {
      prev: this.current,
      value: {
        type: 'gameInfo' as const,
        gameInfo: this.#cloneGameInfo(gameInfo),
      },
      next: null,
    };

    this.current.next = newEntry;
    this.current = newEntry;
  }

  #cloneNode(node: KifuNode) {
    return {
      ...node,
      properties: { ...node.properties },
      children: [...node.children],
    };
  }

  #cloneGameInfo(gameInfo: KifuInfo) {
    return { ...gameInfo };
  }
}
