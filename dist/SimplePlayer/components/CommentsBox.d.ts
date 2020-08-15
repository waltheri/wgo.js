import Component from './Component';
import SimplePlayer from '../SimplePlayer';
export default class CommentBox extends Component {
    player: SimplePlayer;
    element: HTMLElement;
    commentsElement: HTMLElement;
    constructor();
    create(player: SimplePlayer): HTMLElement;
    destroy(): void;
    setComments(event: {
        value: string;
    }): void;
    clearComments(): void;
    formatComment(text: string): string;
}
