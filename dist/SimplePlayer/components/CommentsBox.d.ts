import Component from './Component';
import SimplePlayer from '../SimplePlayer';
export default class CommentBox extends Component {
    commentsElement: HTMLElement;
    constructor(player: SimplePlayer);
    create(): HTMLElement;
    destroy(): void;
    setComments(event: {
        value: string;
    }): void;
    clearComments(): void;
    formatComment(text: string): string;
}
