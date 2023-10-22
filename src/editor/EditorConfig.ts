import { JAPANESE_RULES, Rules } from '../game';
import { BoardSize } from '../types';

export interface EditorConfig {
  defaultRules: Rules;
  defaultBoardSize: BoardSize;
}

export const defaultEditorConfig: EditorConfig = {
  defaultRules: JAPANESE_RULES,
  defaultBoardSize: 19,
};
