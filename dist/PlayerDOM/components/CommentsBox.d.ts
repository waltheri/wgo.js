import { PartialRecursive } from '../../utils/makeConfig';
import PlayerDOM from '../PlayerDOM';
import PlayerDOMComponent from './PlayerDOMComponent';
export interface CommentBoxConfig {
    formatMoves: boolean;
    formatNicks: boolean;
}
export declare const commentBoxDefaultConfig: {
    formatMoves: boolean;
    formatNicks: boolean;
};
export default class CommentsBox implements PlayerDOMComponent {
    element: HTMLElement;
    commentsElement: HTMLElement;
    player: PlayerDOM;
    config: CommentBoxConfig;
    constructor(config?: PartialRecursive<CommentBoxConfig>);
    create(player: PlayerDOM): void;
    destroy(): void;
    setComments(event: {
        value: string;
    }): void;
    clearComments(): void;
    formatComment(text: string): string;
}
